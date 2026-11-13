const assert = require('node:assert/strict');
const test = require('node:test');
const { EventEmitter } = require('node:events');
const discovery = require('../lib/protocol/MiioDiscovery.js');
const MiotDevice = require('../lib/protocol/MiotDevice.js');

const interfaces = { eth0: [{ address: '192.168.1.10', netmask: '255.255.255.0', internal: false }] };
const hello = id => {
  const packet = Buffer.alloc(32);
  packet.writeUInt16BE(0x2131, 0);
  packet.writeUInt16BE(32, 2);
  packet.writeUInt32BE(id, 8);
  return packet;
};
class Socket extends EventEmitter {
  constructor(onSend = () => {}) { super(); this.onSend = onSend; this.sent = []; this.closed = false; }
  bind() { queueMicrotask(() => this.emit('listening')); }
  setBroadcast(value) { this.broadcast = value; }
  send(message, port, address, cb) { this.sent.push({ message, port, address }); cb(); this.onSend(this); }
  close() { this.closed = true; }
}

test('broadcasts follow subnet masks and exclude loopback and point-to-point interfaces', () => {
  assert.deepEqual(discovery.broadcastAddresses({
    ...interfaces,
    wlan0: [{ address: '10.3.5.9', netmask: '255.255.252.0', internal: false }],
    lo: [{ address: '127.0.0.1', netmask: '255.0.0.0', internal: true }],
    tailscale: [{ address: '100.64.1.1', netmask: '255.255.255.255', internal: false }],
    ipv6: [{ address: '::1', netmask: 'ffff:ffff::', internal: false }]
  }), ['192.168.1.255', '10.3.7.255']);
});

test('discovery ignores malformed and unrelated responses and matches the stable device ID', async () => {
  const socket = new Socket(s => queueMicrotask(() => {
    const remote = { address: '192.168.1.99', port: 54321 };
    s.emit('message', Buffer.alloc(2), remote);
    s.emit('message', hello(999), remote);
    s.emit('message', hello(123), { ...remote, port: 1900 });
    s.emit('message', hello(123), remote);
  }));
  assert.equal(await discovery.discoverAddress('123', { interfaces, socketFactory: () => socket }), '192.168.1.99');
  assert.equal(socket.broadcast, true);
  assert.equal(socket.closed, true);
  assert.equal(socket.sent[0].address, '192.168.1.255');
  assert.equal(socket.sent[0].port, 54321);
  assert.equal(socket.sent[0].message.toString('hex'), '21310020' + 'ff'.repeat(28));
});

test('no matching device causes bounded retries and closes the socket', async () => {
  const socket = new Socket();
  await assert.rejects(discovery.discoverAddress('123', {
    interfaces, socketFactory: () => socket, timeoutMs: 35, retryMs: 10
  }), /timed out/);
  assert.ok(socket.sent.length >= 2);
  assert.equal(socket.closed, true);
});

test('invalid identifiers and networks fail without opening a discovery socket', async () => {
  for (const id of ['', 'abc', '0', '-1', '4294967295']) {
    await assert.rejects(discovery.discoverAddress(id, { interfaces }), /valid numeric/);
  }
  await assert.rejects(discovery.discoverAddress('123', { interfaces: {} }), /No IPv4/);
});

test('socket failures close discovery cleanly', async () => {
  const socket = new Socket(s => queueMicrotask(() => s.emit('error', new Error('network unavailable'))));
  await assert.rejects(discovery.discoverAddress('123', { interfaces, socketFactory: () => socket }), /network unavailable/);
  assert.equal(socket.closed, true);
});

function device() {
  const instance = Object.create(MiotDevice.prototype);
  Object.assign(instance, {
    ip: '192.0.2.1', token: 'secret', deviceId: '123', localDiscovery: true, localConnected: false,
    logger: { debug() {}, info() {} }, emit() {},
    isConnectedToLocalDevice() { return this.localConnected; },
    async _localDeviceSetup() {},
    miioProtocol: { updateDevice() {}, async handshake() {}, getDevice() { return { did: 123 }; } },
    async _getLocalDeviceInfo() { return { model: 'xiaomi.airp.cpa4' }; }
  });
  return instance;
}

test('startup and reconnection resolve fresh IPs without changing the saved config hint', async t => {
  const d = device();
  const config = { ip: d.ip };
  const addresses = ['192.0.2.39', '192.0.2.50'];
  t.mock.method(discovery, 'discoverAddress', async id => {
    assert.equal(id, '123'); return addresses.shift();
  });
  const handshakes = [];
  d.miioProtocol.handshake = async ip => handshakes.push(ip);
  await d._connectToLocalDevice();
  assert.equal(d.ip, '192.0.2.39');
  // This is the same connection path called by upstream polling recovery.
  d.localConnected = false;
  await d._connectToLocalDevice();
  assert.deepEqual(handshakes, ['192.0.2.39', '192.0.2.50']);
  assert.equal(config.ip, '192.0.2.1');
});

test('a different device at the address is rejected before encrypted requests', async t => {
  t.mock.method(discovery, 'discoverAddress', async () => '192.168.1.99');
  const d = device();
  d.miioProtocol.getDevice = () => ({ did: 999 });
  d._getLocalDeviceInfo = async () => assert.fail('must not send to a different device');
  await assert.rejects(d._connectToLocalDevice(), /ID mismatch/);
  assert.equal(d.localConnected, false);
  assert.equal(d.ip, '192.0.2.1');
});

test('token authentication must succeed before accepting a discovered address', async t => {
  t.mock.method(discovery, 'discoverAddress', async () => '192.168.1.99');
  const d = device();
  d._getLocalDeviceInfo = async () => { throw new Error('Invalid packet checksum'); };
  await assert.rejects(d._connectToLocalDevice(), /checksum/);
  assert.equal(d.localConnected, false);
  assert.equal(d.ip, '192.0.2.1');
});

test('last known address remains usable if broadcast is unavailable', async t => {
  t.mock.method(discovery, 'discoverAddress', async () => { throw new Error('timed out'); });
  const d = device();
  await d._connectToLocalDevice();
  assert.equal(d.ip, '192.0.2.1');
  assert.equal(d.localConnected, true);
});

test('devices without discovery enabled retain their original connection behavior', async t => {
  t.mock.method(discovery, 'discoverAddress', async () => assert.fail('discovery must be opt-in'));
  const d = device();
  d.localDiscovery = false;
  await d._connectToLocalDevice();
  assert.equal(d.ip, '192.0.2.1');
});

test('the discovery option is present in the dashboard form and disabled by default', () => {
  const schema = require('../config.schema.json');
  assert.equal(schema.schema.properties.devices.items.properties.localDiscovery.default, false);
  assert.ok(JSON.stringify(schema.layout).includes('devices[].localDiscovery'));
});

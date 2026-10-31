const assert = require('node:assert/strict');
const test = require('node:test');
const http = require('node:http');
const MiCloud = require('../lib/protocol/MiCloud.js');
const MiotDevice = require('../lib/protocol/MiotDevice.js');

const logger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };
const token = { ssecurity: 'test-security', userId: 'test-user', serviceToken: 'test-session' };

function localDevice(deviceConfig = { useCachedSession: true }) {
  const device = new MiotDevice('127.0.0.1', 'test-token', 'test-device', 'dreame.vacuum.p2009', 'Robot', logger);
  device.localConnected = true;
  device.setMiCloudConfig({ global: { country: 'us' }, device: deviceConfig, cachedSession: token });
  return device;
}

test('map downloads reuse the configured session and region without changing the control client', async t => {
  const device = localDevice();
  const controlClient = device.miCloud;
  t.mock.method(MiCloud.prototype, 'getInterimFile', async function(objectName) {
    assert.equal(objectName, 'test/map');
    assert.equal(this.country, 'us');
    assert.equal(this.serviceToken, token.serviceToken);
    return Buffer.from('map');
  });
  t.mock.method(MiCloud.prototype, 'login', () => assert.fail('cached session should be reused'));
  assert.equal((await device.getMiCloudFile('test/map')).toString(), 'map');
  assert.equal(device.miCloud, controlClient);
  assert.equal(device.localConnected, true);
  assert.equal(device.shouldUseMiCloud(), false);
});

test('device region overrides the global region for metadata downloads', async t => {
  const device = localDevice({ country: 'de', useCachedSession: true });
  t.mock.method(MiCloud.prototype, 'getInterimFile', async function() {
    assert.equal(this.country, 'de');
    return Buffer.from('map');
  });
  await device.getMiCloudFile('test/map');
});

test('a stale cached session retries once with configured credentials and saves the refreshed session', async t => {
  const device = localDevice({ useCachedSession: true, username: 'test-user', password: 'test-password' });
  let requests = 0;
  let logins = 0;
  let saves = 0;
  t.mock.method(MiCloud.prototype, 'getInterimFile', async function() {
    requests++;
    if (requests === 1) throw new Error('expired session');
    assert.equal(this.serviceToken, 'refreshed-session');
    assert.equal(this.country, 'us');
    return Buffer.from('map');
  });
  t.mock.method(MiCloud.prototype, 'login', async function(username, password) {
    logins++;
    assert.equal(username, 'test-user');
    assert.equal(password, 'test-password');
    this.setServiceToken({ ...token, serviceToken: 'refreshed-session' });
  });
  device._saveReachabilitySession = async () => { saves++; };
  await device.getMiCloudFile('test/map');
  assert.equal(requests, 2);
  assert.equal(logins, 1);
  assert.equal(saves, 1);
  assert.equal(device.miCloudConfig.cachedSession.serviceToken, 'refreshed-session');
});

test('cached-session-only failures propagate without login attempts or changing local connectivity', async t => {
  const device = localDevice();
  t.mock.method(MiCloud.prototype, 'getInterimFile', async () => { throw new Error('expired session'); });
  t.mock.method(MiCloud.prototype, 'login', () => assert.fail('no credentials configured'));
  await assert.rejects(device.getMiCloudFile('test/map'), /expired session/);
  assert.equal(device.localConnected, true);
});

test('disabled MiCloud and sessions without cache opt-in cannot make map requests', async t => {
  t.mock.method(MiCloud.prototype, 'getInterimFile', () => assert.fail('MiCloud is disabled'));
  const device = localDevice({ useCachedSession: false });
  await assert.rejects(device.getMiCloudFile('test/map'));
  device.disableMiCloud();
  await assert.rejects(device.getMiCloudFile('test/map'));
});

test('credentials-only map access does not opt the user into session caching', async t => {
  const device = localDevice({ username: 'test-user', password: 'test-password', useCachedSession: false });
  t.mock.method(MiCloud.prototype, 'login', async function() { this.setServiceToken(token); });
  t.mock.method(MiCloud.prototype, 'getInterimFile', async () => Buffer.from('map'));
  device._saveReachabilitySession = () => assert.fail('session caching is disabled');
  await device.getMiCloudFile('test/map');
  assert.equal(device.miCloudConfig.cachedSession, token);
});

test('temporary session refactor preserves reachability and offline error handling', async t => {
  const device = localDevice();
  t.mock.method(MiCloud.prototype, 'getDevice', async () => ({ isOnline: true }));
  assert.equal(await device._probeMiCloudReachability(), true);
  t.mock.method(MiCloud.prototype, 'getDevice', async () => ({ isOnline: false }));
  assert.equal(await device._probeMiCloudReachability(), false);
  t.mock.method(MiCloud.prototype, 'getDevice', async () => { throw new Error('offline'); });
  assert.equal(await device._probeMiCloudReachability(), false);
});

test('signed map downloads omit account cookies, bound file size and hide signed URLs in errors', async t => {
  let receivedCookie;
  const server = http.createServer((request, response) => {
    receivedCookie = request.headers.cookie;
    if (request.url.startsWith('/error')) { response.writeHead(500); response.end(); }
    else if (request.url.startsWith('/large')) response.end(Buffer.alloc(8 * 1024 * 1024 + 1));
    else response.end('test map bytes');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const cloud = new MiCloud(logger);
  const url = route => `http://127.0.0.1:${server.address().port}/${route}?signature=test-secret`;
  cloud.request = async (endpoint, data) => {
    assert.equal(endpoint, '/v2/home/get_interim_file_url');
    assert.deepEqual(data, { obj_name: 'test/map' });
    return { result: { url: url('map') } };
  };
  assert.equal((await cloud.getInterimFile('test/map')).toString(), 'test map bytes');
  assert.equal(receivedCookie, undefined);
  for (const route of ['error', 'large']) {
    cloud.request = async () => ({ result: { url: url(route) } });
    await assert.rejects(cloud.getInterimFile('test/map'), error => {
      assert.equal(error.message, 'MiCloud map download failed.');
      return true;
    });
  }
  cloud.request = async () => ({ code: -38, result: null });
  await assert.rejects(cloud.getInterimFile('test/map'), /configured MiCloud country and session/);
});

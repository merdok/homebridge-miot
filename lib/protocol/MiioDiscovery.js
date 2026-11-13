const dgram = require('node:dgram');
const os = require('node:os');
const net = require('node:net');

const PORT = 54321;
const HELLO = Buffer.from('21310020' + 'ff'.repeat(28), 'hex');

function broadcastAddresses(interfaces = os.networkInterfaces()) {
  const addresses = new Set();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.internal || !net.isIPv4(entry.address) || !net.isIPv4(entry.netmask)) continue;
      const ip = entry.address.split('.').map(Number);
      const mask = entry.netmask.split('.').map(Number);
      // Point-to-point interfaces (including VPNs) have no broadcast segment.
      if (mask.join('.') === '255.255.255.255' || mask.join('.') === '255.255.255.254') continue;
      addresses.add(ip.map((octet, i) => (octet | (255 ^ mask[i]))).join('.'));
    }
  }
  return [...addresses];
}

function parseHello(message, remote) {
  if (remote.port !== PORT || !net.isIPv4(remote.address) || message.length !== 32 ||
      message.readUInt16BE(0) !== 0x2131 || message.readUInt16BE(2) !== 32) return null;
  const deviceId = message.readUInt32BE(8);
  if (deviceId === 0 || deviceId === 0xffffffff) return null;
  return { deviceId: String(deviceId), address: remote.address };
}

// Discovery replies identify candidates only. MiotDevice must subsequently verify
// the device ID and authenticate an encrypted response with the configured token.
function discoverAddress(deviceId, options = {}) {
  const expected = String(deviceId);
  if (!/^[1-9]\d*$/.test(expected) || Number(expected) >= 0xffffffff) {
    return Promise.reject(new Error('Local discovery requires a valid numeric miIO deviceId'));
  }
  const targets = broadcastAddresses(options.interfaces);
  if (!targets.length) return Promise.reject(new Error('No IPv4 broadcast interface available'));
  const timeoutMs = options.timeoutMs ?? 2500;
  const retryMs = options.retryMs ?? 750;
  return new Promise((resolve, reject) => {
    const socket = options.socketFactory ? options.socketFactory() : dgram.createSocket('udp4');
    let finished = false;
    let retryTimer;
    const finish = (error, address) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutTimer);
      clearInterval(retryTimer);
      try { socket.close(); } catch (_) { /* bind may have failed */ }
      if (error) reject(error);
      else resolve(address);
    };
    const timeoutTimer = setTimeout(() => finish(new Error('Local miIO discovery timed out')), timeoutMs);
    socket.on('error', error => finish(error));
    socket.on('message', (message, remote) => {
      const result = parseHello(message, remote);
      if (result?.deviceId === expected) finish(null, result.address);
    });
    socket.on('listening', () => {
      if (finished) return;
      try {
        socket.setBroadcast(true);
        const probe = () => {
          for (const address of targets) {
            // A route failure on one interface must not discard replies on another.
            socket.send(HELLO, PORT, address, () => {});
          }
        };
        retryTimer = setInterval(probe, retryMs);
        probe();
      } catch (error) { finish(error); }
    });
    try { socket.bind(0, '0.0.0.0'); } catch (error) { finish(error); }
  });
}

module.exports = { discoverAddress, broadcastAddresses, parseHello };

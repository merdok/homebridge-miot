const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');

// Silent logger so the tests don't spam output.
const noopLogger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
  deepDebug() {},
  table() {}
};

// Build a MiotDevice wired for a healthy LOCAL connection (no MiCloud) with a stubbed miioProtocol.
// `sendImpl` lets each test decide how the local get_properties call behaves.
function makeLocalDevice(sendImpl) {
  const device = new MiotDevice('192.168.0.10', 'token', 'device-id', 'test.model.v1', 'Test Device', noopLogger);
  device.localConnected = true;
  device.miCloudDisabled = true; // ensure shouldUseMiCloud() is false -> local path
  device.miioProtocol = {
    send: (ip, command, params) => sendImpl(ip, command, params)
  };
  return device;
}

// These tests lock in the behaviour of the shared local property polling path so that the robot-cleaner
// localPropertyReader fallback (added for Matter support) cannot silently regress non-robot devices.

test('non-robot device returns the raw local property response unchanged', async () => {
  const expected = [{ did: 'p1', value: 1 }];
  const device = makeLocalDevice(() => expected);
  const result = await device.getMiotProperties([{ did: 'p1' }]);
  assert.deepEqual(result, expected);
});

test('non-robot device propagates local get_properties errors (no swallow, no fallback)', async () => {
  const device = makeLocalDevice(() => {
    throw new Error('local timeout');
  });
  // Without a localPropertyReader installed, the original error must propagate exactly as before.
  await assert.rejects(() => device.getMiotProperties([{ did: 'p1' }]), /local timeout/);
});

test('robot with a localPropertyReader still returns a healthy response directly (fallback NOT triggered)', async () => {
  const expected = [{ did: 'p1', value: 42 }];
  const device = makeLocalDevice(() => expected);
  let fallbackCalls = 0;
  device.setLocalPropertyReader(() => {
    fallbackCalls += 1;
    return [{ did: 'p1', value: 'FROM_FALLBACK' }];
  });
  const result = await device.getMiotProperties([{ did: 'p1' }]);
  assert.deepEqual(result, expected, 'healthy local response must be returned directly');
  assert.equal(fallbackCalls, 0, 'legacy fallback reader must not run when the local response is valid');
});

test('robot fallback only runs on a thrown local error', async () => {
  const device = makeLocalDevice(() => {
    throw new Error('transient blip');
  });
  let fallbackCalls = 0;
  const fallbackResult = [{ did: 'p1', value: 7 }];
  device.setLocalPropertyReader(() => {
    fallbackCalls += 1;
    return fallbackResult;
  });
  const result = await device.getMiotProperties([{ did: 'p1' }]);
  assert.equal(fallbackCalls, 1, 'fallback reader must run once when the local send throws');
  assert.deepEqual(result, fallbackResult);
});

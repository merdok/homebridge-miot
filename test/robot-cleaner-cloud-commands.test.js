const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// Robots such as viomi.vacuum.v7/v8 only work through MiCloud. The strict commands used by the
// Matter accessory (start, pause, dock, ...) used to require a local connection, so every Matter
// command failed with "not connected locally" for those robots even with a working MiCloud session.

function makeCloudRobot({ cloudConnected = true } = {}) {
  const md = new MiotDevice('127.0.0.1', 'token', 'devid', 'test.vacuum.x', 'Robot', noopLogger);
  md.createServiceByString('{"siid":2,"type":"urn:x:service:vacuum:1:x:1","description":"Robot Cleaner"}');
  md.addPropertyByString('vacuum:mode', '{"siid":2,"piid":2,"type":"urn:x:property:mode:1:x:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Silent"},{"value":1,"description":"Strong"}]}');
  md.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:x:action:start-sweep:1:x:1","description":"Start Sweep","in":[],"out":[]}');

  const calls = [];
  md.isConnectedToLocalDevice = () => false;
  md.isConnectedToCloud = () => cloudConnected;
  md.shouldUseMiCloud = () => true;
  md.miCloud = {
    miotAction: async (params) => { calls.push(['action', params]); return { code: 0 }; },
    miotSetProps: async (params) => { calls.push(['set', params]); return [{ code: 0 }]; },
    miioCall: async (did, method, params) => { calls.push(['miio', did, method, params]); return ['ok']; }
  };

  const robot = new RobotCleanerDevice(md, 'Robot', noopLogger);
  return { robot, calls };
}

test('strict actions are sent through MiCloud when the robot is only cloud connected', async () => {
  const { robot, calls } = makeCloudRobot();
  await robot.fireActionStrict(robot.startSweepAction());
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'action');
  assert.equal(calls[0][1].siid, 2);
  assert.equal(calls[0][1].aiid, 1);
});

test('strict property writes are sent through MiCloud when the robot is only cloud connected', async () => {
  const { robot, calls } = makeCloudRobot();
  await robot.setPropertyValueStrict('vacuum:mode', 1);
  assert.deepEqual(calls.map(call => call[0]), ['set']);
  assert.equal(calls[0][1][0].value, 1);
});

test('strict methods are sent through MiCloud when the robot is only cloud connected', async () => {
  const { robot, calls } = makeCloudRobot();
  await robot.executeMethodStrict('app_charge', []);
  assert.deepEqual(calls[0], ['miio', 'devid', 'app_charge', []]);
});

test('strict commands still fail when the robot is neither local nor cloud connected', async () => {
  const { robot, calls } = makeCloudRobot({ cloudConnected: false });
  await assert.rejects(() => robot.fireActionStrict(robot.startSweepAction()), /not connected/);
  assert.equal(calls.length, 0);
});

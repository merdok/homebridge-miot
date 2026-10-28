const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

function makeRobot(actionKey, actionSpec) {
  const md = new MiotDevice('127.0.0.1', 'token', 'devid', 'test.vacuum.x', 'Robot', noopLogger);
  const d = new RobotCleanerDevice(md, 'Robot', noopLogger);
  if (actionKey) {
    md.createServiceByString('{"siid":6,"type":"urn:x:service:vacuum-extend:1:x:1","description":"vacuum-extend"}');
    md.addActionByString(actionKey, actionSpec);
  }
  return d;
}

// Issue #762: the "locate / play sound" (HomeKit Identify) action on some robots is a dedicated
// find-vacuum action (e.g. vacuum-extend:find-vacuum on xiaomi.vacuum.b108gl), which was not in the
// identify fallback chain. It should now be recognized.

test('findVacuumAction resolves the vacuum-extend find-vacuum action', () => {
  const d = makeRobot('vacuum-extend:find-vacuum', '{"siid":6,"aiid":6,"type":"urn:x:action:find-vacuum:1:x:1","description":"find","in":[],"out":[]}');
  assert.ok(d.findVacuumAction());
  assert.equal(d.supportsIdentify(), true);
});

test('a robot with no locate/identify capability does not claim identify support', () => {
  const d = makeRobot(null);
  assert.equal(d.findVacuumAction(), null);
  assert.equal(d.supportsIdentify(), false);
});

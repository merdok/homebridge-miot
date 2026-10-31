const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');
const { MATTER_RVC_CLEAN_MODES } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// Issue #762: expose a sequential "vacuum then mop" clean mode for robots whose sweep-mop-type
// property has a value 4 (sweep first, then mop), e.g. xiaomi.vacuum.b108gl.
function makeRobot({ withSweepThenMop = true, withCombinedAction = true } = {}) {
  const md = new MiotDevice('127.0.0.1', 'token', 'devid', 'test.vacuum.x', 'Robot', noopLogger);
  md.createServiceByString('{"siid":2,"type":"urn:x:service:vacuum:1:x:1","description":"Robot Cleaner"}');
  if (withSweepThenMop) {
    md.addPropertyByString('vacuum:sweep-mop-type', '{"siid":2,"piid":3,"type":"urn:x:property:sweep-mop-type:1:x:1","description":"Sweep Mop Type","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Sweep"},{"value":2,"description":"Mop"},{"value":3,"description":"Sweep Mop"},{"value":4,"description":"Sweep then Mop"}]}');
  } else {
    md.addPropertyByString('vacuum:sweep-mop-type', '{"siid":2,"piid":3,"type":"urn:x:property:sweep-mop-type:1:x:1","description":"Sweep Mop Type","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Sweep"},{"value":2,"description":"Mop"}]}');
  }
  if (withCombinedAction) {
    md.addActionByString('vacuum:start-sweep-mop', '{"siid":2,"aiid":5,"type":"urn:x:action:start-sweep-mop:1:x:1","description":"Start Sweep Mop","in":[],"out":[]}');
  }
  return new RobotCleanerDevice(md, 'Robot', noopLogger);
}

test('supportsVacuumThenMop requires both a combined start action and sweep-mop-type value 4', () => {
  assert.equal(makeRobot().supportsVacuumThenMop(), true);
  assert.equal(makeRobot({ withSweepThenMop: false }).supportsVacuumThenMop(), false);
  assert.equal(makeRobot({ withCombinedAction: false }).supportsVacuumThenMop(), false);
});

test('VACUUM_THEN_MOP is a distinct clean mode value', () => {
  assert.equal(MATTER_RVC_CLEAN_MODES.VACUUM_THEN_MOP, 3);
  assert.notEqual(MATTER_RVC_CLEAN_MODES.VACUUM_THEN_MOP, MATTER_RVC_CLEAN_MODES.VACUUM_MOP);
});

const assert = require('node:assert/strict');
const test = require('node:test');

const RobotCleanerMatterAccessory = require('../lib/modules/robotcleaner/RobotCleanerMatterAccessory.js');
const { MATTER_RVC_CLEAN_MODES } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// A vacuum-only robot supports Vacuum (0) + Auto (3). Issue #762: a currentMode persisted in the
// Matter accessory state that is no longer in supportedModes (e.g. left over from a build with a
// different mode list) makes Matter.js reject registration. _buildClusters must clamp it.
function makeAccessory({ mop = false, combined = false } = {}) {
  const device = {
    supportsMopCleaning: () => mop,
    supportsCombinedCleaning: () => combined,
    supportsRoomCleaning: () => false,
    isVacuumWorking: () => false,
    isConnected: () => true,
    isLocallyConnected: () => true,
    hasKnownBatteryLevel: () => false,
    getBatteryLevel: () => 100,
    getOperationalStateFlags: () => ({ isDocked: true })
  };
  return new RobotCleanerMatterAccessory('Robot', device, 'uuid', {}, { matter: {} }, noopLogger);
}

test('a restored currentMode outside the supported list is forced to a supported mode', () => {
  const acc = makeAccessory(); // vacuum-only => supports [Vacuum(0), Auto(3)]
  // simulate restored Matter state from a previous build where currentMode was 2 (Vacuum and Mop),
  // which is not supported here. The published cluster must not carry an unsupported currentMode.
  const clusters = acc._buildClusters({ rvcCleanMode: { currentMode: MATTER_RVC_CLEAN_MODES.VACUUM_MOP } });
  const supported = clusters.rvcCleanMode.supportedModes.map(mode => mode.mode);
  assert.ok(!supported.includes(MATTER_RVC_CLEAN_MODES.VACUUM_MOP), 'VACUUM_MOP is not supported here');
  assert.ok(supported.includes(clusters.rvcCleanMode.currentMode), 'published currentMode must be in supportedModes');
  assert.equal(acc.currentCleanMode, clusters.rvcCleanMode.currentMode, 'in-memory mode is synced to the published value');
});

test('a restored currentMode that is still supported is preserved', () => {
  const acc = makeAccessory({ mop: true, combined: true }); // supports Vacuum(0), Mop(1), Vacuum+Mop(2)
  const clusters = acc._buildClusters({ rvcCleanMode: { currentMode: MATTER_RVC_CLEAN_MODES.VACUUM_MOP } });
  assert.equal(clusters.rvcCleanMode.currentMode, MATTER_RVC_CLEAN_MODES.VACUUM_MOP);
});

test('an in-memory selected mode still in the supported list is preserved', () => {
  const acc = makeAccessory({ mop: true });
  acc.currentCleanMode = MATTER_RVC_CLEAN_MODES.MOP;
  const clusters = acc._buildClusters({});
  assert.equal(clusters.rvcCleanMode.currentMode, MATTER_RVC_CLEAN_MODES.MOP);
});

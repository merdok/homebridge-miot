const assert = require('node:assert/strict');
const test = require('node:test');
const RobotCleanerMatterAccessory = require('../lib/modules/robotcleaner/RobotCleanerMatterAccessory.js');
const { MATTER_RVC_CLEAN_MODES, MATTER_RVC_RUN_MODES } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

function accessory(mop = false, combined = false) {
  const starts = [];
  const device = {
    supportsMopCleaning: () => mop,
    supportsCombinedCleaning: () => combined,
    isVacuumWorking: () => false,
    isConnected: () => true,
    startCleaning: async options => starts.push(options)
  };
  const wrapper = new RobotCleanerMatterAccessory('Robot', device, 'uuid', {}, { matter: {} }, { info() {} });
  return { wrapper, starts };
}

test('vacuum-only robots satisfy the Matter two-mode minimum without advertising mopping', async () => {
  const { wrapper, starts } = accessory();
  const modes = wrapper._getSupportedCleanModes();
  assert.deepEqual(modes.map(mode => mode.label), ['Vacuum', 'Auto']);
  assert.equal(new Set(modes.map(mode => mode.mode)).size, 2);
  assert.deepEqual(modes[1].modeTags, [{ value: 0 }]);
  for (const mode of modes) {
    await wrapper.handleCleanModeChange(mode.mode);
    await wrapper.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING);
  }
  assert.deepEqual(starts, [{ vacuum: true, mop: false }, { vacuum: true, mop: false }]);
  await assert.rejects(wrapper.handleCleanModeChange(MATTER_RVC_CLEAN_MODES.MOP), /not supported/);
});

test('robots with multiple cleaning actions keep their modes and command options', () => {
  for (const [mop, combined, labels] of [
    [true, false, ['Vacuum', 'Mop']],
    [false, true, ['Vacuum', 'Vacuum and Mop']],
    [true, true, ['Vacuum', 'Mop', 'Vacuum and Mop']]
  ]) {
    const { wrapper } = accessory(mop, combined);
    assert.deepEqual(wrapper._getSupportedCleanModes().map(mode => mode.label), labels);
    assert.deepEqual(wrapper._getCleaningOptions(MATTER_RVC_CLEAN_MODES.MOP), { vacuum: false, mop: true });
    assert.deepEqual(wrapper._getCleaningOptions(MATTER_RVC_CLEAN_MODES.VACUUM_MOP), { vacuum: true, mop: true });
  }
});

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  MATTER_RVC_OPERATIONAL_STATES,
  matterOperationalStateFromFlags
} = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

const VALID_OPERATIONAL_STATE_IDS = new Set([0, 1, 2, 3, 64, 65, 66, 67, 68, 69, 70]);

test('only publishes standard Matter robot operational states', () => {
  for (const state of Object.values(MATTER_RVC_OPERATIONAL_STATES)) {
    assert.equal(VALID_OPERATIONAL_STATE_IDS.has(state), true, `unexpected Matter operational state ${state}`);
  }
});

test('reports a fully charged robot as docked', () => {
  assert.equal(
    matterOperationalStateFromFlags({ isFullyCharged: true }),
    MATTER_RVC_OPERATIONAL_STATES.DOCKED
  );
});

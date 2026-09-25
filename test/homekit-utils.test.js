const assert = require('node:assert/strict');
const test = require('node:test');

const HomeKitUtils = require('../lib/utils/HomeKitUtils.js');

// sanitizeHomeKitName is the mechanism that produces HomeKit-visible service/switch names.
// Regressions here surface as blank or malformed accessory names, so pin its behavior.

test('keeps unicode letters, numbers and spaces', () => {
  assert.equal(HomeKitUtils.sanitizeHomeKitName('Living Room Fan 2'), 'Living Room Fan 2');
  assert.equal(HomeKitUtils.sanitizeHomeKitName('Zimmer Röm 3'), 'Zimmer Röm 3');
  assert.equal(HomeKitUtils.sanitizeHomeKitName('房间 1'), '房间 1');
});

test('strips disallowed symbols', () => {
  assert.equal(HomeKitUtils.sanitizeHomeKitName('Fan_Level-#1!'), 'FanLevel1');
  assert.equal(HomeKitUtils.sanitizeHomeKitName('A/B:C'), 'ABC');
});

test('keeps apostrophes', () => {
  assert.equal(HomeKitUtils.sanitizeHomeKitName("Bob's Room"), "Bob's Room");
});

test('trims leading and trailing spaces and apostrophes', () => {
  assert.equal(HomeKitUtils.sanitizeHomeKitName("  Mode  "), 'Mode');
  assert.equal(HomeKitUtils.sanitizeHomeKitName("''Mode''"), 'Mode');
});

test('falls back to Unnamed for empty or symbol-only names', () => {
  assert.equal(HomeKitUtils.sanitizeHomeKitName(''), 'Unnamed');
  assert.equal(HomeKitUtils.sanitizeHomeKitName('###'), 'Unnamed');
  assert.equal(HomeKitUtils.sanitizeHomeKitName('   '), 'Unnamed');
});

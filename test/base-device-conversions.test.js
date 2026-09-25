const assert = require('node:assert/strict');
const test = require('node:test');

const BaseDevice = require('../lib/base/BaseDevice.js');
const MiotProperty = require('../lib/protocol/MiotProperty.js');
const PropFormat = require('../lib/constants/PropFormat.js');
const PropAccess = require('../lib/constants/PropAccess.js');
const PropUnit = require('../lib/constants/PropUnit.js');

// BaseDevice's value-conversion helpers are pure math on a property's range / fan levels. They are
// the exact code the zhimi.fan.za4 speed fix depended on, so pin their behavior. BaseDevice is
// abstract, so we borrow the methods onto a lightweight context via Function.prototype.call.
const proto = BaseDevice.prototype;

function rangedProp(range, value) {
  const p = new MiotProperty('p', 2, 1, 't', 'P', PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, range, []);
  if (value !== undefined) p.updateInternalValue(value);
  return p;
}

/*----------========== percentage <-> prop value (linear) ==========----------*/

test('convertPropValueToPercentage maps a value in range to a rounded percentage', () => {
  assert.equal(proto.convertPropValueToPercentage.call({}, rangedProp([0, 100, 1], 50)), 50);
  assert.equal(proto.convertPropValueToPercentage.call({}, rangedProp([0, 200, 1], 50)), 25);
  assert.equal(proto.convertPropValueToPercentage.call({}, rangedProp([1, 100, 1], 1)), 0);
  assert.equal(proto.convertPropValueToPercentage.call({}, rangedProp([1, 100, 1], 100)), 100);
});

test('convertPropValueToPercentage returns null when the prop has no range', () => {
  const noRange = new MiotProperty('p', 2, 1, 't', 'P', PropFormat.UINT8, PropAccess.READ, PropUnit.NONE, [], []);
  assert.equal(proto.convertPropValueToPercentage.call({}, noRange), null);
});

test('convertPercentageToPropValue adds the range floor for a [1,100] range (current behavior)', () => {
  const p = rangedProp([1, 100, 1]);
  // NOTE: value = round(pct * (to-from)/100 + from). For a range that does NOT start at 0 this is
  // NOT an exact inverse of convertPropValueToPercentage - it carries a +1-ish offset (27 -> 28,
  // 43 -> 44). This is exactly why the zhimi.fan.za4 stepless speed was routed through the linear
  // speedLevelProp path (getRotationSpeedPercentage) instead of this method. Pinned to detect change.
  assert.equal(proto.convertPercentageToPropValue.call({}, 27, p), 28);
  assert.equal(proto.convertPercentageToPropValue.call({}, 43, p), 44);
  assert.equal(proto.convertPercentageToPropValue.call({}, 100, p), 100);
});

test('convertPercentageToPropValue is an exact inverse only for a [0,N] range', () => {
  const p = rangedProp([0, 100, 1]);
  assert.equal(proto.convertPercentageToPropValue.call({}, 27, p), 27);
  assert.equal(proto.convertPercentageToPropValue.call({}, 43, p), 43);
});

test('convertPercentageToPropValue returns the percentage unchanged with no range', () => {
  const noRange = new MiotProperty('p', 2, 1, 't', 'P', PropFormat.UINT8, PropAccess.READ, PropUnit.NONE, [], []);
  assert.equal(proto.convertPercentageToPropValue.call({}, 42, noRange), 42);
});

/*----------========== fan level bucketing ==========----------*/
// NOTE: for a range that does not start at 0, the round-trip is intentionally lossy (adds minLevel).
// These assertions pin the CURRENT behavior so a change is detected; they are not a claim it is ideal.

function fanRangeCtx(range, level) {
  return {
    supportsFanLevelList: () => false,
    supportsFanLevelRange: () => true,
    fanLevelRange: () => range,
    getFanLevel: () => level
  };
}

test('convertFanLevelToRotationSpeed for a [1,4] range', () => {
  // numberOfLevels = 4, speedPerLevel = 25; round(25 * level)
  assert.equal(proto.convertFanLevelToRotationSpeed.call(fanRangeCtx([1, 4, 1], 1)), 25);
  assert.equal(proto.convertFanLevelToRotationSpeed.call(fanRangeCtx([1, 4, 1], 4)), 100);
});

test('convertRotationSpeedToFanLevel for a [1,4] range adds minLevel (current behavior)', () => {
  // level = minLevel(1) + floor(speed / 25)
  assert.equal(proto.convertRotationSpeedToFanLevel.call(fanRangeCtx([1, 4, 1]), 0), 1);
  assert.equal(proto.convertRotationSpeedToFanLevel.call(fanRangeCtx([1, 4, 1]), 50), 3);
  assert.equal(proto.convertRotationSpeedToFanLevel.call(fanRangeCtx([1, 4, 1]), 100), 4); // clamped to max
});

test('fan level list path uses list length for buckets', () => {
  const listCtx = {
    supportsFanLevelList: () => true,
    supportsFanLevelRange: () => false,
    fanLevelsList: () => [{ value: 1 }, { value: 2 }, { value: 3 }],
    getFanLevel: () => 3
  };
  // speedPerLevel = 100/3; round(33.33 * 3) = 100
  assert.equal(proto.convertFanLevelToRotationSpeed.call(listCtx), 100);
});

/*----------========== time unit conversions ==========----------*/

test('convertToMinutes converts hours and seconds, passes minutes through', () => {
  assert.equal(proto.convertToMinutes.call({}, 2, PropUnit.HOURS), 120);
  assert.equal(proto.convertToMinutes.call({}, 90, PropUnit.SECONDS), 2); // ceil(90/60)
  assert.equal(proto.convertToMinutes.call({}, 5, PropUnit.MINUTES), 5);
});

test('convertMinutesToUnit is the inverse mapping', () => {
  assert.equal(proto.convertMinutesToUnit.call({}, 2, PropUnit.SECONDS), 120);
  assert.equal(proto.convertMinutesToUnit.call({}, 120, PropUnit.HOURS), 2);
  assert.equal(proto.convertMinutesToUnit.call({}, 5, PropUnit.MINUTES), 5);
});

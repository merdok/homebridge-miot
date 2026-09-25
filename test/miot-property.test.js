const assert = require('node:assert/strict');
const test = require('node:test');

const MiotProperty = require('../lib/protocol/MiotProperty.js');
const PropFormat = require('../lib/constants/PropFormat.js');
const PropAccess = require('../lib/constants/PropAccess.js');
const PropUnit = require('../lib/constants/PropUnit.js');

// helper to build a property with sensible defaults
function makeProp(overrides = {}) {
  const o = Object.assign({
    name: 'fan:fan-level', siid: 2, piid: 2, type: 'urn:miot-spec-v2:property:fan-level:00000016:x:1',
    description: 'Fan Level', format: PropFormat.UINT8, access: PropAccess.READ_WRITE_NOTIFY,
    unit: PropUnit.NONE, valueRange: [1, 100, 1], valueList: []
  }, overrides);
  return new MiotProperty(o.name, o.siid, o.piid, o.type, o.description, o.format, o.access, o.unit, o.valueRange, o.valueList);
}

test('throws when siid or piid is invalid', () => {
  assert.throws(() => makeProp({ siid: -1 }), /Invalid or missing/);
  assert.throws(() => makeProp({ piid: 'x' }), /Invalid or missing/);
});

test('parses numeric-string ids', () => {
  const p = makeProp({ siid: '2', piid: '5' });
  assert.equal(p.siid, 2);
  assert.equal(p.piid, 5);
});

test('access flags derive correctly from the access array', () => {
  assert.equal(makeProp({ access: PropAccess.READ_WRITE_NOTIFY }).isReadable(), true);
  assert.equal(makeProp({ access: PropAccess.READ_WRITE_NOTIFY }).isWritable(), true);
  assert.equal(makeProp({ access: PropAccess.READ_NOTIFY }).isReadOnly(), true);
  assert.equal(makeProp({ access: PropAccess.READ_NOTIFY }).isWritable(), false);
  assert.equal(makeProp({ access: PropAccess.WRITE }).isWriteOnly(), true);
  assert.equal(makeProp({ access: PropAccess.READ_WRITE }).isWriteOnly(), false);
  assert.equal(makeProp({ access: PropAccess.NONE }).isReadable(), false);
});

test('write-only property hides its value via getValue', () => {
  const p = makeProp({ access: PropAccess.WRITE });
  p.updateInternalValue(42);
  assert.equal(p.getValue(), undefined);
});

test('hasValueRange / hasValueList reflect provided metadata', () => {
  assert.equal(makeProp({ valueRange: [0, 10, 1] }).hasValueRange(), true);
  assert.equal(makeProp({ valueRange: [] }).hasValueRange(), false);
  assert.equal(makeProp({ valueList: [{ value: 0, description: 'Off' }] }).hasValueList(), true);
  assert.equal(makeProp({ valueList: [] }).hasValueList(), false);
});

test('isValueWithinRange respects the value range, true when unranged', () => {
  const ranged = makeProp({ valueRange: [1, 100, 1] });
  assert.equal(ranged.isValueWithinRange(1), true);
  assert.equal(ranged.isValueWithinRange(100), true);
  assert.equal(ranged.isValueWithinRange(0), false);
  assert.equal(ranged.isValueWithinRange(101), false);
  assert.equal(makeProp({ valueRange: [] }).isValueWithinRange(999999), true);
});

test('adjustValueToPropRange clamps to the range bounds', () => {
  const p = makeProp({ valueRange: [1, 100, 1] });
  assert.equal(p.adjustValueToPropRange(0), 1);
  assert.equal(p.adjustValueToPropRange(150), 100);
  assert.equal(p.adjustValueToPropRange(50), 50);
  // undefined is passed through untouched
  assert.equal(p.adjustValueToPropRange(undefined), undefined);
});

test('initial value matches the declared format', () => {
  assert.equal(makeProp({ format: PropFormat.BOOL }).getValue(), false);
  assert.equal(makeProp({ format: PropFormat.STRING }).getValue(), '');
  assert.equal(makeProp({ format: PropFormat.UINT8 }).getValue(), 0);
  assert.equal(makeProp({ format: PropFormat.FLOAT }).getValue(), 0);
});

test('getReadProtocolObjForDid requires a device id', () => {
  const p = makeProp();
  assert.throws(() => p.getReadProtocolObjForDid(null), /Missing device id/);
  assert.deepEqual(p.getReadProtocolObjForDid('dev123'), { did: 'dev123', siid: 2, piid: 2 });
});

test('getName returns the description-backed name and getType parses the urn segment', () => {
  const p = makeProp();
  assert.equal(p.getName(), 'fan:fan-level');
  assert.equal(p.getType(), 'fan-level');
});

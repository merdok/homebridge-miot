const { test } = require('node:test');
const assert = require('node:assert/strict');
const PropertyWrapper = require('../lib/wrappers/PropertyWrapper');

function fixture(initial = 0) {
  let value = initial;
  let writes = 0;
  const prop = { getName: () => 'sensor', getValue: () => value, getFormat: () => 'uint32', isWritable: () => true, isReadable: () => true, isValueWithinRange: () => true };
  const miot = { requestPropertyChunk: async () => ({ sensor: value }), setProperty: async (_, next) => { writes++; await new Promise(resolve => setImmediate(resolve)); value = next; return [{ code: 0 }]; } };
  const device = { isConnected: () => true, getMiotDevice: () => miot };
  const api = { hap: { Service: {}, Characteristic: {}, HapStatusError: class extends Error {}, HAPStatus: { SERVICE_COMMUNICATION_FAILURE: -1 } } };
  const logger = { deepDebug() {}, warn() {} };
  function wrapper(mask) {
    const w = new PropertyWrapper('test', prop, device, {}, api, logger);
    w.setBitMask(mask);
    w.createStatefulSwitch = () => ({});
    w.generateServiceId = suffix => suffix;
    w.addAccessoryService = () => {};
    assert.equal(w.prepareWrapper(), true);
    return w;
  }
  return { wrapper, miot, prop, value: () => value, writes: () => writes };
}

test('uint32 switches preserve other bits and serialize concurrent writes', async () => {
  const s = fixture(0x08012c00);
  const occupancy = s.wrapper('2147483648');
  const other = s.wrapper(262144);
  await Promise.all([occupancy.setBitmaskSwitchOn(true), other.setBitmaskSwitchOn(true)]);
  assert.equal(s.value(), 0x88052c00);
  assert.equal(occupancy.isBitmaskSwitchOn(), true);
  await occupancy.setBitmaskSwitchOn(false);
  assert.equal(s.value(), 0x08052c00);
  assert.equal(other.isBitmaskSwitchOn(), true);
});

test('failed property reads do not write', async () => {
  const s = fixture(8);
  s.miot.requestPropertyChunk = async () => ({});
  await assert.rejects(s.wrapper('1').setBitmaskSwitchOn(true));
  assert.equal(s.value(), 8);
  assert.equal(s.writes(), 0);
});

test('rejects invalid masks', () => {
  for (const mask of ['0', '3', '0x3', '0x100000000', '4294967296', '1.5', 'x']) {
    assert.throws(() => fixture().wrapper(mask));
  }
});

test('accepts hexadecimal masks including the highest uint32 bit', async () => {
  const s = fixture(4);
  const w = s.wrapper('0x80000000');
  await w.setBitmaskSwitchOn(true);
  assert.equal(s.value(), 0x80000004);
  assert.equal(w.isBitmaskSwitchOn(), true);
});

test('rejects a property without read access', () => {
  const s = fixture();
  s.prop.isReadable = () => false;
  assert.throws(() => s.wrapper('1'));
});

test('reports a failed device write and leaves the value unchanged', async () => {
  const s = fixture(8);
  s.miot.setProperty = async () => undefined;
  await assert.rejects(s.wrapper('1').setBitmaskSwitchOn(true));
  assert.equal(s.value(), 8);
});

test('uses the latest device value instead of the cached value', async () => {
  const s = fixture(0);
  s.miot.requestPropertyChunk = async () => ({ sensor: 8 });
  await s.wrapper('1').setBitmaskSwitchOn(true);
  assert.equal(s.value(), 9);
});

test('a failed operation does not block subsequent writes', async () => {
  const s = fixture(8);
  const w = s.wrapper('1');
  const read = s.miot.requestPropertyChunk;
  s.miot.requestPropertyChunk = async () => { throw new Error('read failed'); };
  await assert.rejects(w.setBitmaskSwitchOn(true));
  s.miot.requestPropertyChunk = read;
  await w.setBitmaskSwitchOn(true);
  assert.equal(s.value(), 9);
});

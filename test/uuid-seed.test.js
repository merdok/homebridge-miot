const assert = require('node:assert/strict');
const test = require('node:test');

const configSchema = require('../config.schema.json');
const { getUuidSeed } = require('../index.js');

const device = { ip: '192.168.1.10', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', deviceId: '123456' };

function findFieldset(items, title) {
  for (const item of items || []) {
    if (item && item.title === title) {
      return item;
    }
    const nested = item && findFieldset(item.items, title);
    if (nested) {
      return nested;
    }
  }
  return null;
}

test('keeps the legacy seed when no stable id is set', () => {
  assert.equal(getUuidSeed(device), 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa192.168.1.10123456miot');
  assert.equal(getUuidSeed({ ...device, deviceId: undefined }), 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa192.168.1.10miot');
  assert.equal(getUuidSeed({ ...device, deviceId: '' }), 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa192.168.1.10miot');
});

test('ignores a blank stable id', () => {
  assert.equal(getUuidSeed({ ...device, stableId: '   ' }), getUuidSeed(device));
});

test('a stable id survives a new token, ip and device id', () => {
  const before = getUuidSeed({ ...device, stableId: 'AA:BB:CC:DD:EE:FF' });
  const after = getUuidSeed({ ip: '192.168.1.20', token: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', deviceId: '654321', stableId: ' AA:BB:CC:DD:EE:FF ' });
  assert.equal(after, before);
  assert.equal(before, 'stableId:aa:bb:cc:dd:ee:ffmiot');
});

test('accepts a numeric stable id from a hand-edited config', () => {
  assert.equal(getUuidSeed({ ...device, stableId: 12345 }), getUuidSeed({ ...device, token: 'other', stableId: '12345' }));
});

test('ignores the case of a stable id', () => {
  assert.equal(getUuidSeed({ ...device, stableId: 'aa:bb:cc:dd:ee:ff' }), getUuidSeed({ ...device, stableId: 'AA:BB:CC:DD:EE:FF' }));
});

test('different stable ids give different seeds', () => {
  assert.notEqual(getUuidSeed({ ...device, stableId: 'one' }), getUuidSeed({ ...device, stableId: 'two' }));
});

test('exposes the stable id in the advanced device settings', () => {
  const deviceProperties = configSchema.schema.properties.devices.items.properties;
  assert.equal(deviceProperties.stableId.type, 'string');
  const advanced = findFieldset(configSchema.layout, 'Advanced Settings');
  assert.ok(advanced.items.includes('devices[].stableId'));
});

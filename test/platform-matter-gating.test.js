const assert = require('node:assert/strict');
const test = require('node:test');

const configSchema = require('../config.schema.json');
const {
  getMatterMode,
  isMatterReady
} = require('../index.js');

function createMatterApi(overrides = {}) {
  return {
    isMatterAvailable: () => true,
    isMatterEnabled: () => true,
    matter: {
      deviceTypes: { RoboticVacuumCleaner: {} },
      registerPlatformAccessories() {},
      unregisterPlatformAccessories() {},
      updateAccessoryState() {}
    },
    ...overrides
  };
}

test('defaults the public and legacy Matter settings to off', () => {
  const deviceProperties = configSchema.schema.properties.devices.items.properties;
  assert.equal(deviceProperties.matterEnabled.default, false);
  assert.equal(deviceProperties.matterMode.default, 'hap');
  assert.equal(deviceProperties.matterConnection.default, 'auto');
});

test('keeps Matter off unless it is explicitly enabled', () => {
  assert.equal(getMatterMode({}), 'hap');
  assert.equal(getMatterMode({ matterEnabled: false }), 'hap');
  assert.equal(getMatterMode({ matterEnabled: false, matterMode: 'auto' }), 'hap');
  assert.equal(getMatterMode({ matterEnabled: true }), 'matter');
  assert.equal(getMatterMode({ matterMode: 'matter' }), 'matter');
});

test('keeps Matter off for an invalid legacy mode', () => {
  const warnings = [];
  assert.equal(getMatterMode({ matterMode: 'unexpected' }, { warn: message => warnings.push(message) }), 'hap');
  assert.deepEqual(warnings, ['Unknown matterMode "unexpected". Matter will remain disabled.']);
});

test('requires Homebridge support, bridge enablement, and the complete robot Matter API', () => {
  assert.equal(isMatterReady(createMatterApi()), true);
  assert.equal(isMatterReady(createMatterApi({ isMatterAvailable: () => false })), false);
  assert.equal(isMatterReady(createMatterApi({ isMatterEnabled: () => false })), false);
  assert.equal(isMatterReady(createMatterApi({ matter: undefined })), false);
  assert.equal(isMatterReady(createMatterApi({ matter: { deviceTypes: {} } })), false);
  assert.equal(isMatterReady(createMatterApi({
    matter: {
      deviceTypes: { RoboticVacuumCleaner: {} },
      registerPlatformAccessories() {},
      unregisterPlatformAccessories() {}
    }
  })), false);
});

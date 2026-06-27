const test = require('node:test');
const assert = require('node:assert/strict');
const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');
const PropAccess = require('../lib/constants/PropAccess.js');

const logger = {
  error() {},
  info() {},
  warn() {},
  debug() {},
  deepDebug() {}
};

test('disableMiCloud keeps MiCloud disabled after later config and requirement changes', () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'roborock.vacuum.s5', 'Robot vacuum', logger);

  device.setMiCloudConfig({
    global: {
      forceMiCloud: true,
      username: 'user',
      password: 'password'
    }
  });
  assert.equal(device.shouldUseMiCloud(), true);

  device.disableMiCloud();
  assert.equal(device.shouldUseMiCloud(), false);
  assert.equal(device.requiresMiCloud(), false);

  device.setRequiresMiCloud(true);
  assert.equal(device.requiresMiCloud(), false);
  assert.equal(device.shouldUseMiCloud(), false);

  device.setMiCloudConfig({
    global: {
      forceMiCloud: true,
      username: 'user',
      password: 'password'
    }
  });
  assert.equal(device.shouldUseMiCloud(), false);
});

test('robot cleaner local connection state delegates to MiotDevice local connection state', () => {
  const device = new RobotCleanerDevice({
    isConnectedToLocalDevice() {
      return true;
    }
  }, 'Robot vacuum', logger);

  assert.equal(device.isLocallyConnected(), true);
});

test('local property polling rejects non-array device responses without parsing characters as properties', async () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);
  device.localConnected = true;
  device.addProperty('vacuum:status', 1, 1, '', 'Status', 'uint8', PropAccess.READ);
  device.getMiotProperties = async () => 'unknown_method';

  await assert.rejects(
    () => device.requestPropertyChunk(['vacuum:status']),
    /Local MIOT property polling is not supported/
  );
});

test('unsupported local MIOT property polling stops polling instead of reconnecting', async () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);
  device.localConnected = true;
  device.addProperty('vacuum:status', 1, 1, '', 'Status', 'uint8', PropAccess.READ);
  device.getMiotProperties = async () => 'unknown_method';

  const shouldStartPolling = await device._doInitialPropertiesFetch();

  assert.equal(shouldStartPolling, false);
  assert.equal(device.propertyPollingUnsupported, true);
  assert.equal(device.updateDevicePropertiesInterval, undefined);
  assert.equal(device.currentRunningTimeout, undefined);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');
const RockroboVacuumV1 = require('../lib/modules/robotcleaner/devices/rockrobo.vacuum.v1.js');
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

test('forceLocalConnection overrides MiCloud requirements and force flags', () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);

  device.setMiCloudConfig({
    global: {
      forceMiCloud: true,
      username: 'user',
      password: 'password'
    },
    device: {
      forceMiCloud: true
    }
  });
  device.setRequiresMiCloud(true);
  assert.equal(device.shouldUseMiCloud(), true);

  device.forceLocalConnection();

  assert.equal(device.requiresMiCloud(), false);
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

test('local property polling can use a model-specific local property reader', async () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);
  device.localConnected = true;
  device.setLocalPropertyReader(async params => params.map(() => ({ code: 0, value: 3 })));
  device.addProperty('vacuum:status', 1, 1, '', 'Status', 'uint8', PropAccess.READ);

  const result = await device.requestPropertyChunk(['vacuum:status']);

  assert.deepEqual(result, { 'vacuum:status': 3 });
});

test('local connection can use a model-specific device info fallback', async () => {
  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);
  device.miioProtocol.handshake = async () => {};
  device.miioProtocol.getInfo = async () => {
    throw new Error('Call to device timed out');
  };
  device.setLocalDeviceInfoReader(async () => ({ model: 'rockrobo.vacuum.v1', fw_ver: 'unknown' }));

  await device._connectToLocalDevice();

  assert.equal(device.isConnectedToLocalDevice(), true);
  assert.equal(device.getDeviceInfo().model, 'rockrobo.vacuum.v1');
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

test('rockrobo v1 maps legacy miio status into plugin robot properties', () => {
  const robot = new RockroboVacuumV1({}, 'Robot vacuum', logger);

  assert.equal(robot._mapLegacyMiioState(8), robot.statusChargingValue());
  assert.equal(robot._mapLegacyMiioState(5), robot.statusSweepingValue());
  assert.equal(robot._mapLegacyMiioState(6), robot.statusGoChargingValue());
  assert.equal(robot._mapLegacyMiioState(10), robot.statusPausedValue());
  assert.equal(robot._mapLegacyMiioState(12), robot.statusErrorValue());
  assert.equal(robot._getLegacyMiioPropertyValue({ state: 8, battery: 97, fan_power: 80 }, { siid: 3, piid: 1 }), 97);
  assert.equal(robot._getLegacyMiioPropertyValue({ state: 8, battery: 97, fan_power: 80 }, { siid: 3, piid: 2 }), 1);
  assert.equal(robot._getLegacyMiioPropertyValue({ state: 3, battery: 97, fan_power: 80 }, { siid: 3, piid: 2 }), 2);
  assert.equal(robot._getLegacyMiioPropertyValue({ state: 3, battery: 97, fan_power: 80 }, { siid: 2, piid: 2 }), 80);
});

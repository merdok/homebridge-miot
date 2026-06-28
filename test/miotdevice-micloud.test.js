const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
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

test('cached MiCloud session is refreshed and persisted after cached setup failure', async (t) => {
  const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-cached-session-'));
  const cacheFile = path.join(storagePath, 'cachedSession');
  t.after(() => fs.rm(storagePath, { recursive: true, force: true }));

  const device = new MiotDevice('127.0.0.1', '00000000000000000000000000000000', '123', 'rockrobo.vacuum.v1', 'Robot vacuum', logger);
  device.setMiCloudConfig({
    global: {
      username: 'user',
      password: 'password',
      country: 'cn',
      useCachedSession: true
    },
    cachedSession: {
      ssecurity: 'old-security',
      userId: 'old-user',
      serviceToken: 'old-token',
      loggedInAt: '2024-01-01 00:00:00'
    },
    cachedSessionFile: cacheFile
  });

  const loginCalls = [];
  const serviceTokens = [];
  device.miCloud = {
    loggedIn: false,
    setServiceToken(token) {
      serviceTokens.push(token.serviceToken);
      this.loggedIn = true;
      this.serviceToken = token.serviceToken;
    },
    isLoggedIn() {
      return this.loggedIn;
    },
    setCountry() {},
    logout() {
      this.loggedIn = false;
      this.serviceToken = null;
    },
    async login(username, password) {
      loginCalls.push({ username, password });
      this.loggedIn = true;
      this.serviceToken = 'fresh-token';
    },
    getServiceToken() {
      return {
        ssecurity: 'fresh-security',
        userId: 'fresh-user',
        serviceToken: this.serviceToken,
        timestamp: 1710000000000,
        loggedInAt: '2024-03-09 16:00:00'
      };
    }
  };

  let setupCalls = 0;
  device._cloudDeviceSetup = async () => {
    setupCalls++;
    if (setupCalls === 1) {
      throw new Error('Request error with status 401 Unauthorized');
    }
    device.miCloudDeviceInfo = {
      model: 'rockrobo.vacuum.v1'
    };
  };

  await device._connectToCloudDevice();

  assert.deepEqual(serviceTokens, ['old-token']);
  assert.deepEqual(loginCalls, [{ username: 'user', password: 'password' }]);
  assert.equal(setupCalls, 2);
  assert.equal(device.miCloudConfig.cachedSession.serviceToken, 'fresh-token');

  const savedSession = JSON.parse(await fs.readFile(cacheFile, 'utf8'));
  assert.equal(savedSession.serviceToken, 'fresh-token');
  assert.equal(savedSession.userId, 'fresh-user');
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

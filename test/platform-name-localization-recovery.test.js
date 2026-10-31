const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const DeviceFactory = require('../lib/factories/DeviceFactory.js');
const DevTypes = require('../lib/constants/DevTypes.js');
const {MiotNameResolver} = require('../lib/utils/MiotNameResolver.js');
const plugin = require('../index.js');

test('falls back to source names when localization initialization rejects', async t => {
  const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-name-recovery-'));
  t.after(() => fs.rm(storagePath, {recursive: true, force: true}));

  const originalCreateDevice = DeviceFactory.createDevice;
  const originalCreateResolver = MiotNameResolver.create;
  t.after(() => {
    DeviceFactory.createDevice = originalCreateDevice;
    MiotNameResolver.create = originalCreateResolver;
  });

  let installedResolver;
  let finishOutcome;
  const outcome = new Promise(resolve => {
    finishOutcome = resolve;
  });
  const fakeDevice = {
    async initDevice() {},
    getMiotSpec: () => ({
      type: 'urn:miot-spec-v2:device:light:0000A001:example-v1:1',
    }),
    getMiotSpecUrl: () => null,
    setHomeKitNameResolver(resolver) {
      installedResolver = resolver;
    },
    getType: () => DevTypes.UNKNOWN,
    getDeviceName: () => 'Test Device',
    initDeviceAccessory() {
      finishOutcome('prepared');
    },
    getAccessoryWrapper: () => null,
    getAccessories: () => [],
  };
  DeviceFactory.createDevice = async () => fakeDevice;
  MiotNameResolver.create = async () => {
    throw new Error('localization unavailable');
  };

  const warnings = [];
  const errors = [];
  const log = {
    debug() {},
    info() {},
    warn(message) {
      warnings.push(message);
    },
    error(message) {
      errors.push(message);
      if (message.includes('Failed to initialize device')) {
        finishOutcome('failed');
      }
    },
  };
  const homebridge = {
    hap: {
      Service: {},
      Characteristic: {},
      uuid: {
        generate(value) {
          return crypto.createHash('sha1').update(value).digest('hex');
        },
      },
    },
    platformAccessory: class {},
    registerPlatform() {},
  };
  plugin(homebridge);

  const deviceConfig = {
    name: 'Test Device',
    ip: '192.0.2.10',
    token: '00000000000000000000000000000000',
    model: 'example.light.v1',
    prefsDir: storagePath,
  };
  const api = {
    on() {},
    user: {storagePath: () => storagePath},
    registerPlatformAccessories() {},
    unregisterPlatformAccessories() {},
  };
  const platform = new plugin.miotPlatform(log, {
    nameLanguage: 'zh-Hans',
    devices: [deviceConfig],
  }, api);

  platform.initDevice(deviceConfig);

  let timeoutId;
  const timeout = new Promise(resolve => {
    timeoutId = setTimeout(() => resolve('timeout'), 1000);
  });
  const result = await Promise.race([outcome, timeout]);
  clearTimeout(timeoutId);

  assert.equal(result, 'prepared');
  assert.ok(installedResolver instanceof MiotNameResolver);
  assert.equal(installedResolver.resolve('Mode'), 'Mode');
  assert.equal(warnings.filter(message => message.includes('Falling back to source names')).length, 1);
  assert.equal(errors.length, 0);
});

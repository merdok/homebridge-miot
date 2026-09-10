const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const plugin = require('../index.js');

function createHarness(storagePath, options = {}) {
  const messages = [];
  const homebridge = {
    hap: {
      Service: {},
      Characteristic: {},
      uuid: {
        generate(value) {
          return crypto.createHash('sha1').update(value).digest('hex');
        }
      }
    },
    platformAccessory: class {},
    registerPlatform() {}
  };
  plugin(homebridge);

  const config = {
    devices: [{
      name: 'Mi Robot Vacuum-Mop Pro',
      ip: '192.168.20.29',
      token: 'test-token',
      deviceId: '1023306548',
      matterEnabled: options.matterEnabled ?? true
    }]
  };
  const log = {
    debug() {},
    info(message) { messages.push(message); },
    warn(message) { messages.push(message); }
  };
  const api = {
    on() {},
    user: { storagePath: () => storagePath },
    isMatterAvailable: () => true,
    isMatterEnabled: () => options.matterBridgeEnabled ?? true,
    matter: {
      deviceTypes: { RoboticVacuumCleaner: {} },
      registerPlatformAccessories() {},
      unregisterPlatformAccessories() {},
      updateAccessoryState() {}
    }
  };

  return { platform: new plugin.miotPlatform(log, config, api), config, messages };
}

async function expectedStorage(harness, storagePath) {
  const device = harness.config.devices[0];
  const uuidSeed = device.token + device.ip + device.deviceId + 'miot';
  const uuid = crypto.createHash('sha1').update(uuidSeed + ':matter').digest('hex');
  const storageId = plugin.getExternalMatterStorageId(uuid);
  const storageDir = path.join(storagePath, 'matter', storageId);
  await fs.mkdir(storageDir, { recursive: true });
  return { uuid, storageId, storageDir };
}

test('maps a Matter accessory UUID to Homebridge external storage', () => {
  assert.equal(plugin.getExternalMatterStorageId('c6409d38-1e73-4c0a-ac19-e153adbdad65'), '123F176C5EE8');
});

test('keeps external Matter storage during a normal restart', async t => {
  const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-matter-test-'));
  t.after(() => fs.rm(storagePath, { recursive: true, force: true }));
  const harness = createHarness(storagePath);
  const expected = await expectedStorage(harness, storagePath);
  await fs.writeFile(path.join(expected.storageDir, 'accessories.json'), JSON.stringify([{
    UUID: expected.uuid,
    plugin: 'homebridge-miot',
    context: { plugin: 'homebridge-miot', deviceType: 'RobotCleaner' }
  }]));

  await harness.platform.quarantineStaleExternalMatterStorage();

  await fs.access(expected.storageDir);
  assert.equal(harness.messages.length, 0);
});

test('does not run reset recovery when Homebridge Matter is disabled', async t => {
  const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-matter-test-'));
  t.after(() => fs.rm(storagePath, { recursive: true, force: true }));
  const harness = createHarness(storagePath, { matterBridgeEnabled: false });
  const expected = await expectedStorage(harness, storagePath);

  await harness.platform.quarantineStaleExternalMatterStorage();

  await fs.access(expected.storageDir);
  assert.equal(harness.messages.length, 0);
});

for (const cacheState of ['empty', 'missing']) {
  test(`quarantines ${cacheState} expected cache so a removed robot can be paired again`, async t => {
    const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-matter-test-'));
    t.after(() => fs.rm(storagePath, { recursive: true, force: true }));
    const harness = createHarness(storagePath);
    const expected = await expectedStorage(harness, storagePath);
    if (cacheState === 'empty') {
      await fs.writeFile(path.join(expected.storageDir, 'accessories.json'), '[]');
    }

    await harness.platform.quarantineStaleExternalMatterStorage();

    await assert.rejects(fs.access(expected.storageDir));
    const quarantineEntries = await fs.readdir(path.join(storagePath, '.miot_matter_stale'));
    assert.equal(quarantineEntries.length, 1);
    assert.match(quarantineEntries[0], new RegExp(`^${expected.storageId}-`));
    assert.match(harness.messages[0], /fresh pairing credentials/);
  });
}

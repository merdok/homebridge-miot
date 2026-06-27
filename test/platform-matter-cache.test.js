const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

function createPlatform(config = {}, storagePath = null) {
  delete require.cache[require.resolve('../index.js')];

  let PlatformClass = null;
  const fakeHomebridge = {
    hap: {
      Service: {},
      Characteristic: {},
      uuid: {
        generate(value) {
          return `uuid:${value}`;
        }
      }
    },
    platformAccessory: function PlatformAccessory() {},
    registerPlatform(pluginName, platformName, platformClass) {
      PlatformClass = platformClass;
    }
  };

  require('../index.js')(fakeHomebridge);

  const unregisterCalls = [];
  const log = {
    debug() {},
    error() {},
    info() {},
    warn() {}
  };
  const api = {
    on() {},
    user: {
      storagePath() {
        return storagePath || os.tmpdir();
      }
    },
    matter: {
      async unregisterPlatformAccessories(pluginName, platformName, accessories) {
        unregisterCalls.push({ pluginName, platformName, accessories });
      }
    }
  };

  return {
    platform: new PlatformClass(log, config, api),
    unregisterCalls
  };
}

test('stale restored Matter accessories are all unregistered', async () => {
  const { platform, unregisterCalls } = createPlatform();
  const firstAccessory = {
    UUID: 'uuid-one',
    displayName: 'Old robot one'
  };
  const secondAccessory = {
    UUID: 'uuid-two',
    displayName: 'Old robot two'
  };

  platform.configureMatterAccessory(firstAccessory);
  platform.configureMatterAccessory(secondAccessory);

  await platform.removeMatterAccessories();

  assert.equal(unregisterCalls.length, 1);
  assert.equal(unregisterCalls[0].pluginName, 'homebridge-miot');
  assert.equal(unregisterCalls[0].platformName, 'miot');
  assert.deepEqual(unregisterCalls[0].accessories, [firstAccessory, secondAccessory]);
  assert.deepEqual(platform.cachedMatterAccessories, []);
});

test('stale external Matter storage is moved out of Homebridge Matter cache', async (t) => {
  const storagePath = await fs.mkdtemp(path.join(os.tmpdir(), 'miot-matter-cache-'));
  t.after(() => fs.rm(storagePath, { recursive: true, force: true }));

  const matterPath = path.join(storagePath, 'matter');
  const staleBridgePath = path.join(matterPath, 'ABCDEF123456');
  const currentBridgePath = path.join(matterPath, '111111111111');
  const otherPluginBridgePath = path.join(matterPath, '222222222222');
  const expectedUuid = 'uuid:token127.0.0.1device-idmiot:matter';

  await fs.mkdir(staleBridgePath, { recursive: true });
  await fs.mkdir(currentBridgePath, { recursive: true });
  await fs.mkdir(otherPluginBridgePath, { recursive: true });
  await fs.writeFile(path.join(staleBridgePath, 'accessories.json'), JSON.stringify([{
    uuid: 'stale-uuid',
    displayName: 'Old Robot',
    plugin: 'homebridge-miot',
    model: 'roborock.vacuum.s5'
  }]));
  await fs.writeFile(path.join(currentBridgePath, 'accessories.json'), JSON.stringify([{
    uuid: expectedUuid,
    displayName: 'Robot vacuum2',
    plugin: 'homebridge-miot',
    model: 'rockrobo.vacuum.v1'
  }]));
  await fs.writeFile(path.join(otherPluginBridgePath, 'accessories.json'), JSON.stringify([{
    uuid: 'other-plugin-uuid',
    displayName: 'Other Robot',
    plugin: 'other-plugin',
    model: 'example.vacuum.v1'
  }]));

  const { platform } = createPlatform({
    devices: [{
      name: 'Robot vacuum2',
      model: 'rockrobo.vacuum.v1',
      ip: '127.0.0.1',
      token: 'token',
      deviceId: 'device-id',
      matterMode: 'matter',
      micloud: {
        forceMiCloud: false
      }
    }]
  }, storagePath);

  await platform.removeStaleExternalMatterAccessories();

  await assert.rejects(() => fs.stat(staleBridgePath));
  await fs.stat(path.join(currentBridgePath, 'accessories.json'));
  await fs.stat(path.join(otherPluginBridgePath, 'accessories.json'));

  const backupEntries = await fs.readdir(path.join(storagePath, '.miot_matter_stale'));
  assert.equal(backupEntries.length, 1);
  assert.match(backupEntries[0], /^ABCDEF123456-/);
});

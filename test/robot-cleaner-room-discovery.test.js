const assert = require('node:assert/strict');
const test = require('node:test');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const MiotDevice = require('../lib/protocol/MiotDevice.js');
const RobotCleanerDevice = require('../lib/modules/robotcleaner/RobotCleanerDevice.js');
const RobotCleanerMatterAccessory = require('../lib/modules/robotcleaner/RobotCleanerMatterAccessory.js');
const { normalizeMatterRooms } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

const logger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };
function savedMapFile() {
  const header = Buffer.alloc(27);
  header.writeUInt16LE(42, 0);
  const map = zlib.deflateSync(Buffer.concat([header, Buffer.from(JSON.stringify({ seg_inf: { 1: { name: 'S2l0Y2hlbg==' } } }))])).toString('base64url');
  return Buffer.from(JSON.stringify({ curr_id: 42, mapstr: [{ id: 0, name: 'Current floor', map }] }));
}

function robot() {
  const md = new MiotDevice('127.0.0.1', 'test-token', 'test-device', 'dreame.vacuum.p2009', 'Robot', logger);
  md.localConnected = true;
  md.addPropertyByString('map:mult-map-info', JSON.stringify({ siid: 6, piid: 8, format: 'string', access: ['read', 'notify'] }));
  const file = savedMapFile();
  const commands = [];
  const reference = { object_name: 'test/map', md5: crypto.createHash('md5').update(file).digest('hex') };
  md.miioProtocol = { send: async (ip, method, params) => {
    commands.push({ method, params });
    if (method === 'get_room_mapping') return { error: 'unknown_method' };
    assert.equal(method, 'get_properties');
    return [{ siid: 6, piid: 8, code: 0, value: JSON.stringify(reference) }];
  } };
  const downloads = [];
  md.getMiCloudFile = async objectName => { downloads.push(objectName); return file; };
  return { md, device: new RobotCleanerDevice(md, 'Robot', logger), reference, commands, downloads };
}

test('Dreame map discovery requires explicit MiCloud opt-in and uses read-only LAN queries', async () => {
  const { device, commands, downloads } = robot();
  assert.equal(device.supportsRoomDiscovery(), false);
  assert.equal(device.supportsRoomDiscovery({ useMiCloud: true }), true);
  assert.deepEqual(await device.discoverRooms(), []);
  assert.deepEqual(downloads, []);
  assert.deepEqual(await device.discoverRooms({ useMiCloud: true }), [
    { id: '1', name: 'Kitchen', mapId: '42', mapName: 'Current floor' }
  ]);
  assert.deepEqual(downloads, ['test/map']);
  assert.deepEqual(commands.find(command => command.method === 'get_properties').params, [{ did: 'test-device', siid: 6, piid: 8 }]);
  assert.equal(commands.every(command => ['get_room_mapping', 'get_properties'].includes(command.method)), true);
});

test('prefers existing local room discovery over cloud downloads', async () => {
  const { device, downloads } = robot();
  device._tryDiscoverLegacyRooms = async () => [{ id: '7', name: 'Local room' }];
  assert.deepEqual(await device.discoverRooms({ useMiCloud: true }), [{ id: '7', name: 'Local room' }]);
  assert.deepEqual(downloads, []);
});

test('refuses changed checksums and missing map references', async () => {
  const { device, reference } = robot();
  reference.md5 = 'changed';
  await assert.rejects(device.discoverRooms({ useMiCloud: true }), /checksum/);
  reference.md5 = undefined;
  reference.object_name = undefined;
  await assert.rejects(device.discoverRooms({ useMiCloud: true }), /object name/);
});

function accessory(config = {}) {
  const updates = [];
  const device = {
    supportsRoomCleaning: () => true,
    supportsIdentify: () => false,
    supportsRoomDiscovery: options => options.useMiCloud,
    isLocallyConnected: () => true,
    discoverRooms: async () => [{ id: '1', name: 'Kitchen', mapId: '42', mapName: 'Current floor' }]
  };
  const a = new RobotCleanerMatterAccessory('Robot', device, 'test-uuid', config,
    { matter: { updateAccessoryState: async (...args) => updates.push(args) } }, logger);
  a.accessory = { clusters: { serviceArea: { supportedAreas: [], supportedMaps: [], selectedAreas: [] } } };
  return { a, device, updates };
}

test('refresh publishes discovered rooms through the Matter API with map names and manual name overrides', async () => {
  const { a, device, updates } = accessory({ matterRoomDiscoveryMiCloud: true, matterRooms: [{ id: '1', name: 'My kitchen' }] });
  let options;
  const discover = device.discoverRooms;
  device.discoverRooms = async value => { options = value; return discover(); };
  await a._refreshDiscoveredRoomsIfNeeded();
  assert.deepEqual(options, { useMiCloud: true });
  assert.equal(updates.length, 1);
  assert.deepEqual(updates[0][2].supportedMaps, [{ mapId: 42, name: 'Current floor' }]);
  assert.equal(updates[0][2].supportedAreas[0].areaInfo.locationInfo.locationName, 'My kitchen');
  assert.equal(a.accessory.context.rooms.length, 1);
  await a._refreshDiscoveredRoomsIfNeeded();
  assert.equal(updates.length, 1, 'respects the refresh interval');
});

test('disabled discovery never fetches cloud maps even with the fallback enabled', async () => {
  const { a, device } = accessory({ matterRoomDiscovery: 'disabled', matterRoomDiscoveryMiCloud: true });
  device.discoverRooms = async () => assert.fail('discovery is disabled');
  await a._refreshDiscoveredRoomsIfNeeded();
});

test('changing maps clears a selection even when the new floor reuses the same room ID', async () => {
  const { a } = accessory();
  a.cachedRooms = [{ id: '1', name: 'Old room', mapId: '11' }];
  a.normalizedRooms = normalizeMatterRooms(a.cachedRooms);
  a.selectedAreaIds = [1];
  await a._refreshDiscoveredRooms();
  assert.equal(a.normalizedRooms.length, 1);
  assert.equal(a.normalizedRooms[0].mapId, '42');
  assert.deepEqual(a.selectedAreaIds, []);
});

test('failed or empty discovery preserves cached rooms and current selection', async () => {
  const { a, device, updates } = accessory();
  const cached = [{ id: '1', name: 'Cached room', mapId: '11' }];
  a.cachedRooms = cached;
  a.normalizedRooms = normalizeMatterRooms(cached);
  a.selectedAreaIds = [1];
  device.discoverRooms = async () => { throw new Error('unknown current map'); };
  await assert.rejects(a._refreshDiscoveredRooms(), /unknown current map/);
  device.discoverRooms = async () => [];
  await a._refreshDiscoveredRooms();
  assert.deepEqual(a.cachedRooms, cached);
  assert.deepEqual(a.selectedAreaIds, [1]);
  assert.deepEqual(updates, []);
});

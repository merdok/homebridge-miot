const assert = require('node:assert/strict');
const test = require('node:test');
const zlib = require('node:zlib');
const { parseDreameMapRooms } = require('../lib/modules/robotcleaner/DreameMapRooms.js');
const { normalizeMatterRooms, matterMapsFromRooms } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

// Synthetic maps only: no account IDs, real room names, coordinates or floor plans.
function savedMap(slot, mapId, name, rooms, width = 2, height = 3) {
  const header = Buffer.alloc(27);
  header.writeUInt16LE(mapId, 0);
  header.writeUInt16LE(width, 19);
  header.writeUInt16LE(height, 21);
  const metadata = Buffer.from(JSON.stringify({ seg_inf: rooms }));
  return { id: slot, name, map: zlib.deflateSync(Buffer.concat([header, Buffer.alloc(width * height), metadata])).toString('base64url') };
}

test('selects curr_id by binary header, ignoring list order, slot zero and duplicate room IDs on other maps', () => {
  const oldMap = savedMap(2, 112, 'Old floor', { 1: { name: Buffer.from('Old room').toString('base64') } });
  const currentMap = savedMap(0, 178, 'Current floor', {
    2: { name: Buffer.from('Büro_办公室').toString('base64') },
    1: { roomID: 'unrelated-cloud-room-id', name: Buffer.from('Living room').toString('base64') },
    3: { type: 6 }
  });
  const rooms = parseDreameMapRooms({ curr_id: 178, mapstr: [oldMap, currentMap] });
  assert.deepEqual(rooms, [
    { id: '1', name: 'Living room', mapId: '178', mapName: 'Current floor' },
    { id: '2', name: 'Büro_办公室', mapId: '178', mapName: 'Current floor' },
    { id: '3', name: 'Room 3', mapId: '178', mapName: 'Current floor' }
  ]);
  assert.deepEqual(matterMapsFromRooms(normalizeMatterRooms(rooms)), [{ mapId: 178, name: 'Current floor' }]);
});

test('accepts map ID zero and standard padded base64', () => {
  const map = savedMap(7, 0, 'Ground floor', { 1: {} });
  map.map = Buffer.from(map.map, 'base64url').toString('base64');
  assert.equal(parseDreameMapRooms({ curr_id: '0', mapstr: [map] })[0].mapId, '0');
});

test('rejects a missing, unknown or ambiguous active map rather than guessing a floor', () => {
  const map = savedMap(0, 178, 'Floor', { 1: {} });
  assert.throws(() => parseDreameMapRooms({ mapstr: [map] }), /no current map/);
  assert.throws(() => parseDreameMapRooms({ curr_id: 0, mapstr: [map] }), /uniquely identified/);
  assert.throws(() => parseDreameMapRooms({ curr_id: 178, mapstr: [map, map] }), /uniquely identified/);
});

test('rejects unsupported encryption, corrupt data, truncated headers and missing room metadata', () => {
  const map = savedMap(0, 178, 'Floor', { 1: {} });
  const parse = entry => parseDreameMapRooms({ curr_id: 178, mapstr: [entry] });
  assert.throws(() => parse({ ...map, map: `${map.map},key` }), /encoding/);
  assert.throws(() => parse({ ...map, map: 'not-a-map' }));
  assert.throws(() => parse({ ...map, map: zlib.deflateSync(Buffer.alloc(3)).toString('base64') }), /header/);
  const header = Buffer.alloc(27);
  header.writeUInt16LE(178, 0);
  assert.throws(() => parse({ ...map, map: zlib.deflateSync(header).toString('base64') }), /metadata/);
  assert.throws(() => parse(savedMap(0, 178, 'Floor', null)), /room list/);
});

test('bounds decompression of untrusted map payloads', () => {
  const oversized = zlib.deflateSync(Buffer.alloc(32 * 1024 * 1024 + 1)).toString('base64');
  assert.throws(() => parseDreameMapRooms({ curr_id: 1, mapstr: [{ map: oversized }] }));
});

const zlib = require('zlib');

const HEADER_SIZE = 27;
const MAX_MAP_BYTES = 32 * 1024 * 1024;

// Dreame map-list slots are unrelated to the IDs stored in the binary headers.
// Only curr_id identifies the active map; segment IDs can repeat on other maps.
function parseDreameMapRooms(mapList) {
  if (!mapList || !Array.isArray(mapList.mapstr) || mapList.curr_id == null) {
    throw new Error('Dreame saved map list has no current map.');
  }

  const activeMaps = [];
  for (const entry of mapList.mapstr) {
    if (!entry || typeof entry.map !== 'string' || entry.map.includes(',')) {
      throw new Error('Dreame saved map encoding is not supported.');
    }
    const data = zlib.inflateSync(Buffer.from(entry.map, 'base64url'), { maxOutputLength: MAX_MAP_BYTES });
    if (data.length < HEADER_SIZE) {
      throw new Error('Dreame saved map header is incomplete.');
    }
    const mapId = String(data.readUInt16LE(0));
    if (mapId === String(mapList.curr_id)) {
      activeMaps.push({ entry, data, mapId });
    }
  }
  if (activeMaps.length !== 1) {
    throw new Error('Dreame current map could not be uniquely identified.');
  }

  const { entry, data, mapId } = activeMaps[0];
  const metadataOffset = HEADER_SIZE + data.readUInt16LE(19) * data.readUInt16LE(21);
  if (metadataOffset >= data.length) {
    throw new Error('Dreame current map has no room metadata.');
  }
  const metadata = JSON.parse(data.subarray(metadataOffset).toString('utf8'));
  if (!metadata.seg_inf || typeof metadata.seg_inf !== 'object' || Array.isArray(metadata.seg_inf)) {
    throw new Error('Dreame current map has no room list.');
  }

  return Object.entries(metadata.seg_inf)
    .filter(([id, room]) => /^\d+$/.test(id) && Number(id) > 0 && room && typeof room === 'object')
    .map(([id, room]) => ({
      id,
      name: typeof room.name === 'string' && room.name
        ? Buffer.from(room.name, 'base64').toString('utf8') || `Room ${id}`
        : `Room ${id}`,
      mapId,
      mapName: typeof entry.name === 'string' && entry.name ? entry.name : `Map ${mapId}`
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

module.exports = { parseDreameMapRooms };

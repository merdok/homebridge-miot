const MATTER_RVC_RUN_MODES = {
  IDLE: 0,
  CLEANING: 1
};

const MATTER_RVC_CLEAN_MODES = {
  VACUUM: 0,
  MOP: 1,
  VACUUM_MOP: 2
};

const MATTER_RVC_OPERATIONAL_STATES = {
  STOPPED: 0,
  RUNNING: 1,
  PAUSED: 2,
  ERROR: 3,
  SEEKING_CHARGER: 64,
  CHARGING: 65,
  DOCKED: 66,
  EMPTYING_DUST_BIN: 67,
  CLEANING_MOP: 68,
  FILLING_WATER_TANK: 69,
  UPDATING_MAPS: 70
};

const MATTER_RVC_RUN_MODE_TAGS = {
  IDLE: 16384,
  CLEANING: 16385,
  MAPPING: 16386
};

const MATTER_RVC_CLEAN_MODE_TAGS = {
  DEEP_CLEAN: 16384,
  VACUUM: 16385,
  MOP: 16386
};

const MATTER_BATTERY_CHARGE_LEVELS = {
  OK: 0,
  WARNING: 1,
  CRITICAL: 2
};

const BATTERY_WARNING_THRESHOLD = 20;
const BATTERY_CRITICAL_THRESHOLD = 10;
const AREA_ID_MIN = 1;
const AREA_ID_MAX = 65534;

function containsOrEquals(value, expected) {
  if (expected == null || expected === -1) {
    return false;
  }
  if (Array.isArray(expected)) {
    return expected.includes(value);
  }
  return value === expected;
}

function clampNumber(value, min, max, fallback = min) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, numericValue));
}

function clampBatteryPercent(value) {
  return Math.round(clampNumber(value, 0, 100, 0));
}

function batteryPercentToMatter(value) {
  return clampBatteryPercent(value) * 2;
}

function batteryChargeLevel(value) {
  const percent = clampBatteryPercent(value);
  if (percent <= BATTERY_CRITICAL_THRESHOLD) {
    return MATTER_BATTERY_CHARGE_LEVELS.CRITICAL;
  }
  if (percent <= BATTERY_WARNING_THRESHOLD) {
    return MATTER_BATTERY_CHARGE_LEVELS.WARNING;
  }
  return MATTER_BATTERY_CHARGE_LEVELS.OK;
}

function matterOperationalStateFromFlags(flags = {}) {
  if (flags.hasFault || flags.isError) {
    return MATTER_RVC_OPERATIONAL_STATES.ERROR;
  }
  if (flags.isWorking) {
    return MATTER_RVC_OPERATIONAL_STATES.RUNNING;
  }
  if (flags.isPaused) {
    return MATTER_RVC_OPERATIONAL_STATES.PAUSED;
  }
  if (flags.isGoCharging) {
    return MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER;
  }
  if (flags.isCharging) {
    return MATTER_RVC_OPERATIONAL_STATES.CHARGING;
  }
  if (flags.isDocked) {
    return MATTER_RVC_OPERATIONAL_STATES.DOCKED;
  }
  if (flags.isEmptyingDustBin) {
    return MATTER_RVC_OPERATIONAL_STATES.EMPTYING_DUST_BIN;
  }
  if (flags.isCleaningMop) {
    return MATTER_RVC_OPERATIONAL_STATES.CLEANING_MOP;
  }
  if (flags.isUpdatingMaps) {
    return MATTER_RVC_OPERATIONAL_STATES.UPDATING_MAPS;
  }
  return MATTER_RVC_OPERATIONAL_STATES.STOPPED;
}

function selectMatterCleanModeAction(cleanMode, actions = {}) {
  if (cleanMode === MATTER_RVC_CLEAN_MODES.MOP) {
    return actions.startMop || null;
  }
  if (cleanMode === MATTER_RVC_CLEAN_MODES.VACUUM_MOP) {
    return actions.startSweepMop || null;
  }
  return actions.startOnlySweep || actions.startSweep || null;
}

function stableAreaId(id, usedAreaIds = new Set()) {
  let numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < AREA_ID_MIN || numericId > AREA_ID_MAX) {
    numericId = _hashToMatterAreaId(String(id));
  }

  while (usedAreaIds.has(numericId)) {
    numericId = numericId >= AREA_ID_MAX ? AREA_ID_MIN : numericId + 1;
  }

  usedAreaIds.add(numericId);
  return numericId;
}

function normalizeMatterRooms(discoveredRooms = [], configuredRooms = []) {
  const roomById = new Map();

  _normalizeRoomInput(discoveredRooms).forEach((room) => {
    roomById.set(room.id, room);
  });

  _normalizeRoomInput(configuredRooms).forEach((room) => {
    const existingRoom = roomById.get(room.id) || {};
    roomById.set(room.id, _mergeDefinedRoomFields(existingRoom, room));
  });

  const usedAreaIds = new Set();
  return Array.from(roomById.values())
    .filter(room => room.id != null && String(room.id).length > 0)
    .map((room) => {
      const id = String(room.id);
      return {
        areaId: stableAreaId(room.areaId || id, usedAreaIds),
        vendorId: id,
        mapId: room.mapId == null || room.mapId === '' ? null : String(room.mapId),
        name: room.name || `Room ${id}`,
        areaType: Number.isInteger(Number(room.areaType)) ? Number(room.areaType) : 0
      };
    });
}

function matterAreasFromRooms(rooms = []) {
  return rooms.map((room) => ({
    areaId: room.areaId,
    mapId: room.mapId,
    areaInfo: {
      locationInfo: {
        locationName: room.name,
        floorNumber: 0,
        areaType: room.areaType
      },
      landmarkInfo: null
    }
  }));
}

function parseRoomsFromUnknownPayload(payload) {
  const parsedPayload = _parseMaybeJson(payload);
  const rooms = [];

  _extractRooms(parsedPayload, rooms);

  return _dedupeRooms(rooms);
}

function _normalizeRoomInput(rooms) {
  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms
    .map(room => _normalizeRoom(room))
    .filter(room => room && room.id != null && String(room.id).length > 0);
}

function _normalizeRoom(room) {
  if (Array.isArray(room)) {
    const id = room.length > 1 && _looksLikeVendorRoomId(room[1]) ? room[1] : room[0];
    const name = typeof room[3] === 'string' ? room[3] : (typeof room[2] === 'string' ? room[2] : undefined);
    return {
      id: id == null ? null : String(id),
      name
    };
  }

  if (room && typeof room === 'object') {
    const id = room.id ?? room.roomId ?? room.room_id ?? room.segmentId ?? room.segment_id ?? room.rid;
    const name = room.name ?? room.roomName ?? room.room_name ?? room.label;
    return {
      id: id == null ? null : String(id),
      name: name == null ? undefined : String(name),
      mapId: room.mapId ?? room.map_id,
      areaId: room.areaId ?? room.area_id,
      areaType: room.areaType ?? room.area_type
    };
  }

  if (room != null) {
    return {
      id: String(room)
    };
  }

  return null;
}

function _extractRooms(value, rooms) {
  if (value == null) {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 0 && value.every(item => typeof item !== 'object' || item === null)) {
      const normalizedRoom = _normalizeRoom(value);
      if (normalizedRoom) {
        rooms.push(normalizedRoom);
      }
      return;
    }
    value.forEach(item => _extractRooms(item, rooms));
    return;
  }

  if (typeof value === 'object') {
    const normalizedRoom = _normalizeRoom(value);
    if (normalizedRoom && (value.name || value.roomName || value.room_name || value.id || value.roomId || value.room_id)) {
      rooms.push(normalizedRoom);
    }

    Object.keys(value).forEach((key) => {
      if (['result', 'out', 'data', 'list', 'rooms', 'roomList', 'room_list', 'roomData', 'room_data', 'areas', 'segments'].includes(key)) {
        _extractRooms(value[key], rooms);
      }
    });
  }
}

function _mergeDefinedRoomFields(existingRoom, overrideRoom) {
  const mergedRoom = { ...existingRoom };
  Object.keys(overrideRoom).forEach((key) => {
    if (overrideRoom[key] !== undefined) {
      mergedRoom[key] = overrideRoom[key];
    }
  });
  return mergedRoom;
}

function _dedupeRooms(rooms) {
  const roomMap = new Map();
  rooms.forEach((room) => {
    if (room && room.id != null) {
      roomMap.set(String(room.id), room);
    }
  });
  return Array.from(roomMap.values());
}

function _parseMaybeJson(payload) {
  if (typeof payload !== 'string') {
    return payload;
  }

  const trimmedPayload = payload.trim();
  if (!trimmedPayload.length) {
    return payload;
  }

  try {
    return JSON.parse(trimmedPayload);
  } catch (err) {
    // Some vendor metadata uses single quotes in example-like JSON strings.
    try {
      return JSON.parse(trimmedPayload.replace(/'/g, '"'));
    } catch (ignoredErr) {
      return payload;
    }
  }
}

function _hashToMatterAreaId(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % (AREA_ID_MAX - AREA_ID_MIN + 1)) + AREA_ID_MIN;
}

function _looksLikeVendorRoomId(value) {
  const strValue = String(value);
  return strValue.length > 4 || Number(strValue) > AREA_ID_MAX;
}

module.exports = {
  MATTER_RVC_RUN_MODES,
  MATTER_RVC_CLEAN_MODES,
  MATTER_RVC_OPERATIONAL_STATES,
  MATTER_RVC_RUN_MODE_TAGS,
  MATTER_RVC_CLEAN_MODE_TAGS,
  MATTER_BATTERY_CHARGE_LEVELS,
  containsOrEquals,
  clampBatteryPercent,
  batteryPercentToMatter,
  batteryChargeLevel,
  matterOperationalStateFromFlags,
  selectMatterCleanModeAction,
  stableAreaId,
  normalizeMatterRooms,
  matterAreasFromRooms,
  parseRoomsFromUnknownPayload
};

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  MATTER_RVC_CLEAN_MODES,
  MATTER_RVC_OPERATIONAL_STATES,
  MATTER_BATTERY_CHARGE_LEVELS,
  batteryPercentToMatter,
  batteryChargeLevel,
  matterOperationalStateFromFlags,
  selectMatterCleanModeAction,
  stableAreaId,
  normalizeMatterRooms,
  parseRoomsFromUnknownPayload
} = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

test('battery values are clamped and converted for Matter PowerSource', () => {
  assert.equal(batteryPercentToMatter(50), 100);
  assert.equal(batteryPercentToMatter(200), 200);
  assert.equal(batteryPercentToMatter(-5), 0);
  assert.equal(batteryChargeLevel(21), MATTER_BATTERY_CHARGE_LEVELS.OK);
  assert.equal(batteryChargeLevel(20), MATTER_BATTERY_CHARGE_LEVELS.WARNING);
  assert.equal(batteryChargeLevel(10), MATTER_BATTERY_CHARGE_LEVELS.CRITICAL);
});

test('robot status maps to Matter operational states', () => {
  assert.equal(matterOperationalStateFromFlags({ isWorking: true }), MATTER_RVC_OPERATIONAL_STATES.RUNNING);
  assert.equal(matterOperationalStateFromFlags({ isPaused: true }), MATTER_RVC_OPERATIONAL_STATES.PAUSED);
  assert.equal(matterOperationalStateFromFlags({ isGoCharging: true }), MATTER_RVC_OPERATIONAL_STATES.SEEKING_CHARGER);
  assert.equal(matterOperationalStateFromFlags({ isCharging: true }), MATTER_RVC_OPERATIONAL_STATES.CHARGING);
  assert.equal(matterOperationalStateFromFlags({ isDocked: true }), MATTER_RVC_OPERATIONAL_STATES.DOCKED);
  assert.equal(matterOperationalStateFromFlags({ isEmptyingDustBin: true }), MATTER_RVC_OPERATIONAL_STATES.EMPTYING_DUST_BIN);
  assert.equal(matterOperationalStateFromFlags({ isCleaningMop: true }), MATTER_RVC_OPERATIONAL_STATES.CLEANING_MOP);
  assert.equal(matterOperationalStateFromFlags({ isUpdatingMaps: true }), MATTER_RVC_OPERATIONAL_STATES.UPDATING_MAPS);
  assert.equal(matterOperationalStateFromFlags({ hasFault: true }), MATTER_RVC_OPERATIONAL_STATES.ERROR);
  assert.equal(matterOperationalStateFromFlags(), MATTER_RVC_OPERATIONAL_STATES.STOPPED);
});

test('Matter clean mode chooses dedicated robot actions', async () => {
  const actions = {
    startOnlySweep: 'start-only-sweep',
    startSweep: 'start-sweep',
    startMop: 'start-mop',
    startSweepMop: 'start-sweep-mop'
  };

  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.VACUUM, actions), 'start-only-sweep');
  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.MOP, actions), 'start-mop');
  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.VACUUM_MOP, actions), 'start-sweep-mop');
});

test('Matter clean mode rejects unsupported dedicated actions', async () => {
  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.MOP, {}), null);
  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.VACUUM_MOP, {}), null);
  assert.equal(selectMatterCleanModeAction(MATTER_RVC_CLEAN_MODES.VACUUM, {}), null);
});

test('room normalization preserves vendor IDs and applies configured overrides', () => {
  const rooms = normalizeMatterRooms([
    [1, '80001026443', 2],
    { id: 12, name: 'Office', mapId: 7 }
  ], [
    { id: '80001026443', name: 'Living Room', areaType: 3 },
    { id: 12, name: 'Studio', areaId: 44 }
  ]);

  assert.equal(rooms.length, 2);
  assert.deepEqual(rooms.map(room => room.vendorId), ['80001026443', '12']);
  assert.equal(rooms[0].name, 'Living Room');
  assert.equal(rooms[0].areaType, 3);
  assert.equal(rooms[0].areaId >= 1 && rooms[0].areaId <= 65534, true);
  assert.equal(rooms[1].name, 'Studio');
  assert.equal(rooms[1].mapId, '7');
  assert.equal(rooms[1].areaId, 44);
});

test('room IDs are stable and collisions are made unique', () => {
  const usedAreaIds = new Set();
  assert.equal(stableAreaId(42, usedAreaIds), 42);
  assert.equal(stableAreaId(42, usedAreaIds), 43);
  assert.equal(stableAreaId('80001026443', usedAreaIds) >= 1, true);
});

test('room discovery parser handles nested vendor payloads', () => {
  const rooms = parseRoomsFromUnknownPayload(JSON.stringify({
    result: [{
      rooms: [
        { id: '80001026443', name: 'Kitchen' },
        { room_id: 80001026444, room_name: 'Bedroom' }
      ]
    }]
  }));

  assert.deepEqual(rooms, [
    { id: '80001026443', name: 'Kitchen', mapId: undefined, areaId: undefined, areaType: undefined },
    { id: '80001026444', name: 'Bedroom', mapId: undefined, areaId: undefined, areaType: undefined }
  ]);
});

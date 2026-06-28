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
  matterMapsFromRooms,
  matterAreasFromRooms,
  parseRoomsFromUnknownPayload
} = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');
const MiotDevice = require('../lib/protocol/MiotDevice.js');
const IjaiVacuumV1 = require('../lib/modules/robotcleaner/devices/ijai.vacuum.v1.js');
const RobotCleanerMatterAccessory = require('../lib/modules/robotcleaner/RobotCleanerMatterAccessory.js');

const silentLogger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
  deepDebug() {}
};

function createIjaiVacuumV1() {
  const miotDevice = new MiotDevice(
    '127.0.0.1',
    '00000000000000000000000000000000',
    'test-did',
    'ijai.vacuum.v1',
    'Mi Robot Vacuum-Mop Pro',
    silentLogger
  );
  const robot = new IjaiVacuumV1(miotDevice, 'Mi Robot Vacuum-Mop Pro', silentLogger);
  robot.initDeviceServices();
  robot.initDeviceProperties();
  robot.initDeviceActions();
  return robot;
}

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

test('Matter ServiceArea maps use numeric map IDs when rooms have map IDs', () => {
  const rooms = normalizeMatterRooms([
    { id: 10, name: 'Kitchen', mapId: '1732835741' },
    { id: 11, name: 'Bedroom', mapId: '1732835741' }
  ]);

  assert.deepEqual(matterMapsFromRooms(rooms), [
    { mapId: 1732835741, name: 'Map 1732835741' }
  ]);
  assert.deepEqual(matterAreasFromRooms(rooms).map(area => area.mapId), [
    1732835741,
    1732835741
  ]);
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

test('ijai v1 reports active status before transient fault values for Matter', () => {
  const robot = createIjaiVacuumV1();

  robot.statusProp().updateInternalValue(5);
  robot.faultProp().updateInternalValue(2110);
  assert.equal(robot.getMatterOperationalState(), MATTER_RVC_OPERATIONAL_STATES.RUNNING);

  robot.statusProp().updateInternalValue(2);
  robot.faultProp().updateInternalValue(2108);
  assert.equal(robot.getMatterOperationalState(), MATTER_RVC_OPERATIONAL_STATES.PAUSED);

  robot.statusProp().updateInternalValue(4);
  robot.faultProp().updateInternalValue(2103);

  assert.equal(robot.getDeviceName(), 'Mi Robot Vacuum-Mop Pro');
  assert.equal(robot.getMatterOperationalState(), MATTER_RVC_OPERATIONAL_STATES.CHARGING);
});

test('ijai v1 pause uses stop sweeping action', async () => {
  const robot = createIjaiVacuumV1();
  const miotDevice = robot.getMiotDevice();
  const sentCommands = [];

  miotDevice.localConnected = true;
  miotDevice.pollProperties = () => {};
  miotDevice.miioProtocol.send = async (ip, methodName, params) => {
    sentCommands.push({ ip, methodName, params });
    return { code: 0 };
  };

  await robot.pauseMatterCleaning();

  assert.deepEqual(sentCommands, [{
    ip: '127.0.0.1',
    methodName: 'action',
    params: {
      did: 'test-did',
      siid: 2,
      aiid: 2,
      in: []
    }
  }]);
});

test('ijai v1 go home uses the model-specific go charging action', async () => {
  const robot = createIjaiVacuumV1();
  const miotDevice = robot.getMiotDevice();
  const sentCommands = [];

  miotDevice.localConnected = true;
  miotDevice.pollProperties = () => {};
  miotDevice.miioProtocol.send = async (ip, methodName, params) => {
    sentCommands.push({ ip, methodName, params });
    return { code: 0 };
  };

  await robot.sendMatterGoHome();

  assert.deepEqual(sentCommands, [{
    ip: '127.0.0.1',
    methodName: 'action',
    params: {
      did: 'test-did',
      siid: 7,
      aiid: 7,
      in: [{ piid: 43, value: 1 }]
    }
  }]);
});

test('Matter robot battery ignores the initial unsynced zero', () => {
  const robot = createIjaiVacuumV1();

  assert.equal(robot.hasKnownMatterBatteryLevel(), false);
  assert.deepEqual(robot.getMatterBatteryState(), {
    batPercentRemaining: 200,
    batChargeLevel: MATTER_BATTERY_CHARGE_LEVELS.OK
  });

  robot.batteryLevelProp().updateInternalValue(75);

  assert.equal(robot.hasKnownMatterBatteryLevel(), true);
  assert.deepEqual(robot.getMatterBatteryState(), {
    batPercentRemaining: 150,
    batChargeLevel: MATTER_BATTERY_CHARGE_LEVELS.OK
  });
});

test('Matter robot power source replaces cached zero battery', () => {
  const robot = createIjaiVacuumV1();
  const accessory = new RobotCleanerMatterAccessory(
    'Mi Robot Vacuum-Mop Pro',
    robot,
    'test-uuid',
    {},
    null,
    silentLogger
  );

  assert.equal(accessory._buildPowerSourceCluster({ batPercentRemaining: 0 }).batPercentRemaining, 200);

  robot.batteryLevelProp().updateInternalValue(75);

  const updatedCluster = accessory._buildPowerSourceCluster({
    batPercentRemaining: 0,
    batChargeLevel: MATTER_BATTERY_CHARGE_LEVELS.CRITICAL
  });
  assert.equal(updatedCluster.status, 0);
  assert.equal(updatedCluster.order, 0);
  assert.equal(updatedCluster.description, 'Battery');
  assert.equal(updatedCluster.batPercentRemaining, 150);
  assert.equal(updatedCluster.batChargeLevel, MATTER_BATTERY_CHARGE_LEVELS.OK);
  assert.equal(updatedCluster.batReplaceability, 1);
});

test('Matter robot startup replaces stale cached mode labels', async () => {
  const robot = createIjaiVacuumV1();
  const accessory = new RobotCleanerMatterAccessory(
    'Mi Robot Vacuum-Mop Pro',
    robot,
    'test-uuid',
    {},
    {
      matter: {
        deviceTypes: {
          RoboticVacuumCleaner: 'robotic-vacuum-cleaner'
        },
        clusterNames: {}
      }
    },
    silentLogger,
    {},
    {
      UUID: 'test-uuid',
      displayName: 'Mi Robot Vacuum-Mop Pro',
      clusters: {
        rvcRunMode: {
          supportedModes: [{ mode: 99 }],
          currentMode: 99
        },
        rvcCleanMode: {
          supportedModes: [{ mode: 99 }],
          currentMode: 99
        }
      }
    }
  );

  await accessory.init();

  const matterAccessory = accessory.getMatterAccessory();
  assert.equal(matterAccessory.clusters.rvcRunMode.supportedModes[0].label, 'Idle');
  assert.equal(matterAccessory.clusters.rvcRunMode.currentMode, robot.getMatterRunMode());
  assert.equal(matterAccessory.clusters.rvcCleanMode.supportedModes[0].label, 'Vacuum');
  assert.equal(matterAccessory.clusters.rvcCleanMode.currentMode, MATTER_RVC_CLEAN_MODES.VACUUM);
  assert.deepEqual(matterAccessory.clusters.serviceArea.supportedMaps, []);
  assert.deepEqual(matterAccessory.clusters.serviceArea.supportedAreas, []);
});

test('Matter robot startup publishes supported maps for mapped service areas', async () => {
  const robot = createIjaiVacuumV1();
  const accessory = new RobotCleanerMatterAccessory(
    'Mi Robot Vacuum-Mop Pro',
    robot,
    'test-uuid',
    {
      matterRooms: [
        { id: 10, name: 'Kitchen', mapId: '1732835741' },
        { id: 11, name: 'Bedroom', mapId: '1732835741' }
      ]
    },
    {
      matter: {
        deviceTypes: {
          RoboticVacuumCleaner: 'robotic-vacuum-cleaner'
        },
        clusterNames: {}
      }
    },
    silentLogger
  );

  await accessory.init();

  const serviceArea = accessory.getMatterAccessory().clusters.serviceArea;
  assert.deepEqual(serviceArea.supportedMaps, [
    { mapId: 1732835741, name: 'Map 1732835741' }
  ]);
  assert.deepEqual(serviceArea.supportedAreas.map(area => area.mapId), [
    1732835741,
    1732835741
  ]);
});

test('ijai v1 room discovery uses current map id for room list', async () => {
  const robot = createIjaiVacuumV1();
  const miotDevice = robot.getMiotDevice();

  miotDevice.localConnected = true;
  miotDevice.pollProperties = () => {};
  miotDevice.miioProtocol.send = async (ip, methodName, params) => {
    assert.equal(methodName, 'action');
    if (params.aiid === 1) {
      return {
        code: 0,
        out: [{ piid: 4, value: '[{"name":"Map 1","id":1696994385,"cur":false},{"name":"Map 2","id":1732835741,"cur":true}]' }]
      };
    }
    if (params.aiid === 13) {
      assert.deepEqual(params.in, [{ piid: 2, value: 1732835741 }]);
      return {
        code: 0,
        out: [{ piid: 17, value: '[{"name":"Kitchen","id":13},{"name":"Living Room","id":12}]' }]
      };
    }
    throw new Error(`Unexpected action ${params.aiid}`);
  };

  const rooms = await robot.discoverMatterRooms();

  assert.deepEqual(rooms, [
    { id: '13', name: 'Kitchen', mapId: '1732835741', areaId: undefined, areaType: undefined },
    { id: '12', name: 'Living Room', mapId: '1732835741', areaId: undefined, areaType: undefined }
  ]);
});

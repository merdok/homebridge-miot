const assert = require('node:assert/strict');
const test = require('node:test');
const RobotCleanerMatterAccessory = require('../lib/modules/robotcleaner/RobotCleanerMatterAccessory.js');
const { MATTER_RVC_RUN_MODES, MATTER_RVC_OPERATIONAL_STATES } = require('../lib/modules/robotcleaner/RobotCleanerMatterUtils.js');

function fixture(model = 'roidmi.vacuum.v60') {
  const calls = [];
  const device = {
    getModel: () => model,
    isLocallyConnected: () => true,
    fireActionStrict: async (...args) => { calls.push(['action', ...args]); },
    startRoomCleaning: async (...args) => { calls.push(['generic', ...args]); },
    startCleaning: async (...args) => { calls.push(['whole', ...args]); }
  };
  const config = { matterRooms: [
    { id: '10', name: 'Hall', mapId: 123456 },
    { id: '2', name: 'Kitchen', mapId: 123456 },
    { id: '3', name: 'Other floor', mapId: 654321 }
  ] };
  const accessory = new RobotCleanerMatterAccessory('Robot', device, 'test-robot', config, { matter: { clusterNames: {} } }, { info() {} });
  accessory.normalizedRooms = accessory._getNormalizedRooms();
  accessory.areaIdToRoom = accessory._createAreaIdRoomMap(accessory.normalizedRooms);
  accessory._updateClusterState = async (_cluster, state) => { calls.push(['state', state]); };
  return { accessory, device, calls };
}

async function selectRooms(accessory, ids) {
  await accessory.handleSelectAreas({ newAreas: ids.map(id => accessory.normalizedRooms.find(room => room.vendorId === id).areaId) });
}

test('Matter selection starts V60 room cleaning with the vendor action and map payload', async () => {
  const { accessory, calls } = fixture();
  await selectRooms(accessory, ['10']);
  calls.length = 0;
  await accessory.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING);
  assert.deepEqual(calls, [
    ['action', 'sweep:start-sweep', ['2', '{"mapId":123456,"segmentId":[10]}']],
    ['state', { operationalState: MATTER_RVC_OPERATIONAL_STATES.RUNNING }]
  ]);
});

test('multiple rooms from the same map are sent in one action', async () => {
  const { accessory, calls } = fixture();
  await selectRooms(accessory, ['10', '2']);
  calls.length = 0;
  await accessory.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING);
  assert.deepEqual(JSON.parse(calls[0][2][1]), { mapId: 123456, segmentId: [10, 2] });
});

test('rejects missing maps, mixed maps and invalid room IDs before sending commands', async () => {
  for (const rooms of [
    [{ vendorId: '10', mapId: null }],
    [{ vendorId: '10', mapId: '' }],
    [{ vendorId: '10', mapId: 'abc' }],
    [{ vendorId: '10', mapId: '9007199254740992' }],
    [{ vendorId: '10', mapId: '123456' }, { vendorId: '2', mapId: '654321' }],
    [{ vendorId: 'bad', mapId: '123456' }],
    [{ vendorId: '0', mapId: '123456' }]
  ]) {
    const { accessory, calls } = fixture();
    accessory.normalizedRooms = rooms;
    await assert.rejects(accessory._startRoidmiV60RoomCleaning(rooms.map(room => room.vendorId), { vacuum: true, mop: false }));
    assert.deepEqual(calls, []);
  }
});

test('does not silently substitute vacuum for a requested mopping mode', async () => {
  const { accessory, calls } = fixture();
  for (const vacuum of [true, false]) {
    await assert.rejects(accessory._startRoidmiV60RoomCleaning(['10'], { vacuum, mop: true }), /vacuum mode only/);
  }
  assert.deepEqual(calls, []);
});

test('other models retain generic room cleaning', async () => {
  const { accessory, calls } = fixture('other.vacuum.model');
  await selectRooms(accessory, ['10']);
  calls.length = 0;
  await accessory.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING);
  assert.deepEqual(calls[0], ['generic', ['10'], { vacuum: true, mop: false }]);
});

test('an empty selection retains whole-home cleaning', async () => {
  const { accessory, calls } = fixture();
  await accessory.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING);
  assert.deepEqual(calls[0], ['whole', { vacuum: true, mop: false }]);
});

test('a rejected vendor command does not report the robot as running or fall back to whole-home cleaning', async () => {
  const { accessory, device, calls } = fixture();
  await selectRooms(accessory, ['10']);
  calls.length = 0;
  const failure = new Error('MIOT rejected command');
  device.fireActionStrict = async () => { throw failure; };
  await assert.rejects(accessory.handleRunModeChange(MATTER_RVC_RUN_MODES.CLEANING), error => error === failure);
  assert.deepEqual(calls, []);
});

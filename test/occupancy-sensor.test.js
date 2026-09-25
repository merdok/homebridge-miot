const assert = require('node:assert/strict');
const test = require('node:test');

const OccupancySensorDevice = require('../lib/modules/occupancysensor/OccupancySensorDevice.js');

// OccupancySensorDevice.isOccupied maps the numeric occupancy-status enum to a boolean:
// 0 = No One, 1 = Has One, 2 = Quick Check. Any non-zero value means occupied.
// Borrow the prototype method onto a stub so we don't need a full device/miot stack.
const proto = OccupancySensorDevice.prototype;

function isOccupiedFor(statusValue) {
  return proto.isOccupied.call({ getOccupancyStatus: () => statusValue });
}

test('occupancy status 0 (No One) is not occupied', () => {
  assert.equal(isOccupiedFor(0), false);
});

test('occupancy status 1 (Has One) is occupied', () => {
  assert.equal(isOccupiedFor(1), true);
});

test('occupancy status 2 (Quick Check) is occupied', () => {
  assert.equal(isOccupiedFor(2), true);
});

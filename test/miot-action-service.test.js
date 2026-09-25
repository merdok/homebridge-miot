const assert = require('node:assert/strict');
const test = require('node:test');

const MiotAction = require('../lib/protocol/MiotAction.js');
const MiotService = require('../lib/protocol/MiotService.js');
const MiotProperty = require('../lib/protocol/MiotProperty.js');
const MiotEvent = require('../lib/protocol/MiotEvent.js');
const PropFormat = require('../lib/constants/PropFormat.js');
const PropAccess = require('../lib/constants/PropAccess.js');

/*----------========== MiotAction ==========----------*/

test('MiotAction throws on invalid siid/aiid', () => {
  assert.throws(() => new MiotAction('a', -1, 1, 't', 'd', []), /Invalid or missing/);
  assert.throws(() => new MiotAction('a', 2, 'x', 't', 'd', []), /Invalid or missing/);
});

test('MiotAction getType parses the urn action segment', () => {
  const a = new MiotAction('vacuum:start-sweep', 2, 1, 'urn:miot-spec-v2:action:start-sweep:00002804:x:1', 'Start Sweep', []);
  assert.equal(a.getType(), 'start-sweep');
  assert.equal(a.getId(), 1);
});

test('getProtocolAction requires a device id and maps inDef params to piids', () => {
  const a = new MiotAction('sweep:set', 7, 3, 't', 'd', [24, 25]);
  assert.throws(() => a.getProtocolAction(null), /Missing device id/);
  const proto = a.getProtocolAction('dev', [10, 20]);
  assert.deepEqual(proto, { did: 'dev', siid: 7, aiid: 3, in: [{ piid: 24, value: 10 }, { piid: 25, value: 20 }] });
});

test('getProtocolAction passes through explicit {piid,value} params', () => {
  const a = new MiotAction('sweep:set', 7, 3, 't', 'd', []);
  const proto = a.getProtocolAction('dev', [{ piid: 5, value: 1 }]);
  assert.deepEqual(proto.in, [{ piid: 5, value: 1 }]);
});

/*----------========== MiotService ==========----------*/

test('MiotService throws on invalid siid', () => {
  assert.throws(() => new MiotService(-1, 't', 'd'), /Invalid or missing/);
});

test('MiotService getType parses the urn service segment', () => {
  const s = new MiotService(2, 'urn:miot-spec-v2:service:fan:00007808:x:1', 'Fan');
  assert.equal(s.getType(), 'fan');
  assert.equal(s.getId(), 2);
});

test('addProperty/addAction/addEvent only accept the right type and dedupe by reference', () => {
  const s = new MiotService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  const prop = new MiotProperty('fan:on', 2, 1, 't', 'On', PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY);
  const action = new MiotAction('fan:toggle', 2, 1, 't', 'Toggle', []);
  const event = new MiotEvent('fan:evt', 2, 1, 't', 'Evt', []);

  s.addProperty(prop); s.addProperty(prop); // same ref twice
  s.addAction(action); s.addAction(action);
  s.addEvent(event); s.addEvent(event);

  assert.equal(s.getProperties().length, 1);
  assert.equal(s.getActions().length, 1);
  assert.equal(s.getEvents().length, 1);

  // wrong types are ignored
  s.addProperty(action);
  s.addAction(prop);
  assert.equal(s.getProperties().length, 1);
  assert.equal(s.getActions().length, 1);
});

test('lookup by id and type works', () => {
  const s = new MiotService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  const prop = new MiotProperty('fan:on', 2, 1, 'urn:x:property:on:1:x:1', 'On', PropFormat.BOOL, PropAccess.READ);
  s.addProperty(prop);
  assert.equal(s.getPropertyById(1), prop);
  assert.equal(s.getPropertyByType('on'), prop);
  assert.equal(s.getPropertyById(999), undefined);
});

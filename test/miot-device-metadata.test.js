const assert = require('node:assert/strict');
const test = require('node:test');

const MiotDevice = require('../lib/protocol/MiotDevice.js');

const noopLogger = {
  info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {}
};

// MiotDevice's metadata layer builds services/properties/actions/events in memory (no network at
// construction). These tests guard the add/create invariants: id validation, duplicate rejection,
// and the *ByString JSON-parse error handling that device definition files rely on.
function makeDevice() {
  return new MiotDevice('127.0.0.1', 'token', 'devid', 'test.model.v1', 'Test', noopLogger);
}

test('createService adds a service and rejects duplicate siid', () => {
  const d = makeDevice();
  assert.ok(d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan'));
  assert.equal(d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan'), undefined); // duplicate siid
  assert.equal(d.hasServiceWithId(2), true);
});

test('createService rejects an invalid siid', () => {
  const d = makeDevice();
  assert.equal(d.createService(-1, 't', 'd'), undefined);
});

test('addProperty rejects missing name, invalid ids, and duplicate names', () => {
  const d = makeDevice();
  d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  assert.ok(d.addProperty('fan:on', 2, 1, 't', 'On', 'bool', ['read']));
  assert.equal(d.addProperty(null, 2, 2, 't', 'x', 'bool', ['read']), undefined); // no name
  assert.equal(d.addProperty('fan:bad', 2, -1, 't', 'x', 'bool', ['read']), undefined); // bad piid
  assert.equal(d.addProperty('fan:on', 2, 9, 't', 'x', 'bool', ['read']), undefined); // dup name
  assert.equal(d.hasPropertyByName('fan:on'), true);
});

test('addAction duplicate-guard checks actions, not properties (regression for MiotDevice.js:1186)', () => {
  const d = makeDevice();
  d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  // a property and an action may legitimately share a name namespace segment; the action guard
  // must look at actions, not properties. Register a property first with the same name.
  d.addProperty('fan:toggle', 2, 5, 't', 'Toggle', 'bool', ['read', 'write']);
  // adding an ACTION with that same name must still succeed (previously blocked by the wrong guard)
  const a = d.addAction('fan:toggle', 2, 1, 't', 'Toggle', []);
  assert.ok(a, 'action should be created even when a property shares the name');
  assert.equal(d.hasActionByName('fan:toggle'), true);
  // and a genuine duplicate ACTION name is rejected
  assert.equal(d.addAction('fan:toggle', 2, 2, 't', 'Toggle', []), undefined);
});

test('addPropertyByString returns undefined on malformed JSON without throwing', () => {
  const d = makeDevice();
  d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  assert.doesNotThrow(() => {
    const r = d.addPropertyByString('fan:broken', '{ not valid json');
    assert.equal(r, undefined);
  });
});

test('addPropertyByString parses a valid spec string and wires it to its service', () => {
  const d = makeDevice();
  d.createService(2, 'urn:x:service:fan:1:x:1', 'Fan');
  const prop = d.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:x:property:on:1:x:1","description":"On","format":"bool","access":["read","write","notify"]}');
  assert.ok(prop);
  assert.equal(prop.getName(), 'fan:on');
  assert.equal(d.getServiceById(2).getPropertyById(1), prop);
});

test('createServiceByString returns undefined on malformed JSON without throwing', () => {
  const d = makeDevice();
  assert.doesNotThrow(() => {
    assert.equal(d.createServiceByString('nope'), undefined);
  });
});

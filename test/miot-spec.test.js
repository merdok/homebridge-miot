const assert = require('node:assert/strict');
const test = require('node:test');

const MiotSpec = require('../lib/protocol/MiotSpec.js');
const MiotDevice = require('../lib/protocol/MiotDevice.js');
const MiotProperty = require('../lib/protocol/MiotProperty.js');

const noopLogger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {} };

// MiotSpec is a standalone extraction of the spec surface currently living on
// MiotDevice. These tests prove it is behaviourally equivalent to MiotDevice on
// identical inputs (so it can later back MiotDevice via delegation without any
// change), plus cover each accessor/resolver branch directly.

function newSpec() {
  return new MiotSpec(noopLogger);
}

function newDevice() {
  const md = new MiotDevice('127.0.0.1', 'token', 'did', 'test.model.x', 'Device', noopLogger);
  md.isConnectedToCloud = () => false;
  return md;
}

// real definition strings taken from actual device files (flowerpot + cpa4)
const SERVICE_STRINGS = [
  '{"siid":2,"type":"urn:miot-spec-v2:service:flowerpot:00007888:ymt-test01:1","description":"Flowerpot"}',
  '{"siid":6,"type":"urn:miot-spec-v2:service:plant-monitor:0000784B:ymt-test01:1","description":"Plant Monitor"}'
];
const PROPERTY_STRINGS = [
  ['flowerpot:on', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:on:00000006:ymt-test01:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}'],
  ['flowerpot:mode', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:mode:00000008:ymt-test01:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Manual"}]}'],
  ['plant-monitor:temperature', '{"siid":6,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:ymt-test01:1","description":"Temperature","format":"int8","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}']
];
const ACTION_STRINGS = [
  ['flowerpot:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:ymt-test01:1","description":"Toggle","in":[],"out":[]}']
];

function populateViaStrings(target) {
  SERVICE_STRINGS.forEach(s => target.createServiceByString(s));
  PROPERTY_STRINGS.forEach(([n, s]) => target.addPropertyByString(n, s));
  ACTION_STRINGS.forEach(([n, s]) => target.addActionByString(n, s));
}

// a full fetched-shape raw spec (services array + keyed properties/actions)
const RAW_SPEC = {
  type: 'urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:1',
  description: 'Flowerpot',
  services: [
    { siid: 2, type: 'urn:miot-spec-v2:service:flowerpot:00007888:ymt-test01:1', description: 'Flowerpot' },
    { siid: 6, type: 'urn:miot-spec-v2:service:plant-monitor:0000784B:ymt-test01:1', description: 'Plant Monitor' }
  ],
  properties: {
    'flowerpot:on': { siid: 2, piid: 4, type: 'urn:miot-spec-v2:property:on:00000006:ymt-test01:1', description: 'Switch Status', format: 'bool', access: ['read', 'write', 'notify'] },
    'plant-monitor:temperature': { siid: 6, piid: 3, type: 'urn:miot-spec-v2:property:temperature:00000020:ymt-test01:1', description: 'Temperature', format: 'int8', access: ['read', 'notify'], unit: 'celsius', valueRange: [-30, 100, 1] }
  },
  actions: {
    'flowerpot:toggle': { siid: 2, aiid: 1, type: 'urn:miot-spec-v2:action:toggle:00002811:ymt-test01:1', description: 'Toggle', in: [] }
  },
  events: {}
};


/*----------========== EQUIVALENCE WITH MiotDevice ==========----------*/

test('building via the *ByString builders yields the same structure as MiotDevice', () => {
  const spec = newSpec();
  const dev = newDevice();
  populateViaStrings(spec);
  populateViaStrings(dev);

  assert.deepEqual(spec.getAllServiceTypes(), dev.getAllServiceTypes(), 'service types match');
  assert.deepEqual(spec.getAllPropertyNames().sort(), dev.getAllPropertyNames().sort(), 'property names match');
  assert.deepEqual(spec.getAllActionNames().sort(), dev.getAllActionNames().sort(), 'action names match');

  for (const name of dev.getAllPropertyNames()) {
    const sp = spec.getPropertyByName(name);
    const dp = dev.getPropertyByName(name);
    assert.equal(sp.getId(), dp.getId(), `${name} id matches`);
    assert.equal(sp.getType(), dp.getType(), `${name} type matches`);
  }
});

test('parsing a raw fetched spec yields the same structure as MiotDevice.setMiotSpec', () => {
  const spec = newSpec();
  const dev = newDevice();
  spec.setRaw(RAW_SPEC);
  dev.setMiotSpec(RAW_SPEC);

  assert.deepEqual(spec.getAllServiceTypes(), dev.getAllServiceTypes());
  assert.deepEqual(spec.getAllPropertyNames().sort(), dev.getAllPropertyNames().sort());
  assert.deepEqual(spec.getAllActionNames().sort(), dev.getAllActionNames().sort());
  assert.equal(spec.getType(), dev.getType(), 'derived type matches');
  assert.equal(spec.getDescription(), dev.getDescription(), 'description matches');
  // resolve a property by siid.piid on both
  assert.equal(spec.getPropertyById('2.4').getName(), dev.getPropertyById('2.4').getName());
});


/*----------========== METADATA ==========----------*/

test('getType / getDescription / getVersion derive from the raw spec', () => {
  const spec = newSpec();
  spec.setRaw(RAW_SPEC);
  assert.equal(spec.getType(), 'flowerpot');
  assert.equal(spec.getDescription(), 'Flowerpot');
  assert.equal(spec.getVersion(), 1);
});

test('getVersion parses the trailing-hex urn shape', () => {
  const spec = newSpec();
  spec.setRaw({ type: 'urn:miot-spec-v2:device:fan:0000A005:xiaomi-p45:1:0000D062', description: 'Fan', services: [] });
  assert.equal(spec.getVersion(), 1, 'hex template segment is not read as the version');
});

test('metadata is safe when no raw spec is set', () => {
  const spec = newSpec();
  assert.equal(spec.getRawType(), '');
  assert.equal(spec.getType(), null);
  assert.equal(spec.getDescription(), '');
  assert.equal(spec.getVersion(), undefined);
});


/*----------========== RESOLVERS ==========----------*/

test('getProperty resolves by name, by siid.piid, by object, and misses to null', () => {
  const spec = newSpec();
  populateViaStrings(spec);
  const byName = spec.getProperty('flowerpot:on');
  assert.ok(byName, 'resolves by name');
  assert.equal(spec.getProperty('2.4').getName(), 'flowerpot:on', 'resolves by siid.piid');
  assert.equal(spec.getProperty(byName), byName, 'passes through a property object');
  assert.equal(spec.getProperty('does:not-exist'), null, 'unknown name is null');
  assert.equal(spec.getProperty('9.9'), null, 'unknown id is null');
});

test('getAction resolves by name and siid.aiid', () => {
  const spec = newSpec();
  populateViaStrings(spec);
  assert.ok(spec.getAction('flowerpot:toggle'));
  assert.equal(spec.getAction('2.1').getName(), 'flowerpot:toggle');
  assert.equal(spec.getAction('nope'), null);
});

test('property values live on the MiotProperty and round-trip', () => {
  const spec = newSpec();
  populateViaStrings(spec);
  const prop = spec.getProperty('flowerpot:mode');
  assert.ok(prop instanceof MiotProperty);
  prop.updateInternalValue(1);
  assert.equal(prop.getValue(), 1, 'value is stored on the property object');
  assert.equal(spec.getProperty('flowerpot:mode').getValue(), 1, 'same object is returned on lookup');
});


/*----------========== VALIDATION / DEDUP ==========----------*/

test('duplicate service / property names are not re-added', () => {
  const spec = newSpec();
  spec.createServiceByString(SERVICE_STRINGS[0]);
  spec.createServiceByString(SERVICE_STRINGS[0]); // same siid again
  assert.equal(spec.getAllServices().length, 1, 'duplicate siid service is skipped');

  spec.addPropertyByString(PROPERTY_STRINGS[0][0], PROPERTY_STRINGS[0][1]);
  spec.addPropertyByString(PROPERTY_STRINGS[0][0], PROPERTY_STRINGS[0][1]); // same name again
  assert.equal(spec.getAllPropertyNames().length, 1, 'duplicate property name is skipped');
});

test('invalid siid/piid properties are rejected', () => {
  const spec = newSpec();
  spec.createServiceByString(SERVICE_STRINGS[0]);
  const bad = spec.addPropertyByString('bad:prop', '{"piid":1,"type":"x","format":"bool","access":["read"]}'); // no siid
  assert.equal(bad, undefined, 'missing siid is rejected');
  assert.equal(spec.getAllPropertyNames().length, 0);
});

test('malformed json strings are swallowed and add nothing', () => {
  const spec = newSpec();
  assert.equal(spec.createServiceByString('{ not json'), undefined);
  assert.equal(spec.addPropertyByString('x', '{ not json'), undefined);
  assert.equal(spec.getAllServices().length, 0);
  assert.equal(spec.getAllPropertyNames().length, 0);
});

test('re-parsing a new raw spec resets the previous parsed structure', () => {
  const spec = newSpec();
  spec.setRaw(RAW_SPEC);
  const firstCount = spec.getAllPropertyNames().length;
  assert.ok(firstCount > 0);
  // set a different, smaller spec - old entries must not linger
  spec.setRaw({ type: 'urn:miot-spec-v2:device:switch:0000A003:x-y:1', description: 'Switch', services: [{ siid: 2, type: 'urn:miot-spec-v2:service:switch:x:1', description: 'Switch' }], properties: {}, actions: {}, events: {} });
  assert.equal(spec.getAllPropertyNames().length, 0, 'previous properties were cleared');
  assert.equal(spec.getType(), 'switch');
});

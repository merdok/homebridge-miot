const test = require('node:test');
const assert = require('node:assert/strict');
const hap = require('hap-nodejs');
const MiotDevice = require('../lib/protocol/MiotDevice');
const Device = require('../lib/modules/airpurifier/devices/xiaomi.airp.cpa4');
const AccessoryFactory = require('../lib/factories/AccessoryFactory');
const DeviceFactory = require('../lib/factories/DeviceFactory');
const C = hap.Characteristic;
const logger = { info() {}, warn() {}, error() {}, debug() {}, deepDebug() {} };
const uuid = hap.uuid.generate('compact-test-stable-identity');
const sample = {
  'air-purifier:on': true, 'air-purifier:mode': 0, 'air-purifier:fault': 0,
  'custom-service:favorite-level': 14, 'custom-service:motor-speed-rpm': 400,
  'environment:pm2.5-density': 5, 'filter:filter-life-level': 58,
  'filter:filter-used-time': 2998, 'filter:filter-left-time': 166,
  'alarm:alarm': false, 'physical-controls-locked:physical-controls-locked': true,
  'screen:brightness': 0
};

async function fixture(config = {}) {
  const miot = new MiotDevice('192.0.2.1', '00'.repeat(16), '123', 'xiaomi.airp.cpa4', 'Purifier', logger);
  miot.localConnected = true;
  miot.miioProtocol.getDevice(miot.ip).deviceInfo = { model: 'xiaomi.airp.cpa4' };
  const device = new Device(miot, 'Purifier', logger);
  await device.initDevice();
  const value = (name, v) => device.getProperty(name).updateInternalValue(v);
  for (const [name, v] of Object.entries(sample)) value(name, v);
  const writes = [];
  miot.setProperty = async (property, v) => {
    writes.push([property.getName(), v]);
    property.updateInternalValue(v);
    return [{ code: 0 }];
  };
  const accessory = AccessoryFactory.createAccessory('Purifier', device, uuid, config,
    { hap, platformAccessory: hap.Accessory }, logger);
  return { miot, device, accessory, writes, value };
}

test('exact model class loads its full specification without a cloud fetch', async () => {
  const { miot, device } = await fixture();
  miot.fetchMiotSpec = async () => assert.fail('dedicated definition must not fetch metadata');
  assert.equal(await DeviceFactory.getDeviceClass(miot, '/nonexistent', logger), Device);
  assert.equal(device.supportsFavoriteSpeedControl(), true);
  assert.equal(device.supportsSpeedNowReporting(), true);
  assert.equal(device.supportsFilterLifeResetAction(), true);
  assert.deepEqual(device.resetFilterLifeAction().getProtocolAction('123', [], true).in, []);
  assert.equal(miot.getAllPropRequestChunkSize(), 3);
  assert.equal(device.filterLeftTimeProp().getUnit(), 'days');
});

test('native purifier publishes speed, lock, linked sensors and only three useful switches', async () => {
  const { accessory } = await fixture();
  const primary = accessory.airPurifierService;
  assert.equal(accessory.getAccessory().UUID, uuid);
  assert.equal(primary.subtype, 'airPurifierService');
  assert.equal(primary.isPrimaryService, true);
  assert.ok(primary.testCharacteristic(C.RotationSpeed));
  assert.ok(primary.testCharacteristic(C.LockPhysicalControls));
  assert.deepEqual(primary.linkedServices, [accessory.airQualityService, accessory.filterMaintenanceService]);
  assert.ok(accessory.filterMaintenanceService.testCharacteristic(C.ResetFilterIndication));
  assert.deepEqual(accessory.getAccessory().services.filter(s => s.UUID === hap.Service.Switch.UUID).map(s => s.displayName),
    ['Sleep', 'Display', 'Buzzer']);
  assert.equal(accessory.sleepService.subtype, 'airPurifierModeService1');
  assert.equal(accessory.buzzerService.subtype, 'alarmAlarmService');
});

test('optional controls and child lock can still be hidden', async () => {
  const { accessory } = await fixture({ modeControl: false, screenControl: false, buzzerControl: false, childLockControl: false });
  assert.equal(accessory.getAccessory().services.filter(s => s.UUID === hap.Service.Switch.UUID).length, 0);
  assert.equal(accessory.airPurifierService.testCharacteristic(C.LockPhysicalControls), false);
  accessory.updateAccessoryStatus();
});

test('all 15 manual levels round-trip through positive native percentages', async () => {
  const { accessory, device, value } = await fixture();
  value('air-purifier:mode', 2);
  for (let level = 0; level <= 14; level++) {
    value('custom-service:favorite-level', level);
    const percent = accessory.getRotationSpeed();
    assert.ok(percent > 0 && percent <= 100);
    await accessory.airPurifierService.getCharacteristic(C.RotationSpeed).handleSetRequest(percent);
    assert.equal(device.getFavoriteLevel(), level);
  }
});

test('onlyMainService keeps native controls without adding auxiliary services on update', async () => {
  const { accessory } = await fixture({ onlyMainService: true });
  accessory.updateAccessoryStatus();
  assert.deepEqual(accessory.getAccessory().services.map(service => service.UUID),
    [hap.Service.AccessoryInformation.UUID, hap.Service.AirPurifier.UUID]);
  await accessory.airPurifierService.getCharacteristic(C.RotationSpeed).handleSetRequest(20);
  assert.equal(accessory.getRotationSpeed(), 20);
});

test('speed writes are ordered and choose the requested level before switching to manual', async () => {
  const { accessory, writes, value, device } = await fixture();
  value('air-purifier:on', false);
  await accessory.airPurifierService.getCharacteristic(C.RotationSpeed).handleSetRequest(20);
  assert.deepEqual(writes, [['custom-service:favorite-level', 2], ['air-purifier:mode', 2], ['air-purifier:on', true]]);
  assert.equal(device.getFavoriteLevel(), 2);
  assert.equal(accessory.getRotationSpeed(), 20);
});

test('zero speed turns off without destroying the stored favorite level', async () => {
  const { accessory, device, writes } = await fixture();
  await accessory.setRotationSpeed(0);
  assert.deepEqual(writes, [['air-purifier:on', false]]);
  assert.equal(device.getFavoriteLevel(), 14);
  assert.equal(accessory.getRotationSpeed(), 0);
});

test('Auto and Sleep report live RPM instead of a misleading zero or saved favorite level', async () => {
  const { accessory, value } = await fixture();
  assert.equal(accessory.getRotationSpeed(), 16);
  value('air-purifier:mode', 1);
  value('custom-service:motor-speed-rpm', 500);
  assert.equal(accessory.getRotationSpeed(), 20);
  value('custom-service:motor-speed-rpm', 0);
  assert.equal(accessory.getCurrentAirPurifierState(), C.CurrentAirPurifierState.IDLE);
});

test('Sleep switch enables sleep and returns to Auto; turning it off in Manual does not change mode', async () => {
  const { accessory, device } = await fixture();
  await accessory.sleepService.getCharacteristic(C.On).handleSetRequest(true);
  assert.equal(device.getMode(), 1);
  assert.equal(accessory.getSleep(), true);
  await accessory.sleepService.getCharacteristic(C.On).handleSetRequest(false);
  assert.equal(device.getMode(), 0);
  await accessory.setTargetAirPurifierState(C.TargetAirPurifierState.MANUAL);
  await accessory.setSleep(false);
  assert.equal(device.getMode(), 2);
});

test('Display restores the selected nonzero brightness and does not power on the purifier', async () => {
  const { accessory, device, value } = await fixture();
  value('screen:brightness', 2);
  value('air-purifier:on', false);
  await accessory.setDisplay(false);
  assert.equal(device.getPropertyValue(device.screenBrightnessProp()), 0);
  await accessory.setDisplay(true);
  assert.equal(device.getPropertyValue(device.screenBrightnessProp()), 2);
  assert.equal(device.isOn(), false);
});

test('Buzzer and native child lock use their actual device properties', async () => {
  const { accessory, device } = await fixture();
  await accessory.buzzerService.getCharacteristic(C.On).handleSetRequest(true);
  assert.equal(device.getPropertyValue(device.alarmProp()), true);
  await accessory.airPurifierService.getCharacteristic(C.LockPhysicalControls).handleSetRequest(C.LockPhysicalControls.CONTROL_LOCK_DISABLED);
  assert.equal(device.isChildLockActive(), false);
});

test('offline state and initial data gaps report No Response instead of Off or zero', async () => {
  const { accessory, miot, device } = await fixture();
  miot.localConnected = false;
  assert.throws(() => accessory.getAirPurifierActiveState(), /-70402/);
  accessory.updateAccessoryStatus();
  assert.equal(accessory.airPurifierService.getCharacteristic(C.Active).statusCode, hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);
  await assert.rejects(accessory.setSleep(true));
  miot.localConnected = true;
  device.onProp().isValueInitial = true;
  assert.throws(() => accessory.getRotationSpeed(), /-70402/);
  device.onProp().isValueInitial = false;
  accessory.updateAccessoryStatus();
  assert.equal(accessory.airPurifierService.getCharacteristic(C.Active).statusCode, hap.HAPStatus.SUCCESS);
});

test('sensor faults invalidate air quality while motor faults report idle', async () => {
  const { accessory, value } = await fixture();
  value('air-purifier:fault', 3);
  accessory.updateAccessoryStatus();
  assert.equal(accessory.airQualityService.getCharacteristic(C.StatusFault).value, C.StatusFault.GENERAL_FAULT);
  assert.equal(accessory.getAirQuality(), C.AirQuality.UNKNOWN);
  assert.throws(() => accessory.getPM25Density(), /-70402/);
  value('air-purifier:fault', 2);
  assert.equal(accessory.getCurrentAirPurifierState(), C.CurrentAirPurifierState.IDLE);
  assert.equal(accessory.getRotationSpeed(), 0);
  value('air-purifier:fault', 0);
  accessory.updateAccessoryStatus();
  assert.equal(accessory.airQualityService.getCharacteristic(C.PM2_5Density).statusCode, hap.HAPStatus.SUCCESS);
});

test('filter reset is wired to the native maintenance characteristic with no reset during reads', async () => {
  const { accessory, miot } = await fixture();
  const calls = [];
  miot.executeAction = async (action, params) => { calls.push([action.getName(), params]); return { code: 0 }; };
  miot.requestAllProperties = async () => {};
  accessory.updateAccessoryStatus();
  assert.deepEqual(calls, []);
  await accessory.filterMaintenanceService.getCharacteristic(C.ResetFilterIndication).handleSetRequest(1);
  assert.deepEqual(calls, [['filter:reset-filter-life', []]]);
});

test('failed writes reach HomeKit and do not poison subsequent queued controls', async () => {
  const { accessory, miot, writes } = await fixture();
  const original = miot.setProperty;
  miot.setProperty = async () => undefined;
  await assert.rejects(accessory.setRotationSpeed(20));
  assert.deepEqual(writes, []);
  miot.setProperty = original;
  await accessory.setSleep(true);
  assert.equal(accessory.getSleep(), true);
});

test('overlapping commands remain serialized and the final mode is deterministic', async () => {
  const { accessory, device } = await fixture();
  await Promise.all([accessory.setRotationSpeed(20), accessory.setSleep(true)]);
  assert.equal(device.getMode(), 1);
  assert.equal(device.getFavoriteLevel(), 2);
});

test('explicit mode requests are sent even when the cache already says Auto', async () => {
  const { accessory, writes, value } = await fixture();
  // The firmware may have switched to Favorite after a favorite-level write,
  // while a concurrent poll has left the cached mode at Auto.
  value('air-purifier:mode', 0);
  await accessory.setTargetAirPurifierState(C.TargetAirPurifierState.AUTO);
  assert.deepEqual(writes, [['air-purifier:mode', 0]]);
});

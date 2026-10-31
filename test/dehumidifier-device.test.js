const assert = require('node:assert/strict');
const test = require('node:test');

const DehumidifierDevice = require('../lib/modules/dehumidifier/DehumidifierDevice.js');
const DehumidifierAccessory = require('../lib/modules/dehumidifier/DehumidifierAccessory.js');
const MiotDevice = require('../lib/protocol/MiotDevice.js');

const noopLogger = {
  info() {}, warn() {}, error() {}, debug() {}, deepDebug() {}, table() {}
};

function addProperty(device, name, spec) {
  device.addPropertyByString(name, JSON.stringify(spec));
  return device.getProperty(name);
}

function createDehumidifier({ compressorStatus = false } = {}) {
  const miotDevice = new MiotDevice('192.168.0.10', 'token', 'device-id', 'test.derh.v1', 'Test dehumidifier', noopLogger);
  const on = addProperty(miotDevice, 'dehumidifier:on', {
    siid: 2, piid: 1, type: 'urn:miot-spec-v2:property:on:00000006:test:1', description: 'On', format: 'bool', access: ['read']
  });
  const targetHumidity = addProperty(miotDevice, 'dehumidifier:target-humidity', {
    siid: 2, piid: 5, type: 'urn:miot-spec-v2:property:target-humidity:00000022:test:1', description: 'Target humidity', format: 'uint8', access: ['read'], valueRange: [40, 70, 1]
  });
  const relativeHumidity = addProperty(miotDevice, 'environment:relative-humidity', {
    siid: 3, piid: 1, type: 'urn:miot-spec-v2:property:relative-humidity:0000000C:test:1', description: 'Relative humidity', format: 'uint8', access: ['read'], valueRange: [0, 100, 1]
  });
  let compressor = null;
  if (compressorStatus) {
    compressor = addProperty(miotDevice, 'vendor-state:running-now', {
      siid: 7, piid: 1, type: 'urn:vendor-spec:property:compressor-status:00000001:test:1', description: 'Compressor status', format: 'bool', access: ['read']
    });
  }

  return {
    device: new DehumidifierDevice(miotDevice, 'Test dehumidifier', noopLogger),
    on,
    targetHumidity,
    relativeHumidity,
    compressor
  };
}

function createAccessoryWithState({ on, compressorState }) {
  const characteristic = {
    onGet() { return this; }, onSet() { return this; }, setProps() { return this; }, updateValue() { return this; }
  };
  class HumidifierDehumidifier {
    getCharacteristic() { return Object.create(characteristic); }
    addCharacteristic() { return Object.create(characteristic); }
  }
  class PlatformAccessory {
    addService() {}
    removeService() {}
    getService() { return null; }
  }
  const api = {
    hap: {
      Service: { HumidifierDehumidifier },
      Characteristic: {
        Active: { ACTIVE: 1, INACTIVE: 0 },
        CurrentHumidifierDehumidifierState: { INACTIVE: 0, IDLE: 1, DEHUMIDIFYING: 2 },
        TargetHumidifierDehumidifierState: { DEHUMIDIFIER: 2 },
        CurrentRelativeHumidity: 'CurrentRelativeHumidity',
        RelativeHumidityDehumidifierThreshold: 'RelativeHumidityDehumidifierThreshold'
      },
      Categories: { AIR_DEHUMIDIFIER: 1 },
      HapStatusError: Error,
      HAPStatus: { SERVICE_COMMUNICATION_FAILURE: -70402 }
    },
    platformAccessory: PlatformAccessory
  };
  const device = {
    getType: () => 'Dehumidifier',
    supportsChildLock: () => false,
    targetHumidityMinVal: () => 40,
    targetHumidityMaxVal: () => 70,
    targetHumidityStepVal: () => 1,
    isOn: () => on,
    isConnected: () => true,
    getReportedDehumidifyingState: () => compressorState
  };
  const accessory = new DehumidifierAccessory('Test dehumidifier', device, 'test-uuid', { name: 'Test dehumidifier', onlyMainService: true }, api, noopLogger);
  accessory.hasSyncedDehumidifierState = () => true;
  return accessory;
}

test('does not treat MIOT initial values as a synchronised dehumidifier state', () => {
  const { device } = createDehumidifier();

  assert.equal(device.hasSyncedDehumidifierState(), false);
  assert.equal(device.getTargetHumiditySafe(), 40);
});

test('keeps a synchronised target humidity unchanged', () => {
  const { device, on, targetHumidity, relativeHumidity } = createDehumidifier();
  on.updateInternalValue(true);
  targetHumidity.updateInternalValue(55);
  relativeHumidity.updateInternalValue(47);

  assert.equal(device.hasSyncedDehumidifierState(), true);
  assert.equal(device.getTargetHumiditySafe(), 55);
});

test('discovers and monitors a compressor-status property without a model profile', () => {
  const { device, on, targetHumidity, relativeHumidity, compressor } = createDehumidifier({ compressorStatus: true });
  on.updateInternalValue(true);
  targetHumidity.updateInternalValue(55);
  relativeHumidity.updateInternalValue(47);

  assert.ok(device.propertiesToMonitor().includes('vendor-state:running-now'));
  assert.equal(device.getReportedDehumidifyingState(), null, 'an unsynchronised compressor value is not evidence of activity');

  compressor.updateInternalValue(true);
  assert.equal(device.getReportedDehumidifyingState(), true);

  compressor.updateInternalValue(false);
  assert.equal(device.getReportedDehumidifyingState(), false);
});

test('does not infer active dehumidification from power alone', () => {
  const { device, on, targetHumidity, relativeHumidity } = createDehumidifier();
  on.updateInternalValue(true);
  targetHumidity.updateInternalValue(55);
  relativeHumidity.updateInternalValue(47);

  assert.equal(device.getReportedDehumidifyingState(), null);
});

test('reports idle instead of a communication failure when compressor state is unavailable', () => {
  const accessory = createAccessoryWithState({ on: true, compressorState: null });

  assert.equal(accessory.getCurrentHumidifierDehumidifierState(), 1);
});

test('does not overwrite HomeKit characteristics while the state is unsynchronised', () => {
  let characteristicReads = 0;
  const accessory = {
    hasSyncedDehumidifierState: () => false,
    dehumidifierService: {
      getCharacteristic() {
        characteristicReads++;
      }
    }
  };

  DehumidifierAccessory.prototype.updateAccessoryStatus.call(accessory);

  assert.equal(characteristicReads, 0);
});

const AirPurifierDevice = require('../AirPurifierDevice.js');
const CompactAirPurifierAccessory = require('../CompactAirPurifierAccessory.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


// This is the xiaomi-cpa4:2 variant. The older zhimi definition has different
// property names and filter-reset arguments, so it must not be used as an alias.
class XiaomiAirpCpa4 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Smart Air Purifier 4 Compact';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:xiaomi-cpa4:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  allPropRequestChunkSize() {
    return 3; // device cannot handle more then 3
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:xiaomi-cpa4:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:xiaomi-cpa4:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:xiaomi-cpa4:1","description":"Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-cpa4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-cpa4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":13,"type":"urn:miot-spec-v2:service:screen:00007806:xiaomi-cpa4:1","description":"Screen"}');
    this.createServiceByString('{"siid":9,"type":"urn:xiaomi-spec:service:custom-service:00007801:xiaomi-cpa4:1","description":"custom-service"}');
    this.createServiceByString('{"siid":11,"type":"urn:xiaomi-spec:service:aqi:00007803:xiaomi-cpa4:1","description":"aqi"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-cpa4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-cpa4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":2,"description":"Motor Stuck"},{"value":3,"description":"Sensor Lost"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-cpa4:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:xiaomi-cpa4:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,600,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:xiaomi-cpa4:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:xiaomi-cpa4:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,65535,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:xiaomi-cpa4:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"days","valueRange":[0,1000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:xiaomi-cpa4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:xiaomi-cpa4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":13,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:xiaomi-cpa4:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Bright"},{"value":2,"description":"Brightness"}]}');
    this.addPropertyByString('custom-service:motor-speed-rpm', '{"siid":9,"piid":1,"type":"urn:xiaomi-spec:property:motor-speed-rpm:00000001:xiaomi-cpa4:1","description":"","format":"uint16","access":["read","notify"],"valueRange":[0,2500,1]}');
    this.addPropertyByString('custom-service:country-code', '{"siid":9,"piid":10,"type":"urn:xiaomi-spec:property:country-code:0000000a:xiaomi-cpa4:1","description":"country-code","format":"uint16","access":["read","notify","write"],"valueList":[{"value":17230,"description":"CN"},{"value":17749,"description":"EU"},{"value":21576,"description":"TH"},{"value":19024,"description":"JP"},{"value":21843,"description":"US"},{"value":19282,"description":"KR"},{"value":21591,"description":"TW"},{"value":18766,"description":"IN"}]}');
    this.addPropertyByString('custom-service:favorite-level', '{"siid":9,"piid":11,"type":"urn:xiaomi-spec:property:favorite-level:00000002:xiaomi-cpa4:1","description":"","format":"uint8","access":["read","notify","write"],"valueRange":[0,14,1]}');
    this.addPropertyByString('custom-service:filter-used-time-dbg', '{"siid":9,"piid":12,"type":"urn:xiaomi-spec:property:filter-used-time-dbg:00000003:xiaomi-cpa4:1","description":"","format":"uint16","access":["write"],"unit":"hours","valueRange":[0,7000,1]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":11,"piid":4,"type":"urn:xiaomi-spec:property:aqi-updata-heartbeat:00000004:xiaomi-cpa4:1","description":"","format":"uint16","access":["read","notify","write"],"valueRange":[0,65535,1]}');
  }

  initDeviceActions() {
    this.addActionByString('air-purifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:xiaomi-cpa4:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:xiaomi-cpa4:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('custom-service:toggle-mode', '{"siid":9,"aiid":1,"type":"urn:xiaomi-spec:action:toggle-mode:00002801:xiaomi-cpa4:1","description":"toggle-mode","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:fault-motor-stuck', '{"siid":9,"eiid":1,"type":"urn:xiaomi-spec:event:fault-motor-stuck:00005001:xiaomi-cpa4:1","description":"fault-motor-stuck","arguments":[]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":9,"eiid":2,"type":"urn:xiaomi-spec:event:childlock-trigger:00005002:xiaomi-cpa4:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-service:filter-exhausted', '{"siid":9,"eiid":3,"type":"urn:xiaomi-spec:event:filter-exhausted:00005003:xiaomi-cpa4:1","description":"filter-exhausted","arguments":[]}');
  }


  /*----------========== ACCESSORY ==========----------*/

  // Use the dedicated compact-purifier accessory (native manual speed, trimmed switches)
  // instead of the default AirPurifierAccessory, without touching the shared AccessoryFactory.
  initDeviceAccessory(uuid, config, api, cachedDeviceInfo) {
    this.logger.info('Initializing accessory!');
    this.accessoryWrapper = new CompactAirPurifierAccessory(this.getName(), this, uuid, config, api, this.logger);
    if (this.accessoryWrapper) {
      this.updateAccessoryInformationService(cachedDeviceInfo);
      this.logger.info('Accessory successfully initialized!');
    } else {
      this.logger.error('Something went wrong. Could not initialize accessory!');
    }
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  favoriteLevelProp() { return this.getProperty('custom-service:favorite-level'); }
  speedNowProp() { return this.getProperty('custom-service:motor-speed-rpm'); }
  resetFilterLifeAction() { return this.getAction('filter:reset-filter-life'); }

  devicePropertiesToMonitor() {
    return ['air-purifier:on', 'air-purifier:mode', 'air-purifier:fault',
      'custom-service:favorite-level', 'custom-service:motor-speed-rpm',
      'environment:pm2.5-density', 'filter:filter-life-level', 'filter:filter-used-time',
      'filter:filter-left-time', 'alarm:alarm',
      'physical-controls-locked:physical-controls-locked', 'screen:brightness'];
  }


  /*----------========== OVERRIDES ==========----------*/

  isStateReady() {
    return this.isConnected() && this.devicePropertiesToMonitor().every(name =>
      this.getProperty(name) && !this.getProperty(name).isValueInitial);
  }

  async setPropertyValue(propObj, value) {
    const property = this.getProperty(propObj);
    if (!property || !this.isConnected()) throw new Error('Purifier is not ready for this command');
    const adjusted = property.adjustValueToPropRange(value);
    // Commands must reach the device even if a poll cache has the same value.
    // Writing favorite-level also changes the firmware's mode, and a concurrent
    // poll can temporarily leave the cached mode stale.
    // Upstream setProperty logs and swallows errors. Surface them to HomeKit.
    const result = await this.getMiotDevice().setProperty(property, adjusted);
    if (!Array.isArray(result) || result.length !== 1 || result[0].code !== 0) {
      throw new Error(`Purifier did not accept ${property.getName()}`);
    }
    return result;
  }

  async resetFilterLife() {
    const result = await this.getMiotDevice().executeAction(this.resetFilterLifeAction(), []);
    if (!result || result.code !== 0) throw new Error('Purifier did not accept filter reset');
    await this.getMiotDevice().requestAllProperties();
    this.updateAccessoryStatus();
  }

  initialPropertyFetchDone() {
    this.logger.info(`Filter life: ${this.getFilterLifeLevel()}%; ${this.getFilterLeftTime()} days remaining; ${this.getFilterUsedTime()} hours used.`);
    this.allPropertiesUpdated();
  }

  allPropertiesUpdated() {
    const fault = this.getFault();
    if (fault !== this.lastReportedFault) {
      if (fault) this.logger.warn(`Purifier fault: ${fault === 2 ? 'motor stuck' : fault === 3 ? 'sensor lost' : fault}`);
      else if (this.lastReportedFault) this.logger.info('Purifier fault cleared');
      this.lastReportedFault = fault;
    }
  }
}

module.exports = XiaomiAirpCpa4;

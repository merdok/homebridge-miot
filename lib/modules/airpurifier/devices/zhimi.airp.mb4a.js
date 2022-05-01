const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpMb4a extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Air Purifier 3C v2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb4a:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-mb4a:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-mb4a:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-mb4a:1","description":"Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-mb4a:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:screen:00007806:zhimi-mb4a:1","description":"Screen"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-mb4a:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-mb4a:1","description":"custom-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-mb4a:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-mb4a:1","description":"Device Fault","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-mb4a:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-mb4a:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,600,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-mb4a:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-mb4a:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,65000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-mb4a:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":7,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-mb4a:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,8,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-mb4a:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('custom-service:moto-speed-rpm', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:moto-speed-rpm:00000001:zhimi-mb4a:1","description":"moto-speed-rpm","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-service:miio-lib-version', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:miio-lib-version:00000002:zhimi-mb4a:1","description":"miio-lib-version","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom-service:favorite-speed', '{"siid":9,"piid":3,"type":"urn:zhimi-spec:property:favorite-speed:00000003:zhimi-mb4a:1","description":"","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[300,2200,1]}');
    this.addPropertyByString('custom-service:aqi-updata-heartbeat', '{"siid":9,"piid":4,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000004:zhimi-mb4a:1","description":"","format":"int32","access":["write","read","notify"],"unit":"seconds","valueRange":[0,65534,1]}');
  }

  initDeviceActions() {
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-mb4a:1","description":"Reset Filter Life","in":[3],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:fault-motor-stuck', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:fault-motor-stuck:00005001:zhimi-mb4a:1","description":"fault-motor-stuck","arguments":[]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trigger:00005002:zhimi-mb4a:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-service:door-opened', '{"siid":9,"eiid":3,"type":"urn:zhimi-spec:event:door-opened:00005003:zhimi-mb4a:1","description":"door-opened","arguments":[]}');
    this.addEventByString('custom-service:filter-exhausted', '{"siid":9,"eiid":4,"type":"urn:zhimi-spec:event:filter-exhausted:00005004:zhimi-mb4a:1","description":"filter-exhausted","arguments":[]}');
    this.addEventByString('custom-service:filter-reset', '{"siid":9,"eiid":5,"type":"urn:zhimi-spec:event:filter-reset:00005005:zhimi-mb4a:1","description":"filter-reset","arguments":[]}');
    this.addEventByString('custom-service:aqi-sensor-error', '{"siid":9,"eiid":6,"type":"urn:zhimi-spec:event:aqi-sensor-error:00005006:zhimi-mb4a:1","description":"aqi-sensor-error","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 1;
  }

  favoriteModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  speedNowProp() {
    return this.getProperty('custom-service:moto-speed-rpm');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpMb4a;

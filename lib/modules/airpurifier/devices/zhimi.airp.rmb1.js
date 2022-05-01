const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpRmb1 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Purifier 4 Lite';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-rmb1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-rmb1:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-rmb1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-rmb1:1","description":"Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-rmb1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-rmb1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":13,"type":"urn:miot-spec-v2:service:screen:00007806:zhimi-rmb1:1","description":"Screen"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:device-display-unit:000078AC:zhimi-rmb1:1","description":"Device Display Unit"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-rmb1:1","description":"custom-service"}');
    this.createServiceByString('{"siid":11,"type":"urn:zhimi-spec:service:aqi:00007803:zhimi-rmb1:1","description":"aqi"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-rmb1:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-rmb1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":2,"description":"Motor Stop"},{"value":3,"description":"Sensor Lost"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-rmb1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"}]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-rmb1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-rmb1:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,600,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-rmb1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-rmb1:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-rmb1:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"days","valueRange":[0,1000,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:zhimi-rmb1:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"days","valueRange":[0,1000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-rmb1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-rmb1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":13,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-rmb1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Bright"},{"value":2,"description":"Brightest"}]}');
    this.addPropertyByString('device-display-unit:temperature-display-unit', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:temperature-display-unit:00000116:zhimi-rmb1:1","description":"Temperature Display Unit","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Celsius"},{"value":2,"description":"Fahrenheit"}]}');
    this.addPropertyByString('custom-service:moto-speed-rpm', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:moto-speed-rpm:00000001:zhimi-rmb1:1","description":"moto-speed-rpm","format":"uint16","access":["read","notify"],"valueRange":[0,2500,1]}');
    this.addPropertyByString('custom-service:country-code', '{"siid":9,"piid":10,"type":"urn:zhimi-spec:property:country-code:00000008:zhimi-rmb1:1","description":"country-code","format":"int32","access":["read","notify","write"],"valueList":[{"value":2,"description":"EU"},{"value":1,"description":"US"},{"value":82,"description":"KR"},{"value":886,"description":"TW"},{"value":66,"description":"TH"},{"value":44,"description":"UK"},{"value":91,"description":"IN"}]}');
    this.addPropertyByString('custom-service:favorite-level', '{"siid":9,"piid":11,"type":"urn:zhimi-spec:property:favorite-level:00000002:zhimi-rmb1:1","description":"favorite-level","format":"uint8","access":["read","notify","write"],"valueRange":[0,14,1]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":11,"piid":4,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000004:zhimi-rmb1:1","description":"aqi-updata-heartbeat","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,65535,1]}');
  }

  initDeviceActions() {
    this.addActionByString('air-purifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:zhimi-rmb1:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-rmb1:1","description":"Reset Filter Life","in":[3],"out":[]}');
    this.addActionByString('custom-service:toggle-mode', '{"siid":9,"aiid":1,"type":"urn:zhimi-spec:action:toggle-mode:00002801:zhimi-rmb1:1","description":"toggle-mode","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:fault-motor-stuck', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:fault-motor-stuck:00005001:zhimi-rmb1:1","description":"fault-motor-stuck","arguments":[]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trigger:00005002:zhimi-rmb1:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-service:door-opened', '{"siid":9,"eiid":3,"type":"urn:zhimi-spec:event:door-opened:00005003:zhimi-rmb1:1","description":"door-opened","arguments":[]}');
    this.addEventByString('custom-service:filter-exhausted', '{"siid":9,"eiid":5,"type":"urn:zhimi-spec:event:filter-exhausted:00005005:zhimi-rmb1:1","description":"filter-exhausted","arguments":[]}');
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


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpRmb1;

const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpSa4 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Purifier 4 Max';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-sa4:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-sa4:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-sa4:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-sa4:1","description":"Left Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-sa4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:screen:00007806:zhimi-sa4:1","description":"Screen"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-sa4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-sa4:1","description":"Right Filter"}');
    this.createServiceByString('{"siid":15,"type":"urn:miot-spec-v2:service:air-purifier-favorite:000078B2:zhimi-sa4:1","description":"Air Purifier Favorite"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:filter-debugging:00007802:zhimi-sa4:1","description":"filter-debugging"}');
    this.createServiceByString('{"siid":13,"type":"urn:zhimi-spec:service:habit:00007803:zhimi-sa4:1","description":"habit"}');
    this.createServiceByString('{"siid":17,"type":"urn:zhimi-spec:service:rfid:00007805:zhimi-sa4:1","description":"rfid"}');
    this.createServiceByString('{"siid":19,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-sa4:1","description":"custom-service"}');
    this.createServiceByString('{"siid":20,"type":"urn:zhimi-spec:service:aqi:00007806:zhimi-sa4:1","description":"aqi"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-sa4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-sa4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"PM Faults"},{"value":2,"description":"TEMP Faults"},{"value":3,"description":"HUM Faults"},{"value":4,"description":"FORM Faults"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-sa4:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"},{"value":3,"description":"Manual"}]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-sa4:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Level1"},{"value":1,"description":"Level2"},{"value":2,"description":"Level3"}]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-sa4:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:air-quality', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:air-quality:0000001C:zhimi-sa4:1","description":"Air Quality","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Excellent"},{"value":1,"description":"Good"},{"value":2,"description":"Moderate"},{"value":3,"description":"Poor"},{"value":4,"description":"Heavy Pollution"},{"value":5,"description":"Hazardous"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-sa4:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,600,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-sa4:1","description":"Temperature","format":"int16","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('environment:hcho-density', '{"siid":3,"piid":11,"type":"urn:miot-spec-v2:property:hcho-density:000000B0:zhimi-sa4:1","description":"HCHO Density","format":"float","access":["read","notify"],"unit":"mg/m3","valueRange":[0,5,0.001]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-sa4:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:zhimi-sa4:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,7000,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-sa4:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,7000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-sa4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:volume', '{"siid":6,"piid":2,"type":"urn:miot-spec-v2:property:volume:00000013:zhimi-sa4:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('screen:brightness', '{"siid":7,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-sa4:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Brightest"},{"value":1,"description":"Bright"},{"value":2,"description":"Close"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-sa4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('filter10:filter-life-level', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-sa4:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter10:filter-left-time', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:zhimi-sa4:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,7000,1]}');
    this.addPropertyByString('filter10:filter-used-time', '{"siid":10,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-sa4:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,7000,1]}');
    this.addPropertyByString('air-purifier-favorite:fan-level', '{"siid":15,"piid":1,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-sa4:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[0,9,1]}');
    this.addPropertyByString('filter-debugging:filter-left-debug', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:filter-left-debug:00000001:zhimi-sa4:1","description":"filter-left-debug","format":"uint16","access":["write"],"valueRange":[0,7000,1]}');
    this.addPropertyByString('filter-debugging:filter-left-debug2', '{"siid":12,"piid":2,"type":"urn:zhimi-spec:property:filter-left-debug:00000002:zhimi-sa4:1","description":"filter-left-debug","format":"uint16","access":["write"],"valueRange":[0,7000,1]}');
    this.addPropertyByString('filter-debugging:filter-left-life', '{"siid":12,"piid":3,"type":"urn:zhimi-spec:property:filter-left-life:00000003:zhimi-sa4:1","description":"","format":"uint8","access":["write"],"valueRange":[0,100,1]}');
    this.addPropertyByString('filter-debugging:filter-left-life4', '{"siid":12,"piid":4,"type":"urn:zhimi-spec:property:filter-left-life:00000004:zhimi-sa4:1","description":"","format":"uint8","access":["write"],"valueRange":[0,100,1]}');
    this.addPropertyByString('habit:real-motor-feetback', '{"siid":13,"piid":1,"type":"urn:zhimi-spec:property:real-motor-feetback:00000001:zhimi-sa4:1","description":"real-motor-feetback","format":"uint16","access":["read","notify"],"valueRange":[0,2000,1]}');
    this.addPropertyByString('rfid:left-rfid-tag', '{"siid":17,"piid":1,"type":"urn:zhimi-spec:property:left-rfid-tag:00000001:zhimi-sa4:1","description":"left-rfid-tag","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:left-rfid-factory-id', '{"siid":17,"piid":2,"type":"urn:zhimi-spec:property:left-rfid-factory-id:00000002:zhimi-sa4:1","description":"left-rfid-factory-id","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:left-product-id', '{"siid":17,"piid":3,"type":"urn:zhimi-spec:property:left-product-id:00000003:zhimi-sa4:1","description":"left-product-id","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:left-rfid-time', '{"siid":17,"piid":4,"type":"urn:zhimi-spec:property:left-rfid-time:00000004:zhimi-sa4:1","description":"left-rfid-time","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:left-rfid-serial-num', '{"siid":17,"piid":5,"type":"urn:zhimi-spec:property:left-rfid-serial-num:00000005:zhimi-sa4:1","description":"left-rfid-serial-num","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:right-rfid-tag', '{"siid":17,"piid":6,"type":"urn:zhimi-spec:property:right-rfid-tag:00000006:zhimi-sa4:1","description":"right-rfid-tag","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:right-rfid-fac-id', '{"siid":17,"piid":7,"type":"urn:zhimi-spec:property:right-rfid-fac-id:00000007:zhimi-sa4:1","description":"right-rfid-fac-id","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:right-product-id', '{"siid":17,"piid":8,"type":"urn:zhimi-spec:property:right-product-id:00000008:zhimi-sa4:1","description":"right-product-id","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:right-rfid-time', '{"siid":17,"piid":9,"type":"urn:zhimi-spec:property:right-rfid-time:00000009:zhimi-sa4:1","description":"right-rfid-time","format":"string","access":["read","notify"]}');
    this.addPropertyByString('rfid:right-rfid-ser-num', '{"siid":17,"piid":10,"type":"urn:zhimi-spec:property:right-rfid-ser-num:0000000a:zhimi-sa4:1","description":"right-rfid-ser-num","format":"string","access":["read","notify"]}');
    this.addPropertyByString('custom-service:favorite-square', '{"siid":19,"piid":1,"type":"urn:zhimi-spec:property:favorite-square:00000001:zhimi-sa4:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('custom-service:form-sensor-sn', '{"siid":19,"piid":2,"type":"urn:zhimi-spec:property:form-sensor-sn:00000002:zhimi-sa4:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":20,"piid":1,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000001:zhimi-sa4:1","description":"","format":"uint16","access":["read","notify","write"],"valueRange":[0,65535,1]}');
  }

  initDeviceActions() {
    this.addActionByString('air-purifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:zhimi-sa4:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-sa4:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('filter10:reset-filter-life', '{"siid":10,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-sa4:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('habit:mode-switch', '{"siid":13,"aiid":1,"type":"urn:zhimi-spec:action:mode-switch:00002801:zhimi-sa4:1","description":"mode-switch","in":[],"out":[]}');
    this.addActionByString('habit:fan-level-switch', '{"siid":13,"aiid":2,"type":"urn:zhimi-spec:action:fan-level-switch:00002802:zhimi-sa4:1","description":"fan-level-switch","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('habit:door-opening', '{"siid":13,"eiid":1,"type":"urn:zhimi-spec:event:door-opening:00005001:zhimi-sa4:1","description":"door-opening","arguments":[]}');
    this.addEventByString('habit:filter-exhausted', '{"siid":13,"eiid":2,"type":"urn:zhimi-spec:event:filter-exhausted:00005002:zhimi-sa4:1","description":"filter-exhausted","arguments":[]}');
    this.addEventByString('habit:filter-exhauster', '{"siid":13,"eiid":3,"type":"urn:zhimi-spec:event:filter-exhauster:00005003:zhimi-sa4:1","description":"filter-exhauster","arguments":[]}');
    this.addEventByString('habit:motor-stuck', '{"siid":13,"eiid":4,"type":"urn:zhimi-spec:event:motor-stuck:00005004:zhimi-sa4:1","description":"motor-stuck","arguments":[]}');
    this.addEventByString('habit:door-opening5', '{"siid":13,"eiid":5,"type":"urn:zhimi-spec:event:door-opening:00005005:zhimi-sa4:1","description":"door-opening","arguments":[]}');
    this.addEventByString('habit:top-grille-opening', '{"siid":13,"eiid":6,"type":"urn:zhimi-spec:event:top-grille-opening:00005006:zhimi-sa4:1","description":"top-grille-opening","arguments":[]}');
    this.addEventByString('habit:child-lock-opeming', '{"siid":13,"eiid":7,"type":"urn:zhimi-spec:event:child-lock-opeming:00005007:zhimi-sa4:1","description":"child-lock-opeming","arguments":[]}');
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

  manualModeValue() {
    return 3;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  favoriteLevelProp() {
    return this.getProperty('air-purifier-favorite:fan-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpSa4;

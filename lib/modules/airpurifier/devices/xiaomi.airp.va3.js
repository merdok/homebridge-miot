const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiAirpurifierVa3 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Purifier 5S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:xiaomi-va3:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":1,"type":"urn:miot-spec-v2:service:device-information:00007801:xiaomi-va3:1","description":"Device Information"}');
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:xiaomi-va3:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:xiaomi-va3:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:xiaomi-va3:1","description":"Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-va3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:screen:00007806:xiaomi-va3:1","description":"Screen"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-va3:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:air-purifier-favorite:000078B2:xiaomi-va3:1","description":"Air Purifier Favorite"}');
    this.createServiceByString('{"siid":10,"type":"urn:xiaomi-spec:service:filter-debug:00007801:xiaomi-va3:1","description":"filter-debug"}');
    this.createServiceByString('{"siid":11,"type":"urn:xiaomi-spec:service:filter-tag:00007802:xiaomi-va3:1","description":"filter-tag"}');
    this.createServiceByString('{"siid":12,"type":"urn:xiaomi-spec:service:aqi:00007803:xiaomi-va3:1","description":"aqi"}');
    this.createServiceByString('{"siid":13,"type":"urn:xiaomi-spec:service:custom-service:00007804:xiaomi-va3:1","description":"custom-service"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:self-check:000078D7:xiaomi-va3:2","description":"Self Check"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('device:manufacturer', '{"siid":1,"piid":1,"type":"urn:miot-spec-v2:property:manufacturer:00000001:xiaomi-va3:1","format":"string","access":["read"],"description":"Device Manufacturer"}');
    this.addPropertyByString('device:model', '{"siid":1,"piid":2,"type":"urn:miot-spec-v2:property:model:00000002:xiaomi-va3:1","format":"string","access":["read"],"description":"Device Model"}');
    this.addPropertyByString('device:serial-number', '{"siid":1,"piid":3,"type":"urn:miot-spec-v2:property:serial-number:00000003:xiaomi-va3:1","format":"string","access":["read"],"description":"Device ID"}');
    this.addPropertyByString('device:firmware', '{"siid":1,"piid":4,"type":"urn:miot-spec-v2:property:firmware-revision:00000005:xiaomi-va3:1","format":"string","access":["read"],"description":"Current Firmware Version"}');
    this.addPropertyByString('device:serial-no', '{"siid":1,"piid":5,"type":"urn:miot-spec-v2:property:serial-no:000000FF:xiaomi-va3:1","format":"string","access":["read","notify"],"description":"Serial Number"}');
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"Switch Status"}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"Device Fault","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Sensor PM Error"},{"value":2,"description":"Sensor Temp Hum Error"},{"value":3,"description":"Sensor Hcho Error"},{"value":4,"description":"Filter Error"},{"value":5,"description":"Motor Error"}]}');
    this.addPropertyByString('air-purifier:mode',
      '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-va3:1","format":"uint8","access":["read","write","notify"],"description":"Mode","valueList":[' +
      '{"value":0,"description":"Auto"},' +
      '{"value":3,"description":"Sleep"},' +
      '{"value":5,"description":"Favorite"},' +
      '{"value":6,"description":"None"}]}'
    );
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-va3:1","format":"uint8","access":["read","write","notify"],"description":"Fan Level","valueList":[{"value":0,"description":"Level1"},{"value":1,"description":"Level2"},{"value":2,"description":"Level3"}]}');
    this.addPropertyByString('air-purifier:anion', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:anion:00000025:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"Anion"}');
    this.addPropertyByString('air-purifier:uv', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:uv:00000029:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"UV"}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"Relative Humidity","unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:air-quality', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:air-quality:0000001C:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"Air Quality","valueList":[{"value":0,"description":"Excellent"},{"value":1,"description":"Good"},{"value":2,"description":"Moderate"},{"value":3,"description":"Poor"},{"value":4,"description":"Heavy Pollution"},{"value":5,"description":"Hazardous"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"PM2.5 Density","unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:pm10-density', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:pm10-density:00000035:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"PM10 Density","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:xiaomi-va3:1","format":"float","access":["read","notify"],"description":"Temperature","unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('environment:hcho-density', '{"siid":3,"piid":11,"type":"urn:miot-spec-v2:property:hcho-density:000000B0:xiaomi-va3:1","format":"float","access":["read","notify"],"description":"HCHO Density","unit":"mg/m3","valueRange":[0,1,0.001]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"Filter Life Level","unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"Filter Left Time","unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"Filter Used Time","unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"Alarm"}');
    this.addPropertyByString('screen:on', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"Switch Status"}');
    this.addPropertyByString('screen:brightness', '{"siid":7,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:xiaomi-va3:1","format":"uint8","access":["read","write","notify"],"description":"Brightness","valueList":[{"value":0,"description":"Dim"},{"value":1,"description":"Normal"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:xiaomi-va3:1","format":"bool","access":["read","write","notify"],"description":"Physical Control Locked"}');
    this.addPropertyByString('favorite:fan-level', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-va3:1","format":"uint8","access":["read","write","notify"],"description":"Fan Level","valueRange":[0,10,1]}');
    this.addPropertyByString('filter-debug:filter-used-time', '{"siid":10,"piid":1,"type":"urn:xiaomi-spec:property:filter-used-time:00000001:xiaomi-va3:1","format":"uint16","access":["write"],"description":"filter-used-time","unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('filter-debug:filter-used-life', '{"siid":10,"piid":2,"type":"urn:xiaomi-spec:property:filter-used-life:00000002:xiaomi-va3:1","format":"uint8","access":["write"],"description":"filter-used-life","unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter-tag:tag', '{"siid":11,"piid":1,"type":"urn:xiaomi-spec:property:tag:00000001:xiaomi-va3:1","format":"string","access":["read","notify"],"description":"tag"}');
    this.addPropertyByString('filter-tag:factory-id', '{"siid":11,"piid":2,"type":"urn:xiaomi-spec:property:factory-id:00000002:xiaomi-va3:1","format":"string","access":["read","notify"],"description":"factory-id"}');
    this.addPropertyByString('filter-tag:product-id', '{"siid":11,"piid":3,"type":"urn:xiaomi-spec:property:product-id:00000003:xiaomi-va3:1","format":"string","access":["read","notify"],"description":"product-id"}');
    this.addPropertyByString('filter-tag:date', '{"siid":11,"piid":4,"type":"urn:xiaomi-spec:property:date:00000004:xiaomi-va3:1","format":"string","access":["read","notify"],"description":"date"}');
    this.addPropertyByString('filter-tag:serial-number', '{"siid":11,"piid":5,"type":"urn:xiaomi-spec:property:serial-number:00000005:xiaomi-va3:1","format":"string","access":["read","notify"],"description":""}');
    this.addPropertyByString('aqi:update-heartbeat', '{"siid":12,"piid":1,"type":"urn:xiaomi-spec:property:update-heartbeat:00000001:xiaomi-va3:1","format":"uint16","access":["read","notify","write"],"description":"","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-service:favorite-square', '{"siid":13,"piid":1,"type":"urn:xiaomi-spec:property:favorite-square:00000001:xiaomi-va3:1","format":"string","access":["read","notify"],"description":""}');
    this.addPropertyByString('custom-service:reboot-cause', '{"siid":13,"piid":2,"type":"urn:xiaomi-spec:property:reboot-cause:00000002:xiaomi-va3:1","format":"uint8","access":["read","notify"],"description":"","valueList":[{"value":1,"description":"Power"},{"value":2,"description":"External-pin"},{"value":3,"description":"Software"},{"value":4,"description":"IWDG"},{"value":5,"description":"Unknown"}]}');
    this.addPropertyByString('custom-service:motor-rpm-set', '{"siid":13,"piid":3,"type":"urn:xiaomi-spec:property:motor-rpm-set:00000003:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"","valueRange":[0,10000,1]}');
    this.addPropertyByString('custom-service:motor-rpm-feedback', '{"siid":13,"piid":4,"type":"urn:xiaomi-spec:property:motor-rpm-feedback:00000004:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"","valueRange":[0,10000,1]}');
    this.addPropertyByString('custom-service:hcho-tag', '{"siid":13,"piid":5,"type":"urn:xiaomi-spec:property:hcho-tag:00000005:xiaomi-va3:1","format":"string","access":["read","notify"],"description":""}');
    this.addPropertyByString('custom-service:iic-error-cnt', '{"siid":13,"piid":6,"type":"urn:xiaomi-spec:property:iic-error-cnt:00000006:xiaomi-va3:1","format":"uint16","access":["read","notify"],"description":"","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-service:hcho-original', '{"siid":13,"piid":7,"type":"urn:xiaomi-spec:property:hcho-original:00000007:xiaomi-va3:1","format":"float","access":["read","notify"],"description":"hcho-original","unit":"mg/m3","valueRange":[0,10,0.001]}');
    this.addPropertyByString('custom-service:common-property', '{"siid":13,"piid":10,"type":"urn:xiaomi-spec:property:common-property:0000000a:xiaomi-va3:1","format":"string","access":["read","notify"],"description":""}');
    this.addPropertyByString('custom-service:motor-rpm-debug', '{"siid":13,"piid":11,"type":"urn:xiaomi-spec:property:motor-rpm-debug:0000000b:xiaomi-va3:1","format":"uint16","access":["write"],"description":"","valueRange":[0,10000,1]}');
    this.addPropertyByString('custom-service:particle-abnormal-on', '{"siid":13,"piid":12,"type":"urn:xiaomi-spec:property:particle-abnormal-on:00000008:xiaomi-va3:2","format":"bool","access":["read","notify","write"],"description":"particle-abnormal-on"}');
    this.addPropertyByString('self-check:self-check-items', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:self-check-items:0000020D:xiaomi-va3:2","format":"uint8","access":[],"description":"Self Check Items","valueList":[{"value":0,"description":"All"},{"value":1,"description":"Motor"},{"value":2,"description":"Filter"},{"value":3,"description":"HCHO-Sensor"},{"value":4,"description":"Particle-Sensor"},{"value":5,"description":"Temp-Sensor"},{"value":6,"description":"Top-Switch"},{"value":7,"description":"Door-Hall"},{"value":8,"description":"Key-Power"},{"value":9,"description":"Key-Mode"},{"value":10,"description":"Key-Info"},{"value":11,"description":"Key-Curve"},{"value":12,"description":"Key-Led"}]}');
    this.addPropertyByString('self-check:self-check-results', '{"siid":14,"piid":2,"type":"urn:miot-spec-v2:property:self-check-results:0000020E:xiaomi-va3:2","format":"string","access":["read","notify"],"description":"Self Check Results"}');
    this.addPropertyByString('self-check:manual-check-results', '{"siid":14,"piid":3,"type":"urn:miot-spec-v2:property:manual-check-results:000002A3:xiaomi-va3:2","format":"uint8","access":["read","write","notify"],"description":"Manual Check Results","valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Abnormal"},{"value":2,"description":"Ignore"}]}');
  }

  initDeviceActions() {
    this.addActionByString('air-purifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:xiaomi-va3:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:xiaomi-va3:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('custom-service:toggle-mode', '{"siid":13,"aiid":1,"type":"urn:xiaomi-spec:action:toggle-mode:00002801:xiaomi-va3:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('custom-service:toggle-fan-level', '{"siid":13,"aiid":2,"type":"urn:xiaomi-spec:action:toggle-fan-level:00002802:xiaomi-va3:1","description":"toggle-fan-level","in":[],"out":[]}');
    this.addActionByString('self-check:start-check', '{"siid":14,"aiid":1,"type":"urn:miot-spec-v2:action:start-check:00002891:xiaomi-va3:2","description":"Start Check","in":[1],"out":[]}');
    this.addActionByString('self-check:stop-check', '{"siid":14,"aiid":2,"type":"urn:miot-spec-v2:action:stop-check:0000289E:xiaomi-va3:2","description":"Stop Check","in":[],"out":[]}');
    this.addActionByString('self-check:sync-manual-check', '{"siid":14,"aiid":3,"type":"urn:miot-spec-v2:action:sync-manual-check:000028B9:xiaomi-va3:2","description":"Sync Manual Check","in":[1,3],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:motor-stuck', '{"siid":13,"eiid":1,"type":"urn:xiaomi-spec:event:motor-stuck:00005001:xiaomi-va3:1","description":"motor-stuck","arguments":[]}');
    this.addEventByString('custom-service:grille-opened', '{"siid":13,"eiid":2,"type":"urn:xiaomi-spec:event:grille-opened:00005002:xiaomi-va3:1","description":"grille-opened","arguments":[]}');
    this.addEventByString('custom-service:door-opened', '{"siid":13,"eiid":3,"type":"urn:xiaomi-spec:event:door-opened:00005003:xiaomi-va3:1","description":"door-opened","arguments":[]}');
    this.addEventByString('custom-service:filter-exhausted', '{"siid":13,"eiid":4,"type":"urn:xiaomi-spec:event:filter-exhausted:00005004:xiaomi-va3:1","description":"filter-exhausted","arguments":[]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":13,"eiid":5,"type":"urn:xiaomi-spec:event:childlock-trigger:00005005:xiaomi-va3:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-service:particle-abnormal', '{"siid":13,"eiid":6,"type":"urn:xiaomi-spec:event:particle-abnormal:00005006:xiaomi-va3:1","description":"particle-abnormal","arguments":[]}');
    this.addEventByString('self-check:self-check-complete', '{"siid":14,"eiid":1,"type":"urn:miot-spec-v2:event:self-check-complete:00005079:xiaomi-va3:2","description":"Self Check Complete","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 3;
  }

  favoriteModeValue() {
    return 5;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  favoriteLevelProp() {
    return this.getProperty('favorite:fan-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiAirpurifierVa3;

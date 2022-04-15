const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpMp4 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Miija Air Purifier 4 Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mp4:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-mp4:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-mp4:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-mp4:1","description":"Filter"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-mp4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-mp4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":13,"type":"urn:miot-spec-v2:service:screen:00007806:zhimi-mp4:1","description":"Screen"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-mp4:1","description":"custom-service"}');
    this.createServiceByString('{"siid":10,"type":"urn:zhimi-spec:service:filter-time:00007802:zhimi-mp4:1","description":"filter-time"}');
    this.createServiceByString('{"siid":11,"type":"urn:zhimi-spec:service:aqi:00007803:zhimi-mp4:1","description":"aqi"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:rfid:00007804:zhimi-mp4:1","description":"rfid"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-mp4:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-mp4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Sensor PM Error"},{"value":2,"description":"Temp Error"},{"value":3,"description":"Hum Error"},{"value":4,"description":"No Filter"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-mp4:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"},{"value":3,"description":"Manual"}]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-mp4:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('air-purifier:anion', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:anion:00000025:zhimi-mp4:1","description":"Anion","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-mp4:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-mp4:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-mp4:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-mp4:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-mp4:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,65000,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:zhimi-mp4:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"days","valueRange":[0,1000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-mp4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-mp4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":13,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-mp4:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Bright"},{"value":2,"description":"Brightest"}]}');
    this.addPropertyByString('custom-service:moto-speed-rpm', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:moto-speed-rpm:00000001:zhimi-mp4:1","description":"moto-speed-rpm","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-service:favorite-speed', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:favorite-speed:00000002:zhimi-mp4:1","description":"favorite-speed","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[200,2300,1]}');
    this.addPropertyByString('custom-service:motor-set-speed', '{"siid":9,"piid":4,"type":"urn:zhimi-spec:property:motor-set-speed:00000004:zhimi-mp4:1","description":"motor-set-speed","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,2000,1]}');
    this.addPropertyByString('custom-service:favorite-level', '{"siid":9,"piid":5,"type":"urn:zhimi-spec:property:favorite-level:00000005:zhimi-mp4:1","description":"favorite-level","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,11,1]}');
    this.addPropertyByString('custom-service:buttom-door', '{"siid":9,"piid":6,"type":"urn:zhimi-spec:property:buttom-door:00000003:zhimi-mp4:1","description":"buttom-door","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom-service:reboot-cause', '{"siid":9,"piid":8,"type":"urn:zhimi-spec:property:reboot-cause:00000007:zhimi-mp4:1","description":"reboot-cause","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"REASON-HW-BOOT"},{"value":1,"description":"REASON-USER-REBOOT"},{"value":2,"description":"REASON-UPDATE"},{"value":3,"description":"REASON-WDT"}]}');
    this.addPropertyByString('custom-service:manual-level', '{"siid":9,"piid":9,"type":"urn:zhimi-spec:property:manual-level:00000006:zhimi-mp4:1","description":"manual-level","format":"uint16","access":["read","notify","write"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('custom-service:ic-error-count', '{"siid":9,"piid":10,"type":"urn:zhimi-spec:property:ic-error-count:00000008:zhimi-mp4:1","description":"ic-error-count","format":"uint32","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('filter-time:filter-used-debug', '{"siid":10,"piid":1,"type":"urn:zhimi-spec:property:filter-used-debug:00000001:zhimi-mp4:1","description":"filter-used-debug","format":"uint16","access":["write"],"unit":"hours","valueRange":[0,3500,1]}');
    this.addPropertyByString('aqi:purify-volume', '{"siid":11,"piid":1,"type":"urn:zhimi-spec:property:purify-volume:00000001:zhimi-mp4:1","description":"purify-volume","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:average-aqi', '{"siid":11,"piid":2,"type":"urn:zhimi-spec:property:average-aqi:00000002:zhimi-mp4:1","description":"average-aqi","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:aqi-state', '{"siid":11,"piid":3,"type":"urn:zhimi-spec:property:aqi-state:00000003:zhimi-mp4:1","description":"aqi-state","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"AQI-GOOD-L"},{"value":1,"description":"AQI-GOOD-H"},{"value":2,"description":"AQI-MID-L"},{"value":3,"description":"AQI-MID-H"},{"value":4,"description":"AQI-BAD-L"},{"value":5,"description":"AQI-BAD-H"}]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":11,"piid":4,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000004:zhimi-mp4:1","description":"aqi-updata-heartbeat","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('rfid:rfid-tag', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:rfid-tag:00000001:zhimi-mp4:1","description":"rfid-tag","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-factory-id', '{"siid":12,"piid":2,"type":"urn:zhimi-spec:property:rfid-factory-id:00000002:zhimi-mp4:1","description":"rfid-factory-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-product-id', '{"siid":12,"piid":3,"type":"urn:zhimi-spec:property:rfid-product-id:00000003:zhimi-mp4:1","description":"rfid-product-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-time', '{"siid":12,"piid":4,"type":"urn:zhimi-spec:property:rfid-time:00000004:zhimi-mp4:1","description":"rfid-time","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-serial-num', '{"siid":12,"piid":5,"type":"urn:zhimi-spec:property:rfid-serial-num:00000005:zhimi-mp4:1","description":"rfid-serial-num","format":"string","access":["read","notify"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('air-purifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:zhimi-mp4:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-mp4:1","description":"Reset Filter Life","in":[3],"out":[]}');
    this.addActionByString('custom-service:toggle-mode', '{"siid":9,"aiid":1,"type":"urn:zhimi-spec:action:toggle-mode:00002801:zhimi-mp4:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('custom-service:toggle-fan-leve', '{"siid":9,"aiid":2,"type":"urn:zhimi-spec:action:toggle-fan-leve:00002802:zhimi-mp4:1","description":"toggle-fan-leve","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:fault-motor-stuck', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:fault-motor-stuck:00005001:zhimi-mp4:1","description":"fault-motor-stuck","arguments":[]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trigger:00005002:zhimi-mp4:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-service:door-opened', '{"siid":9,"eiid":3,"type":"urn:zhimi-spec:event:door-opened:00005003:zhimi-mp4:1","description":"door-opened","arguments":[]}');
    this.addEventByString('custom-service:top-grille', '{"siid":9,"eiid":4,"type":"urn:zhimi-spec:event:top-grille:00005004:zhimi-mp4:1","description":"top-grille","arguments":[]}');
    this.addEventByString('custom-service:filter-exhausted', '{"siid":9,"eiid":5,"type":"urn:zhimi-spec:event:filter-exhausted:00005005:zhimi-mp4:1","description":"filter-exhausted","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpMp4;

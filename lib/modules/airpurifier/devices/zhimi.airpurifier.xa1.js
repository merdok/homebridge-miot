const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpurifierXa1 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Air Purifier X';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-xa1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-xa1:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-xa1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-xa1:1","description":"Filter"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-xa1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":15,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-xa1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:zhimi-spec:service:indicator-light:00007802:zhimi-xa1:1","description":"indicator-light"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:button:00007804:zhimi-xa1:1","description":"button"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:filter-time:00007805:zhimi-xa1:1","description":"filter-time"}');
    this.createServiceByString('{"siid":10,"type":"urn:zhimi-spec:service:motor-speed:00007806:zhimi-xa1:1","description":"motor-speed"}');
    this.createServiceByString('{"siid":11,"type":"urn:zhimi-spec:service:other:00007807:zhimi-xa1:1","description":"other"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:aqi:00007808:zhimi-xa1:1","description":"aqi"}');
    this.createServiceByString('{"siid":13,"type":"urn:zhimi-spec:service:rfid:00007809:zhimi-xa1:1","description":"rfid"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-xa1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-xa1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":2,"description":" Motor Stuck"},{"value":3,"description":"No Sensor"},{"value":4,"description":"Error Hum"},{"value":5,"description":"Error Temp"},{"value":6,"description":"Error TVOC"}]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-xa1:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-xa1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"},{"value":3,"description":"None"}]}');
    this.addPropertyByString('air-purifier:anion', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:anion:00000025:zhimi-xa1:1","description":"Anion","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-xa1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-xa1:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-xa1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('environment:tvoc-density', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:tvoc-density:00000065:zhimi-xa1:1","description":"TVOC Density","format":"int32","access":["read","notify"],"unit":"μg/m3","valueRange":[0,500,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-xa1:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-xa1:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-xa1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":15,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-xa1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":2,"type":"urn:zhimi-spec:property:on:00000002:zhimi-xa1:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('indicator-light:led-status', '{"siid":6,"piid":3,"type":"urn:zhimi-spec:property:led-status:00000001:zhimi-xa1:1","description":"led-status","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Auto"},{"value":2,"description":"Brightest"},{"value":3,"description":"Bright"}]}');
    this.addPropertyByString('button:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000001:zhimi-xa1:1","description":"button-pressed","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('filter-time:filter-used-debug', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:filter-used-debug:00000002:zhimi-xa1:1","description":"filter-used-debug","format":"int32","access":["write"],"unit":"hours","valueRange":[0,8000,1]}');
    this.addPropertyByString('motor-speed:motor-speed', '{"siid":10,"piid":8,"type":"urn:zhimi-spec:property:motor-speed:00000008:zhimi-xa1:1","description":"","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,1000,1]}');
    this.addPropertyByString('motor-speed:motor-set-speed', '{"siid":10,"piid":9,"type":"urn:zhimi-spec:property:motor-set-speed:00000009:zhimi-xa1:1","description":"motor-set-speed","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,10000,1]}');
    this.addPropertyByString('motor-speed:favorite-level', '{"siid":10,"piid":10,"type":"urn:zhimi-spec:property:favorite-level:0000000a:zhimi-xa1:1","description":"favorite-level","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[0,9,1]}');
    this.addPropertyByString('other:main-channel', '{"siid":11,"piid":2,"type":"urn:zhimi-spec:property:main-channel:00000002:zhimi-xa1:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('other:slave-channel', '{"siid":11,"piid":3,"type":"urn:zhimi-spec:property:slave-channel:00000003:zhimi-xa1:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('other:buttom-door', '{"siid":11,"piid":5,"type":"urn:zhimi-spec:property:buttom-door:00000005:zhimi-xa1:1","description":"buttom-door","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('other:reboot-cause', '{"siid":11,"piid":6,"type":"urn:zhimi-spec:property:reboot-cause:00000006:zhimi-xa1:1","description":"reboot-cause","format":"uint32","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"REASON_HW_BOOT"},{"value":1,"description":"REASON_USER_REBOOT"},{"value":2,"description":"REASON_UPDATE"},{"value":3,"description":"REASON_WDT"}]}');
    this.addPropertyByString('other:manual-level', '{"siid":11,"piid":7,"type":"urn:zhimi-spec:property:manual-level:00000001:zhimi-xa1:1","description":"manual-level","format":"int32","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('other:light-value', '{"siid":11,"piid":8,"type":"urn:zhimi-spec:property:light-value:00000007:zhimi-xa1:1","description":"light-value","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,330,1]}');
    this.addPropertyByString('other:light-set', '{"siid":11,"piid":9,"type":"urn:zhimi-spec:property:light-set:00000008:zhimi-xa1:1","description":"light-set","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,15,1]}');
    this.addPropertyByString('other:shutter-angle', '{"siid":11,"piid":10,"type":"urn:zhimi-spec:property:shutter-angle:00000009:zhimi-xa1:1","description":"shutter-angle","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"30°"},{"value":1,"description":"60°"},{"value":2,"description":"90°"}]}');
    this.addPropertyByString('aqi:purify-volume', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:purify-volume:00000001:zhimi-xa1:1","description":"purify-volume","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:average-aqi', '{"siid":12,"piid":2,"type":"urn:zhimi-spec:property:average-aqi:00000002:zhimi-xa1:1","description":"average-aqi","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:average-aqi-cnt', '{"siid":12,"piid":3,"type":"urn:zhimi-spec:property:average-aqi-cnt:00000003:zhimi-xa1:1","description":"average-aqi-cnt","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:aqi-zone', '{"siid":12,"piid":4,"type":"urn:zhimi-spec:property:aqi-zone:00000004:zhimi-xa1:1","description":"aqi-zone","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('aqi:aqi-state', '{"siid":12,"piid":7,"type":"urn:zhimi-spec:property:aqi-state:00000007:zhimi-xa1:1","description":"aqi-state","format":"int32","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"AQI_GOOD_L"},{"value":1,"description":"AQI_GOOD_H"},{"value":2,"description":"AQI_MID_L"},{"value":3,"description":"AQI_MID_H"},{"value":4,"description":"AQI_BAD_L"},{"value":5,"description":"AQI_BAD_H"}]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":12,"piid":8,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000008:zhimi-xa1:1","description":"aqi-updata-heartbeat","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('aqi:tvoc-level', '{"siid":12,"piid":10,"type":"urn:zhimi-spec:property:tvoc-level:0000000a:zhimi-xa1:1","description":"tvoc-level","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"优"},{"value":1,"description":"良"},{"value":2,"description":"中"},{"value":3,"description":"差"}]}');
    this.addPropertyByString('aqi:ethanol', '{"siid":12,"piid":11,"type":"urn:zhimi-spec:property:ethanol:00000006:zhimi-xa1:1","description":"ethanol","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('aqi:sgp-serial', '{"siid":12,"piid":12,"type":"urn:zhimi-spec:property:sgp-serial:00000009:zhimi-xa1:1","description":"sgp-serial","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('aqi:sgp-version', '{"siid":12,"piid":13,"type":"urn:zhimi-spec:property:sgp-version:0000000b:zhimi-xa1:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('aqi:pm-updata', '{"siid":12,"piid":14,"type":"urn:zhimi-spec:property:pm-updata:00000005:zhimi-xa1:1","description":"pm-updata","format":"uint32","access":["read","notify"],"unit":"μg/m3","valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:voc-updata', '{"siid":12,"piid":15,"type":"urn:zhimi-spec:property:voc-updata:0000000c:zhimi-xa1:1","description":"voc-updata","format":"uint32","access":["read","notify"],"unit":"μg/m3","valueRange":[0,500,1]}');
    this.addPropertyByString('rfid:rfid-tag', '{"siid":13,"piid":1,"type":"urn:zhimi-spec:property:rfid-tag:00000001:zhimi-xa1:1","description":"rfid-tag","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-factory-id', '{"siid":13,"piid":2,"type":"urn:zhimi-spec:property:rfid-factory-id:00000002:zhimi-xa1:1","description":"rfid-factory-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-product-id', '{"siid":13,"piid":3,"type":"urn:zhimi-spec:property:rfid-product-id:00000003:zhimi-xa1:1","description":"rfid-product-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-time', '{"siid":13,"piid":4,"type":"urn:zhimi-spec:property:rfid-time:00000004:zhimi-xa1:1","description":"rfid-time","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('rfid:rfid-serial-num', '{"siid":13,"piid":5,"type":"urn:zhimi-spec:property:rfid-serial-num:00000005:zhimi-xa1:1","description":"rfid-serial-num","format":"string","access":["read","notify"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('button:toggle', '{"siid":8,"aiid":1,"type":"urn:zhimi-spec:action:toggle:00002801:zhimi-xa1:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('button:toggle-mode', '{"siid":8,"aiid":2,"type":"urn:zhimi-spec:action:toggle-mode:00002802:zhimi-xa1:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('button:toggle-fan-level', '{"siid":8,"aiid":3,"type":"urn:zhimi-spec:action:toggle-fan-level:00002803:zhimi-xa1:1","description":"toggle-fan-level","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('button:child-lock-trigger', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:child-lock-trigger:00005001:zhimi-xa1:1","description":"child-lock-trigger","arguments":[1]}');
    this.addEventByString('filter-time:filter-eof', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:filter-eof:00005001:zhimi-xa1:1","description":"filter-eof","arguments":[]}');
    this.addEventByString('filter-time:filter-door-opened', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:filter-door-opened:00005002:zhimi-xa1:1","description":"filter-door-opened","arguments":[]}');
    this.addEventByString('other:statusreport', '{"siid":11,"eiid":1,"type":"urn:zhimi-spec:event:statusreport:00005001:zhimi-xa1:1","description":"statusreport","arguments":[]}');
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

module.exports = ZhimiAirpurifierXa1;

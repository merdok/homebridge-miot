const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpVb2a extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Purifier Pro H v2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-vb2a:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-vb2a:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-vb2a:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-vb2a:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-vb2a:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-vb2a:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-vb2a:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:button:00000001:zhimi-vb2a:1","description":"button"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:filter-time:00000003:zhimi-vb2a:1","description":"filter-time"}');
    this.createServiceByString('{"siid":10,"type":"urn:zhimi-spec:service:motor-speed:00000005:zhimi-vb2a:1","description":"motor-speed"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:use-time:00000013:zhimi-vb2a:1","description":"use-time"}');
    this.createServiceByString('{"siid":13,"type":"urn:zhimi-spec:service:aqi:00000015:zhimi-vb2a:1","description":"aqi"}');
    this.createServiceByString('{"siid":14,"type":"urn:zhimi-spec:service:rfid:0000001A:zhimi-vb2a:1","description":"rfid"}');
    this.createServiceByString('{"siid":15,"type":"urn:zhimi-spec:service:others:00000021:zhimi-vb2a:1","description":"others"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-vb2a:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"},{"value":1,"description":"m1_run"},{"value":2,"description":"m1_stuck"},{"value":3,"description":"no_sensor"},{"value":4,"description":"error_hum"},{"value":5,"description":"error_temp"},{"value":6,"description":"timer_error1"},{"value":7,"description":"timer_error2"}]}');
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-vb2a:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-vb2a:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":0,"description":"Sleep"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-vb2a:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"},{"value":3,"description":"None"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-vb2a:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"valueRange":[0,600,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-vb2a:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-vb2a:1","description":"Temperature","format":"float","access":["read","notify"],"valueRange":[-40,125,0.1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-vb2a:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":5,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-vb2a:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,18000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-vb2a:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:volume', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:volume:00000013:zhimi-vb2a:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-vb2a:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"brightest"},{"value":1,"description":"glimmer"},{"value":2,"description":"not bright"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":6,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-vb2a:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-vb2a:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('button:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000002:zhimi-vb2a:1","description":"button_pressed","format":"string","access":["read"]}');
    this.addPropertyByString('filter-time:filter-max-time', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:filter-max-time:00000004:zhimi-vb2a:1","description":"filter-max-time","format":"int32","access":["read","write"],"unit":"hours","valueRange":[2000,8000,1]}');
    this.addPropertyByString('filter-time:filter-hour-used-debug', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:filter-hour-used-debug:00000046:zhimi-vb2a:1","description":"filter-hour-used-debug","format":"int32","access":["read","write"],"unit":"hours","valueRange":[0,8000,1]}');
    this.addPropertyByString('motor-speed:m1-high', '{"siid":10,"piid":2,"type":"urn:zhimi-spec:property:m1-high:00000007:zhimi-vb2a:1","description":"m1-high","format":"int32","access":["read","write"],"valueRange":[300,2100,10]}');
    this.addPropertyByString('motor-speed:m1-med', '{"siid":10,"piid":3,"type":"urn:zhimi-spec:property:m1-med:00000008:zhimi-vb2a:1","description":"m1-med","format":"int32","access":["read","write"],"valueRange":[300,2100,10]}');
    this.addPropertyByString('motor-speed:m1-med-l', '{"siid":10,"piid":4,"type":"urn:zhimi-spec:property:m1-med-l:00000009:zhimi-vb2a:1","description":"m1-med-l","format":"int32","access":["read","write"],"valueRange":[300,2100,10]}');
    this.addPropertyByString('motor-speed:m1-low', '{"siid":10,"piid":5,"type":"urn:zhimi-spec:property:m1-low:0000000A:zhimi-vb2a:1","description":"m1-low","format":"int32","access":["read","write"],"valueRange":[300,2100,10]}');
    this.addPropertyByString('motor-speed:m1-silent', '{"siid":10,"piid":6,"type":"urn:zhimi-spec:property:m1-silent:0000000B:zhimi-vb2a:1","description":"m1-silent","format":"int32","access":["read","write"],"valueRange":[300,2100,10]}');
    this.addPropertyByString('motor-speed:m1-favorite', '{"siid":10,"piid":7,"type":"urn:zhimi-spec:property:m1-favorite:0000000C:zhimi-vb2a:1","description":"m1-favorite","format":"int32","access":["read"],"valueRange":[300,2300,10]}');
    this.addPropertyByString('motor-speed:motor1-speed', '{"siid":10,"piid":8,"type":"urn:zhimi-spec:property:motor1-speed:0000000D:zhimi-vb2a:1","description":"motor1-speed","format":"int32","access":["read"],"valueRange":[0,10000,1]}');
    this.addPropertyByString('motor-speed:motor1-set-speed', '{"siid":10,"piid":9,"type":"urn:zhimi-spec:property:motor1-set-speed:00000041:zhimi-vb2a:1","description":"motor1-set-speed","format":"int32","access":["read"],"valueRange":[0,10000,1]}');
    this.addPropertyByString('motor-speed:favorite-level', '{"siid":10,"piid":10,"type":"urn:zhimi-spec:property:favorite-level:00000045:zhimi-vb2a:1","description":"favorite-level","format":"int32","access":["read","write"],"valueRange":[0,9,1]}');
    this.addPropertyByString('use-time:use-time', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:use-time:00000014:zhimi-vb2a:1","description":"use-time","format":"int32","access":["read"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('aqi:purify-volume', '{"siid":13,"piid":1,"type":"urn:zhimi-spec:property:purify-volume:00000016:zhimi-vb2a:1","description":"purify-volume","format":"int32","access":["read"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('aqi:average-aqi', '{"siid":13,"piid":2,"type":"urn:zhimi-spec:property:average-aqi:00000017:zhimi-vb2a:1","description":"average-aqi","format":"int32","access":["read"],"valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:average-aqi-cnt', '{"siid":13,"piid":3,"type":"urn:zhimi-spec:property:average-aqi-cnt:00000018:zhimi-vb2a:1","description":"average_aqi read times","format":"int32","access":["read"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('aqi:aqi-zone', '{"siid":13,"piid":4,"type":"urn:zhimi-spec:property:aqi-zone:00000019:zhimi-vb2a:1","description":"aqi-zone","format":"string","access":["read"]}');
    this.addPropertyByString('aqi:sensor-state', '{"siid":13,"piid":5,"type":"urn:zhimi-spec:property:sensor-state:00000020:zhimi-vb2a:1","description":"sensor-state","format":"int32","access":["read"],"valueList":[{"value":0,"description":"waiting"},{"value":1,"description":"ready"}]}');
    this.addPropertyByString('aqi:aqi-goodh', '{"siid":13,"piid":6,"type":"urn:zhimi-spec:property:aqi-goodh:00000034:zhimi-vb2a:1","description":"aqi-goodh","format":"int32","access":["read","write"],"valueRange":[36,114,1]}');
    this.addPropertyByString('aqi:aqi-runstate', '{"siid":13,"piid":7,"type":"urn:zhimi-spec:property:aqi-runstate:00000035:zhimi-vb2a:1","description":"runstate","format":"int32","access":["read"],"valueList":[{"value":0,"description":"continue"},{"value":1,"description":"hold"},{"value":2,"description":"sleep"}]}');
    this.addPropertyByString('aqi:aqi-state', '{"siid":13,"piid":8,"type":"urn:zhimi-spec:property:aqi-state:00000036:zhimi-vb2a:1","description":"aqi-state","format":"int32","access":["read"],"valueList":[{"value":0,"description":"AQI_GOOD_L"},{"value":1,"description":"AQI_GOOD_H"},{"value":2,"description":"AQI_MID_L"},{"value":3,"description":"AQI_MID_H"},{"value":4,"description":"AQI_BAD_L"},{"value":5,"description":"AQI_BAD_H"}]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":13,"piid":9,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000001:zhimi-vb2a:1","description":"aqi-updata-heartbeat","format":"uint16","access":["write"],"unit":"seconds","valueRange":[1,65535,1]}');
    this.addPropertyByString('rfid:rfid-tag', '{"siid":14,"piid":1,"type":"urn:zhimi-spec:property:rfid-tag:0000001B:zhimi-vb2a:1","description":"rfid-tag","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-factory-id', '{"siid":14,"piid":2,"type":"urn:zhimi-spec:property:rfid-factory-id:0000001C:zhimi-vb2a:1","description":"rfid-factory-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-product-id', '{"siid":14,"piid":3,"type":"urn:zhimi-spec:property:rfid-product-id:0000001D:zhimi-vb2a:1","description":"rfid-product-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-time', '{"siid":14,"piid":4,"type":"urn:zhimi-spec:property:rfid-time:0000001E:zhimi-vb2a:1","description":"rfid-time","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-serial-num', '{"siid":14,"piid":5,"type":"urn:zhimi-spec:property:rfid-serial-num:0000001F:zhimi-vb2a:1","description":"rfid-serial-num","format":"string","access":["read"]}');
    this.addPropertyByString('others:app-extra', '{"siid":15,"piid":1,"type":"urn:zhimi-spec:property:app-extra:00000022:zhimi-vb2a:1","description":"app-extra","format":"int32","access":["read","write"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('others:main-channel', '{"siid":15,"piid":2,"type":"urn:zhimi-spec:property:main-channel:00000023:zhimi-vb2a:1","description":"main-channel","format":"int32","access":["read"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('others:slave-channel', '{"siid":15,"piid":3,"type":"urn:zhimi-spec:property:slave-channel:00000024:zhimi-vb2a:1","description":"slave-channel","format":"int32","access":["read"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('others:cola', '{"siid":15,"piid":4,"type":"urn:zhimi-spec:property:cola:00000025:zhimi-vb2a:1","description":"cola","format":"string","access":["read","write"]}');
    this.addPropertyByString('others:buttom-door', '{"siid":15,"piid":5,"type":"urn:zhimi-spec:property:buttom-door:00000037:zhimi-vb2a:1","description":"buttom-door","format":"string","access":["read"]}');
    this.addPropertyByString('others:reboot-cause', '{"siid":15,"piid":6,"type":"urn:zhimi-spec:property:reboot-cause:00000043:zhimi-vb2a:1","description":"reboot_cause","format":"int32","access":["read"],"valueList":[{"value":0,"description":"REASON_HW_BOOT"},{"value":1,"description":"REASON_USER_REBOOT"},{"value":2,"description":"REASON_UPDATE"},{"value":3,"description":"REASON_WDT"}]}');
    this.addPropertyByString('others:manual-level', '{"siid":15,"piid":7,"type":"urn:zhimi-spec:property:manual-level:00000047:zhimi-vb2a:1","description":"manual-level","format":"int32","access":["read"],"valueList":[{"value":1,"description":"level1"},{"value":2,"description":"level2"},{"value":3,"description":"level3"}]}');
    this.addPropertyByString('others:powertime', '{"siid":15,"piid":8,"type":"urn:zhimi-spec:property:powertime:00000049:zhimi-vb2a:1","description":"powertime","format":"int32","access":["read"],"valueRange":[0,2147483647,1]}');
    this.addPropertyByString('others:country-code', '{"siid":15,"piid":9,"type":"urn:zhimi-spec:property:country-code:00000001:zhimi-vb2a:1","description":"country-code","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":91,"description":"印度"},{"value":44,"description":"分销英文"},{"value":852,"description":"中国香港"},{"value":886,"description":"中国台湾"},{"value":82,"description":"韩国"}]}');
  }

  initDeviceActions() {
    this.addActionByString('button:toggle', '{"siid":8,"aiid":1,"type":"urn:zhimi-spec:action:toggle:00000028:zhimi-vb2a:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('button:toggle-mode', '{"siid":8,"aiid":2,"type":"urn:zhimi-spec:action:toggle-mode:00000029:zhimi-vb2a:1","description":"toggle-mode","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('button:child-lock-trigger', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:child-lock-trigger:00000031:zhimi-vb2a:1","description":"child-lock-trigger","arguments":[]}');
    this.addEventByString('filter-time:filter1-eof', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:filter1-eof:0000002C:zhimi-vb2a:1","description":"filter1-eof","arguments":[]}');
    this.addEventByString('filter-time:filter-door-opened', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:filter-door-opened:0000002D:zhimi-vb2a:1","description":"filter-door-opened","arguments":[]}');
    this.addEventByString('filter-time:reset-filter-life', '{"siid":9,"eiid":3,"type":"urn:zhimi-spec:event:reset-filter-life:0000002E:zhimi-vb2a:1","description":"reset-filter-life","arguments":[]}');
    this.addEventByString('others:status-report', '{"siid":15,"eiid":1,"type":"urn:zhimi-spec:event:status-report:00000042:zhimi-vb2a:1","description":"status-report","arguments":[1]}');
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

module.exports = ZhimiAirpVb2a;

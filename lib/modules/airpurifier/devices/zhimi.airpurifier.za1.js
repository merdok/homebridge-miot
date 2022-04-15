const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpurifierZa1 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Air Purifier';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-za1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['air-purifier:on', 'air-purifier:mode', 'air-purifier:fault', 'environment:air-quality',
      'environment:pm2.5-density', 'environment:relative-humidity', 'environment:temperature', 'filter:filter-life-level',
      'filter:filter-used-time', 'alarm:alarm', 'indicator-light:brightness', 'physical-controls-locked:physical-controls-locked',
      'motor-speed:favorite-fan-level'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-za1:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-za1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-za1:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-za1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-za1:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-za1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":16,"type":"urn:miot-spec-v2:service:device-display-unit:000078AC:zhimi-za1:2","description":"Device Display Unit"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:button:00007801:zhimi-za1:1","description":""}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:filter-time:00007802:zhimi-za1:1","description":"filter-time"}');
    this.createServiceByString('{"siid":10,"type":"urn:zhimi-spec:service:motor-speed:00007803:zhimi-za1:1","description":"motor-speed"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:use-time:00007805:zhimi-za1:1","description":"use-time"}');
    this.createServiceByString('{"siid":13,"type":"urn:zhimi-spec:service:aqi:00007804:zhimi-za1:1","description":"aqi"}');
    this.createServiceByString('{"siid":14,"type":"urn:zhimi-spec:service:rfid:00007806:zhimi-za1:1","description":"rfid"}');
    this.createServiceByString('{"siid":15,"type":"urn:zhimi-spec:service:others:00007807:zhimi-za1:1","description":"others"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-za1:1","description":"故障","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"无故障"},{"value":1,"description":"马达故障"},{"value":2,"description":"马达停转"},{"value":3,"description":"传感器丢失"},{"value":4,"description":"湿度异常"},{"value":5,"description":"温度异常"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-za1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"}]}');
    this.addPropertyByString('environment:air-quality', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:air-quality:0000001C:zhimi-za1:1","description":"Air Quality","format":"uint16","access":["read","notify"],"valueRange":[0,500,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-za1:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"valueRange":[0,600,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-za1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-za1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-za1:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":5,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-za1:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,15000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-za1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-za1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Bright"},{"value":1,"description":"Light"},{"value":2,"description":"Off"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-za1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('device-display-unit:temperature-display-unit', '{"siid":16,"piid":1,"type":"urn:miot-spec-v2:property:temperature-display-unit:00000116:zhimi-za1:2","description":"Temperature Display Unit","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Celsius"},{"value":2,"description":"Fahrenheit"}]}');
    this.addPropertyByString('filter-time:filter-max-time', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:filter-max-time:00000001:zhimi-za1:1","description":"filter-max-time","format":"uint16","access":["read","write"],"unit":"hour","valueRange":[2000,6000,1]}');
    this.addPropertyByString('filter-time:filter-time-set', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:filter-time-set:00000002:zhimi-za1:1","description":"filter-time-set","format":"uint16","access":["write"],"unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('motor-speed:favorite-fan-level', '{"siid":10,"piid":10,"type":"urn:zhimi-spec:property:favorite-fan-level:0000000a:zhimi-za1:1","description":"","format":"uint16","access":["read","write"],"unit":"none","valueRange":[0,14,1]}');
    this.addPropertyByString('motor-speed:motor-speed', '{"siid":10,"piid":11,"type":"urn:zhimi-spec:property:motor-speed:00000001:zhimi-za1:1","description":"motor-speed","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,3000,1]}');
    this.addPropertyByString('use-time:use-time', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:use-time:00000001:zhimi-za1:1","description":"设备运行时间","format":"uint32","access":["read"],"unit":"seconds","valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:purify-volume', '{"siid":13,"piid":1,"type":"urn:zhimi-spec:property:purify-volume:00000001:zhimi-za1:1","description":"purify-volume","format":"uint32","access":["read"],"valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:average-aqi', '{"siid":13,"piid":2,"type":"urn:zhimi-spec:property:average-aqi:00000002:zhimi-za1:1","description":"average-aqi","format":"uint16","access":["read"],"valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:aqi-zone', '{"siid":13,"piid":4,"type":"urn:zhimi-spec:property:aqi-zone:00000004:zhimi-za1:1","description":"aqi-zone","format":"string","access":["read"]}');
    this.addPropertyByString('aqi:sensor-state', '{"siid":13,"piid":5,"type":"urn:zhimi-spec:property:sensor-state:00000005:zhimi-za1:1","description":"","format":"uint8","access":["read"],"unit":"none","valueList":[{"value":0,"description":"正常模式"},{"value":1,"description":"休眠模式"}]}');
    this.addPropertyByString('rfid:rfid-tag', '{"siid":14,"piid":1,"type":"urn:zhimi-spec:property:rfid-tag:00000001:zhimi-za1:1","description":"rfid-tag","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-factory-id', '{"siid":14,"piid":2,"type":"urn:zhimi-spec:property:rfid-factory-id:00000002:zhimi-za1:1","description":"rfid-factory-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-product-id', '{"siid":14,"piid":3,"type":"urn:zhimi-spec:property:rfid-product-id:00000003:zhimi-za1:1","description":"rfid-product-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-time', '{"siid":14,"piid":4,"type":"urn:zhimi-spec:property:rfid-time:00000004:zhimi-za1:1","description":"rfid-time","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-serial-num', '{"siid":14,"piid":5,"type":"urn:zhimi-spec:property:rfid-serial-num:00000005:zhimi-za1:1","description":"rfid-serial-num","format":"string","access":["read"]}');
    this.addPropertyByString('others:reboot-cause', '{"siid":15,"piid":6,"type":"urn:zhimi-spec:property:reboot-cause:00000006:zhimi-za1:1","description":"reboot-cause","format":"uint8","access":["read"],"valueList":[{"value":0,"description":"hardware"},{"value":1,"description":"human"},{"value":2,"description":"upgrade"},{"value":3,"description":"watchdog"}]}');
    this.addPropertyByString('others:hw-version', '{"siid":15,"piid":8,"type":"urn:zhimi-spec:property:hw-version:00000008:zhimi-za1:1","description":"hw-version","format":"uint16","access":["read"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('others:sgp-ethanol', '{"siid":15,"piid":9,"type":"urn:zhimi-spec:property:sgp-ethanol:00000002:zhimi-za1:1","description":"sgp-ethanol","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('others:sgp-serial', '{"siid":15,"piid":10,"type":"urn:zhimi-spec:property:sgp-serial:00000003:zhimi-za1:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('others:sgp-version', '{"siid":15,"piid":11,"type":"urn:zhimi-spec:property:sgp-version:00000004:zhimi-za1:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('others:country-code', '{"siid":15,"piid":12,"type":"urn:zhimi-spec:property:country-code:00000001:zhimi-za1:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"America"},{"value":2,"description":"Canada"},{"value":3,"description":"Singapore"},{"value":4,"description":"Europe"},{"value":5,"description":"Australian"},{"value":6,"description":"Korea"},{"value":7,"description":"China"},{"value":8,"description":"France"},{"value":9,"description":"Japanese"},{"value":10,"description":"Taiwan"}]}');
    this.addPropertyByString('others:gesture-status', '{"siid":15,"piid":13,"type":"urn:zhimi-spec:property:gesture-status:00000005:zhimi-za1:1","description":"gesture-status","format":"bool","access":["write","read","notify"],"unit":"none"}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('button:child-lock-trigger', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:child-lock-trigger:00005001:zhimi-za1:1","description":"child-lock-trigger","arguments":[]}');
    this.addEventByString('filter-time:filter-end', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:filter-end:00005001:zhimi-za1:1","description":"filter-end","arguments":[]}');
    this.addEventByString('filter-time:filter-door-opened', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:filter-door-opened:00005002:zhimi-za1:1","description":"filter-door-opened","arguments":[]}');
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

  favoriteLevelProp() {
    return this.getProperty('motor-speed:favorite-fan-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpurifierZa1;

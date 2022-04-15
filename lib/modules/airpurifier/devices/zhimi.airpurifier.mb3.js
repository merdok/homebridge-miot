const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirpurifierMb3 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Air Purifier 3H';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb3:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['air-purifier:on', 'air-purifier:mode', 'air-purifier:fault', 'air-purifier:fan-level',
      'environment:pm2.5-density', 'environment:relative-humidity', 'environment:temperature', 'filter:filter-life-level',
      'filter:filter-used-time', 'alarm:alarm', 'indicator-light:on', 'indicator-light:brightness',
      'physical-controls-locked:physical-controls-locked', 'motor-speed:favorite-fan-level', 'motor-speed:motor-speed',
      'motor-speed:motor-favorite'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:zhimi-mb3:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-mb3:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-mb3:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-mb3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-mb3:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-mb3:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:button:00007801:zhimi-mb3:1","description":"Button"}');
    this.createServiceByString('{"siid":9,"type":"urn:zhimi-spec:service:filter-time:00007802:zhimi-mb3:1","description":"filter-time"}');
    this.createServiceByString('{"siid":10,"type":"urn:zhimi-spec:service:motor-speed:00007803:zhimi-mb3:1","description":"motor-speed"}');
    this.createServiceByString('{"siid":12,"type":"urn:zhimi-spec:service:use-time:00007805:zhimi-mb3:1","description":"use-time"}');
    this.createServiceByString('{"siid":13,"type":"urn:zhimi-spec:service:aqi:00007806:zhimi-mb3:1","description":"aqi"}');
    this.createServiceByString('{"siid":14,"type":"urn:zhimi-spec:service:rfid:00007807:zhimi-mb3:1","description":"rfid"}');
    this.createServiceByString('{"siid":15,"type":"urn:zhimi-spec:service:others:00007808:zhimi-mb3:1","description":"others"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-mb3:1","description":"fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"},{"value":1,"description":"m1_run"},{"value":2,"description":"m1_stuck"},{"value":3,"description":"no_sensor"},{"value":4,"description":"error_hum"},{"value":5,"description":"error_temp"}]}');
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-mb3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-mb3:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-mb3:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Favorite"},{"value":3,"description":"None"}]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:zhimi-mb3:1","description":"PM2.5","format":"float","access":["read","notify"],"valueRange":[0,600,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-mb3:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-mb3:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-40,125,0.1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-mb3:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":5,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-mb3:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-mb3:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-mb3:1","description":"brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Brightest"},{"value":1,"description":"Glimmer"},{"value":2,"description":"Led Closed"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":6,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-mb3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-mb3:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('button:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000001:zhimi-mb3:1","description":"button-pressed","format":"string","access":["read"]}');
    this.addPropertyByString('filter-time:filter-max-time', '{"siid":9,"piid":1,"type":"urn:zhimi-spec:property:filter-max-time:00000001:zhimi-mb3:1","description":"filter-max-time","format":"int32","access":["read","write"],"valueRange":[2000,6000,1]}');
    this.addPropertyByString('filter-time:filter-hour-debug', '{"siid":9,"piid":2,"type":"urn:zhimi-spec:property:filter-hour-debug:00000002:zhimi-mb3:1","description":"filter-hour-debug","format":"int32","access":["read","write"],"valueRange":[0,5000,1]}');
    this.addPropertyByString('motor-speed:motor-strong', '{"siid":10,"piid":1,"type":"urn:zhimi-spec:property:motor-strong:00000001:zhimi-mb3:1","description":"motor-strong","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-high', '{"siid":10,"piid":2,"type":"urn:zhimi-spec:property:motor-high:00000002:zhimi-mb3:1","description":"motor-high","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-med', '{"siid":10,"piid":3,"type":"urn:zhimi-spec:property:motor-med:00000003:zhimi-mb3:1","description":"motor-med","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-med-l', '{"siid":10,"piid":4,"type":"urn:zhimi-spec:property:motor-med-l:00000004:zhimi-mb3:1","description":"motor-med-l","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-low', '{"siid":10,"piid":5,"type":"urn:zhimi-spec:property:motor-low:00000005:zhimi-mb3:1","description":"motor-low","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-silent', '{"siid":10,"piid":6,"type":"urn:zhimi-spec:property:motor-silent:00000006:zhimi-mb3:1","description":"motor-silent","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-favorite', '{"siid":10,"piid":7,"type":"urn:zhimi-spec:property:motor-favorite:00000007:zhimi-mb3:1","description":"motor-favorite","format":"int32","access":["read","write"],"valueRange":[300,2300,1]}');
    this.addPropertyByString('motor-speed:motor-speed', '{"siid":10,"piid":8,"type":"urn:zhimi-spec:property:motor-speed:00000008:zhimi-mb3:1","description":"motor-speed","format":"int32","access":["read"],"valueRange":[0,3000,1]}');
    this.addPropertyByString('motor-speed:motor-set-speed', '{"siid":10,"piid":9,"type":"urn:zhimi-spec:property:motor-set-speed:00000009:zhimi-mb3:1","description":"motor-set-speed","format":"int32","access":["read"],"valueRange":[0,3000,1]}');
    this.addPropertyByString('motor-speed:favorite-fan-level', '{"siid":10,"piid":10,"type":"urn:zhimi-spec:property:favorite-fan-level:0000000a:zhimi-mb3:1","description":"favorite-fan-level","format":"int32","access":["read","write"],"valueRange":[0,14,1]}');
    this.addPropertyByString('use-time:use-time', '{"siid":12,"piid":1,"type":"urn:zhimi-spec:property:use-time:00000001:zhimi-mb3:1","description":"use-time","format":"int32","access":["read"],"unit":"seconds","valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:purify-volume', '{"siid":13,"piid":1,"type":"urn:zhimi-spec:property:purify-volume:00000001:zhimi-mb3:1","description":"purify-volume","format":"int32","access":["read"],"valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:average-aqi', '{"siid":13,"piid":2,"type":"urn:zhimi-spec:property:average-aqi:00000002:zhimi-mb3:1","description":"average-aqi","format":"int32","access":["read"],"valueRange":[0,600,1]}');
    this.addPropertyByString('aqi:average-aqi-cnt', '{"siid":13,"piid":3,"type":"urn:zhimi-spec:property:average-aqi-cnt:00000003:zhimi-mb3:1","description":"average-aqi-cnt","format":"int32","access":["read"],"valueRange":[0,2147483600,1]}');
    this.addPropertyByString('aqi:aqi-zone', '{"siid":13,"piid":4,"type":"urn:zhimi-spec:property:aqi-zone:00000004:zhimi-mb3:1","description":"aqi-zone","format":"string","access":["read"]}');
    this.addPropertyByString('aqi:sensor-state', '{"siid":13,"piid":5,"type":"urn:zhimi-spec:property:sensor-state:00000005:zhimi-mb3:1","description":"sensor-state","format":"string","access":["read"]}');
    this.addPropertyByString('aqi:aqi-goodh', '{"siid":13,"piid":6,"type":"urn:zhimi-spec:property:aqi-goodh:00000006:zhimi-mb3:1","description":"aqi-goodh","format":"int32","access":["read","write"],"valueRange":[0,115,1]}');
    this.addPropertyByString('aqi:aqi-runstate', '{"siid":13,"piid":7,"type":"urn:zhimi-spec:property:aqi-runstate:00000007:zhimi-mb3:1","description":"aqi-runstate","format":"int32","access":["read"],"valueList":[{"value":0,"description":"continuous sampling"},{"value":1,"description":"preparing sampling"},{"value":2,"description":"stop sampling"}]}');
    this.addPropertyByString('aqi:aqi-state', '{"siid":13,"piid":8,"type":"urn:zhimi-spec:property:aqi-state:00000008:zhimi-mb3:1","description":"aqi-state","format":"int32","access":["read"],"valueList":[{"value":0,"description":"best"},{"value":1,"description":"good"},{"value":2,"description":"normal"},{"value":3,"description":"bad"},{"value":4,"description":"worse"},{"value":5,"description":"unhealthy"}]}');
    this.addPropertyByString('aqi:aqi-updata-heartbeat', '{"siid":13,"piid":9,"type":"urn:zhimi-spec:property:aqi-updata-heartbeat:00000009:zhimi-mb3:1","description":"aqi-updata-heartbeat","format":"int32","access":["read","write"],"valueRange":[0,65534,1]}');
    this.addPropertyByString('rfid:rfid-tag', '{"siid":14,"piid":1,"type":"urn:zhimi-spec:property:rfid-tag:00000001:zhimi-mb3:1","description":"rfid-tag","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-factory-id', '{"siid":14,"piid":2,"type":"urn:zhimi-spec:property:rfid-factory-id:00000002:zhimi-mb3:1","description":"rfid-factory-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-product-id', '{"siid":14,"piid":3,"type":"urn:zhimi-spec:property:rfid-product-id:00000003:zhimi-mb3:1","description":"rfid-product-id","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-time', '{"siid":14,"piid":4,"type":"urn:zhimi-spec:property:rfid-time:00000004:zhimi-mb3:1","description":"rfid-time","format":"string","access":["read"]}');
    this.addPropertyByString('rfid:rfid-serial-num', '{"siid":14,"piid":5,"type":"urn:zhimi-spec:property:rfid-serial-num:00000005:zhimi-mb3:1","description":"rfid-serial-num","format":"string","access":["read"]}');
    this.addPropertyByString('others:app-extra', '{"siid":15,"piid":1,"type":"urn:zhimi-spec:property:app-extra:00000001:zhimi-mb3:1","description":"app-extra","format":"int32","access":["write","read"],"valueRange":[0,10000,1]}');
    this.addPropertyByString('others:main-channel', '{"siid":15,"piid":2,"type":"urn:zhimi-spec:property:main-channel:00000002:zhimi-mb3:1","description":"main-channel","format":"int32","access":["read","write"],"valueRange":[0,10000,1]}');
    this.addPropertyByString('others:slave-channel', '{"siid":15,"piid":3,"type":"urn:zhimi-spec:property:slave-channel:00000003:zhimi-mb3:1","description":"slave-channel","format":"int32","access":["read","write"],"valueRange":[0,10000,1]}');
    this.addPropertyByString('others:cola', '{"siid":15,"piid":4,"type":"urn:zhimi-spec:property:cola:00000004:zhimi-mb3:1","description":"cola","format":"string","access":["read","write"]}');
    this.addPropertyByString('others:buttom-door', '{"siid":15,"piid":5,"type":"urn:zhimi-spec:property:buttom-door:00000005:zhimi-mb3:1","description":"buttom-door","format":"bool","access":["read"]}');
    this.addPropertyByString('others:reboot-cause', '{"siid":15,"piid":6,"type":"urn:zhimi-spec:property:reboot-cause:00000006:zhimi-mb3:1","description":"reboot-cause","format":"int32","access":["read"],"valueList":[{"value":0,"description":"hardware reboot"},{"value":1,"description":"software reboot"},{"value":2,"description":"update reboot"},{"value":3,"description":"dog reboot"}]}');
    this.addPropertyByString('others:hw-version', '{"siid":15,"piid":8,"type":"urn:zhimi-spec:property:hw-version:00000008:zhimi-mb3:1","description":"hw-version","format":"int32","access":["read"],"valueRange":[0,66536,1]}');
    this.addPropertyByString('others:iic-error-count', '{"siid":15,"piid":9,"type":"urn:zhimi-spec:property:iic-error-count:00000009:zhimi-mb3:1","description":"iic-error-count","format":"int32","access":["read"],"valueRange":[0,66535,1]}');
    this.addPropertyByString('others:manual-level', '{"siid":15,"piid":10,"type":"urn:zhimi-spec:property:manual-level:0000000a:zhimi-mb3:1","description":"manual-level","format":"int32","access":["read"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('others:country-code', '{"siid":15,"piid":11,"type":"urn:zhimi-spec:property:country-code:00000007:zhimi-mb3:1","description":"National code","format":"int32","access":["read","write"],"valueList":[{"value":91,"description":"印度"},{"value":44,"description":"分销英文"},{"value":852,"description":"中国香港"},{"value":886,"description":"中国台湾"},{"value":82,"description":"韩国"}]}');
    this.addPropertyByString('others:temperature-unit', '{"siid":15,"piid":12,"type":"urn:zhimi-spec:property:temperature-unit:0000000b:zhimi-mb3:2","description":"temperature-unit","format":"int32","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Centigrade"},{"value":1,"description":"Fahrenheit"}]}');
    this.addPropertyByString('others:device-serial-number', '{"siid":15,"piid":13,"type":"urn:zhimi-spec:property:device-serial-number:0000000c:zhimi-mb3:2","description":"device-serial-number","format":"string","access":["read","notify"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-mb3:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('button:toggle', '{"siid":8,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:zhimi-mb3:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('button:toggle-mode', '{"siid":8,"aiid":2,"type":"urn:zhimi-spec:action:toggle-mode:00002801:zhimi-mb3:1","description":"toggle-mode","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('button:cild-lock-trigger', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:cild-lock-trigger:00005001:zhimi-mb3:1","description":"child-lock-trigger","arguments":[]}');
    this.addEventByString('filter-time:filter-eof', '{"siid":9,"eiid":1,"type":"urn:zhimi-spec:event:filter-eof:00005001:zhimi-mb3:1","description":"filter-eof","arguments":[]}');
    this.addEventByString('filter-time:filter-door-opened', '{"siid":9,"eiid":2,"type":"urn:zhimi-spec:event:filter-door-opened:00005002:zhimi-mb3:1","description":"filter-door-opened","arguments":[]}');
    this.addEventByString('others:statusreport', '{"siid":15,"eiid":1,"type":"urn:zhimi-spec:event:statusreport:00005001:zhimi-mb3:1","description":"status_report","arguments":[1]}');
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

  favoriteSpeedProp() {
    return this.getProperty('motor-speed:motor-favorite');
  }

  favoriteLevelProp() {
    return this.getProperty('motor-speed:favorite-fan-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirpurifierMb3;

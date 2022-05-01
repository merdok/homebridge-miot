const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterMa3 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Smart Baseboard Heater E';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma3:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:zhimi-ma3:1","description":"Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:countdown:0000782D:zhimi-ma3:1","description":"Countdown"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-ma3:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-ma3:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-ma3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-ma3:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:private-service:00007801:zhimi-ma3:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-ma3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-ma3:1","description":"故障","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Error"},{"value":1,"description":"NTC  Connect Error"},{"value":2,"description":"High Temperature Alarm"},{"value":3,"description":"EEPROM Error"},{"value":4,"description":"Multi Errors"}]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:zhimi-ma3:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,28,1]}');
    this.addPropertyByString('heater:mode', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-ma3:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"LL Mode"},{"value":2,"description":"HH Mode"}]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:zhimi-ma3:1","description":"倒计时","format":"uint32","access":["read","write","notify"],"unit":"seconds","valueRange":[0,43200,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":4,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-ma3:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-ma3:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-ma3:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":7,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-ma3:1","description":"亮度","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Bright"},{"value":1,"description":"Dark"},{"value":2,"description":"Extinguished"}]}');
    this.addPropertyByString('private-service:use-time', '{"siid":8,"piid":9,"type":"urn:zhimi-spec:property:use-time:00000009:zhimi-ma3:1","description":"","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,2147483647,1]}');
  }

  initDeviceActions() {
    this.addActionByString('private-service:toggle-switch', '{"siid":8,"aiid":1,"type":"urn:zhimi-spec:action:toggle-switch:00002801:zhimi-ma3:1","description":"toggle-switch","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('private-service:childlock-trig', '{"siid":8,"eiid":6,"type":"urn:zhimi-spec:event:childlock-trig:00005006:zhimi-ma3:1","description":"实现方式暂时存疑惑， 童锁状态下1s内多次连续触发次数","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiHeaterMa3;

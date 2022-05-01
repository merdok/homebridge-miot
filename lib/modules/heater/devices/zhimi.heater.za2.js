const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterZa2 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Electric Heater 1S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-za2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }
  

  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:zhimi-za2:1","description":"Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-za2:1","description":"Alarm"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:countdown:0000782D:zhimi-za2:1","description":"Countdown"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-za2:1","description":"Environment"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-za2:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-za2:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:private-service:00000001:zhimi-za2:1","description":"private-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-za2:1","description":"Device Fault","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('heater:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-temperature:00000021:zhimi-za2:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,28,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-za2:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:zhimi-za2:1","description":"定时关机时间","format":"uint32","access":["read","write","notify"],"unit":"hours","valueRange":[0,8,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":5,"piid":7,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-za2:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":5,"piid":8,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-za2:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-za2:1","description":"亮度","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,2,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-za2:1","description":"童锁功能","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('private-service:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000008:zhimi-za2:1","description":"按键点击","format":"int32","access":["notify"],"valueRange":[0,6,1]}');
    this.addPropertyByString('private-service:use-time', '{"siid":8,"piid":7,"type":"urn:zhimi-spec:property:use-time:00000001:zhimi-za2:1","description":"","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    this.addEventByString('private-service:temperature-exce', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:temperature-exce:00000003:zhimi-za2:1","description":"high temperature exception","arguments":[]}');
    this.addEventByString('private-service:thsensor-exce', '{"siid":8,"eiid":2,"type":"urn:zhimi-spec:event:thsensor-exce:00000004:zhimi-za2:1","description":"温湿度传感器异常","arguments":[]}');
    this.addEventByString('private-service:status-report', '{"siid":8,"eiid":3,"type":"urn:zhimi-spec:event:status-report:00000005:zhimi-za2:1","description":"status report","arguments":[]}');
    this.addEventByString('private-service:child-lock-trigger', '{"siid":8,"eiid":4,"type":"urn:zhimi-spec:event:child-lock-trigger:0000000E:zhimi-za2:1","description":"childlock trigger","arguments":[]}');
    this.addEventByString('private-service:eeprom-exce', '{"siid":8,"eiid":5,"type":"urn:zhimi-spec:event:eeprom-exce:00005001:zhimi-za2:1","description":"E2PROM 异常","arguments":[]}');
    this.addEventByString('private-service:ntc-exce', '{"siid":8,"eiid":6,"type":"urn:zhimi-spec:event:ntc-exce:00005002:zhimi-za2:1","description":"","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiHeaterZa2;

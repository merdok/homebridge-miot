const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterMa2 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Smart Space Heater S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:zhimi-ma2:1","description":"Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:countdown:0000782D:zhimi-ma2:1","description":"Countdown"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-ma2:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-ma2:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-ma2:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-ma2:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:private-service:00007801:zhimi-ma2:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-ma2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-ma2:1","description":"故障","format":"uint8","access":["read","notify"],"valueRange":[0,255,1]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:zhimi-ma2:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[18,28,1]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:zhimi-ma2:1","description":"倒计时","format":"uint32","access":["read","write","notify"],"unit":"hours","valueRange":[0,12,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":4,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-ma2:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-ma2:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-ma2:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":7,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-ma2:1","description":"亮度","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,1,1]}');
    this.addPropertyByString('private-service:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000001:zhimi-ma2:1","description":"","format":"uint8","access":["notify"],"valueRange":[0,4,1]}');
    this.addPropertyByString('private-service:hw-enable', '{"siid":8,"piid":8,"type":"urn:zhimi-spec:property:hw-enable:00000008:zhimi-ma2:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('private-service:use-time', '{"siid":8,"piid":9,"type":"urn:zhimi-spec:property:use-time:00000009:zhimi-ma2:1","description":"","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,2147483647,1]}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    this.addEventByString('private-service:temp-exce', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:temp-exce:00005001:zhimi-ma2:1","description":"","arguments":[]}');
    this.addEventByString('private-service:tsensor-exce', '{"siid":8,"eiid":2,"type":"urn:zhimi-spec:event:tsensor-exce:00005002:zhimi-ma2:1","description":"","arguments":[]}');
    this.addEventByString('private-service:status-report', '{"siid":8,"eiid":3,"type":"urn:zhimi-spec:event:status-report:00005003:zhimi-ma2:1","description":"状态异常上报。 目前没必要实现","arguments":[]}');
    this.addEventByString('private-service:eeprom-exce', '{"siid":8,"eiid":4,"type":"urn:zhimi-spec:event:eeprom-exce:00005004:zhimi-ma2:1","description":"","arguments":[]}');
    this.addEventByString('private-service:display-exce', '{"siid":8,"eiid":5,"type":"urn:zhimi-spec:event:display-exce:00005005:zhimi-ma2:1","description":"","arguments":[]}');
    this.addEventByString('private-service:childlock-trig', '{"siid":8,"eiid":6,"type":"urn:zhimi-spec:event:childlock-trig:00005006:zhimi-ma2:1","description":"实现方式暂时存疑惑， 童锁状态下1s内多次连续触发次数","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiHeaterMa2;

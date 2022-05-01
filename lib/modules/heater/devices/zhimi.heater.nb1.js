const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterNb1 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Smart Fan Heater';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-nb1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:zhimi-nb1:1","description":"Heater"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:countdown:0000782D:zhimi-nb1:1","description":"Countdown"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-nb1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-nb1:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-nb1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-nb1:1","description":"Environment"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:private-service:00007801:zhimi-nb1:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-nb1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"}]}');
    this.addPropertyByString('heater:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-nb1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('heater:heat-level', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:heat-level:00000047:zhimi-nb1:1","description":"Heat Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"High"},{"value":2,"description":"Low"}]}');
    this.addPropertyByString('heater:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-nb1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Fan not swing"},{"value":1,"description":"Fan swing"}]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:zhimi-nb1:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,30,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-nb1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:zhimi-nb1:1","description":"Countdown Time","format":"uint32","access":["read","write","notify"],"unit":"hours","valueRange":[0,12,1]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-nb1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"valueRange":[0,2,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-nb1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:temperature', '{"siid":9,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-nb1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('private-service:button-pressed', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:button-pressed:00000001:zhimi-nb1:1","description":"按键点击","format":"uint8","access":["notify"],"unit":"none","valueRange":[0,15,1]}');
    this.addPropertyByString('private-service:return-to-middle', '{"siid":8,"piid":3,"type":"urn:zhimi-spec:property:return-to-middle:00000003:zhimi-nb1:1","description":"","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('private-service:country-code', '{"siid":8,"piid":4,"type":"urn:zhimi-spec:property:country-code:00000002:zhimi-nb1:1","description":"country-code","format":"int32","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"未知"},{"value":1,"description":"US 美国"},{"value":82,"description":"KR 韩国"},{"value":44,"description":"EU 欧洲"},{"value":81,"description":"JP 日本"},{"value":7,"description":"RU 俄罗斯"},{"value":86,"description":"CN 中国"},{"value":852,"description":"HK 香港"},{"value":886,"description":"TW 台湾"},{"value":33,"description":"FR 法国"}]}');
    this.addPropertyByString('private-service:hw-en', '{"siid":8,"piid":5,"type":"urn:zhimi-spec:property:hw-en:00000004:zhimi-nb1:1","description":"hw-en","format":"bool","access":["read","notify","write"],"unit":"none"}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('private-service:temperature-exce', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:temperature-exce:00005001:zhimi-nb1:1","description":"","arguments":[]}');
    this.addEventByString('private-service:childlock-trig-evt', '{"siid":8,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trig-evt:00005002:zhimi-nb1:1","description":"童锁状态下，一秒5次点击。上报！如果30min内将无上报，如果30min外将第二次上报","arguments":[]}');
    this.addEventByString('private-service:ntc-exception', '{"siid":8,"eiid":3,"type":"urn:zhimi-spec:event:ntc-exception:00005003:zhimi-nb1:1","description":"ntc-exception","arguments":[]}');
    this.addEventByString('private-service:user-cover-exception', '{"siid":8,"eiid":4,"type":"urn:zhimi-spec:event:user-cover-exception:00005004:zhimi-nb1:1","description":"user-cover-exception","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  fanSwingModeValue() {
    return 1;
  }

  fanNotSwingModeValue() {
    return 0;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiHeaterNb1;

const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiFanZa5 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return "Smartmi Standing Fan 3";
  }

  getMiotSpecUrl() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za5:4";
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['fan:on', 'fan:fan-level', 'fan:horizontal-swing', 'fan:horizontal-angle',
      'fan:mode', 'fan:off-delay', 'fan:anion', 'physical-controls-locked:physical-controls-locked',
      'indicator-light:brightness', 'alarm:alarm', 'environment:relative-humidity',
      'environment:temperature', 'custom-service:battery-state', 'custom-service:speed-now',
      'custom-service:ac-state', 'custom-service:motor-status', 'custom-service:speed-level'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:zhimi-za5:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-za5:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-za5:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-za5:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-za5:1","description":"Environment"}');
    this.createServiceByString('{"siid":6,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-za5:1","description":"用户自定义服务"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-za5:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"1"},{"value":2,"description":"2"},{"value":3,"description":"3"},{"value":4,"description":"4"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:zhimi-za5:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:zhimi-za5:1","description":"Horizontal Angle","format":"uint16","access":["read","write","notify"],"unit":"none","valueRange":[30,120,1]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-za5:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Natural Wind"},{"value":1,"description":"Straight Wind"}]}');
    this.addPropertyByString('fan:off-delay', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:off-delay:00000053:zhimi-za5:1","description":"Power Off Delay","format":"uint32","access":["read","write","notify"],"unit":"none","valueRange":[0,36000,1]}');
    this.addPropertyByString('fan:anion', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:anion:00000025:zhimi-za5:1","description":"Anion","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-za5:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-za5:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-za5:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-za5:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":7,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-za5:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('custom-service:button-press', '{"siid":6,"piid":1,"type":"urn:zhimi-spec:property:button-press:00000001:zhimi-za5:1","description":"按下按键的键值","format":"uint8","access":["notify","read"],"unit":"none","valueList":[{"value":1,"description":"power"},{"value":2,"description":"swing"},{"value":0,"description":"无按键按下"}]}');
    this.addPropertyByString('custom-service:battery-state', '{"siid":6,"piid":2,"type":"urn:zhimi-spec:property:battery-state:00000002:zhimi-za5:1","description":"是否有电池","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom-service:swing-step-move', '{"siid":6,"piid":3,"type":"urn:zhimi-spec:property:swing-step-move:00000003:zhimi-za5:1","description":"设定风扇水平转动7.5度","format":"string","access":["write"]}');
    this.addPropertyByString('custom-service:speed-now', '{"siid":6,"piid":4,"type":"urn:zhimi-spec:property:speed-now:00000004:zhimi-za5:1","description":"当前扇叶实时转速，RPM。调试使用，不向用户开放。","format":"uint32","access":["read","notify"],"valueRange":[0,3000,1]}');
    this.addPropertyByString('custom-service:ac-state', '{"siid":6,"piid":5,"type":"urn:zhimi-spec:property:ac-state:00000005:zhimi-za5:1","description":"交流电是否插入","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom-service:motor-status', '{"siid":6,"piid":6,"type":"urn:zhimi-spec:property:motor-status:00000006:zhimi-za5:1","description":"马达运行状况","format":"string","access":["notify"]}');
    this.addPropertyByString('custom-service:lp-enter-second', '{"siid":6,"piid":7,"type":"urn:zhimi-spec:property:lp-enter-second:00000007:zhimi-za5:1","description":"lp-enter-second","format":"uint32","access":["write"],"unit":"seconds","valueRange":[1,3600,1]}');
    this.addPropertyByString('custom-service:speed-level', '{"siid":6,"piid":8,"type":"urn:zhimi-spec:property:speed-level:00000008:zhimi-za5:1","description":"speed-level","format":"uint8","access":["write","read","notify"],"unit":"none","valueRange":[1,100,1]}');
    this.addPropertyByString('custom-service:country-code', '{"siid":6,"piid":9,"type":"urn:zhimi-spec:property:country-code:00000009:zhimi-za5:2","description":"","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom-service:temp-sens', '{"siid":6,"piid":10,"type":"urn:zhimi-spec:property:temp-sens:0000000a:zhimi-za5:3","description":"temp-sens","format":"bool","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:fault', '{"siid":6,"eiid":1,"type":"urn:zhimi-spec:event:fault:00005001:zhimi-za5:1","description":"设备运行故障","arguments":[6]}');
    this.addEventByString('custom-service:childlock-trigger', '{"siid":6,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trigger:00005002:zhimi-za5:1","description":"childlock-trigger","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  straightWindModeValue() {
    return 1;
  }

  naturalModeValue() {
    return 0;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiFanZa5;

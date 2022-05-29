const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiFanFa1 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia DC Circulating Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-fa1:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['fan:on', 'fan:fan-level', 'fan:horizontal-swing', 'fan:horizontal-angle',
      'fan:vertical-swing', 'fan:vertical-angle', 'fan:mode', 'fan:status',
      'fan:brightness', 'fan:alarm', 'physical-controls-locked:physical-controls-locked', 'custom-service:timing',
      'custom-service:stepless-fan-level'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:zhimi-fa1:1","description":"Fan"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-fa1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":5,"type":"urn:zhimi-spec:service:custom-service:00007801:zhimi-fa1:1","description":""}');
    this.createServiceByString('{"siid":7,"type":"urn:zhimi-spec:service:custom-service:00007802:zhimi-fa1:2","description":"custom-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-fa1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-fa1:1","description":"Gear Fan Level ","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"1"},{"value":2,"description":"2"},{"value":3,"description":"3"},{"value":4,"description":"4"},{"value":5,"description":"5"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:zhimi-fa1:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:vertical-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:zhimi-fa1:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:zhimi-fa1:1","description":"Horizontal Angle","format":"uint16","access":["read","write","notify"],"unit":"none","valueRange":[0,120,1]}');
    this.addPropertyByString('fan:vertical-angle', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:vertical-angle:0000001A:zhimi-fa1:1","description":"Vertical Angle","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,90,1]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-fa1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Natural Wind"},{"value":1,"description":"Straight Wind"}]}');
    this.addPropertyByString('fan:status', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:status:00000007:zhimi-fa1:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('fan:fault', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-fa1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Nofaults"},{"value":1,"description":"Stuck"},{"value":2,"description":"2"}]}');
    this.addPropertyByString('fan:brightness', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-fa1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,1,1]}');
    this.addPropertyByString('fan:alarm', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-fa1:1","description":"Alarm","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-fa1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('physical-controls-locked:current-physical-control-lock', '{"siid":6,"piid":2,"type":"urn:miot-spec-v2:property:current-physical-control-lock:00000099:zhimi-fa1:1","description":"Current Physical Control Lock","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom-service:timing', '{"siid":5,"piid":2,"type":"urn:zhimi-spec:property:timing:00000002:zhimi-fa1:1","description":"定时","format":"uint32","access":["read","notify","write"],"unit":"hours","valueRange":[0,8,1]}');
    this.addPropertyByString('custom-service:h-swing-back', '{"siid":5,"piid":4,"type":"urn:zhimi-spec:property:h-swing-back:00000003:zhimi-fa1:1","description":"左右回正开关","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('custom-service:v-swing-back', '{"siid":5,"piid":5,"type":"urn:zhimi-spec:property:v-swing-back:00000004:zhimi-fa1:1","description":"上下回正开关","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom-service:h-swing-step-move', '{"siid":5,"piid":6,"type":"urn:zhimi-spec:property:h-swing-step-move:00000005:zhimi-fa1:1","description":"设定风扇左右转动7.5度","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('custom-service:v-swing-step-move', '{"siid":5,"piid":7,"type":"urn:zhimi-spec:property:v-swing-step-move:00000006:zhimi-fa1:1","description":"设定风扇水平转动7.5度","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('custom-service:one-key-cycle', '{"siid":5,"piid":8,"type":"urn:zhimi-spec:property:one-key-cycle:00000007:zhimi-fa1:1","description":"one-key-cycle","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('custom-service:one-key-back', '{"siid":5,"piid":9,"type":"urn:zhimi-spec:property:one-key-back:00000008:zhimi-fa1:1","description":"one-key-back","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('custom-service:stepless-fan-level', '{"siid":5,"piid":10,"type":"urn:zhimi-spec:property:stepless-fan-level:00000009:zhimi-fa1:1","description":"stepless-fan-level","format":"uint8","access":["read","notify","write"],"unit":"none","valueRange":[1,100,1]}');
    this.addPropertyByString('custom-service:toggle', '{"siid":7,"piid":1,"type":"urn:zhimi-spec:property:toggle:00000001:zhimi-fa1:2","description":"toggle","format":"bool","access":["write"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('custom-service:toggle-switch', '{"siid":7,"aiid":1,"type":"urn:zhimi-spec:action:toggle-switch:00002801:zhimi-fa1:2","description":"toggle-switch","in":[1],"out":[]}');
    this.addActionByString('custom-service:toggle-mode', '{"siid":7,"aiid":2,"type":"urn:zhimi-spec:action:toggle-mode:00002802:zhimi-fa1:2","description":"toggle-mode","in":[1],"out":[]}');
    this.addActionByString('custom-service:toggle-level', '{"siid":7,"aiid":3,"type":"urn:zhimi-spec:action:toggle-level:00002803:zhimi-fa1:2","description":"toggle-level","in":[1],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-service:stuck', '{"siid":5,"eiid":1,"type":"urn:zhimi-spec:event:stuck:00005001:zhimi-fa1:1","description":"马达卡转","arguments":[]}');
    this.addEventByString('custom-service:child-lock-trigger', '{"siid":5,"eiid":2,"type":"urn:zhimi-spec:event:child-lock-trigger:00005002:zhimi-fa1:1","description":"童锁锁定按键，1秒内大于等于5次操作","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  straightWindModeValue() {
    return 1;
  }

  naturalModeValue() {
    return 0;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('custom-service:timing');
  }

  alarmProp() {
    return this.getProperty('fan:alarm');
  }

  indicatorLightBrightnessProp() {
    return this.getProperty('fan:brightness');
  }

  speedLevelProp() {
    return this.getProperty('custom-service:stepless-fan-level');
  }

  swingStepMoveProp() {
    return this.getProperty('custom-service:h-swing-step-move');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiFanFa1;

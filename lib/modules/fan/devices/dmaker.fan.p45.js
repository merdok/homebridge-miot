const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP45 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Tower Fan 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p45:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-p45:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:dmaker-p45:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-p45:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p45:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":3,"type":"urn:dmaker-spec:service:off-delay-time:00007801:dmaker-p45:1","description":"off-delay-time"}');
    this.createServiceByString('{"siid":8,"type":"urn:dmaker-spec:service:dm-service:00007802:dmaker-p45:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p45:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-p45:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p45:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"},{"value":2,"description":"Sleep"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-p45:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:dmaker-p45:1","description":"Horizontal Swing Included Angle","format":"uint16","access":["read","write","notify"],"valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"},{"value":150,"description":"150"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p45:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p45:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p45:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('off-delay-time:off-delay-time', '{"siid":3,"piid":1,"type":"urn:dmaker-spec:property:off-delay-time:00000001:dmaker-p45:1","description":"","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('dm-service:speed-level', '{"siid":8,"piid":1,"type":"urn:dmaker-spec:property:speed-level:00000001:dmaker-p45:1","description":"","format":"uint8","access":["read","notify","write"],"valueRange":[1,100,1]}');
    this.addPropertyByString('dm-service:start-left', '{"siid":8,"piid":3,"type":"urn:dmaker-spec:property:start-left:00000003:dmaker-p45:1","description":"","format":"bool","access":["write"]}');
    this.addPropertyByString('dm-service:start-right', '{"siid":8,"piid":4,"type":"urn:dmaker-spec:property:start-right:00000004:dmaker-p45:1","description":"","format":"bool","access":["write"]}');
    this.addPropertyByString('dm-service:natural-list', '{"siid":8,"piid":5,"type":"urn:dmaker-spec:property:natural-list:00000005:dmaker-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-e', '{"siid":8,"piid":6,"type":"urn:dmaker-spec:property:natural-e:00000006:dmaker-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-f', '{"siid":8,"piid":7,"type":"urn:dmaker-spec:property:natural-f:00000007:dmaker-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-g', '{"siid":8,"piid":8,"type":"urn:dmaker-spec:property:natural-g:00000008:dmaker-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-h', '{"siid":8,"piid":9,"type":"urn:dmaker-spec:property:natural-h:00000009:dmaker-p45:1","description":"","format":"string","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:dmaker-p45:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('fan:turn-left', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:turn-left:00002886:dmaker-p45:1","description":"Turn Left","in":[],"out":[]}');
    this.addActionByString('fan:turn-right', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:turn-right:00002887:dmaker-p45:1","description":"Turn Right","in":[],"out":[]}');
    this.addActionByString('dm-service:toggle-mode', '{"siid":8,"aiid":1,"type":"urn:dmaker-spec:action:toggle-mode:00002801:dmaker-p45:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-gear', '{"siid":8,"aiid":2,"type":"urn:dmaker-spec:action:loop-gear:00002802:dmaker-p45:1","description":"loop-gear","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  straightWindModeValue() {
    return 0;
  }

  naturalModeValue() {
    return 1;
  }

  sleepModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('off-delay-time:off-delay-time');
  }

  horizontalAngleProp() {
    return this.getProperty('fan:horizontal-swing-included-angle');
  }

  speedLevelProp() {
    return this.getProperty('dm-service:speed-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerFanP45;

const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiFanP45 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return ' Xiaomi Smart Tower Fan 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:xiaomi-p45:1:0000D062';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:xiaomi-p45:1:0000D062","description":"fan"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:xiaomi-p45:1:0000D062","description":"Indicator-light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-p45:1:0000D062","description":"Alarm"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-p45:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":12,"type":"urn:miot-spec-v2:service:delay:000078BB:xiaomi-p45:1","description":"Delay"}');
    this.createServiceByString('{"siid":13,"type":"urn:xiaomi-spec:service:dm-service:00007801:xiaomi-p45:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p45:1:0000D062","description":"switch status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-p45:1:0000D062","description":"mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"},{"value":2,"description":"Sleep"}]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-p45:1:0000D062","description":"Gear Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-p45:1:0000D062","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('fan:fan-level5', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-p45:1:0000D062","description":"Stepless Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,100,1]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:xiaomi-p45:1:0000D062","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:xiaomi-p45:1:0000D062","description":"horizontal swing included angle","format":"uint8","access":["read","write","notify"],"unit":"arcdegrees","valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"},{"value":150,"description":"150"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p45:1:0000D062","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00007804:xiaomi-p45:1:0000D062","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:xiaomi-p45:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay', '{"siid":12,"piid":1,"type":"urn:miot-spec-v2:property:delay:0000014F:xiaomi-p45:1","description":"Delay","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay-time', '{"siid":12,"piid":2,"type":"urn:miot-spec-v2:property:delay-time:00000150:xiaomi-p45:1","description":"Delay Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('delay:delay-remain-time', '{"siid":12,"piid":3,"type":"urn:miot-spec-v2:property:delay-remain-time:00000151:xiaomi-p45:1","description":"Delay Remain Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('dm-service:start-left', '{"siid":13,"piid":1,"type":"urn:xiaomi-spec:property:start-left:00000001:xiaomi-p45:1","description":"","format":"bool","access":["write"]}');
    this.addPropertyByString('dm-service:start-right', '{"siid":13,"piid":2,"type":"urn:xiaomi-spec:property:start-right:00000002:xiaomi-p45:1","description":"","format":"bool","access":["write"]}');
    this.addPropertyByString('dm-service:natural-list', '{"siid":13,"piid":3,"type":"urn:xiaomi-spec:property:natural-list:00000003:xiaomi-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-e', '{"siid":13,"piid":4,"type":"urn:xiaomi-spec:property:natural-e:00000004:xiaomi-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-f', '{"siid":13,"piid":5,"type":"urn:xiaomi-spec:property:natural-f:00000005:xiaomi-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-g', '{"siid":13,"piid":6,"type":"urn:xiaomi-spec:property:natural-g:00000006:xiaomi-p45:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-h', '{"siid":13,"piid":7,"type":"urn:xiaomi-spec:property:natural-h:00000007:xiaomi-p45:1","description":"","format":"string","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:toggle:00002811:xiaomi-p45:1:0000D062","description":"toggle","in":[],"out":[]}');
    this.addActionByString('fan:turn-left', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:turn-left:00002886:xiaomi-p45:1:0000D062","description":"turn left","in":[],"out":[]}');
    this.addActionByString('fan:turn-right', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:turn-right:00002887:xiaomi-p45:1:0000D062","description":"turn right","in":[],"out":[]}');
    this.addActionByString('dm-service:toggle-mode', '{"siid":13,"aiid":1,"type":"urn:xiaomi-spec:action:toggle-mode:00002801:xiaomi-p45:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-gear', '{"siid":13,"aiid":2,"type":"urn:xiaomi-spec:action:loop-gear:00002802:xiaomi-p45:1","description":"loop-gear","in":[],"out":[]}');
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
    return this.getProperty('delay:delay-time');
  }

  horizontalAngleProp() {
    return this.getProperty('fan:horizontal-swing-included-angle');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiFanP45;

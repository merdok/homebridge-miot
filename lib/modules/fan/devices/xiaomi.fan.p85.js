const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiFanP85 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Smart Standing Fan Pro Slim';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:xiaomi-p85:1:0000D062';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:xiaomi-p85:1:0000D062","description":"fan"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:xiaomi-p85:1:0000D062","description":"Indicator-light"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-p85:1:0000D062","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-p85:1:0000D062","description":"Child Lock"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:delay:000078BB:xiaomi-p85:1:0000D062","description":"Delay"}');
    this.createServiceByString('{"siid":11,"type":"urn:xiaomi-spec:service:dm-service:00007801:xiaomi-p85:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p85:1:0000D062","description":"switch status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-p85:1:0000D062","description":"mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"}]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-p85:1:0000D062","description":"Gear Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-p85:1:0000D062","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Insufficient Power9"},{"value":2,"description":"Insufficient Power5"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:xiaomi-p85:1:0000D062","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:xiaomi-p85:1:0000D062","description":"horizontal swing included angle","format":"uint8","access":["read","write","notify"],"unit":"arcdegrees","valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p85:1:0000D062","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00007804:xiaomi-p85:1:0000D062","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:00007807:xiaomi-p85:1:0000D062","description":"Child Lock","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:delay:000078BB:xiaomi-p85:1:0000D062","description":"Delay","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay-time', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:delay-time:00000150:xiaomi-p85:1:0000D062","description":"Delay Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('delay:delay-remain-time', '{"siid":9,"piid":4,"type":"urn:miot-spec-v2:property:delay-remain-time:00000151:xiaomi-p85:1","description":"Delay Remain Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('dm-service:natural-list', '{"siid":11,"piid":1,"type":"urn:xiaomi-spec:property:natural-list:00000001:xiaomi-p85:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-i', '{"siid":11,"piid":2,"type":"urn:xiaomi-spec:property:natural-i:00000002:xiaomi-p85:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-j', '{"siid":11,"piid":3,"type":"urn:xiaomi-spec:property:natural-j:00000003:xiaomi-p85:1","description":"natural-j","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-k', '{"siid":11,"piid":4,"type":"urn:xiaomi-spec:property:natural-k:00000004:xiaomi-p85:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:natural-l', '{"siid":11,"piid":5,"type":"urn:xiaomi-spec:property:natural-l:00000005:xiaomi-p85:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:fan-level', '{"siid":11,"piid":6,"type":"urn:xiaomi-spec:property:fan-level:00000006:xiaomi-p85:1","description":"","format":"uint8","access":["read","notify","write"],"valueRange":[1,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:toggle:00002811:xiaomi-p85:1:0000D062","description":"toggle","in":[],"out":[]}');
    this.addActionByString('fan:turn-left', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:turn-left:00002886:xiaomi-p85:1","description":"Turn Left","in":[],"out":[]}');
    this.addActionByString('fan:turn-right', '{"siid":2,"aiid":7,"type":"urn:miot-spec-v2:action:turn-right:00002887:xiaomi-p85:1","description":"Turn Right","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-mode', '{"siid":11,"aiid":1,"type":"urn:xiaomi-spec:action:loop-mode:00002801:xiaomi-p85:1","description":"loop-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-gear', '{"siid":11,"aiid":2,"type":"urn:xiaomi-spec:action:loop-gear:00002802:xiaomi-p85:1","description":"loop-gear","in":[],"out":[]}');
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


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('delay:delay-time');
  }

  horizontalAngleProp() {
    return this.getProperty('fan:horizontal-swing-included-angle');
  }

  speedLevelProp() {
    return this.getProperty('dm-service:fan-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/

  // manual rotate uses the turn-left / turn-right actions instead of a step-move property
  supportsHorizontalMove() {
    return !!this.getAction('fan:turn-left') && !!this.getAction('fan:turn-right');
  }

  async moveLeft() {
    return this.fireAction('fan:turn-left');
  }

  async moveRight() {
    return this.fireAction('fan:turn-right');
  }


}

module.exports = XiaomiFanP85;

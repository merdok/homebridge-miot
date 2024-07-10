const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiFanP51 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Air Circulation Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:xiaomi-p51:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:xiaomi-p51:1","description":"Fan"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:xiaomi-p51:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-p51:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-p51:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:delay:000078BB:xiaomi-p51:1","description":"Delay"}');
    this.createServiceByString('{"siid":8,"type":"urn:xiaomi-spec:service:dm-service:00007802:xiaomi-p51:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p51:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-p51:1","description":"Gear Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-p51:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:xiaomi-p51:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:xiaomi-p51:1","description":"Horizontal Swing Included Angle","format":"uint16","access":["read","write","notify"],"valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"}]}');
    this.addPropertyByString('fan:fan-level6', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-p51:1","description":"Stepless Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,100,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-p51:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:xiaomi-p51:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:xiaomi-p51:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:delay:0000014F:xiaomi-p51:1","description":"Delay","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay-time', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:delay-time:00000150:xiaomi-p51:1","description":"Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('delay:delay-remain-time', '{"siid":9,"piid":3,"type":"urn:miot-spec-v2:property:delay-remain-time:00000151:xiaomi-p51:1","description":"Delay Remain Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,480,1]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:xiaomi-p51:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('fan:turn-left', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:turn-left:00002886:xiaomi-p51:1","description":"Turn Left","in":[],"out":[]}');
    this.addActionByString('fan:turn-right', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:turn-right:00002887:xiaomi-p51:1","description":"Turn Right","in":[],"out":[]}');
    this.addActionByString('dm-service:toggle-mode', '{"siid":8,"aiid":1,"type":"urn:xiaomi-spec:action:toggle-mode:00002801:xiaomi-p51:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-gear', '{"siid":8,"aiid":2,"type":"urn:xiaomi-spec:action:loop-gear:00002802:xiaomi-p51:1","description":"loop-gear","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiFanP51;
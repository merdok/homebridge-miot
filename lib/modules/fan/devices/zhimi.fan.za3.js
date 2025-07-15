const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiFanZa3 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Standing Fan 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za3:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:zhimi-za3:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-za3:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-za3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-za3:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:countdown:0000782D:zhimi-za3:1","description":"Countdown"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-za3:1","description":"Gear Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:zhimi-za3:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:zhimi-za3:1","description":"Horizontal Swing Included Angle","format":"uint16","access":["read","write","notify"],"valueRange":[0,120,1]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-za3:1","description":"Mode","format":"uint8","access":["read","write"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"}]}');
    this.addPropertyByString('fan:fan-level6', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-za3:1","description":"Stepless Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,100,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-za3:1","description":"Physical Control Locked","format":"bool","access":["read","write"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-za3:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-za3:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Dim"},{"value":2,"description":"Off"}]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:zhimi-za3:1","description":"Countdown Time","format":"uint32","access":["read","write","notify"],"unit":"seconds","valueRange":[0,28800,1]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:turn-left', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:turn-left:00002886:zhimi-za3:1","description":"Turn Left","in":[],"out":[]}');
    this.addActionByString('fan:turn-right', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:turn-right:00002887:zhimi-za3:1","description":"Turn Right","in":[],"out":[]}');
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


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiFanZa3;

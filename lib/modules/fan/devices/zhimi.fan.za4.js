const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiFanZa4 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Standing Fan 2s';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za4:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:zhimi-za4:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-za4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-za4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-za4:1","description":"Indicator Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-za4:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,4,1]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:zhimi-za4:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:zhimi-za4:1","description":"Horizontal Angle","format":"uint16","access":["read","write","notify"],"valueRange":[0,120,1]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-za4:1","description":"Mode","format":"uint8","access":["read","write"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-za4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-za4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-za4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
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

module.exports = ZhimiFanZa4;

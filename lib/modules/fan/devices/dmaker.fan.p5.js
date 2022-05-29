const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP5 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Fan 1X';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p5:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-p5:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p5:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:dmaker-p5:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-p5:1","description":"Alarm"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-p5:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p5:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Natural Wind"},{"value":1,"description":"Straight Wind"}]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-p5:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,4,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p5:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p5:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
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

module.exports = DmakerFanP5;

const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP11 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Standing Fan Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p11:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-p11:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:dmaker-p11:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-p11:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:motor-controller:00007832:dmaker-p11:1","description":"Motor Controller"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p11:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":3,"type":"urn:dmaker-spec:service:off-delay-time:00007801:dmaker-p11:1","description":"off-delay-time"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p11:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-p11:1","description":"Gear Fan Level ","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p11:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-p11:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:dmaker-p11:1","description":"Horizontal Angle","format":"uint16","access":["read","write","notify"],"unit":"none","valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"},{"value":140,"description":"140"}]}');
    this.addPropertyByString('fan:status', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:status:00000007:dmaker-p11:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[1,100,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p11:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p11:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('motor-controller:motor-control', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:motor-control:00000038:dmaker-p11:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"NONE"},{"value":1,"description":"LEFT"},{"value":2,"description":"RIGHT"}]}');
    this.addPropertyByString('motor-controller:fault', '{"siid":6,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:dmaker-p11:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p11:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('off-delay-time:off-delay-time', '{"siid":3,"piid":1,"type":"urn:dmaker-spec:property:off-delay-time:00000001:dmaker-p11:1","description":"off-delay-time","format":"uint16","access":["write","read","notify"],"unit":"none","valueRange":[0,480,1]}');
  }

  initDeviceActions() {
    this.addActionByString('off-delay-time:toggle', '{"siid":3,"aiid":1,"type":"urn:dmaker-spec:action:toggle:00002801:dmaker-p11:1","description":"toggle","in":[],"out":[]}');
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

  moveLeftValue() {
    return 1;
  }

  moveRightValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('off-delay-time:off-delay-time');
  }

  swingStepMoveProp() {
    return this.getProperty('motor-controller:motor-control');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerFanP11;

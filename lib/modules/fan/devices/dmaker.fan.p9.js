const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP9 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Tower Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p9:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-p9:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p9:1","description":"Physical Control Locked"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p9:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-p9:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p9:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"},{"value":2,"description":"Sleep"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-p9:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:dmaker-p9:1","description":"Horizontal Angle","format":"uint16","access":["read","write","notify"],"unit":"none","valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"},{"value":150,"description":"150"}]}');
    this.addPropertyByString('fan:alarm', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p9:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:off-delay-time', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:dmaker-p9:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('fan:brightness', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:brightness:0000000D:dmaker-p9:1","description":"Brightness","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('fan:motor-control', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:motor-control:00000038:dmaker-p9:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"None"},{"value":1,"description":"Left"},{"value":2,"description":"Right"}]}');
    this.addPropertyByString('fan:speed-level', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:speed-level:00000023:dmaker-p9:1","description":"Speed Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[1,100,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p9:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:dmaker-p9:1","description":"Toggle","in":[],"out":[]}');
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

  moveLeftValue() {
    return 1;
  }

  moveRightValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('fan:off-delay-time');
  }

  alarmProp() {
    return this.getProperty('fan:alarm');
  }

  indicatorLightBrightnessProp() {
    return this.getProperty('fan:brightness');
  }

  speedLevelProp() {
    return this.getProperty('fan:speed-level');
  }

  swingStepMoveProp() {
    return this.getProperty('fan:motor-control');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerFanP9;

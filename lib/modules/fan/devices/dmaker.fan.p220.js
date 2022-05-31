const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP220 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia DC Inverter Circulating Floor Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p220:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-p220:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:dmaker-p220:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-p220:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p220:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:temperature-humidity-sensor:00007814:dmaker-p220:1","description":"Temperature Humidity Sensor"}');
    this.createServiceByString('{"siid":3,"type":"urn:dmaker-spec:service:off-delay-time:00007801:dmaker-p220:1","description":"off-delay-time"}');
    this.createServiceByString('{"siid":8,"type":"urn:dmaker-spec:service:dm-service:00007802:dmaker-p220:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p220:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-p220:1","description":"Gear Fan Level ","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p220:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Natural Wind"},{"value":2,"description":"Smart"},{"value":3,"description":"Sleep"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-p220:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:dmaker-p220:1","description":"Horizontal Swing Included Angle","format":"uint16","access":["read","write","notify"],"valueList":[{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":90,"description":"90"},{"value":120,"description":"120"},{"value":140,"description":"140"}]}');
    this.addPropertyByString('fan:vertical-swing', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:dmaker-p220:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:vertical-swing-included-angle', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:vertical-swing-included-angle:0000011A:dmaker-p220:1","description":"Vertical Swing Included Angle","format":"uint8","access":["read","write","notify"],"valueList":[{"value":35,"description":"35"},{"value":65,"description":"65"},{"value":95,"description":"95"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p220:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p220:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p220:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('temperature-humidity-sensor:temperature', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:temperature:00000020:dmaker-p220:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,45,0.1]}');
    this.addPropertyByString('temperature-humidity-sensor:relative-humidity', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:dmaker-p220:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('off-delay-time:off-delay-time', '{"siid":3,"piid":1,"type":"urn:dmaker-spec:property:off-delay-time:00000001:dmaker-p220:1","description":"off-delay-time","format":"uint16","access":["write","read","notify"],"valueRange":[0,720,1]}');
    this.addPropertyByString('dm-service:speed-level', '{"siid":8,"piid":1,"type":"urn:dmaker-spec:property:speed-level:00000001:dmaker-p220:1","description":"speed-level","format":"uint8","access":["write","read","notify"],"valueRange":[1,100,1]}');
    this.addPropertyByString('dm-service:swing-updown-manual', '{"siid":8,"piid":2,"type":"urn:dmaker-spec:property:swing-updown-manual:00000002:dmaker-p220:1","description":"swing-updown-manual","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"NONE"},{"value":1,"description":"UP"},{"value":2,"description":"DOWN"}]}');
    this.addPropertyByString('dm-service:swing-lr-manual', '{"siid":8,"piid":3,"type":"urn:dmaker-spec:property:swing-lr-manual:00000003:dmaker-p220:1","description":"swing-lr-manual","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"NONE"},{"value":1,"description":"LEFT"},{"value":2,"description":"RIGHT"}]}');
    this.addPropertyByString('dm-service:on', '{"siid":8,"piid":4,"type":"urn:dmaker-spec:property:on:00000004:dmaker-p220:1","description":"on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:temperature', '{"siid":8,"piid":5,"type":"urn:dmaker-spec:property:temperature:00000005:dmaker-p220:1","description":"temperature","format":"uint8","access":["read","notify","write"],"unit":"celsius","valueRange":[15,36,1]}');
    this.addPropertyByString('dm-service:off', '{"siid":8,"piid":6,"type":"urn:dmaker-spec:property:off:00000006:dmaker-p220:1","description":"off","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:temperature7', '{"siid":8,"piid":7,"type":"urn:dmaker-spec:property:temperature:00000007:dmaker-p220:1","description":"temperature","format":"uint8","access":["read","notify","write"],"unit":"celsius","valueRange":[14,35,1]}');
    this.addPropertyByString('dm-service:swing-all', '{"siid":8,"piid":8,"type":"urn:dmaker-spec:property:swing-all:00000008:dmaker-p220:1","description":"swing-all","format":"bool","access":["write"]}');
  }

  initDeviceActions() {
    this.addActionByString('off-delay-time:toggle', '{"siid":3,"aiid":1,"type":"urn:dmaker-spec:action:toggle:00002801:dmaker-p220:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('dm-service:toggle-mode', '{"siid":8,"aiid":1,"type":"urn:dmaker-spec:action:toggle-mode:00002801:dmaker-p220:1","description":"toggle-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-gear', '{"siid":8,"aiid":2,"type":"urn:dmaker-spec:action:loop-gear:00002802:dmaker-p220:1","description":"loop-gear","in":[],"out":[]}');
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
    return 3;
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
    return this.getProperty('dm-service:swing-lr-manual');
  }

  temperatureProp() {
    return this.getProperty('temperature-humidity-sensor:temperature');
  }

  relativeHumidityProp() {
    return this.getProperty('temperature-humidity-sensor:relative-humidity');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerFanP220;

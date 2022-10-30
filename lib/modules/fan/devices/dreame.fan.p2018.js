const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DreameFanP2018 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Smart Purifying Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dreame-p2018:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dreame-p2018:1","description":"Fan"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dreame-p2018:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:countdown:0000782D:dreame-p2018:1","description":"Countdown"}');
    this.createServiceByString('{"siid":12,"type":"urn:miot-spec-v2:service:alarm:00007804:dreame-p2018:1","description":"Alarm"}');
    this.createServiceByString('{"siid":13,"type":"urn:miot-spec-v2:service:screen:00007806:dreame-p2018:1","description":"Screen"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:environment:0000780A:dreame-p2018:1","description":"Environment"}');
    this.createServiceByString('{"siid":15,"type":"urn:miot-spec-v2:service:filter:0000780B:dreame-p2018:1","description":"Filter"}');
    this.createServiceByString('{"siid":11,"type":"urn:dreame-spec:service:other:00007801:dreame-p2018:1","description":"other"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dreame-p2018:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dreame-p2018:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[1,100,1]}');
    this.addPropertyByString('fan:horizontal-angle', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:horizontal-angle:00000019:dreame-p2018:1","description":"Horizontal Angle","format":"int16","access":["read","write","notify"],"unit":"arcdegress","valueRange":[-75,75,1]}');
    this.addPropertyByString('fan:fault', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:fault:00000009:dreame-p2018:1","description":"Device Fault","format":"uint16","access":["read","notify"],"valueList":[{"value":0,"description":"NORMAL"},{"value":1,"description":"MOTOR FAULT CUR"},{"value":2,"description":"MOTOR FAULT VOL"},{"value":3,"description":"MOTOR FAULT TEMP"},{"value":4,"description":"MOTOR FAULT LACK"},{"value":5,"description":"MOTOR FAULT BLOCK"},{"value":6,"description":"MOTOR FAULT SHORT"},{"value":7,"description":"MOTOR FAULT LOSE"},{"value":8,"description":"DUMP FAULT"},{"value":9,"description":"STEP FAULT"}]}');
    this.addPropertyByString('fan:wind-reverse', '{"siid":2,"piid":17,"type":"urn:miot-spec-v2:property:wind-reverse:00000117:dreame-p2018:1","description":"Wind Reverse","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":18,"type":"urn:miot-spec-v2:property:mode:00000008:dreame-p2018:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Straight Wind"},{"value":2,"description":"Natural Wind"},{"value":3,"description":"Smart"},{"value":4,"description":"Circular Wind"},{"value":5,"description":"Purification"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":19,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dreame-p2018:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:horizontal-swing-included-angle', '{"siid":2,"piid":20,"type":"urn:miot-spec-v2:property:horizontal-swing-included-angle:0000011B:dreame-p2018:1","description":"Horizontal Swing Included Angle","format":"uint16","access":["read","write","notify"],"valueList":[{"value":30,"description":"30 Angle Swing"},{"value":60,"description":"60 Angle Swing"},{"value":90,"description":"90 Angle Swing"},{"value":120,"description":"120 Angle Swing"},{"value":150,"description":"150 Angle Swing"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dreame-p2018:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:dreame-p2018:1","description":"Countdown Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,2400,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":12,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dreame-p2018:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:on', '{"siid":13,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dreame-p2018:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:temperature', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:temperature:00000020:dreame-p2018:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":14,"piid":2,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:dreame-p2018:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":14,"piid":3,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:dreame-p2018:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:pm10-density', '{"siid":14,"piid":4,"type":"urn:miot-spec-v2:property:pm10-density:00000035:dreame-p2018:1","description":"PM10 Density","format":"float","access":["read","notify"],"valueRange":[0,1000,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":15,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:dreame-p2018:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('other:real-angle', '{"siid":11,"piid":3,"type":"urn:dreame-spec:property:real-angle:00000003:dreame-p2018:1","description":"real-angle","format":"int16","access":["read","notify"],"unit":"arcdegress","valueRange":[-75,75,1]}');
    this.addPropertyByString('other:debug', '{"siid":11,"piid":4,"type":"urn:dreame-spec:property:debug:00000002:dreame-p2018:1","description":"debug","format":"bool","access":["write"]}');
    this.addPropertyByString('other:on-off', '{"siid":11,"piid":5,"type":"urn:dreame-spec:property:on-off:00000001:dreame-p2018:1","description":"on-off","format":"bool","access":["write"]}');
    this.addPropertyByString('other:reset', '{"siid":11,"piid":6,"type":"urn:dreame-spec:property:reset:00000004:dreame-p2018:1","description":"reset","format":"bool","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DreameFanP2018;

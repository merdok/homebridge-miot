const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshowHumidifierJsq1 extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mijia Pure Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:leshow-jsq1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:leshow-jsq1:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:leshow-jsq1:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:leshow-jsq1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:leshow-spec:service:device:00007801:leshow-jsq1:1","description":"device"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:leshow-jsq1:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('humidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:leshow-jsq1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"NULL"},{"value":1,"description":"Hydropenia"},{"value":2,"description":"Overflow"},{"value":4,"description":"Slant"},{"value":8,"description":"Communication"},{"value":3,"description":"Humidity"}]}');
    this.addPropertyByString('humidifier:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:leshow-jsq1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Const Humidity"},{"value":1,"description":"Strong"},{"value":2,"description":"Sleep"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-humidity:00000022:leshow-jsq1:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[40,70,1]}');
    this.addPropertyByString('humidifier:water-level', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:water-level:0000003D:leshow-jsq1:2","description":"Water Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:leshow-jsq1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:leshow-jsq1:1","description":"Alarm","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('device:water-level', '{"siid":8,"piid":1,"type":"urn:leshow-spec:property:water-level:00000001:leshow-jsq1:1","description":"water-level","format":"uint8","access":["notify","read"],"unit":"none","valueRange":[0,128,1]}');
    this.addPropertyByString('device:tsms-turn-off', '{"siid":8,"piid":2,"type":"urn:leshow-spec:property:tsms-turn-off:00000002:leshow-jsq1:1","description":"tsms-turn-off","format":"uint32","access":["notify","read"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('device:turn-off-dry-turn', '{"siid":8,"piid":3,"type":"urn:leshow-spec:property:turn-off-dry-turn:00000003:leshow-jsq1:1","description":"turn-off-dry-turn","format":"bool","access":["write","read","notify"],"unit":"none"}');
    this.addPropertyByString('device:tsms-dry-turn-off', '{"siid":8,"piid":5,"type":"urn:leshow-spec:property:tsms-dry-turn-off:00000005:leshow-jsq1:1","description":"tsms-dry-turn-off","format":"uint32","access":[],"unit":"minutes","valueList":[{"value":0,"description":"180"}]}');
    this.addPropertyByString('device:screen-brightness', '{"siid":8,"piid":6,"type":"urn:leshow-spec:property:screen-brightness:00000006:leshow-jsq1:1","description":"screen-brightness","format":"uint8","access":[],"unit":"none","valueRange":[0,1,1]}');
    this.addPropertyByString('device:water-percentage', '{"siid":8,"piid":7,"type":"urn:leshow-spec:property:water-percentage:00000007:leshow-jsq1:1","description":"water-percentage","format":"uint8","access":[],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('device:warm-wind-turn', '{"siid":8,"piid":9,"type":"urn:leshow-spec:property:warm-wind-turn:00000008:leshow-jsq1:1","description":"warm-wind-turn","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('device:mode', '{"siid":8,"piid":10,"type":"urn:leshow-spec:property:mode:00000009:leshow-jsq1:1","description":"mode","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Const Humidity"},{"value":1,"description":"Strong"},{"value":2,"description":"Sleep"}]}');
    this.addPropertyByString('device:turn-ovp', '{"siid":8,"piid":11,"type":"urn:leshow-spec:property:turn-ovp:00000004:leshow-jsq1:2","description":"turn-ovp","format":"uint8","access":["read","notify","write"],"valueRange":[0,3,1]}');
    this.addPropertyByString('device:ntc-over-push', '{"siid":8,"piid":12,"type":"urn:leshow-spec:property:ntc-over-push:0000000a:leshow-jsq1:2","description":"ntc-over-push","format":"uint8","access":["notify","read"],"valueRange":[0,1,1]}');
    this.addPropertyByString('device:dry-turn', '{"siid":8,"piid":13,"type":"urn:leshow-spec:property:dry-turn:0000000b:leshow-jsq1:2","description":"dry-turn","format":"uint8","access":["read","notify","write"],"valueRange":[0,1,1]}');
    this.addPropertyByString('device:overwetting', '{"siid":8,"piid":14,"type":"urn:leshow-spec:property:overwetting:0000000c:leshow-jsq1:2","description":"overwetting","format":"uint8","access":["read","notify"],"valueRange":[0,1,1]}');
  }

  initDeviceActions() {
    this.addActionByString('humidifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:leshow-jsq1:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('device:mode-toggle', '{"siid":8,"aiid":1,"type":"urn:leshow-spec:action:mode-toggle:00002801:leshow-jsq1:1","description":"mode-toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LeshowHumidifierJsq1;

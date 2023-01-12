const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerHumidifierP2 extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mijia Pure Smart Humidifier 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:dmaker-p2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:dmaker-p2:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:dmaker-p2:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-p2:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-p2:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:screen:00007806:dmaker-p2:1","description":"Screen"}');
    this.createServiceByString('{"siid":7,"type":"urn:dmaker-spec:service:dm-service:00007801:dmaker-p2:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:dmaker-p2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Moto Fault"},{"value":2,"description":"Pump Fault"},{"value":3,"description":"Low Water Fault"},{"value":4,"description":"Th Fault"},{"value":5,"description":"Full Water Fault"}]}');
    this.addPropertyByString('humidifier:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-p2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Constant Humidity"},{"value":1,"description":"Sleep"},{"value":2,"description":"Strong"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-humidity:00000022:dmaker-p2:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[40,70,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:dmaker-p2:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[10,99,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:dmaker-p2:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,45,0.1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-p2:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-p2:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:on', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-p2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":8,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:dmaker-p2:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Dim"},{"value":1,"description":"Normal"}]}');
    this.addPropertyByString('dm-service:off-delay-time', '{"siid":7,"piid":1,"type":"urn:dmaker-spec:property:off-delay-time:00000001:dmaker-p2:1","description":"off-delay-time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('dm-service:water-status', '{"siid":7,"piid":2,"type":"urn:dmaker-spec:property:water-status:00000002:dmaker-p2:1","description":"water-status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Low-water"},{"value":2,"description":"Full-water"}]}');
    this.addPropertyByString('dm-service:water-level', '{"siid":7,"piid":3,"type":"urn:dmaker-spec:property:water-level:00000003:dmaker-p2:1","description":"water-level","format":"uint8","access":["read","notify"],"valueRange":[0,16,1]}');
    this.addPropertyByString('dm-service:over-wet-protect', '{"siid":7,"piid":4,"type":"urn:dmaker-spec:property:over-wet-protect:00000004:dmaker-p2:1","description":"over-wet-protect","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:fan-dry-time', '{"siid":7,"piid":5,"type":"urn:dmaker-spec:property:fan-dry-time:00000005:dmaker-p2:1","description":"fan-dry-time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,90,1]}');
  }

  initDeviceActions() {
    this.addActionByString('humidifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:dmaker-p2:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-mode', '{"siid":7,"aiid":1,"type":"urn:dmaker-spec:action:loop-mode:00002801:dmaker-p2:1","description":"loop-mode","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  waterLevelProp() {
    return this.getProperty('dm-service:water-level');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerHumidifierP2;

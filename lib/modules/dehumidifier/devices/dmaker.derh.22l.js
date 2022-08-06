const DehumidifierDevice = require('../DehumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerDerh22l extends DehumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Smart Dehumidifier 22L';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:dehumidifier:0000A02D:dmaker-22l:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:dehumidifier:00007841:dmaker-22l:1","description":"Dehumidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:dmaker-22l:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:dmaker-22l:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:dmaker-22l:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-22l:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":7,"type":"urn:dmaker-spec:service:dm-service:00007801:dmaker-22l:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('dehumidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-22l:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('dehumidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:dmaker-22l:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Water Full"},{"value":2,"description":"Sensor Fault1"},{"value":3,"description":"Sensor Fault2"},{"value":4,"description":"Communication Fault1"},{"value":5,"description":"Filter Clean"},{"value":6,"description":"Defrost"},{"value":7,"description":"Fan Motor"},{"value":8,"description":"Overload"},{"value":9,"description":"Lack Of Refrigerant"}]}');
    this.addPropertyByString('dehumidifier:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-22l:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Smart"},{"value":1,"description":"Sleep"},{"value":2,"description":"Clothes Drying"}]}');
    this.addPropertyByString('dehumidifier:target-humidity', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-humidity:00000022:dmaker-22l:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[30,70,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:dmaker-22l:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:dmaker-22l:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-22l:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-22l:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:mode', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-22l:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Half"},{"value":2,"description":"Full"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-22l:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('dm-service:off-delay-time', '{"siid":7,"piid":1,"type":"urn:dmaker-spec:property:off-delay-time:00000001:dmaker-22l:1","description":"off-delay-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('dm-service:dry-after-off', '{"siid":7,"piid":2,"type":"urn:dmaker-spec:property:dry-after-off:00000002:dmaker-22l:1","description":"dry-after-off","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:dry-left-time', '{"siid":7,"piid":3,"type":"urn:dmaker-spec:property:dry-left-time:00000003:dmaker-22l:1","description":"dry-left-time","format":"uint16","access":["read","notify"],"unit":"seconds","valueRange":[0,2400,1]}');
    this.addPropertyByString('dm-service:is-warming-up', '{"siid":7,"piid":4,"type":"urn:dmaker-spec:property:is-warming-up:00000004:dmaker-22l:1","description":"is-warming-up","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('dm-service:toggle', '{"siid":7,"aiid":1,"type":"urn:dmaker-spec:action:toggle:00002801:dmaker-22l:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-mode', '{"siid":7,"aiid":2,"type":"urn:dmaker-spec:action:loop-mode:00002802:dmaker-22l:1","description":"loop-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:reset-filter', '{"siid":7,"aiid":3,"type":"urn:dmaker-spec:action:reset-filter:00002803:dmaker-22l:1","description":"reset-filter","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('dm-service:tank-full', '{"siid":7,"eiid":1,"type":"urn:dmaker-spec:event:tank-full:00005001:dmaker-22l:1","description":"tank-full","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerDerh22l;

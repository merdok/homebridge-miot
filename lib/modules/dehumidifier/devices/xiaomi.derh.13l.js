const DehumidifierDevice = require('../DehumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiDerh13l extends DehumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Dehumidifier 13L';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:dehumidifier:0000A02D:xiaomi-13l:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:dehumidifier:00007841:xiaomi-13l:1","description":"Dehumidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:xiaomi-13l:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-13l:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:xiaomi-13l:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:xiaomi-13l:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:delay:000078BB:xiaomi-13l:1","description":"Delay"}');
    this.createServiceByString('{"siid":7,"type":"urn:xiaomi-spec:service:dm-service:00007801:xiaomi-13l:1","description":"dm-service"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('dehumidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-13l:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('dehumidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-13l:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Water Full"},{"value":2,"description":"Sensor Fault1"},{"value":3,"description":"Sensor Fault2"},{"value":4,"description":"Communication Fault1"},{"value":5,"description":"Filter Clean"},{"value":6,"description":"Defrost"},{"value":7,"description":"Fan Motor"},{"value":8,"description":"Overload"},{"value":9,"description":"Lack Of Refrigerant"}]}');
    this.addPropertyByString('dehumidifier:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-13l:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Smart"},{"value":1,"description":"Sleep"},{"value":2,"description":"Clothes Drying"}]}');
    this.addPropertyByString('dehumidifier:target-humidity', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-humidity:00000022:xiaomi-13l:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[30,70,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:xiaomi-13l:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:xiaomi-13l:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:xiaomi-13l:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-13l:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:mode', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-13l:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Half"},{"value":2,"description":"Full"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:xiaomi-13l:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:delay:0000014F:xiaomi-13l:1","description":"Delay","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('delay:delay-time', '{"siid":8,"piid":2,"type":"urn:miot-spec-v2:property:delay-time:00000150:xiaomi-13l:1","description":"Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('delay:delay-remain-time', '{"siid":8,"piid":3,"type":"urn:miot-spec-v2:property:delay-remain-time:00000151:xiaomi-13l:1","description":"Delay Remain Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('dm-service:dry-after-off', '{"siid":7,"piid":1,"type":"urn:xiaomi-spec:property:dry-after-off:00000001:xiaomi-13l:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('dm-service:dry-left-time', '{"siid":7,"piid":2,"type":"urn:xiaomi-spec:property:dry-left-time:00000002:xiaomi-13l:1","description":"","format":"uint16","access":["read","notify"],"unit":"seconds","valueRange":[0,2400,1]}');
    this.addPropertyByString('dm-service:is-warming-up', '{"siid":7,"piid":3,"type":"urn:xiaomi-spec:property:is-warming-up:00000003:xiaomi-13l:1","description":"","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('dm-service:toggle', '{"siid":7,"aiid":1,"type":"urn:xiaomi-spec:action:toggle:00002801:xiaomi-13l:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('dm-service:loop-mode', '{"siid":7,"aiid":2,"type":"urn:xiaomi-spec:action:loop-mode:00002802:xiaomi-13l:1","description":"loop-mode","in":[],"out":[]}');
    this.addActionByString('dm-service:reset-filter', '{"siid":7,"aiid":3,"type":"urn:xiaomi-spec:action:reset-filter:00002803:xiaomi-13l:1","description":"reset-filter","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('dm-service:tank-full', '{"siid":7,"eiid":1,"type":"urn:xiaomi-spec:event:tank-full:00005001:xiaomi-13l:1","description":"tank-full","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiDerh13l;
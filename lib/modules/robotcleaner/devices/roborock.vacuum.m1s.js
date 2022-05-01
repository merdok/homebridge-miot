const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoborockVacuumM1s extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Robot 1S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-m1s:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:roborock-m1s:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:identify:0000782C:roborock-m1s:1","description":"Identify"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:battery:00007805:roborock-m1s:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:mode:00000008:roborock-m1s:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Silent"},{"value":2,"description":"Basic"},{"value":3,"description":"Strong"},{"value":4,"description":"Full Speed"}]}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:room-ids:00000073:roborock-m1s:1","description":"Room IDs","format":"string","access":[]}');
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:roborock-m1s:2","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":2,"description":"Sleep"},{"value":3,"description":"Idle"},{"value":5,"description":"Sweeping"},{"value":6,"description":"Go Charging"},{"value":7,"description":"Remote Control"},{"value":8,"description":"Charging"},{"value":9,"description":"Charging Error"},{"value":10,"description":"Paused"},{"value":11,"description":"Part Sweeping"},{"value":12,"description":"Error"},{"value":14,"description":"Update"},{"value":15,"description":"Rub Back"},{"value":16,"description":"Go Where"},{"value":17,"description":"Zone Sweeping"},{"value":18,"description":"Select Sweeping"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:roborock-m1s:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:roborock-m1s:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:roborock-m1s:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:roborock-m1s:1","description":"Start Room Sweep","in":[2],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:roborock-m1s:1","description":"Identify","in":[],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:roborock-m1s:1","description":"Start Charge","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 5;
  }

  statusIdleValue() {
    return 3;
  }

  statusPausedValue() {
    return 10;
  }

  statusErrorValue() {
    return 12;
  }

  statusGoChargingValue() {
    return 6;
  }

  statusChargingValue() {
    return 8;
  }

  statusSleepValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = RoborockVacuumM1s;

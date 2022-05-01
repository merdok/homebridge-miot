const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoborockVacuumS5e extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Roborock S5 MAX';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-s5e:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:roborock-s5e:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:roborock-s5e:1","description":"Battery"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:identify:0000782C:roborock-s5e:1","description":"Identify"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:roborock-s5e:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":2,"description":"Off"},{"value":3,"description":"Idle"},{"value":5,"description":"Sweeping"},{"value":6,"description":"Go Charging"},{"value":7,"description":"Remote Control"},{"value":8,"description":"Charging"},{"value":9,"description":"Charging Error"},{"value":10,"description":"Paused"},{"value":11,"description":"Partial Sweeping"},{"value":12,"description":"Error"},{"value":14,"description":"Updating"},{"value":15,"description":"Back Sweeping"},{"value":16,"description":"Target Sweeping"},{"value":17,"description":"Area Sweeping"},{"value":18,"description":"Selected Sweeping"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:roborock-s5e:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":101,"description":"Silent"},{"value":102,"description":"Basic"},{"value":103,"description":"Strong"},{"value":104,"description":"Full Speed"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:roborock-s5e:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:roborock-s5e:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:roborock-s5e:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:roborock-s5e:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:roborock-s5e:1","description":"Identify","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 2;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 4;
  }

  statusErrorValue() {
    return 7;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 3;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = RoborockVacuumS5e;

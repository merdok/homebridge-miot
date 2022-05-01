const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiVacuumV10 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Robot Vacuum Mop P';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v10:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:viomi-v10:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:viomi-v10:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:viomi-v10:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Sleep"},{"value":1,"description":"Idle"},{"value":2,"description":"Paused"},{"value":3,"description":"Sweeping"},{"value":4,"description":"Go Charging"},{"value":5,"description":"Charging"},{"value":6,"description":"Sweeping and Mopping"},{"value":7,"description":"Mopping"},{"value":8,"description":"Updating"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:viomi-v10:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Silent"},{"value":1,"description":"Medium"},{"value":2,"description":"Basic"},{"value":3,"description":"Strong"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:viomi-v10:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:viomi-v10:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:viomi-v10:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-sweep-mop', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-sweep-mop:00002835:viomi-v10:1","description":"Start Sweep Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-mop', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:start-mop:00002834:viomi-v10:1","description":"Start Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:pause-sweeping', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:pause-sweeping:00002805:viomi-v10:1","description":"Pause Sweeping","in":[],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:viomi-v10:1","description":"Start Charge","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 3;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 2;
  }

  statusGoChargingValue() {
    return 4;
  }

  statusChargingValue() {
    return 5;
  }

  statusMopppingValue() {
    return 7;
  }

  statusUpdatingValue() {
    return 8;
  }

  statusSleepValue() {
    return 0;
  }

  statusSweepingAndMoppingValue() {
    return 6;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ViomiVacuumV10;

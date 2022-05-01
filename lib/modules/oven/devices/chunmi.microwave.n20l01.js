const OvenDevice = require('../OvenDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiMicrowaveN20l01 extends OvenDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Microwave Oven';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:microwave-oven:0000A032:chunmi-n20l01:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }
  

  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:microwave-oven:00007843:chunmi-n20l01:1","description":"Microwave Oven"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:chunmi-n20l01:1","description":"Physical Control Locked"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('microwave-oven:left-time', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:left-time:0000003C:chunmi-n20l01:1","description":"Left Time","format":"uint16","access":["read"],"unit":"seconds","valueRange":[0,3960,1]}');
    this.addPropertyByString('microwave-oven:status', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-n20l01:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"},{"value":3,"description":"Delay"},{"value":4,"description":"Fault"},{"value":5,"description":"Paused"},{"value":6,"description":"Completed"}]}');
    this.addPropertyByString('microwave-oven:heat-level', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:heat-level:00000047:chunmi-n20l01:1","description":"Heat Level","format":"uint8","access":["read","notify"],"valueRange":[0,5,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:chunmi-n20l01:1","description":"Physical Control Locked","format":"bool","access":["read","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('microwave-oven:pause', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:pause:0000280C:chunmi-n20l01:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('microwave-oven:start-cook', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:start-cook:00002806:chunmi-n20l01:1","description":"Start Cook","in":[],"out":[]}');
    this.addActionByString('microwave-oven:cancel-cooking', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-n20l01:1","description":"Cancel Cooking","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 2;
  }

  statusDelayValue() {
    return 3;
  }

  statusFaultValue() {
    return 4;
  }

  statusPausedValue() {
    return 5;
  }

  statusCompletedValue() {
    return 6;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  statusProp() {
    return this.getProperty('microwave-oven:status');
  }

  leftTimeProp() {
    return this.getProperty('microwave-oven:left-time');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/

  startCookAction() {
    return this.getAction('microwave-oven:start-cook');
  }

  cancelCookAction() {
    return this.getAction('microwave-oven:cancel-cooking');
  }

  pauseCookAction() {
    return this.getAction('microwave-oven:pause');
  }


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiMicrowaveN20l01;

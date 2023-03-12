const AirConditionerDevice = require('../AirConditionerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class MiirAirconditionIr02 extends AirConditionerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'IR AC Remote Control';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:miir-ir02:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:ir-aircondition-control:00007824:miir-ir02:1","description":"IR Aircondition Control"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('ir-aircondition-control:ir-mode', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:ir-mode:0000004C:miir-ir02:1","description":"Mode for IR","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Cool"},{"value":2,"description":"Dry"},{"value":3,"description":"Heat"},{"value":4,"description":"Fan"}]}');
    this.addPropertyByString('ir-aircondition-control:ir-temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:ir-temperature:0000004D:miir-ir02:1","description":"Temperature for IR","format":"float","access":["write"],"unit":"celsius","valueRange":[16,30,1]}');
  }

  initDeviceActions() {
    this.addActionByString('ir-aircondition-control:fan-speed-down', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:fan-speed-down:0000281C:miir-ir02:1","description":"Fan Speed Down","in":[],"out":[]}');
    this.addActionByString('ir-aircondition-control:fan-speed-up', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:fan-speed-up:0000281B:miir-ir02:1","description":"Fan Speed Up","in":[],"out":[]}');
    this.addActionByString('ir-aircondition-control:temperature-down', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:temperature-down:0000281E:miir-ir02:1","description":"Temperature Down","in":[],"out":[]}');
    this.addActionByString('ir-aircondition-control:temperature-up', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:temperature-up:0000281D:miir-ir02:1","description":"Temperature Up","in":[],"out":[]}');
    this.addActionByString('ir-aircondition-control:turn-off', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:turn-off:00002809:miir-ir02:1","description":"Turn Off","in":[],"out":[]}');
    this.addActionByString('ir-aircondition-control:turn-on', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:turn-on:00002808:miir-ir02:1","description":"Turn On","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = MiirAirconditionIr02;
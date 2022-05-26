const AirerDevice = require('../AirerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class HydAirerZnlyj1 extends AirerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'MIJIA Smart Clothes Dryer';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:airer:00007817:hyd-znlyj1:1","description":"Airer"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:light:00007802:hyd-znlyj1:1","description":"Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('airer:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:hyd-znlyj1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Obstruction"},{"value":2,"description":"Overweight"},{"value":3,"description":"Overheated"}]}');
    this.addPropertyByString('airer:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:hyd-znlyj1:1","description":"Motor Control","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Up"},{"value":2,"description":"Down"}]}');
    this.addPropertyByString('airer:current-position', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:current-position:00000039:hyd-znlyj1:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,2,1]}');
    this.addPropertyByString('airer:status', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:hyd-znlyj1:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Stopped"},{"value":1,"description":"Up"},{"value":2,"description":"Down"},{"value":3,"description":"Pause"}]}');
    this.addPropertyByString('light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:hyd-znlyj1:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:hyd-znlyj1:2","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusStoppedValue() {
    return 0;
  }

  statusUpValue() {
    return 1;
  }

  statusDownValue() {
    return 2;
  }

  statusPauseValue() {
    return 3;
  }

  faultObstructionValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = HydAirerZnlyj1;

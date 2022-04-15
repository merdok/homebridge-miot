const AirerDevice = require('../AirerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class HydAirerZnlyj2 extends AirerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Smart Clothes Drying Rack';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj2:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return [];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:airer:00007817:hyd-znlyj2:1","description":"Airer"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:light:00007802:hyd-znlyj2:1","description":"Light"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:airer:00007817:hyd-znlyj2:2","description":"Airer"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('airer:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:hyd-znlyj2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Obstruction"},{"value":2,"description":"Overweight"},{"value":3,"description":"Overheated"}]}');
    this.addPropertyByString('airer:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:hyd-znlyj2:1","description":"Motor Control","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Up"},{"value":2,"description":"Down"}]}');
    this.addPropertyByString('airer:current-position', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:current-position:00000039:hyd-znlyj2:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,2,1]}');
    this.addPropertyByString('airer:status', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:hyd-znlyj2:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Stopped"},{"value":1,"description":"Up"},{"value":2,"description":"Down"},{"value":3,"description":"Pause"}]}');
    this.addPropertyByString('airer:target-position', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-position:0000003A:hyd-znlyj2:2","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,49,1]}');
    this.addPropertyByString('airer:target-position6', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-position:0000003A:hyd-znlyj2:2","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[51,100,1]}');
    this.addPropertyByString('airer:on', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:on:00000006:hyd-znlyj2:2","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:hyd-znlyj2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer4:fault', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:hyd-znlyj2:2","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('airer4:motor-control', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:hyd-znlyj2:2","description":"Motor Control","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Pause"}]}');
    this.addPropertyByString('airer4:on', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:on:00000006:hyd-znlyj2:2","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer4:status', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:hyd-znlyj2:2","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('airer4:mode', '{"siid":4,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:hyd-znlyj2:2","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('airer4:target-position', '{"siid":4,"piid":6,"type":"urn:miot-spec-v2:property:target-position:0000003A:hyd-znlyj2:2","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('airer4:current-position', '{"siid":4,"piid":7,"type":"urn:miot-spec-v2:property:current-position:00000039:hyd-znlyj2:2","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('airer4:dryer', '{"siid":4,"piid":8,"type":"urn:miot-spec-v2:property:dryer:00000027:hyd-znlyj2:2","description":"Dryer","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer4:drying-level', '{"siid":4,"piid":9,"type":"urn:miot-spec-v2:property:drying-level:0000003B:hyd-znlyj2:2","description":"Drying Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"}]}');
    this.addPropertyByString('airer4:left-time', '{"siid":4,"piid":10,"type":"urn:miot-spec-v2:property:left-time:0000003C:hyd-znlyj2:2","description":"Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('airer4:uv', '{"siid":4,"piid":11,"type":"urn:miot-spec-v2:property:uv:00000029:hyd-znlyj2:2","description":"UV","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer4:anion', '{"siid":4,"piid":12,"type":"urn:miot-spec-v2:property:anion:00000025:hyd-znlyj2:2","description":"Anion","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer4:drying-time', '{"siid":4,"piid":13,"type":"urn:miot-spec-v2:property:drying-time:0000006A:hyd-znlyj2:2","description":"Drying Time","format":"uint8","access":["read","write","notify"],"unit":"minutes","valueRange":[0,120,30]}');
    this.addPropertyByString('airer4:motion-end-position', '{"siid":4,"piid":14,"type":"urn:miot-spec-v2:property:motion-end-position:00000115:hyd-znlyj2:2","description":"Motion End Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[51,100,1]}');
    this.addPropertyByString('airer4:motion-start-position', '{"siid":4,"piid":15,"type":"urn:miot-spec-v2:property:motion-start-position:00000114:hyd-znlyj2:2","description":"Motion Start Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,49,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = HydAirerZnlyj2;

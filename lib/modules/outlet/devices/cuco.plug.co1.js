const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCo1 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund Smart Wall Plug';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-co1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-co1:1","description":"Switch"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:cuco-co1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":7,"type":"urn:cuco-spec:service:setting:00007802:cuco-co1:1","description":"setting"}');
    this.createServiceByString('{"siid":8,"type":"urn:cuco-spec:service:cycle:00007801:cuco-co1:2","description":"cycle"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-co1:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:cuco-co1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('setting:light', '{"siid":7,"piid":1,"type":"urn:cuco-spec:property:light:00000001:cuco-co1:1","description":"light","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('setting:memory', '{"siid":7,"piid":2,"type":"urn:cuco-spec:property:memory:00000002:cuco-co1:1","description":"memory","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"On"},{"value":1,"description":"Off"},{"value":2,"description":"Memory"}]}');
    this.addPropertyByString('setting:mode', '{"siid":7,"piid":3,"type":"urn:cuco-spec:property:mode:00000003:cuco-co1:2","description":"mode","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('setting:start-time', '{"siid":7,"piid":4,"type":"urn:cuco-spec:property:start-time:00000004:cuco-co1:2","description":"start-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('setting:end-time', '{"siid":7,"piid":5,"type":"urn:cuco-spec:property:end-time:00000005:cuco-co1:2","description":"end-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('cycle:status', '{"siid":8,"piid":1,"type":"urn:cuco-spec:property:status:00000001:cuco-co1:2","description":"status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('cycle:data-value', '{"siid":8,"piid":2,"type":"urn:cuco-spec:property:data-value:00000002:cuco-co1:2","description":"data-value","format":"string","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-co1:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  indicatorLightOnProp() {
    return this.getProperty('setting:light');
  }

  offMemoryProp() {
    return this.getProperty('setting:memory');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoPlugCo1;

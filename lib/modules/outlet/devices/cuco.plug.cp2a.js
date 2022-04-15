const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp2a extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund CP2-AM';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp2a:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp2a:1","description":"Switch"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:cuco-cp2a:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:switch:00007801:cuco-cp2a:1","description":"switch"}');
    this.createServiceByString('{"siid":4,"type":"urn:cuco-spec:service:switch:00007802:cuco-cp2a:1","description":"switch"}');
    this.createServiceByString('{"siid":7,"type":"urn:cuco-spec:service:setting:00007804:cuco-cp2a:1","description":"setting"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp2a:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:cuco-cp2a:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp2a:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch3:status', '{"siid":3,"piid":2,"type":"urn:cuco-spec:property:status:00000002:cuco-cp2a:2","description":"status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch3:data-value', '{"siid":3,"piid":3,"type":"urn:cuco-spec:property:data-value:00000003:cuco-cp2a:2","description":"data-value","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('switch4:on', '{"siid":4,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp2a:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch4:status', '{"siid":4,"piid":2,"type":"urn:cuco-spec:property:status:00000002:cuco-cp2a:2","description":"status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch4:data-value', '{"siid":4,"piid":3,"type":"urn:cuco-spec:property:data-value:00000003:cuco-cp2a:2","description":"data-value","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('setting:light', '{"siid":7,"piid":1,"type":"urn:cuco-spec:property:light:00000001:cuco-cp2a:1","description":"light","format":"bool","access":["notify","write","read"]}');
    this.addPropertyByString('setting:memory', '{"siid":7,"piid":2,"type":"urn:cuco-spec:property:memory:00000002:cuco-cp2a:1","description":"memory","format":"int8","access":["read","notify","write"],"valueList":[{"value":0,"description":"On"},{"value":1,"description":"Off"},{"value":2,"description":"Memory"}]}');
    this.addPropertyByString('setting:mode', '{"siid":7,"piid":3,"type":"urn:cuco-spec:property:mode:00000003:cuco-cp2a:2","description":"mode","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('setting:start-time', '{"siid":7,"piid":4,"type":"urn:cuco-spec:property:start-time:00000004:cuco-cp2a:2","description":"start-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('setting:end-time', '{"siid":7,"piid":5,"type":"urn:cuco-spec:property:end-time:00000005:cuco-cp2a:2","description":"end-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[1,1440,1]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-cp2a:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('switch3:toggle', '{"siid":3,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp2a:2","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch4:toggle', '{"siid":4,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp2a:2","description":"toggle","in":[],"out":[]}');
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

module.exports = CucoPlugCp2a;

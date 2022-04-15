const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugSp5 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund Smart Power Strip';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-sp5:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-sp5:1","description":"Switch"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-sp5:1","description":"USB Switch Status"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:cuco-sp5:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:switch:00007801:cuco-sp5:1","description":"switch"}');
    this.createServiceByString('{"siid":4,"type":"urn:cuco-spec:service:switch:00007802:cuco-sp5:1","description":"switch"}');
    this.createServiceByString('{"siid":5,"type":"urn:cuco-spec:service:switch:00007803:cuco-sp5:1","description":"switch"}');
    this.createServiceByString('{"siid":6,"type":"urn:cuco-spec:service:switch:00007804:cuco-sp5:1","description":"switch"}');
    this.createServiceByString('{"siid":9,"type":"urn:cuco-spec:service:custome:00007805:cuco-sp5:1","description":"custome"}');
    this.createServiceByString('{"siid":10,"type":"urn:cuco-spec:service:indicator-light:00007806:cuco-sp5:3","description":"indicator-light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-sp5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch7:on', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-sp5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:cuco-sp5:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-sp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch4:on', '{"siid":4,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-sp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch5:on', '{"siid":5,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-sp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch6:on', '{"siid":6,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-sp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custome:off-memory', '{"siid":9,"piid":1,"type":"urn:cuco-spec:property:off-memory:00000001:cuco-sp5:1","description":"off-memory","format":"bool","access":["notify","write","read"],"unit":"none"}');
    this.addPropertyByString('custome:off-manager', '{"siid":9,"piid":2,"type":"urn:cuco-spec:property:off-manager:00000002:cuco-sp5:3","description":"off-manager","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Line-On"},{"value":1,"description":"Line-Off"},{"value":2,"description":"Line-Memory"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":10,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-sp5:3","description":"on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('indicator-light:mode', '{"siid":10,"piid":2,"type":"urn:cuco-spec:property:mode:00000002:cuco-sp5:3","description":"mode","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('indicator-light:start-time', '{"siid":10,"piid":3,"type":"urn:cuco-spec:property:start-time:00000003:cuco-sp5:3","description":"start-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('indicator-light:end-time', '{"siid":10,"piid":4,"type":"urn:cuco-spec:property:end-time:00000004:cuco-sp5:3","description":"end-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-sp5:2","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('switch3:toggle', '{"siid":3,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-sp5:2","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch4:toggle', '{"siid":4,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-sp5:2","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch5:toggle', '{"siid":5,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-sp5:2","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch6:toggle', '{"siid":6,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-sp5:2","description":"toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoPlugSp5;

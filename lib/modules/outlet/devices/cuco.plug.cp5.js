const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp5 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund Smart Power Strip';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp5:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp5:1","description":"Switch"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp5:1","description":"USB Switch Status"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:cuco-cp5:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:switch:00007801:cuco-cp5:1","description":"switch"}');
    this.createServiceByString('{"siid":4,"type":"urn:cuco-spec:service:switch:00007802:cuco-cp5:1","description":"switch"}');
    this.createServiceByString('{"siid":5,"type":"urn:cuco-spec:service:switch:00007803:cuco-cp5:1","description":"switch"}');
    this.createServiceByString('{"siid":6,"type":"urn:cuco-spec:service:switch:00007804:cuco-cp5:1","description":"switch"}');
    this.createServiceByString('{"siid":9,"type":"urn:cuco-spec:service:custome:00007805:cuco-cp5:1","description":"custome"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch7:on', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:cuco-cp5:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch4:on', '{"siid":4,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch5:on', '{"siid":5,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch6:on', '{"siid":6,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custome:off-memory', '{"siid":9,"piid":1,"type":"urn:cuco-spec:property:off-memory:00000001:cuco-cp5:1","description":"off-memory","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"On"},{"value":1,"description":"Off"},{"value":2,"description":"Memory"}]}');
    this.addPropertyByString('custome:indicator-light', '{"siid":9,"piid":2,"type":"urn:cuco-spec:property:indicator-light:00000002:cuco-cp5:1","description":"indicator-light","format":"bool","access":["read","notify","write"]}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  indicatorLightOnProp() {
    return this.getProperty('custome:indicator-light');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoPlugCp5;

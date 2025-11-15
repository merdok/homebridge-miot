const DiffuserDevice = require('../DiffuserDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiDiffuserXw2iv extends DiffuserDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Smart Scent Diffuser';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:diffuser:0000A01E:xiaomi-xw2iv:2:0000C82B';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:diffuser:00007833:xiaomi-xw2iv:1:0000C82B","description":"Diffuser"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:ambient-light:0000789D:xiaomi-xw2iv:1","description":"Ambient Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:battery:00007805:xiaomi-xw2iv:1","description":"Battery"}');
    this.createServiceByString('{"siid":4,"type":"urn:xiaomi-spec:service:other:00007801:xiaomi-xw2iv:1","description":"other"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('diffuser:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-xw2iv:1:0000C82B","description":"Device Fault","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('diffuser:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-xw2iv:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('diffuser:fragrance-out-time', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:fragrance-out-time:0000017F:xiaomi-xw2iv:1","description":"Fragrance Out Time","format":"uint8","access":["read","write","notify"],"unit":"seconds","valueRange":[2,6,1]}');
    this.addPropertyByString('diffuser:fragrance-out-time4', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fragrance-out-time:0000017F:xiaomi-xw2iv:1","description":"Fragrance Out Time","format":"uint8","access":["read","write","notify"],"unit":"minutes","valueRange":[10,20,5]}');
    this.addPropertyByString('ambient-light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-xw2iv:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('ambient-light:brightness', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:xiaomi-xw2iv:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('ambient-light:color', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:color:0000000E:xiaomi-xw2iv:1","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[0,16777215,1]}');
    this.addPropertyByString('battery:battery-level', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:xiaomi-xw2iv:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,5]}');
    this.addPropertyByString('battery:charging-state', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:xiaomi-xw2iv:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not Charging"},{"value":3,"description":"Not Chargeable"}]}');
    this.addPropertyByString('other:auto-fragrance', '{"siid":4,"piid":1,"type":"urn:xiaomi-spec:property:auto-fragrance:00000001:xiaomi-xw2iv:1","description":"","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('other:auto-light', '{"siid":4,"piid":2,"type":"urn:xiaomi-spec:property:auto-light:00000002:xiaomi-xw2iv:1","description":"","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('other:light-auto-off', '{"siid":4,"piid":3,"type":"urn:xiaomi-spec:property:light-auto-off:00000003:xiaomi-xw2iv:2","description":"light-auto-off","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('other:fragrance-delivery', '{"siid":4,"aiid":1,"type":"urn:xiaomi-spec:action:fragrance-delivery:00002801:xiaomi-xw2iv:1","description":"fragrance-delivery","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('other:auto-light', '{"siid":4,"eiid":1,"type":"urn:xiaomi-spec:event:auto-light:00005001:xiaomi-xw2iv:1","description":"auto-light","arguments":[]}');
    this.addEventByString('other:auto-fragrance', '{"siid":4,"eiid":2,"type":"urn:xiaomi-spec:event:auto-fragrance:00005002:xiaomi-xw2iv:1","description":"auto-fragrance","arguments":[]}');
    this.addEventByString('other:someone-move', '{"siid":4,"eiid":3,"type":"urn:xiaomi-spec:event:someone-move:00005003:xiaomi-xw2iv:1","description":"someone-move","arguments":[]}');
    this.addEventByString('other:nobody-move', '{"siid":4,"eiid":4,"type":"urn:xiaomi-spec:event:nobody-move:00005004:xiaomi-xw2iv:1","description":"nobody-move","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiDiffuserXw2iv;

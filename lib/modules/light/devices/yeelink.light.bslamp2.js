const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightBslamp2 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Bedside Lamp 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-bslamp2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-bslamp2:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:yeelink-spec:service:light-extension:00000001:yeelink-bslamp2:1","description":"Light Extension Feature"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-bslamp2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-bslamp2:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-bslamp2:1","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[1700,6500,1]}');
    this.addPropertyByString('light:color', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:color:0000000E:yeelink-bslamp2:1","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[1,16777215,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-bslamp2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Color"},{"value":2,"description":"Day"}]}');
    this.addPropertyByString('light:saturability', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:saturability:00000011:yeelink-bslamp2:1","description":"Saturability","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('light-extension:brightness-delta', '{"siid":3,"piid":1,"type":"urn:yeelink-spec:property:brightness-delta:00000002:yeelink-bslamp2:1","description":"Adjust brightness","format":"int8","access":["write"],"unit":"percentage","valueRange":[-100,100,1]}');
    this.addPropertyByString('light-extension:ct-delta', '{"siid":3,"piid":2,"type":"urn:yeelink-spec:property:ct-delta:00000003:yeelink-bslamp2:1","description":"Adjust Color Temperature","format":"int8","access":["write"],"unit":"percentage","valueRange":[-100,100,1]}');
    this.addPropertyByString('light-extension:ct-adjust-alexa', '{"siid":3,"piid":3,"type":"urn:yeelink-spec:property:ct-adjust-alexa:00000004:yeelink-bslamp2:1","description":"Alexa Adjust Color Temperature","format":"uint8","access":["write"],"valueList":[{"value":1,"description":"Increase"},{"value":2,"description":"Decrease"}]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-bslamp2:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightBslamp2;

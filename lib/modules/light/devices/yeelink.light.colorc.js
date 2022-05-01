const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightColorc extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight RGB LED Bulb';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-colorc:1:0000C814';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-colorc:1:0000C814","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-colorc:1:0000C814","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-colorc:1:0000C814","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-colorc:1:0000C814","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:color', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:color:0000000E:yeelink-colorc:1:0000C814","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[1,16777215,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-colorc:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Color"},{"value":2,"description":"Ct"}]}');
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

module.exports = YeelinkLightColorc;

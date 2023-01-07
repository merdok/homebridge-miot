const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightCeilc extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Arwen';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-ceilc:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-ceilc:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:ambient-light:0000789D:yeelink-ceilc:1","description":"Ambient Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-ceilc:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-ceilc:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Day"},{"value":1,"description":"Night"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-ceilc:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-ceilc:1","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('ambient-light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-ceilc:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('ambient-light:mode', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-ceilc:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"RGB"},{"value":3,"description":"HSV"}]}');
    this.addPropertyByString('ambient-light:brightness', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-ceilc:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('ambient-light:color-temperature', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-ceilc:1","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[1700,6500,1]}');
    this.addPropertyByString('ambient-light:color', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:color:0000000E:yeelink-ceilc:1","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[1,16777215,1]}');
    this.addPropertyByString('ambient-light:saturability', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:saturability:00000011:yeelink-ceilc:1","description":"Saturability","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('ambient-light:flow', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:flow:00000010:yeelink-ceilc:1","description":"Flow","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"NOFLOW"},{"value":1,"description":"FLOWING"}]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-ceilc:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('light:brightness-up', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:brightness-up:00002828:yeelink-ceilc:1","description":"Brightness Up","in":[],"out":[]}');
    this.addActionByString('light:brightness-down', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:brightness-down:00002829:yeelink-ceilc:1","description":"Brightness Down","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightCeilc;

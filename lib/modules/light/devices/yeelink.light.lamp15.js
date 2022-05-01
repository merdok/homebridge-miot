const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightLamp15 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Led Screen Light Bar Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-lamp15:2:0000C814';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-lamp15:1:0000C814","description":""}');
    this.createServiceByString('{"siid":3,"type":"urn:yeelink-spec:service:yeelight:00007801:yeelink-lamp15:2","description":"yeelight"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-lamp15:1:0000C814","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-lamp15:1:0000C814","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-lamp15:1:0000C814","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:color', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:color:0000000E:yeelink-lamp15:1:0000C814","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[1,16777215,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-lamp15:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":2,"description":"Ct"}]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-lamp15:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('yeelight:toggle', '{"siid":3,"aiid":1,"type":"urn:yeelink-spec:action:toggle:00002801:yeelink-lamp15:2","description":"toggle","in":[],"out":[]}');
    this.addActionByString('yeelight:brightness-up', '{"siid":3,"aiid":2,"type":"urn:yeelink-spec:action:brightness-up:00002802:yeelink-lamp15:2","description":"brightness-up","in":[],"out":[]}');
    this.addActionByString('yeelight:brightness-down', '{"siid":3,"aiid":3,"type":"urn:yeelink-spec:action:brightness-down:00002803:yeelink-lamp15:2","description":"brightness-down","in":[],"out":[]}');
    this.addActionByString('yeelight:ct-up', '{"siid":3,"aiid":4,"type":"urn:yeelink-spec:action:ct-up:00002804:yeelink-lamp15:2","description":"ct-up","in":[],"out":[]}');
    this.addActionByString('yeelight:ct-down', '{"siid":3,"aiid":5,"type":"urn:yeelink-spec:action:ct-down:00002805:yeelink-lamp15:2","description":"ct-down","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightLamp15;

const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoLightSl4a extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'NiteBird SL4';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:cuco-sl4a:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:cuco-sl4a:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:scene:00007801:cuco-sl4a:1","description":"scene"}');
    this.createServiceByString('{"siid":4,"type":"urn:cuco-spec:service:music:00007802:cuco-sl4a:1","description":"music"}');
    this.createServiceByString('{"siid":5,"type":"urn:cuco-spec:service:collection:00007803:cuco-sl4a:1","description":"collection"}');
    this.createServiceByString('{"siid":6,"type":"urn:cuco-spec:service:version-two:00007804:cuco-sl4a:2","description":"version-two"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-sl4a:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:cuco-sl4a:1","description":"Mode","format":"int8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Noe"},{"value":1,"description":"Color"},{"value":2,"description":"Scene"},{"value":3,"description":"Musice"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:cuco-sl4a:1","description":"Brightness","format":"int16","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:color:0000000E:cuco-sl4a:1","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[0,16777215,1]}');
    this.addPropertyByString('scene:mode', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:mode:00000001:cuco-sl4a:1","description":"","format":"int8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Work"},{"value":1,"description":"Night"},{"value":2,"description":"Soft"},{"value":3,"description":"Colorful"},{"value":4,"description":"Sport"},{"value":5,"description":"Summer"},{"value":6,"description":"Warm"},{"value":7,"description":"Cold Light"},{"value":-1,"description":"No Choose"}]}');
    this.addPropertyByString('scene:change-type', '{"siid":3,"piid":2,"type":"urn:cuco-spec:property:change-type:00000002:cuco-sl4a:1","description":"","format":"int8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Static"},{"value":1,"description":"Gradient"},{"value":2,"description":"Breathe"}]}');
    this.addPropertyByString('scene:brightness', '{"siid":3,"piid":3,"type":"urn:cuco-spec:property:brightness:00000003:cuco-sl4a:1","description":"","format":"int16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('scene:color', '{"siid":3,"piid":4,"type":"urn:cuco-spec:property:color:00000004:cuco-sl4a:1","description":"color","format":"uint32","access":["read","notify","write"],"unit":"rgb","valueRange":[0,16777215,1]}');
    this.addPropertyByString('scene:change-speed', '{"siid":3,"piid":5,"type":"urn:cuco-spec:property:change-speed:00000005:cuco-sl4a:1","description":"","format":"int16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('scene:default-color', '{"siid":3,"piid":6,"type":"urn:cuco-spec:property:default-color:00000006:cuco-sl4a:1","description":"default-color","format":"string","access":["read","notify","write"],"unit":"rgb"}');
    this.addPropertyByString('music:swich', '{"siid":4,"piid":1,"type":"urn:cuco-spec:property:swich:00000001:cuco-sl4a:1","description":"swich","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('collection:list', '{"siid":5,"piid":1,"type":"urn:cuco-spec:property:list:00000001:cuco-sl4a:1","description":"list","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('collection:add', '{"siid":5,"piid":2,"type":"urn:cuco-spec:property:add:00000002:cuco-sl4a:1","description":"add","format":"int8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Work"},{"value":1,"description":"Night"},{"value":2,"description":"Soft"},{"value":3,"description":"Colorful"},{"value":4,"description":"Sport"},{"value":5,"description":"Summer"},{"value":6,"description":"Warm"},{"value":7,"description":"Cold Light"}]}');
    this.addPropertyByString('version-two:delay-open', '{"siid":6,"piid":1,"type":"urn:cuco-spec:property:delay-open:00000001:cuco-sl4a:2","description":"delay-open","format":"uint16","access":["write","read","notify"],"unit":"minutes","valueRange":[1,60,1]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-sl4a:2","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('scene:reset', '{"siid":3,"aiid":1,"type":"urn:cuco-spec:action:reset:00002801:cuco-sl4a:1","description":"reset","in":[],"out":[]}');
    this.addActionByString('version-two:bright-add', '{"siid":6,"aiid":1,"type":"urn:cuco-spec:action:bright-add:00002801:cuco-sl4a:2","description":"bright-add","in":[],"out":[]}');
    this.addActionByString('version-two:bright-less', '{"siid":6,"aiid":2,"type":"urn:cuco-spec:action:bright-less:00002802:cuco-sl4a:2","description":"bright-less","in":[],"out":[]}');
    this.addActionByString('version-two:open-or-bright', '{"siid":6,"aiid":3,"type":"urn:cuco-spec:action:open-or-bright:00002803:cuco-sl4a:2","description":"open-or-bright","in":[],"out":[]}');
    this.addActionByString('version-two:open-or-color', '{"siid":6,"aiid":4,"type":"urn:cuco-spec:action:open-or-color:00002804:cuco-sl4a:2","description":"open-or-color","in":[],"out":[]}');
    this.addActionByString('version-two:bright-toggle', '{"siid":6,"aiid":5,"type":"urn:cuco-spec:action:bright-toggle:00002805:cuco-sl4a:2","description":"bright-toggle","in":[],"out":[]}');
    this.addActionByString('version-two:color-toggle', '{"siid":6,"aiid":6,"type":"urn:cuco-spec:action:color-toggle:00002806:cuco-sl4a:2","description":"color-toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoLightSl4a;

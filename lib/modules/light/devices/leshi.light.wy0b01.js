const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshiLightWy0b01 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Scenario WIFI Dual Color Light';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:leshi-wy0b01:2:0000C802';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:leshi-wy0b01:1:0000C802","description":""}');
    this.createServiceByString('{"siid":3,"type":"urn:leshi-spec:service:scene:00007801:leshi-wy0b01:1","description":"scene"}');
    this.createServiceByString('{"siid":4,"type":"urn:leshi-spec:service:default:00007802:leshi-wy0b01:1","description":"default"}');
    this.createServiceByString('{"siid":8,"type":"urn:leshi-spec:service:remote:00007806:leshi-wy0b01:1","description":"remote"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:leshi-wy0b01:1:0000C802","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:leshi-wy0b01:1:0000C802","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:leshi-wy0b01:1:0000C802","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[3000,6400,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:leshi-wy0b01:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"WYmode"},{"value":4,"description":"Day"},{"value":5,"description":"Night"},{"value":7,"description":"Warmth"},{"value":8,"description":"Tv"},{"value":9,"description":"Reading"},{"value":10,"description":"Computer"},{"value":11,"description":"Hospitality"},{"value":12,"description":"Entertainment"},{"value":13,"description":"Wakeup"},{"value":14,"description":"Dusk"},{"value":15,"description":"Sleeping"}]}');
    this.addPropertyByString('scene:on-off', '{"siid":3,"piid":1,"type":"urn:leshi-spec:property:on-off:00000001:leshi-wy0b01:1","description":"on-off","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:brightness-add', '{"siid":3,"piid":2,"type":"urn:leshi-spec:property:brightness-add:00000002:leshi-wy0b01:1","description":"","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:brightness-dec', '{"siid":3,"piid":3,"type":"urn:leshi-spec:property:brightness-dec:00000003:leshi-wy0b01:1","description":"","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:brightness-switch', '{"siid":3,"piid":4,"type":"urn:leshi-spec:property:brightness-switch:00000004:leshi-wy0b01:1","description":"brightness-switch","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:on-or-brightness', '{"siid":3,"piid":5,"type":"urn:leshi-spec:property:on-or-brightness:00000005:leshi-wy0b01:1","description":"on-or-brightness","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:colortemperature-add', '{"siid":3,"piid":6,"type":"urn:leshi-spec:property:colortemperature-add:00000006:leshi-wy0b01:1","description":"colortemperature-add","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:colortemperature-dec', '{"siid":3,"piid":7,"type":"urn:leshi-spec:property:colortemperature-dec:00000007:leshi-wy0b01:1","description":"colortemperature-dec","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:colortemperature-sw', '{"siid":3,"piid":8,"type":"urn:leshi-spec:property:colortemperature-sw:00000008:leshi-wy0b01:1","description":"colortemperature-sw","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('scene:on-or-colortemp', '{"siid":3,"piid":9,"type":"urn:leshi-spec:property:on-or-colortemp:00000009:leshi-wy0b01:1","description":"on-or-colortemp","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('default:default', '{"siid":4,"piid":1,"type":"urn:leshi-spec:property:default:00000001:leshi-wy0b01:1","description":"default","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"通电默认记忆"},{"value":1,"description":"通电默认开灯"}]}');
    this.addPropertyByString('default:user-save', '{"siid":4,"piid":2,"type":"urn:leshi-spec:property:user-save:00000002:leshi-wy0b01:1","description":"user-save","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"OFF"},{"value":1,"description":"ON"}]}');
    this.addPropertyByString('default:dimming', '{"siid":4,"piid":3,"type":"urn:leshi-spec:property:dimming:00000003:leshi-wy0b01:1","description":"dimming","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"渐变变化"},{"value":1,"description":"立变变化"}]}');
    this.addPropertyByString('default:inteligent-switch', '{"siid":4,"piid":4,"type":"urn:leshi-spec:property:inteligent-switch:00000004:leshi-wy0b01:1","description":"inteligent-switch","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('default:night-switch', '{"siid":4,"piid":5,"type":"urn:leshi-spec:property:night-switch:00000005:leshi-wy0b01:1","description":"night-switch","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"OFF"},{"value":1,"description":"ON"}]}');
    this.addPropertyByString('default:delay', '{"siid":4,"piid":6,"type":"urn:leshi-spec:property:delay:00000006:leshi-wy0b01:1","description":"delay","format":"uint8","access":["write"],"unit":"minutes","valueRange":[1,60,1]}');
    this.addPropertyByString('default:ac', '{"siid":4,"piid":7,"type":"urn:leshi-spec:property:ac:00000007:leshi-wy0b01:2","description":"ac","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('remote:remote-switch', '{"siid":8,"piid":1,"type":"urn:leshi-spec:property:remote-switch:00000001:leshi-wy0b01:1","description":"remote-switch","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"OFF"},{"value":1,"description":"ON"}]}');
    this.addPropertyByString('remote:remote-add', '{"siid":8,"piid":2,"type":"urn:leshi-spec:property:remote-add:00000002:leshi-wy0b01:1","description":"remote-add","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"Remote-add"}]}');
    this.addPropertyByString('remote:remote-del', '{"siid":8,"piid":3,"type":"urn:leshi-spec:property:remote-del:00000003:leshi-wy0b01:1","description":"remote-del","format":"int32","access":["write"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-ltype', '{"siid":8,"piid":4,"type":"urn:leshi-spec:property:remote-ltype:00000004:leshi-wy0b01:1","description":"remote-ltype","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-htype', '{"siid":8,"piid":5,"type":"urn:leshi-spec:property:remote-htype:00000005:leshi-wy0b01:1","description":"remote-htype","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-a', '{"siid":8,"piid":6,"type":"urn:leshi-spec:property:remote-a:00000006:leshi-wy0b01:1","description":"remote-a","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-b', '{"siid":8,"piid":7,"type":"urn:leshi-spec:property:remote-b:00000007:leshi-wy0b01:1","description":"remote-b","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-c', '{"siid":8,"piid":8,"type":"urn:leshi-spec:property:remote-c:00000008:leshi-wy0b01:1","description":"remote-c","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-d', '{"siid":8,"piid":9,"type":"urn:leshi-spec:property:remote-d:00000009:leshi-wy0b01:1","description":"remote-d","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-e', '{"siid":8,"piid":10,"type":"urn:leshi-spec:property:remote-e:0000000a:leshi-wy0b01:1","description":"remote-e","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-f', '{"siid":8,"piid":11,"type":"urn:leshi-spec:property:remote-f:0000000b:leshi-wy0b01:1","description":"remote-f","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-g', '{"siid":8,"piid":12,"type":"urn:leshi-spec:property:remote-g:0000000c:leshi-wy0b01:1","description":"remote-g","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-h', '{"siid":8,"piid":13,"type":"urn:leshi-spec:property:remote-h:0000000d:leshi-wy0b01:1","description":"remote-h","format":"int32","access":["read","notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-cmd', '{"siid":8,"piid":14,"type":"urn:leshi-spec:property:remote-cmd:0000000e:leshi-wy0b01:1","description":"remote-cmd","format":"int32","access":["notify"],"unit":"none","valueRange":[-2147483648,2147483647,1]}');
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

module.exports = LeshiLightWy0b01;

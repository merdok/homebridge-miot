const CeilingFanDevice = require('../CeilingFanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl8 extends CeilingFanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Fan Light L4';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl8:1:0000C802';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['light:on', 'light:brightness', 'light:color-temperature', 'light:mode',
      'fan:on', 'fan:fan-level', 'fan:mode'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-fancl8:1:0000C802","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan:00007808:yeelink-fancl8:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:yeelink-spec:service:scene:00007801:yeelink-fancl8:1","description":"scene"}');
    this.createServiceByString('{"siid":5,"type":"urn:yeelink-spec:service:function:00007802:yeelink-fancl8:1","description":"function"}');
    this.createServiceByString('{"siid":6,"type":"urn:yeelink-spec:service:remote:00007803:yeelink-fancl8:1","description":"remote"}');
    this.createServiceByString('{"siid":7,"type":"urn:yeelink-spec:service:ambient-light:00007804:yeelink-fancl8:1","description":"ambient-light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl8:1:0000C802","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-fancl8:1:0000C802","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-fancl8:1:0000C802","description":"Color Temperature","format":"uint16","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,5300,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl8:1:0000C802","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"None"},{"value":4,"description":"Day"},{"value":5,"description":"Night"},{"value":7,"description":"Warmth"},{"value":8,"description":"Tv"},{"value":9,"description":"Reading"},{"value":10,"description":"Computer"},{"value":11,"description":"Hospitality"},{"value":12,"description":"Entertainment"},{"value":13,"description":"Wakeup"},{"value":14,"description":"Dusk"},{"value":15,"description":"Sleep"}]}');
    this.addPropertyByString('light:default-power-on-state', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:default-power-on-state:00000105:yeelink-fancl8:1:0000C802","description":"Default Power On State","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Default"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('light:flex-switch', '{"siid":2,"piid":12,"type":"urn:miot-spec-v2:property:flex-switch:000000EC:yeelink-fancl8:1","description":"Flex Switch","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl8:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-fancl8:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"},{"value":5,"description":"Level5"},{"value":6,"description":"Turbo"}]}');
    this.addPropertyByString('fan:mode', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl8:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Basic"},{"value":2,"description":"Natural Wind"}]}');
    this.addPropertyByString('fan:wind-reverse', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:wind-reverse:00000117:yeelink-fancl8:1","description":"Wind Reverse","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('function:user-save', '{"siid":5,"piid":1,"type":"urn:yeelink-spec:property:user-save:00000001:yeelink-fancl8:1","description":"","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('function:fan-default', '{"siid":5,"piid":2,"type":"urn:yeelink-spec:property:fan-default:00000002:yeelink-fancl8:1","description":"","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Default"},{"value":1,"description":"Fan-on"},{"value":2,"description":"Fan-off"}]}');
    this.addPropertyByString('function:fan-state-default', '{"siid":5,"piid":3,"type":"urn:yeelink-spec:property:fan-state-default:00000003:yeelink-fancl8:1","description":"","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Middle"},{"value":3,"description":"High"},{"value":4,"description":"Natural-wind"}]}');
    this.addPropertyByString('function:fan-beer', '{"siid":5,"piid":4,"type":"urn:yeelink-spec:property:fan-beer:00000004:yeelink-fancl8:1","description":"","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('function:type', '{"siid":5,"piid":5,"type":"urn:yeelink-spec:property:type:00000005:yeelink-fancl8:1","description":"","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Invisibility"},{"value":1,"description":"Aphylly"}]}');
    this.addPropertyByString('remote:remote-switch', '{"siid":6,"piid":1,"type":"urn:yeelink-spec:property:remote-switch:00000001:yeelink-fancl8:1","description":"","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('remote:remote-add', '{"siid":6,"piid":2,"type":"urn:yeelink-spec:property:remote-add:00000002:yeelink-fancl8:1","description":"","format":"uint8","access":["write"],"valueList":[{"value":1,"description":"Remote-add"}]}');
    this.addPropertyByString('remote:remote-del', '{"siid":6,"piid":3,"type":"urn:yeelink-spec:property:remote-del:00000003:yeelink-fancl8:1","description":"","format":"int32","access":["write"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-ltype', '{"siid":6,"piid":4,"type":"urn:yeelink-spec:property:remote-ltype:00000004:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-htype', '{"siid":6,"piid":5,"type":"urn:yeelink-spec:property:remote-htype:00000005:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-a', '{"siid":6,"piid":6,"type":"urn:yeelink-spec:property:remote-a:00000006:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-b', '{"siid":6,"piid":7,"type":"urn:yeelink-spec:property:remote-b:00000007:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-c', '{"siid":6,"piid":8,"type":"urn:yeelink-spec:property:remote-c:00000008:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-d', '{"siid":6,"piid":9,"type":"urn:yeelink-spec:property:remote-d:00000009:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-e', '{"siid":6,"piid":10,"type":"urn:yeelink-spec:property:remote-e:0000000a:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-f', '{"siid":6,"piid":11,"type":"urn:yeelink-spec:property:remote-f:0000000b:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-g', '{"siid":6,"piid":12,"type":"urn:yeelink-spec:property:remote-g:0000000c:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-h', '{"siid":6,"piid":13,"type":"urn:yeelink-spec:property:remote-h:0000000d:yeelink-fancl8:1","description":"","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-cmd', '{"siid":6,"piid":14,"type":"urn:yeelink-spec:property:remote-cmd:0000000e:yeelink-fancl8:1","description":"","format":"int32","access":["notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('ambient-light:on', '{"siid":7,"piid":1,"type":"urn:yeelink-spec:property:on:00000001:yeelink-fancl8:1","description":"","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl8:1:0000C802","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('fan:toggle', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl8:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('scene:brightness-add', '{"siid":4,"aiid":1,"type":"urn:yeelink-spec:action:brightness-add:00002801:yeelink-fancl8:1","description":"brightness-add","in":[],"out":[]}');
    this.addActionByString('scene:brightness-dec', '{"siid":4,"aiid":2,"type":"urn:yeelink-spec:action:brightness-dec:00002802:yeelink-fancl8:1","description":"brightness-dec","in":[],"out":[]}');
    this.addActionByString('scene:brightness-sw', '{"siid":4,"aiid":3,"type":"urn:yeelink-spec:action:brightness-sw:00002803:yeelink-fancl8:1","description":"brightness-sw","in":[],"out":[]}');
    this.addActionByString('scene:on-or-brightness', '{"siid":4,"aiid":4,"type":"urn:yeelink-spec:action:on-or-brightness:00002804:yeelink-fancl8:1","description":"on-or-brightness","in":[],"out":[]}');
    this.addActionByString('scene:colortemperature-add', '{"siid":4,"aiid":5,"type":"urn:yeelink-spec:action:colortemperature-add:00002805:yeelink-fancl8:1","description":"colortemperature-add","in":[],"out":[]}');
    this.addActionByString('scene:colortemperature-dec', '{"siid":4,"aiid":6,"type":"urn:yeelink-spec:action:colortemperature-dec:00002806:yeelink-fancl8:1","description":"colortemperature-dec","in":[],"out":[]}');
    this.addActionByString('scene:colortemperature-sw', '{"siid":4,"aiid":7,"type":"urn:yeelink-spec:action:colortemperature-sw:00002807:yeelink-fancl8:1","description":"colortemperature-sw","in":[],"out":[]}');
    this.addActionByString('scene:on-or-colortemp', '{"siid":4,"aiid":8,"type":"urn:yeelink-spec:action:on-or-colortemp:00002808:yeelink-fancl8:1","description":"on-or-colortemp","in":[],"out":[]}');
    this.addActionByString('scene:wind-speed-sw', '{"siid":4,"aiid":9,"type":"urn:yeelink-spec:action:wind-speed-sw:00002809:yeelink-fancl8:1","description":"wind-speed-sw","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightFancl8;

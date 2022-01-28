const CeilingFanDevice = require('../CeilingFanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl1 extends CeilingFanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart Ceiling Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-fancl1:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan:00007808:yeelink-fancl1:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:yeelink-spec:service:yl-light:00007801:yeelink-fancl1:1","description":""}');
    this.createServiceByString('{"siid":5,"type":"urn:yeelink-spec:service:yl-fan:00007802:yeelink-fancl1:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Day Light"},{"value":1,"description":"Night Light"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-fancl1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-fancl1:1","description":"Color Temperature","format":"uint16","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:flow', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:flow:00000010:yeelink-fancl1:1","description":"Flow","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('light:off-delay-time', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-fancl1:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,180,1]}');
    this.addPropertyByString('fan:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-fancl1:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Level0"},{"value":1,"description":"Level1"},{"value":2,"description":"Level2"}]}');
    this.addPropertyByString('fan:mode', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('fan:status', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:status:00000007:yeelink-fancl1:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"}]}');
    this.addPropertyByString('fan:fault', '{"siid":3,"piid":9,"type":"urn:miot-spec-v2:property:fault:00000009:yeelink-fancl1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"}]}');
    this.addPropertyByString('fan:off-delay-time', '{"siid":3,"piid":10,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-fancl1:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('yl-light:init-power-opt', '{"siid":4,"piid":1,"type":"urn:yeelink-spec:property:init-power-opt:00000001:yeelink-fancl1:1","description":"上电是否开灯","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"On"},{"value":2,"description":"Off"}]}');
    this.addPropertyByString('yl-light:night-time', '{"siid":4,"piid":2,"type":"urn:yeelink-spec:property:night-time:00000002:yeelink-fancl1:1","description":"夜灯时间段(en, dly, em, eh, sm, sh)","format":"int64","access":["read","write","notify"],"unit":"none","valueRange":[0,281474976710655,1]}');
    this.addPropertyByString('yl-light:scene-param', '{"siid":4,"piid":3,"type":"urn:yeelink-spec:property:scene-param:00000003:yeelink-fancl1:1","description":"","format":"string","access":["read","write","notify"]}');
    this.addPropertyByString('yl-fan:fan-init-power-opt', '{"siid":5,"piid":1,"type":"urn:yeelink-spec:property:fan-init-power-opt:00000001:yeelink-fancl1:1","description":"上电是否开风扇","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl1:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('fan:toggle', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl1:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('yl-light:set-scene', '{"siid":4,"aiid":1,"type":"urn:yeelink-spec:action:set-scene:00002801:yeelink-fancl1:1","description":"设置灯光情景","in":[3],"out":[]}');
    this.addActionByString('yl-light:brightness-cycle', '{"siid":4,"aiid":2,"type":"urn:yeelink-spec:action:brightness-cycle:00002801:yeelink-fancl1:1","description":"亮度切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-cycle', '{"siid":4,"aiid":3,"type":"urn:yeelink-spec:action:ct-cycle:00002802:yeelink-fancl1:1","description":"色温切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-light:fan-gears-cycle', '{"siid":4,"aiid":4,"type":"urn:yeelink-spec:action:fan-gears-cycle:00002803:yeelink-fancl1:1","description":"风扇档位切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-fan:fan-gears-cycle', '{"siid":5,"aiid":1,"type":"urn:yeelink-spec:action:fan-gears-cycle:00002801:yeelink-fancl1:1","description":"风扇档位切换（智能联动）","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightFancl1;

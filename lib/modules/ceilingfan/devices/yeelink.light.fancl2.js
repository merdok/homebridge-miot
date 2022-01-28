const CeilingFanDevice = require('../CeilingFanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl2 extends CeilingFanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart Ceiling Fan S2001';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl2:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-fancl2:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan:00007808:yeelink-fancl2:1","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:yeelink-spec:service:yl-light:00007801:yeelink-fancl2:1","description":"yl light 私有服务"}');
    this.createServiceByString('{"siid":5,"type":"urn:yeelink-spec:service:yl-fan:00007802:yeelink-fancl2:1","description":"yl fan 私有服务"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Day"},{"value":1,"description":"Night"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-fancl2:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-fancl2:1","description":"Color Temperature","format":"uint16","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:flow', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:flow:00000010:yeelink-fancl2:1","description":"Flow","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('light:off-delay-time', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-fancl2:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,180,1]}');
    this.addPropertyByString('light:left-time', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:left-time:0000003C:yeelink-fancl2:1","description":"Left Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,180,1]}');
    this.addPropertyByString('fan:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-fancl2:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Level1"},{"value":1,"description":"Level2"},{"value":2,"description":"Level3"},{"value":3,"description":"Level4"}]}');
    this.addPropertyByString('fan:mode', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Normal-wind"},{"value":1,"description":"Natural-wind"},{"value":2,"description":"Reverse-wind"},{"value":3,"description":"Strong-wind"},{"value":4,"description":"Small-wind"},{"value":5,"description":"Sleep-wind"}]}');
    this.addPropertyByString('fan:status', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:status:00000007:yeelink-fancl2:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"}]}');
    this.addPropertyByString('fan:fault', '{"siid":3,"piid":9,"type":"urn:miot-spec-v2:property:fault:00000009:yeelink-fancl2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"}]}');
    this.addPropertyByString('fan:off-delay-time', '{"siid":3,"piid":11,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-fancl2:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('fan:left-time', '{"siid":3,"piid":12,"type":"urn:miot-spec-v2:property:left-time:0000003C:yeelink-fancl2:1","description":"Left Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('yl-light:init-power-opt', '{"siid":4,"piid":1,"type":"urn:yeelink-spec:property:init-power-opt:00000001:yeelink-fancl2:1","description":"上电是否开灯","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":""},{"value":2,"description":""}]}');
    this.addPropertyByString('yl-light:night-time', '{"siid":4,"piid":2,"type":"urn:yeelink-spec:property:night-time:00000002:yeelink-fancl2:1","description":"夜灯时间段(en, dly, em, eh, sm, sh)","format":"int64","access":["read","write","notify"],"unit":"none","valueRange":[0,281474976710655,1]}');
    this.addPropertyByString('yl-light:smart-switch-en', '{"siid":4,"piid":4,"type":"urn:yeelink-spec:property:smart-switch-en:00000004:yeelink-fancl2:1","description":"smart-switch-en","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('yl-light:miband-sleep-ctrl', '{"siid":4,"piid":5,"type":"urn:yeelink-spec:property:miband-sleep-ctrl:00000005:yeelink-fancl2:1","description":"miband-sleep-ctrl","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Trun Off MiBand Ctrl"},{"value":1,"description":"Trun Off Light By MiBand When Sleep"},{"value":2,"description":"Trun Off Fan By MiBand When Sleep"},{"value":3,"description":"Trun Off Light And Fan By MiBand When Sleep"},{"value":4,"description":"Turn On Sleep-Wind Mode When Sleep"},{"value":5,"description":"Trun Off Light And Turn On Sleep-Wind Mode When Sleep"}]}');
    this.addPropertyByString('yl-fan:fan-init-power-opt', '{"siid":5,"piid":1,"type":"urn:yeelink-spec:property:fan-init-power-opt:00000001:yeelink-fancl2:1","description":"上电是否开风扇","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('yl-fan:fanlevel-combine', '{"siid":5,"piid":2,"type":"urn:yeelink-spec:property:fanlevel-combine:00000002:yeelink-fancl2:1","description":"","format":"uint32","access":["read","write","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('yl-fan:smart-switch-en', '{"siid":5,"piid":3,"type":"urn:yeelink-spec:property:smart-switch-en:00000003:yeelink-fancl2:1","description":"smart-switch-en","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('yl-fan:fan-speed', '{"siid":5,"piid":4,"type":"urn:yeelink-spec:property:fan-speed:00000004:yeelink-fancl2:1","description":"fan-speed","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-fan:sleep-delay-off', '{"siid":5,"piid":5,"type":"urn:yeelink-spec:property:sleep-delay-off:00000005:yeelink-fancl2:1","description":"sleep-delay-off","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('yl-fan:mode-for-restore', '{"siid":5,"piid":6,"type":"urn:yeelink-spec:property:mode-for-restore:00000006:yeelink-fancl2:1","description":"mode-for-restore","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,2,1]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl2:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('fan:toggle', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-fancl2:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('yl-light:brightness-cycle', '{"siid":4,"aiid":2,"type":"urn:yeelink-spec:action:brightness-cycle:00002802:yeelink-fancl2:1","description":"亮度切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-cycle', '{"siid":4,"aiid":3,"type":"urn:yeelink-spec:action:ct-cycle:00002803:yeelink-fancl2:1","description":"色温切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-light:fan-gears-cycle', '{"siid":4,"aiid":4,"type":"urn:yeelink-spec:action:fan-gears-cycle:00002804:yeelink-fancl2:1","description":"风扇档位切换（智能联动）","in":[],"out":[]}');
    this.addActionByString('yl-light:birghtness-increase', '{"siid":4,"aiid":5,"type":"urn:yeelink-spec:action:birghtness-increase:00002805:yeelink-fancl2:1","description":"birghtness-increase","in":[],"out":[]}');
    this.addActionByString('yl-light:brightness-decrease', '{"siid":4,"aiid":6,"type":"urn:yeelink-spec:action:brightness-decrease:00002806:yeelink-fancl2:1","description":"brightness-decrease","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-increase', '{"siid":4,"aiid":7,"type":"urn:yeelink-spec:action:ct-increase:00002807:yeelink-fancl2:1","description":"ct-increase","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-decrease', '{"siid":4,"aiid":8,"type":"urn:yeelink-spec:action:ct-decrease:00002808:yeelink-fancl2:1","description":"ct-decrease","in":[],"out":[]}');
    this.addActionByString('yl-light:on-or-bright-cycle', '{"siid":4,"aiid":9,"type":"urn:yeelink-spec:action:on-or-bright-cycle:00002809:yeelink-fancl2:1","description":"on-or-bright-cycle","in":[],"out":[]}');
    this.addActionByString('yl-light:on-or-ct-cycle', '{"siid":4,"aiid":10,"type":"urn:yeelink-spec:action:on-or-ct-cycle:0000280a:yeelink-fancl2:1","description":"on-or-ct-cycle","in":[],"out":[]}');
    this.addActionByString('yl-fan:fan-gears-cycle', '{"siid":5,"aiid":1,"type":"urn:yeelink-spec:action:fan-gears-cycle:00002801:yeelink-fancl2:1","description":"风扇档位切换（智能联动）","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightFancl2;

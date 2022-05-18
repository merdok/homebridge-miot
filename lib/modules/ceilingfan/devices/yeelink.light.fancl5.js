const CeilingFanDevice = require('../CeilingFanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl5 extends CeilingFanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart Ceiling Fan C900';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl5:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['light:on', 'light:brightness', 'light:color-temperature', 'light:mode',
      'ceiling-fan:on', 'ceiling-fan:fan-level', 'ceiling-fan:status', 'ceiling-fan:mode',
      'ceiling-fan:off-delay-time', 'fan:on', 'fan:fan-level', 'fan:mode',
      'fan:status', 'yl-light:off-delay-time'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-fancl5:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:ceiling-fan:00007849:yeelink-fancl5:1","description":"Ceiling Fan"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:fan:00007808:yeelink-fancl5:2","description":"Fan"}');
    this.createServiceByString('{"siid":4,"type":"urn:yeelink-spec:service:yl-light:00007801:yeelink-fancl5:1","description":"yl-light"}');
    this.createServiceByString('{"siid":5,"type":"urn:yeelink-spec:service:yl-fan:00007802:yeelink-fancl5:1","description":"yl-fan"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-fancl5:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-fancl5:1","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl5:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Day"},{"value":1,"description":"Night"}]}');
    this.addPropertyByString('ceiling-fan:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl5:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('ceiling-fan:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-fancl5:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('ceiling-fan:status', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:yeelink-fancl5:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('ceiling-fan:mode', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl5:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Auto"}]}');
    this.addPropertyByString('ceiling-fan:off-delay-time', '{"siid":3,"piid":10,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-fancl5:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('fan:on', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-fancl5:2","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('fan:fan-level', '{"siid":6,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-fancl5:2","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('fan:mode', '{"siid":6,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-fancl5:2","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('fan:status', '{"siid":6,"piid":8,"type":"urn:miot-spec-v2:property:status:00000007:yeelink-fancl5:2","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('yl-light:init-power-opt', '{"siid":4,"piid":1,"type":"urn:yeelink-spec:property:init-power-opt:00000001:yeelink-fancl5:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"上电开灯"},{"value":2,"description":"上电关灯"}]}');
    this.addPropertyByString('yl-light:smart-switch-en', '{"siid":4,"piid":3,"type":"urn:yeelink-spec:property:smart-switch-en:00000003:yeelink-fancl5:1","description":"","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('yl-light:off-delay-time', '{"siid":4,"piid":4,"type":"urn:yeelink-spec:property:off-delay-time:00000004:yeelink-fancl5:1","description":"","format":"uint32","access":["read","notify","write"],"unit":"minutes","valueRange":[0,180,1]}');
    this.addPropertyByString('yl-light:left-time', '{"siid":4,"piid":5,"type":"urn:yeelink-spec:property:left-time:00000005:yeelink-fancl5:1","description":"","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,180,1]}');
    this.addPropertyByString('yl-light:night-time-str', '{"siid":4,"piid":6,"type":"urn:yeelink-spec:property:night-time-str:00000006:yeelink-fancl5:1","description":"night-time-str","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('yl-light:dl-brightness', '{"siid":4,"piid":7,"type":"urn:yeelink-spec:property:dl-brightness:00000007:yeelink-fancl5:1","description":"dl-brightness","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-light:nl-brightness', '{"siid":4,"piid":8,"type":"urn:yeelink-spec:property:nl-brightness:00000008:yeelink-fancl5:1","description":"nl-brightness","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-fan:left-time', '{"siid":5,"piid":4,"type":"urn:yeelink-spec:property:left-time:00000004:yeelink-fancl5:1","description":"left-time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,720,1]}');
    this.addPropertyByString('yl-fan:fan-init-power-opt', '{"siid":5,"piid":5,"type":"urn:yeelink-spec:property:fan-init-power-opt:00000001:yeelink-fancl5:1","description":"fan-init-power-opt","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"上电风扇不开"},{"value":1,"description":"上电开风扇"}]}');
    this.addPropertyByString('yl-fan:smart-switch-en', '{"siid":5,"piid":6,"type":"urn:yeelink-spec:property:smart-switch-en:00000002:yeelink-fancl5:1","description":"smart-switch-en","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"闪断不控制风扇"},{"value":1,"description":"闪断控制风扇开关"}]}');
    this.addPropertyByString('yl-fan:fan-speed-std', '{"siid":5,"piid":7,"type":"urn:yeelink-spec:property:fan-speed-std:00000003:yeelink-fancl5:1","description":"fan-speed-std","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-fan:fan-speed-rec', '{"siid":5,"piid":8,"type":"urn:yeelink-spec:property:fan-speed-rec:00000005:yeelink-fancl5:1","description":"fan-speed-rec","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('yl-light:toggle', '{"siid":4,"aiid":1,"type":"urn:yeelink-spec:action:toggle:00002801:yeelink-fancl5:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('yl-light:brightness-up', '{"siid":4,"aiid":2,"type":"urn:yeelink-spec:action:brightness-up:00002802:yeelink-fancl5:1","description":"brightness-up","in":[],"out":[]}');
    this.addActionByString('yl-light:brightness-down', '{"siid":4,"aiid":3,"type":"urn:yeelink-spec:action:brightness-down:00002803:yeelink-fancl5:1","description":"brightness-down","in":[],"out":[]}');
    this.addActionByString('yl-light:brightness-cycle', '{"siid":4,"aiid":4,"type":"urn:yeelink-spec:action:brightness-cycle:00002804:yeelink-fancl5:1","description":"brightness-cycle","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-cycle', '{"siid":4,"aiid":5,"type":"urn:yeelink-spec:action:ct-cycle:00002805:yeelink-fancl5:1","description":"ct-cycle","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-increase', '{"siid":4,"aiid":7,"type":"urn:yeelink-spec:action:ct-increase:00002807:yeelink-fancl5:1","description":"ct-increase","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-decrease', '{"siid":4,"aiid":8,"type":"urn:yeelink-spec:action:ct-decrease:00002808:yeelink-fancl5:1","description":"ct-decrease","in":[],"out":[]}');
    this.addActionByString('yl-light:on-or-bright-cycle', '{"siid":4,"aiid":9,"type":"urn:yeelink-spec:action:on-or-bright-cycle:00002809:yeelink-fancl5:1","description":"on-or-bright-cycle","in":[],"out":[]}');
    this.addActionByString('yl-light:on-or-ct-cycle', '{"siid":4,"aiid":10,"type":"urn:yeelink-spec:action:on-or-ct-cycle:0000280a:yeelink-fancl5:1","description":"on-or-ct-cycle","in":[],"out":[]}');
    this.addActionByString('yl-fan:toggle', '{"siid":5,"aiid":1,"type":"urn:yeelink-spec:action:toggle:00002801:yeelink-fancl5:1","description":"toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  onProp() {
    return this.getProperty('ceiling-fan:on');
  }

  modeProp() {
    return this.getProperty('ceiling-fan:mode');
  }

  statusProp() {
    return this.getProperty('ceiling-fan:status');
  }

  offDelayProp() {
    return this.getProperty('ceiling-fan:off-delay-time');
  }

  fanLevelProp() {
    return this.getProperty('ceiling-fan:fan-level');
  }

  fanOnProp() {
    return this.getProperty('ceiling-fan:on');
  }

  lightOffDelayProp() {
    return this.getProperty('yl-light:off-delay-time');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightFancl5;

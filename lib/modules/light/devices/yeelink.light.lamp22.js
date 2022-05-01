const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightLamp22 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Computer Monitor Light Bar 1S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-lamp22:1:0000C802';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-lamp22:1:0000C802","description":""}');
    this.createServiceByString('{"siid":3,"type":"urn:yeelink-spec:service:yl-light:00007801:yeelink-lamp22:1","description":"yl-light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-lamp22:1:0000C802","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-lamp22:1:0000C802","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:yeelink-lamp22:1:0000C802","description":"Color Temperature","format":"uint32","access":["read","write","notify"],"unit":"kelvin","valueRange":[2700,6500,1]}');
    this.addPropertyByString('light:default-power-on-state', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:default-power-on-state:00000105:yeelink-lamp22:1","description":"Default Power On State","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-lamp22:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":5,"description":"Reading"},{"value":6,"description":"Office"},{"value":7,"description":"Leisure"},{"value":8,"description":"Warmth"},{"value":9,"description":"Computer"}]}');
    this.addPropertyByString('yl-light:save-state', '{"siid":3,"piid":1,"type":"urn:yeelink-spec:property:save-state:00000001:yeelink-lamp22:1","description":"save-state","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('yl-light:delay-time', '{"siid":3,"piid":2,"type":"urn:yeelink-spec:property:delay-time:00000002:yeelink-lamp22:1","description":"delay-time","format":"uint8","access":["read","notify","write"],"unit":"minutes","valueRange":[1,60,1]}');
    this.addPropertyByString('yl-light:delay-off-enable', '{"siid":3,"piid":4,"type":"urn:yeelink-spec:property:delay-off-enable:00000004:yeelink-lamp22:1","description":"delay-off-enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('yl-light:double-click-enable', '{"siid":3,"piid":6,"type":"urn:yeelink-spec:property:double-click-enable:00000006:yeelink-lamp22:1","description":"double-click-enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('yl-light:double-click', '{"siid":3,"piid":7,"type":"urn:yeelink-spec:property:double-click:00000007:yeelink-lamp22:1","description":"double-click","format":"uint8","access":["read","notify","write"],"valueList":[{"value":1,"description":"Start Pomodoro Mode"},{"value":2,"description":"Start Delay Off"}]}');
    this.addPropertyByString('yl-light:long-press-enable', '{"siid":3,"piid":8,"type":"urn:yeelink-spec:property:long-press-enable:00000008:yeelink-lamp22:1","description":"long-press-enable","format":"bool","access":["write","read","notify"]}');
    this.addPropertyByString('yl-light:scene-mode', '{"siid":3,"piid":9,"type":"urn:yeelink-spec:property:scene-mode:00000009:yeelink-lamp22:1","description":"scene-mode","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Free Mode"},{"value":1,"description":"My Mode 1"},{"value":2,"description":"My Mode 2"},{"value":3,"description":"My Mode 3"},{"value":4,"description":"My Mode 4"},{"value":5,"description":"Reading Mode"},{"value":6,"description":"Working Mode"},{"value":7,"description":"Movie Mode"},{"value":8,"description":"Warm Mode"},{"value":9,"description":"Anti Blue-light Mode"},{"value":10,"description":"Flow Mode"}]}');
    this.addPropertyByString('yl-light:long-press-one', '{"siid":3,"piid":13,"type":"urn:yeelink-spec:property:long-press-one:0000000d:yeelink-lamp22:1","description":"long-press-one","format":"uint8","access":["read","notify","write"],"valueRange":[0,10,1]}');
    this.addPropertyByString('yl-light:long-press-two', '{"siid":3,"piid":14,"type":"urn:yeelink-spec:property:long-press-two:0000000e:yeelink-lamp22:1","description":"long-press-two","format":"uint8","access":["read","notify","write"],"valueRange":[0,10,1]}');
    this.addPropertyByString('yl-light:long-press-three', '{"siid":3,"piid":15,"type":"urn:yeelink-spec:property:long-press-three:0000000f:yeelink-lamp22:1","description":"long-press-three","format":"uint8","access":["read","notify","write"],"valueRange":[0,10,1]}');
    this.addPropertyByString('yl-light:work-minutes', '{"siid":3,"piid":16,"type":"urn:yeelink-spec:property:work-minutes:00000010:yeelink-lamp22:1","description":"work-minutes","format":"uint8","access":["read","notify","write"],"unit":"minutes","valueRange":[1,60,1]}');
    this.addPropertyByString('yl-light:break-minutes', '{"siid":3,"piid":17,"type":"urn:yeelink-spec:property:break-minutes:00000011:yeelink-lamp22:1","description":"break-minutes","format":"uint8","access":["read","notify","write"],"unit":"minutes","valueRange":[1,60,1]}');
    this.addPropertyByString('yl-light:pomodoro-enable', '{"siid":3,"piid":18,"type":"urn:yeelink-spec:property:pomodoro-enable:00000012:yeelink-lamp22:1","description":"pomodoro-enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('yl-light:mode-one-bright', '{"siid":3,"piid":19,"type":"urn:yeelink-spec:property:mode-one-bright:00000013:yeelink-lamp22:1","description":"mode-one-bright","format":"uint16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-light:mode-one-ct', '{"siid":3,"piid":20,"type":"urn:yeelink-spec:property:mode-one-ct:00000014:yeelink-lamp22:1","description":"mode-one-ct","format":"uint16","access":["read","notify","write"],"valueRange":[2700,6500,1]}');
    this.addPropertyByString('yl-light:mode-two-bright', '{"siid":3,"piid":21,"type":"urn:yeelink-spec:property:mode-two-bright:00000015:yeelink-lamp22:1","description":"mode-two-bright","format":"uint16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-light:mode-two-ct', '{"siid":3,"piid":22,"type":"urn:yeelink-spec:property:mode-two-ct:00000016:yeelink-lamp22:1","description":"mode-two-ct","format":"uint16","access":["read","notify","write"],"valueRange":[2700,6500,1]}');
    this.addPropertyByString('yl-light:mode-three-bright', '{"siid":3,"piid":23,"type":"urn:yeelink-spec:property:mode-three-bright:00000017:yeelink-lamp22:1","description":"mode-three-bright","format":"uint16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-light:mode-three-ct', '{"siid":3,"piid":24,"type":"urn:yeelink-spec:property:mode-three-ct:00000018:yeelink-lamp22:1","description":"mode-three-ct","format":"uint16","access":["read","notify","write"],"valueRange":[2700,6500,1]}');
    this.addPropertyByString('yl-light:mode-four-bright', '{"siid":3,"piid":25,"type":"urn:yeelink-spec:property:mode-four-bright:00000019:yeelink-lamp22:1","description":"mode-four-bright","format":"uint16","access":["read","notify","write"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('yl-light:mode-four-ct', '{"siid":3,"piid":26,"type":"urn:yeelink-spec:property:mode-four-ct:0000001a:yeelink-lamp22:1","description":"mode-four-ct","format":"uint16","access":["read","notify","write"],"valueRange":[2700,6500,1]}');
    this.addPropertyByString('yl-light:ble-paired-mac', '{"siid":3,"piid":27,"type":"urn:yeelink-spec:property:ble-paired-mac:0000000a:yeelink-lamp22:1","description":"ble-paired-mac","format":"string","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-lamp22:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('yl-light:set-default', '{"siid":3,"aiid":1,"type":"urn:yeelink-spec:action:set-default:00002801:yeelink-lamp22:1","description":"set-default","in":[],"out":[]}');
    this.addActionByString('yl-light:delay-off', '{"siid":3,"aiid":2,"type":"urn:yeelink-spec:action:delay-off:00002802:yeelink-lamp22:1","description":"delay-off","in":[2],"out":[]}');
    this.addActionByString('yl-light:bright-increase', '{"siid":3,"aiid":3,"type":"urn:yeelink-spec:action:bright-increase:00002803:yeelink-lamp22:1","description":"bright-increase","in":[],"out":[]}');
    this.addActionByString('yl-light:bright-decrease', '{"siid":3,"aiid":4,"type":"urn:yeelink-spec:action:bright-decrease:00002804:yeelink-lamp22:1","description":"bright-decrease","in":[],"out":[]}');
    this.addActionByString('yl-light:bright-circle', '{"siid":3,"aiid":5,"type":"urn:yeelink-spec:action:bright-circle:00002805:yeelink-lamp22:1","description":"bright-circle","in":[],"out":[]}');
    this.addActionByString('yl-light:bright-on-circle', '{"siid":3,"aiid":6,"type":"urn:yeelink-spec:action:bright-on-circle:00002806:yeelink-lamp22:1","description":"bright-on-circle","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-increase', '{"siid":3,"aiid":7,"type":"urn:yeelink-spec:action:ct-increase:00002807:yeelink-lamp22:1","description":"ct-increase","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-decrease', '{"siid":3,"aiid":8,"type":"urn:yeelink-spec:action:ct-decrease:00002808:yeelink-lamp22:1","description":"ct-decrease","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-circle', '{"siid":3,"aiid":9,"type":"urn:yeelink-spec:action:ct-circle:00002809:yeelink-lamp22:1","description":"ct-circle","in":[],"out":[]}');
    this.addActionByString('yl-light:ct-on-circle', '{"siid":3,"aiid":10,"type":"urn:yeelink-spec:action:ct-on-circle:0000280a:yeelink-lamp22:1","description":"ct-on-circle","in":[],"out":[]}');
    this.addActionByString('yl-light:long-press-ids-set', '{"siid":3,"aiid":13,"type":"urn:yeelink-spec:action:long-press-ids-set:0000280d:yeelink-lamp22:1","description":"long-press-ids-set","in":[13,14,15],"out":[]}');
    this.addActionByString('yl-light:long-press-ids-get', '{"siid":3,"aiid":14,"type":"urn:yeelink-spec:action:long-press-ids-get:0000280e:yeelink-lamp22:1","description":"long-press-ids-get","in":[],"out":[13,14,15]}');
    this.addActionByString('yl-light:apply-scene', '{"siid":3,"aiid":15,"type":"urn:yeelink-spec:action:apply-scene:0000280b:yeelink-lamp22:1","description":"apply-scene","in":[9],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightLamp22;

const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp5pro extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund Smart Power Strip Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp5pro:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp5pro:1","description":"Switch"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp5pro:1","description":"USB Switch Status"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:cuco-cp5pro:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:power-consumption:0000780E:cuco-cp5pro:1","description":"Power Consumption"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:switch:00007801:cuco-cp5pro:1","description":"switch"}');
    this.createServiceByString('{"siid":4,"type":"urn:cuco-spec:service:switch:00007802:cuco-cp5pro:1","description":"switch"}');
    this.createServiceByString('{"siid":5,"type":"urn:cuco-spec:service:switch:00007803:cuco-cp5pro:1","description":"switch"}');
    this.createServiceByString('{"siid":6,"type":"urn:cuco-spec:service:switch:00007804:cuco-cp5pro:1","description":"switch"}');
    this.createServiceByString('{"siid":9,"type":"urn:cuco-spec:service:device-setting:00007805:cuco-cp5pro:1","description":"device-setting"}');
    this.createServiceByString('{"siid":11,"type":"urn:cuco-spec:service:use-ele-alert:00007806:cuco-cp5pro:1","description":"use-ele-alert"}');
    this.createServiceByString('{"siid":12,"type":"urn:cuco-spec:service:indicator-light:00007807:cuco-cp5pro:1","description":"indicator-light"}');
    this.createServiceByString('{"siid":13,"type":"urn:cuco-spec:service:alert:00007808:cuco-cp5pro:1","description":"alert"}');
    this.createServiceByString('{"siid":14,"type":"urn:cuco-spec:service:usb-cyc:00007809:cuco-cp5pro:2","description":"usb-cyc"}');
    this.createServiceByString('{"siid":15,"type":"urn:cuco-spec:service:other:0000780a:cuco-cp5pro:2","description":"other"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp5pro:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch7:on', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp5pro:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch7:status', '{"siid":7,"piid":2,"type":"urn:miot-spec-v2:property:status:00000007:cuco-cp5pro:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"}]}');
    this.addPropertyByString('switch7:status3', '{"siid":7,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:cuco-cp5pro:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"}]}');
    this.addPropertyByString('switch7:status4', '{"siid":7,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:cuco-cp5pro:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"}]}');
    this.addPropertyByString('switch7:mode', '{"siid":7,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:cuco-cp5pro:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Balanced"},{"value":1,"description":"C1"},{"value":2,"description":"C2"},{"value":3,"description":"NONE"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:cuco-cp5pro:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('power-consumption:power-consumption', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:cuco-cp5pro:1","description":"Power Consumption","format":"float","access":["read","notify"],"valueRange":[0,65535,0.01]}');
    this.addPropertyByString('power-consumption:electric-current', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:electric-current:00000030:cuco-cp5pro:1","description":"Electric Current","format":"float","access":["read","notify"],"valueRange":[0,255,0.1]}');
    this.addPropertyByString('power-consumption:voltage', '{"siid":10,"piid":3,"type":"urn:miot-spec-v2:property:voltage:00000031:cuco-cp5pro:1","description":"Voltage","format":"float","access":["read","notify"],"valueRange":[0,65535,0.1]}');
    this.addPropertyByString('power-consumption:electric-power', '{"siid":10,"piid":4,"type":"urn:miot-spec-v2:property:electric-power:00000066:cuco-cp5pro:1","description":"Electric Power","format":"float","access":["read","notify"],"unit":"watt","valueRange":[0,65535,0.1]}');
    this.addPropertyByString('power-consumption:electric-power5', '{"siid":10,"piid":5,"type":"urn:miot-spec-v2:property:electric-power:00000066:cuco-cp5pro:2","description":"Electric Power","format":"float","access":["read","notify"],"unit":"watt","valueRange":[0,65535,0.1]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch3:cyc-status', '{"siid":3,"piid":2,"type":"urn:cuco-spec:property:cyc-status:00000002:cuco-cp5pro:2","description":"cyc-status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch3:data-values', '{"siid":3,"piid":3,"type":"urn:cuco-spec:property:data-values:00000003:cuco-cp5pro:2","description":"data-values","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('switch4:on', '{"siid":4,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch4:cyc-status', '{"siid":4,"piid":2,"type":"urn:cuco-spec:property:cyc-status:00000002:cuco-cp5pro:2","description":"cyc-status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch4:data-values', '{"siid":4,"piid":3,"type":"urn:cuco-spec:property:data-values:00000003:cuco-cp5pro:2","description":"data-values","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('switch5:on', '{"siid":5,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch5:cyc-status', '{"siid":5,"piid":2,"type":"urn:cuco-spec:property:cyc-status:00000002:cuco-cp5pro:2","description":"cyc-status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch5:data-values', '{"siid":5,"piid":3,"type":"urn:cuco-spec:property:data-values:00000003:cuco-cp5pro:2","description":"data-values","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('switch6:on', '{"siid":6,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('switch6:cyc-status', '{"siid":6,"piid":2,"type":"urn:cuco-spec:property:cyc-status:00000002:cuco-cp5pro:2","description":"cyc-status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('switch6:data-values', '{"siid":6,"piid":3,"type":"urn:cuco-spec:property:data-values:00000003:cuco-cp5pro:2","description":"data-values","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('device-setting:off-memory', '{"siid":9,"piid":1,"type":"urn:cuco-spec:property:off-memory:00000001:cuco-cp5pro:1","description":"off-memory","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('device-setting:status', '{"siid":9,"piid":2,"type":"urn:cuco-spec:property:status:00000002:cuco-cp5pro:1","description":"status","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close-Open"},{"value":1,"description":"Close-Close"}]}');
    this.addPropertyByString('use-ele-alert:on', '{"siid":11,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('use-ele-alert:day-ele-alert', '{"siid":11,"piid":2,"type":"urn:cuco-spec:property:day-ele-alert:00000002:cuco-cp5pro:1","description":"day-ele-alert","format":"uint8","access":["read","notify","write"],"valueRange":[1,60,1]}');
    this.addPropertyByString('use-ele-alert:month-ele-alert', '{"siid":11,"piid":3,"type":"urn:cuco-spec:property:month-ele-alert:00000003:cuco-cp5pro:1","description":"month-ele-alert","format":"uint16","access":["read","notify","write"],"valueRange":[50,1800,50]}');
    this.addPropertyByString('use-ele-alert:month-ele-alertl', '{"siid":11,"piid":4,"type":"urn:cuco-spec:property:month-ele-alertl:00000004:cuco-cp5pro:2","description":"month-ele-alertl","format":"uint16","access":["read","notify","write"],"valueRange":[10,1800,10]}');
    this.addPropertyByString('indicator-light:on', '{"siid":12,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp5pro:1","description":"on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('indicator-light:mode', '{"siid":12,"piid":2,"type":"urn:cuco-spec:property:mode:00000002:cuco-cp5pro:1","description":"mode","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('indicator-light:start-time', '{"siid":12,"piid":3,"type":"urn:cuco-spec:property:start-time:00000003:cuco-cp5pro:1","description":"start-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('indicator-light:end-time', '{"siid":12,"piid":4,"type":"urn:cuco-spec:property:end-time:00000004:cuco-cp5pro:1","description":"end-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('alert:overload', '{"siid":13,"piid":1,"type":"urn:cuco-spec:property:overload:00000001:cuco-cp5pro:1","description":"overload","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('alert:temperature-high-ci', '{"siid":13,"piid":2,"type":"urn:cuco-spec:property:temperature-high-ci:00000002:cuco-cp5pro:1","description":"temperature-high-ci","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('alert:temperature-high-ai', '{"siid":13,"piid":4,"type":"urn:cuco-spec:property:temperature-high-ai:00000004:cuco-cp5pro:1","description":"temperature-high-ai","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('usb-cyc:cyc-status', '{"siid":14,"piid":1,"type":"urn:cuco-spec:property:cyc-status:00000001:cuco-cp5pro:2","description":"cyc-status","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('usb-cyc:data-values', '{"siid":14,"piid":2,"type":"urn:cuco-spec:property:data-values:00000002:cuco-cp5pro:2","description":"data-values","format":"string","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-cp5pro:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('switch7:toggle', '{"siid":7,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-cp5pro:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('switch3:toggle', '{"siid":3,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp5pro:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch4:toggle', '{"siid":4,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp5pro:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch5:toggle', '{"siid":5,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp5pro:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('switch6:toggle', '{"siid":6,"aiid":1,"type":"urn:cuco-spec:action:toggle:00002801:cuco-cp5pro:1","description":"toggle","in":[],"out":[]}');
    this.addActionByString('other:refresh', '{"siid":15,"aiid":1,"type":"urn:cuco-spec:action:refresh:00002801:cuco-cp5pro:2","description":"refresh","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoPlugCp5pro;

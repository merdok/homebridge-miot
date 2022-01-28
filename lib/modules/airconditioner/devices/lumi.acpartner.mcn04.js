const AirConditionerDevice = require('../AirConditionerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAcpartnerMcn04 extends AirConditionerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Air Conditioner Controller Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-condition-outlet:0000A045:lumi-mcn04:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-condition-outlet:000078A3:lumi-mcn04:1","description":"Air Condition Outlet"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:air-conditioner:0000780F:lumi-mcn04:1","description":"Air Conditioner"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:fan-control:00007809:lumi-mcn04:1","description":"Fan Control"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:power-consumption:0000780E:lumi-mcn04:1","description":"Power Consumption"}');
    this.createServiceByString('{"siid":8,"type":"urn:lumi-spec:service:ac-function:00007801:lumi-mcn04:1","description":"ac-function"}');
    this.createServiceByString('{"siid":9,"type":"urn:lumi-spec:service:indicator-light:00007802:lumi-mcn04:1","description":"indicator-light"}');
    this.createServiceByString('{"siid":10,"type":"urn:lumi-spec:service:device-protect:00007803:lumi-mcn04:1","description":"device-protect"}');
    this.createServiceByString('{"siid":11,"type":"urn:lumi-spec:service:device-info:00007804:lumi-mcn04:1","description":"device-info"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-conditioner:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:lumi-mcn04:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:mode', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:lumi-mcn04:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Cool"},{"value":1,"description":"Heat"},{"value":2,"description":"Auto"},{"value":3,"description":"Fan"},{"value":4,"description":"Dry"}]}');
    this.addPropertyByString('air-conditioner:fault', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-mcn04:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('air-conditioner:target-temperature', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:target-temperature:00000021:lumi-mcn04:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,30,1]}');
    this.addPropertyByString('fan-control:fan-level', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:lumi-mcn04:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('fan-control:vertical-swing', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:lumi-mcn04:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('power-consumption:power-consumption', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:lumi-mcn04:1","description":"Power Consumption","format":"float","access":["read","notify"],"unit":"none","valueRange":[0,3.4e+38,0.001]}');
    this.addPropertyByString('power-consumption:electric-power', '{"siid":7,"piid":2,"type":"urn:miot-spec-v2:property:electric-power:00000066:lumi-mcn04:1","description":"Electric Power","format":"float","access":["read","notify"],"unit":"watt","valueRange":[0,3.4e+38,1]}');
    this.addPropertyByString('power-consumption:power-consumption2', '{"siid":7,"piid":3,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:lumi-mcn04:1","description":"Power Consumption","format":"float","access":["read","notify"],"unit":"none","valueRange":[0,3.4e+38,0.001]}');
    this.addPropertyByString('power-consumption:electric-power2', '{"siid":7,"piid":4,"type":"urn:miot-spec-v2:property:electric-power:00000066:lumi-mcn04:1","description":"Electric Power","format":"float","access":["read","notify"],"unit":"watt","valueRange":[0,3.4e+38,1]}');
    this.addPropertyByString('ac-function:set-ele-info', '{"siid":8,"piid":1,"type":"urn:lumi-spec:property:set-ele-info:00000001:lumi-mcn04:1","description":"set-ele-info","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:brand-id', '{"siid":8,"piid":2,"type":"urn:lumi-spec:property:brand-id:00000002:lumi-mcn04:1","description":"brand-id","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('ac-function:remote-id', '{"siid":8,"piid":3,"type":"urn:lumi-spec:property:remote-id:00000003:lumi-mcn04:1","description":"remote-id","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('ac-function:ac-mode', '{"siid":8,"piid":4,"type":"urn:lumi-spec:property:ac-mode:00000004:lumi-mcn04:1","description":"ac-mode","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"AC-Plug"},{"value":2,"description":"AC-Unplug"},{"value":5,"description":"AC-Plug-10"}]}');
    this.addPropertyByString('ac-function:ac-type', '{"siid":8,"piid":5,"type":"urn:lumi-spec:property:ac-type:00000005:lumi-mcn04:1","description":"ac-type","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"No-status"},{"value":2,"description":"Have-status"}]}');
    this.addPropertyByString('ac-function:ac-ctrl-range', '{"siid":8,"piid":6,"type":"urn:lumi-spec:property:ac-ctrl-range:00000006:lumi-mcn04:1","description":"ac-ctrl-range","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:ac-state', '{"siid":8,"piid":7,"type":"urn:lumi-spec:property:ac-state:00000007:lumi-mcn04:1","description":"ac-state","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:quick-cool-enable', '{"siid":8,"piid":8,"type":"urn:lumi-spec:property:quick-cool-enable:00000008:lumi-mcn04:1","description":"quick-cool-enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('ac-function:quick-cool-time', '{"siid":8,"piid":9,"type":"urn:lumi-spec:property:quick-cool-time:00000009:lumi-mcn04:1","description":"quick-cool-time","format":"uint8","access":["read","notify","write"],"unit":"none","valueRange":[1,59,1]}');
    this.addPropertyByString('ac-function:quick-cool-status', '{"siid":8,"piid":10,"type":"urn:lumi-spec:property:quick-cool-status:0000000a:lumi-mcn04:1","description":"quick-cool-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Quick-cool"}]}');
    this.addPropertyByString('ac-function:sleep-cfg', '{"siid":8,"piid":11,"type":"urn:lumi-spec:property:sleep-cfg:0000000b:lumi-mcn04:1","description":"sleep-cfg","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:sleep-status', '{"siid":8,"piid":12,"type":"urn:lumi-spec:property:sleep-status:0000000c:lumi-mcn04:1","description":"sleep-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Sleep"}]}');
    this.addPropertyByString('indicator-light:indicator-light', '{"siid":9,"piid":1,"type":"urn:lumi-spec:property:indicator-light:00000001:lumi-mcn04:1","description":"indicator-light","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('indicator-light:effective-time', '{"siid":9,"piid":2,"type":"urn:lumi-spec:property:effective-time:00000002:lumi-mcn04:1","description":"effective-time","format":"uint32","access":["read","notify","write"],"valueRange":[1,991378198,1]}');
    this.addPropertyByString('device-protect:temperature-alarm', '{"siid":10,"piid":1,"type":"urn:lumi-spec:property:temperature-alarm:00000001:lumi-mcn04:1","description":"temperature-alarm","format":"uint8","access":["notify"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":2,"description":"Abnormal"}]}');
    this.addPropertyByString('device-protect:power-alarm', '{"siid":10,"piid":2,"type":"urn:lumi-spec:property:power-alarm:00000002:lumi-mcn04:1","description":"power-alarm","format":"uint8","access":["notify"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":2,"description":"Abnormal"}]}');
    this.addPropertyByString('device-info:chip-temperature', '{"siid":11,"piid":1,"type":"urn:lumi-spec:property:chip-temperature:00000001:lumi-mcn04:1","description":"chip-temperature","format":"float","access":["notify"],"unit":"celsius","valueRange":[-200,200,0.1]}');
    this.addPropertyByString('device-info:debug-info', '{"siid":11,"piid":2,"type":"urn:lumi-spec:property:debug-info:00000002:lumi-mcn04:1","description":"debug-info","format":"string","access":["notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('air-conditioner:toggle', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:lumi-mcn04:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('device-protect:temp-alarm-prompt', '{"siid":10,"eiid":1,"type":"urn:lumi-spec:event:temp-alarm-prompt:00005001:lumi-mcn04:1","description":"temp-alarm-prompt","arguments":[1]}');
    this.addEventByString('device-protect:power-alarm-prompt', '{"siid":10,"eiid":2,"type":"urn:lumi-spec:event:power-alarm-prompt:00005002:lumi-mcn04:1","description":"power-alarm-prompt","arguments":[2]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  heatModeValue() {
    return 3;
  }

  coolModeValue() {
    return 1;
  }

  dryModeValue() {
    return 2;
  }

  fanModeValue() {
    return 4;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiAcpartnerMcn04;

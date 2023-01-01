const CurtainDevice = require('../CurtainDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiCurtainHmcn02 extends CurtainDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi BLE Curtain Driver E1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:lumi-hmcn02:2:0000C817';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:curtain:00007816:lumi-hmcn02:1:0000C817","description":""}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:identify:0000782C:lumi-hmcn02:1","description":"Identify"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:battery:00007805:lumi-hmcn02:1","description":"Battery"}');
    this.createServiceByString('{"siid":3,"type":"urn:lumi-spec:service:curtain-cfg:00007801:lumi-hmcn02:1","description":"curtain-cfg"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('curtain:motor-control', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:motor-control:00000038:lumi-hmcn02:1:0000C817","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Open"},{"value":2,"description":"Close"},{"value":3,"description":"Auto"}]}');
    this.addPropertyByString('curtain:target-position', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:target-position:0000003A:lumi-hmcn02:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:status', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:lumi-hmcn02:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Stop"},{"value":1,"description":"Opening"},{"value":2,"description":"Closing"}]}');
    this.addPropertyByString('curtain:fault', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-hmcn02:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Overtemp Uncharging"},{"value":2,"description":"Undertemp Uncharging"},{"value":3,"description":"Overtemp Charging"},{"value":4,"description":"Undertemp Charging"}]}');
    this.addPropertyByString('curtain:motor-reverse', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:motor-reverse:00000072:lumi-hmcn02:1","description":"Motor Reverse","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Forward"},{"value":1,"description":"Reserve"}]}');
    this.addPropertyByString('curtain:current-position', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:current-position:00000039:lumi-hmcn02:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:wake-up-mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:wake-up-mode:00000107:lumi-hmcn02:1","description":"Wake Up Mode","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('battery:battery-level', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:lumi-hmcn02:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:lumi-hmcn02:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"},{"value":3,"description":"Not chargeable"}]}');
    this.addPropertyByString('curtain-cfg:set-limit-point', '{"siid":3,"piid":2,"type":"urn:lumi-spec:property:set-limit-point:00000002:lumi-hmcn02:1","description":"set-limit-point","format":"uint8","access":["write","notify"],"unit":"none","valueList":[{"value":0,"description":"ClearPoint"},{"value":1,"description":"SetPointOpen"},{"value":2,"description":"SetPointClose"}]}');
    this.addPropertyByString('curtain-cfg:limit-point-num', '{"siid":3,"piid":3,"type":"urn:lumi-spec:property:limit-point-num:00000003:lumi-hmcn02:1","description":"limit-point-num","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,2,1]}');
    this.addPropertyByString('curtain-cfg:curtain-manual', '{"siid":3,"piid":4,"type":"urn:lumi-spec:property:curtain-manual:00000004:lumi-hmcn02:1","description":"curtain-manual","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"Disable"},{"value":0,"description":"Enable"}]}');
    this.addPropertyByString('curtain-cfg:curtain-range-flag', '{"siid":3,"piid":5,"type":"urn:lumi-spec:property:curtain-range-flag:00000005:lumi-hmcn02:1","description":"curtain-range-flag","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"None"},{"value":1,"description":"HaveIt"}]}');
    this.addPropertyByString('curtain-cfg:run-time', '{"siid":3,"piid":8,"type":"urn:lumi-spec:property:run-time:00000008:lumi-hmcn02:1","description":"run-time","format":"uint8","access":["read","notify"],"unit":"seconds","valueRange":[0,255,1]}');
    this.addPropertyByString('curtain-cfg:lock-unlock-cmd', '{"siid":3,"piid":9,"type":"urn:lumi-spec:property:lock-unlock-cmd:00000001:lumi-hmcn02:1","description":"lock-unlock-cmd","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Unlock"},{"value":1,"description":"Lock"}]}');
    this.addPropertyByString('curtain-cfg:lock-unlock-status', '{"siid":3,"piid":10,"type":"urn:lumi-spec:property:lock-unlock-status:00000006:lumi-hmcn02:1","description":"lock-unlock-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Unlocked"},{"value":1,"description":"Locked"},{"value":2,"description":"Lock-seting"},{"value":3,"description":"Unlock-seting"}]}');
    this.addPropertyByString('curtain-cfg:bright-status', '{"siid":3,"piid":11,"type":"urn:lumi-spec:property:bright-status:00000009:lumi-hmcn02:1","description":"bright-status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Dark"},{"value":1,"description":"Bright"},{"value":2,"description":"Critical"}]}');
    this.addPropertyByString('curtain-cfg:remote-power-off', '{"siid":3,"piid":15,"type":"urn:lumi-spec:property:remote-power-off:0000000d:lumi-hmcn02:1","description":"remote-power-off","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"PowerOff"}]}');
    this.addPropertyByString('curtain-cfg:battery-temp-warning', '{"siid":3,"piid":16,"type":"urn:lumi-spec:property:battery-temp-warning:0000000e:lumi-hmcn02:1","description":"battery-temp-warning","format":"int16","access":["read","notify"],"valueRange":[-5000,10000,1]}');
    this.addPropertyByString('curtain-cfg:long-batt-life-mode', '{"siid":3,"piid":17,"type":"urn:lumi-spec:property:long-batt-life-mode:0000000f:lumi-hmcn02:1","description":"long-batt-life-mode","format":"uint8","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"ON"},{"value":1,"description":"OFF"}]}');
    this.addPropertyByString('curtain-cfg:aging-test', '{"siid":3,"piid":18,"type":"urn:lumi-spec:property:aging-test:00000010:lumi-hmcn02:1","description":"aging-test","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Enable"},{"value":1,"description":"Disable"}]}');
    this.addPropertyByString('curtain-cfg:set-rail-type', '{"siid":3,"piid":19,"type":"urn:lumi-spec:property:set-rail-type:00000011:lumi-hmcn02:1","description":"set-rail-type","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"I Rail"},{"value":2,"description":"U Rail"},{"value":3,"description":"Rome Pole"}]}');
    this.addPropertyByString('curtain-cfg:sync-utc', '{"siid":3,"piid":20,"type":"urn:lumi-spec:property:sync-utc:00000012:lumi-hmcn02:1","description":"sync-utc","format":"uint32","access":["write"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('curtain-cfg:light-auto-timezone', '{"siid":3,"piid":21,"type":"urn:lumi-spec:property:light-auto-timezone:00000007:lumi-hmcn02:1","description":"light-auto-timezone","format":"uint32","access":["read","notify","write"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('curtain-cfg:light-auto-param', '{"siid":3,"piid":22,"type":"urn:lumi-spec:property:light-auto-param:0000000a:lumi-hmcn02:1","description":"light-auto-param","format":"uint32","access":["read","notify","write"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('curtain-cfg:unlocked-ever', '{"siid":3,"piid":23,"type":"urn:lumi-spec:property:unlocked-ever:0000000b:lumi-hmcn02:1","description":"unlocked-ever","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Never Unlock"},{"value":1,"description":"Unlock Ever"}]}');
    this.addPropertyByString('curtain-cfg:pointset-block-time', '{"siid":3,"piid":24,"type":"urn:lumi-spec:property:pointset-block-time:0000000c:lumi-hmcn02:1","description":"pointset-block-time","format":"uint8","access":["read","notify","write"],"unit":"seconds","valueRange":[10,255,1]}');
    this.addPropertyByString('curtain-cfg:long-batt-time-zoom', '{"siid":3,"piid":25,"type":"urn:lumi-spec:property:long-batt-time-zoom:00000013:lumi-hmcn02:2","description":"long-batt-time-zoom","format":"uint32","access":["write","read","notify"],"valueRange":[0,4294967295,1]}');
  }

  initDeviceActions() {
    this.addActionByString('curtain:motor-calibrate', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:motor-calibrate:00002836:lumi-hmcn02:1","description":"Motor Calibrate","in":[],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:lumi-hmcn02:1","description":"Identify","in":[],"out":[]}');
    this.addActionByString('curtain-cfg:sync-all-rd-attr', '{"siid":3,"aiid":1,"type":"urn:lumi-spec:action:sync-all-rd-attr:00002801:lumi-hmcn02:1","description":"sync-all-rd-attr","in":[],"out":[]}');
    this.addActionByString('curtain-cfg:block-auto-pointset', '{"siid":3,"aiid":2,"type":"urn:lumi-spec:action:block-auto-pointset:00002802:lumi-hmcn02:1","description":"block-auto-pointset","in":[],"out":[]}');
    this.addActionByString('curtain-cfg:resume-auto-pointset', '{"siid":3,"aiid":3,"type":"urn:lumi-spec:action:resume-auto-pointset:00002803:lumi-hmcn02:1","description":"resume-auto-pointset","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('curtain:curtain-manually-opened', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:curtain-manually-opened:00005021:lumi-hmcn02:1","description":"Curtain Manually Opened","arguments":[]}');
    this.addEventByString('curtain:curtain-manually-closed', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:curtain-manually-closed:00005022:lumi-hmcn02:1","description":"Curtain Manually Closed","arguments":[]}');
    this.addEventByString('battery:low-battery', '{"siid":5,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:lumi-hmcn02:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('curtain-cfg:dev-factory-reset', '{"siid":3,"eiid":3,"type":"urn:lumi-spec:event:dev-factory-reset:00005003:lumi-hmcn02:1","description":"dev-factory-reset","arguments":[]}');
    this.addEventByString('curtain-cfg:extreme-batt-low', '{"siid":3,"eiid":4,"type":"urn:lumi-spec:event:extreme-batt-low:00005004:lumi-hmcn02:1","description":"extreme-batt-low","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-low-autp', '{"siid":3,"eiid":5,"type":"urn:lumi-spec:event:batt-low-autp:00005001:lumi-hmcn02:1","description":"batt-low-autp","arguments":[]}');
    this.addEventByString('curtain-cfg:error-occurred', '{"siid":3,"eiid":6,"type":"urn:lumi-spec:event:error-occurred:00005002:lumi-hmcn02:1","description":"error-occurred","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-output-normal', '{"siid":3,"eiid":7,"type":"urn:lumi-spec:event:batt-output-normal:00005005:lumi-hmcn02:1","description":"batt-output-normal","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-output-overtmp', '{"siid":3,"eiid":8,"type":"urn:lumi-spec:event:batt-output-overtmp:00005006:lumi-hmcn02:1","description":"batt-output-overtmp","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-output-undertmp', '{"siid":3,"eiid":9,"type":"urn:lumi-spec:event:batt-output-undertmp:00005007:lumi-hmcn02:1","description":"batt-output-undertmp","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-overtmp-char', '{"siid":3,"eiid":10,"type":"urn:lumi-spec:event:batt-overtmp-char:00005008:lumi-hmcn02:1","description":"batt-overtmp-char","arguments":[]}');
    this.addEventByString('curtain-cfg:batt-undertmp-char', '{"siid":3,"eiid":11,"type":"urn:lumi-spec:event:batt-undertmp-char:00005009:lumi-hmcn02:1","description":"batt-undertmp-char","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusClosingValue() {
    return 2;
  }

  statusStopValue() {
    return 0;
  }

  statusOpeningValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiCurtainHmcn02;

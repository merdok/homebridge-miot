const OvenDevice = require('../OvenDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiOvenX02 extends OvenDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mijia Smart Steam Oven Toaster 12L';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:oven:0000A04E:chunmi-x02:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:oven:00007862:chunmi-x02:1","description":"Oven"}');
    this.createServiceByString('{"siid":4,"type":"urn:chunmi-spec:service:custom:00007801:chunmi-x02:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('oven:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-x02:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"},{"value":3,"description":"Paused"},{"value":5,"description":"Sleep"},{"value":11,"description":"Fault"}]}');
    this.addPropertyByString('oven:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:chunmi-x02:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":6,"description":"HighTemperature"},{"value":9,"description":"NTCBreak"},{"value":11,"description":"CommunicateError"}]}');
    this.addPropertyByString('oven:cook-mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:cook-mode:00000037:chunmi-x02:1","description":"Cook Mode","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"Cheese"},{"value":1,"description":"Tart"},{"value":2,"description":"Wing"},{"value":3,"description":"Seafood"}]}');
    this.addPropertyByString('oven:left-time', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:left-time:0000003C:chunmi-x02:1","description":"Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('oven:target-temperature', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:target-temperature:00000021:chunmi-x02:1","description":"Target Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[0,255,1]}');
    this.addPropertyByString('oven:temperature', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:temperature:00000020:chunmi-x02:1","description":"Temperature","format":"uint8","access":["read","notify"],"unit":"celsius","valueRange":[0,255,1]}');
    this.addPropertyByString('oven:cook-time', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:cook-time:000000C8:chunmi-x02:1","description":"Cook Time","format":"uint32","access":[],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:menu', '{"siid":4,"piid":1,"type":"urn:chunmi-spec:property:menu:00000001:chunmi-x02:1","description":"menu","format":"string","access":["read","notify"]}');
    this.addPropertyByString('custom:phase', '{"siid":4,"piid":2,"type":"urn:chunmi-spec:property:phase:00000002:chunmi-x02:1","description":"phase","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('custom:timeout-time', '{"siid":4,"piid":3,"type":"urn:chunmi-spec:property:timeout-time:00000003:chunmi-x02:1","description":"timeout-time","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:adjust-time-cnt', '{"siid":4,"piid":4,"type":"urn:chunmi-spec:property:adjust-time-cnt:00000004:chunmi-x02:1","description":"adjust-time-cnt","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:adjust-temper-cnt', '{"siid":4,"piid":5,"type":"urn:chunmi-spec:property:adjust-temper-cnt:00000005:chunmi-x02:1","description":"adjust-temper-cnt","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:custom-details', '{"siid":4,"piid":6,"type":"urn:chunmi-spec:property:custom-details:00000006:chunmi-x02:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:version', '{"siid":4,"piid":7,"type":"urn:chunmi-spec:property:version:00000007:chunmi-x02:1","description":"version","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,9999,1]}');
    this.addPropertyByString('custom:finish-state', '{"siid":4,"piid":8,"type":"urn:chunmi-spec:property:finish-state:00000008:chunmi-x02:1","description":"finish-state","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Operated"},{"value":1,"description":"NormalFinish"},{"value":2,"description":"TimeoutFinish"}]}');
    this.addPropertyByString('custom:recipe-type', '{"siid":4,"piid":9,"type":"urn:chunmi-spec:property:recipe-type:00000009:chunmi-x02:1","description":"recipe-type","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"OfficialMode"},{"value":1,"description":"OfficialRecipe"},{"value":2,"description":"CustomRecipe"}]}');
    this.addPropertyByString('custom:cooking-time', '{"siid":4,"piid":10,"type":"urn:chunmi-spec:property:cooking-time:0000000a:chunmi-x02:1","description":"cooking-time","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:cook-data', '{"siid":4,"piid":11,"type":"urn:chunmi-spec:property:cook-data:0000000b:chunmi-x02:1","description":"cook-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:proceed-cook-data', '{"siid":4,"piid":12,"type":"urn:chunmi-spec:property:proceed-cook-data:0000000c:chunmi-x02:1","description":"proceed-cook-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:user-id', '{"siid":4,"piid":13,"type":"urn:chunmi-spec:property:user-id:0000000d:chunmi-x02:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:information', '{"siid":4,"piid":14,"type":"urn:chunmi-spec:property:information:0000000e:chunmi-x02:1","description":"information","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:recipe-name', '{"siid":4,"piid":15,"type":"urn:chunmi-spec:property:recipe-name:0000000f:chunmi-x02:1","description":"recipe-name","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:bell', '{"siid":4,"piid":16,"type":"urn:chunmi-spec:property:bell:00000010:chunmi-x02:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:menu-order', '{"siid":4,"piid":17,"type":"urn:chunmi-spec:property:menu-order:00000011:chunmi-x02:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:interaction', '{"siid":4,"piid":18,"type":"urn:chunmi-spec:property:interaction:00000012:chunmi-x02:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:inspection-data', '{"siid":4,"piid":19,"type":"urn:chunmi-spec:property:inspection-data:00000013:chunmi-x02:1","description":"inspection-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:event-out-string', '{"siid":4,"piid":20,"type":"urn:chunmi-spec:property:event-out-string:00000014:chunmi-x02:1","description":"event-out-string","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:menu-id', '{"siid":4,"piid":21,"type":"urn:chunmi-spec:property:menu-id:00000015:chunmi-x02:1","description":"menu-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:board-version', '{"siid":4,"piid":22,"type":"urn:chunmi-spec:property:board-version:00000016:chunmi-x02:1","description":"board-version","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[1,255,1]}');
    this.addPropertyByString('custom:left-time', '{"siid":4,"piid":23,"type":"urn:chunmi-spec:property:left-time:00000017:chunmi-x02:1","description":"left-time","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:setting-time', '{"siid":4,"piid":24,"type":"urn:chunmi-spec:property:setting-time:00000018:chunmi-x02:1","description":"setting-time","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
  }

  initDeviceActions() {
    this.addActionByString('oven:start-cook', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-cook:00002806:chunmi-x02:1","description":"Start Cook","in":[4],"out":[]}');
    this.addActionByString('oven:cancel-cooking', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-x02:1","description":"Cancel Cooking","in":[],"out":[]}');
    this.addActionByString('oven:pause', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:pause:0000280C:chunmi-x02:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('custom:start-cooking', '{"siid":4,"aiid":1,"type":"urn:chunmi-spec:action:start-cooking:00002801:chunmi-x02:1","description":"start-cooking","in":[15,11,13],"out":[]}');
    this.addActionByString('custom:pause-cooking', '{"siid":4,"aiid":2,"type":"urn:chunmi-spec:action:pause-cooking:00002802:chunmi-x02:1","description":"pause-cooking","in":[13,14],"out":[]}');
    this.addActionByString('custom:proceed-cooking', '{"siid":4,"aiid":3,"type":"urn:chunmi-spec:action:proceed-cooking:00002803:chunmi-x02:1","description":"proceed-cooking","in":[12,13,14],"out":[]}');
    this.addActionByString('custom:stop-cooking', '{"siid":4,"aiid":4,"type":"urn:chunmi-spec:action:stop-cooking:00002804:chunmi-x02:1","description":"stop-cooking","in":[13,14],"out":[]}');
    this.addActionByString('custom:set-menu', '{"siid":4,"aiid":5,"type":"urn:chunmi-spec:action:set-menu:00002805:chunmi-x02:1","description":"set-menu","in":[15,11,16,13],"out":[]}');
    this.addActionByString('custom:delete-menu', '{"siid":4,"aiid":6,"type":"urn:chunmi-spec:action:delete-menu:00002806:chunmi-x02:1","description":"delete-menu","in":[17,16,13,14],"out":[]}');
    this.addActionByString('custom:factory-reset', '{"siid":4,"aiid":7,"type":"urn:chunmi-spec:action:factory-reset:00002807:chunmi-x02:1","description":"factory-reset","in":[16,13,14],"out":[]}');
    this.addActionByString('custom:set-info', '{"siid":4,"aiid":8,"type":"urn:chunmi-spec:action:set-info:00002808:chunmi-x02:1","description":"set-info","in":[18,13,14],"out":[]}');
    this.addActionByString('custom:get-info', '{"siid":4,"aiid":9,"type":"urn:chunmi-spec:action:get-info:00002809:chunmi-x02:1","description":"get-info","in":[],"out":[18]}');
    this.addActionByString('custom:clear-finish-state', '{"siid":4,"aiid":10,"type":"urn:chunmi-spec:action:clear-finish-state:0000280a:chunmi-x02:1","description":"clear-finish-state","in":[13,14],"out":[]}');
    this.addActionByString('custom:get-inspection-data', '{"siid":4,"aiid":11,"type":"urn:chunmi-spec:action:get-inspection-data:0000280b:chunmi-x02:1","description":"get-inspection-data","in":[],"out":[19]}');
    this.addActionByString('custom:get-error-info', '{"siid":4,"aiid":12,"type":"urn:chunmi-spec:action:get-error-info:0000280c:chunmi-x02:1","description":"get-error-info","in":[7],"out":[20]}');
  }

  initDeviceEvents() {
    this.addEventByString('oven:low-water-level', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:low-water-level:0000500A:chunmi-x02:1","description":"Low Water Level","arguments":[]}');
    this.addEventByString('custom:cook-finish', '{"siid":4,"eiid":1,"type":"urn:chunmi-spec:event:cook-finish:00005001:chunmi-x02:1","description":"cook-finish","arguments":[21]}');
    this.addEventByString('custom:cooking-complete', '{"siid":4,"eiid":2,"type":"urn:chunmi-spec:event:cooking-complete:00005002:chunmi-x02:1","description":"cooking-complete","arguments":[]}');
    this.addEventByString('custom:ntc-break', '{"siid":4,"eiid":3,"type":"urn:chunmi-spec:event:ntc-break:00005003:chunmi-x02:1","description":"ntc-break","arguments":[]}');
    this.addEventByString('custom:high-temperature', '{"siid":4,"eiid":4,"type":"urn:chunmi-spec:event:high-temperature:00005004:chunmi-x02:1","description":"high-temperature","arguments":[]}');
    this.addEventByString('custom:communicate-error', '{"siid":4,"eiid":5,"type":"urn:chunmi-spec:event:communicate-error:00005005:chunmi-x02:1","description":"communicate-error","arguments":[]}');
    this.addEventByString('custom:general-event', '{"siid":4,"eiid":6,"type":"urn:chunmi-spec:event:general-event:00005006:chunmi-x02:1","description":"general-event","arguments":[20]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 2;
  }

  statusFaultValue() {
    return 11;
  }

  statusPausedValue() {
    return 3;
  }

  statusSleepValue() {
    return 5;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiOvenX02;

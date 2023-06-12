const CookerDevice = require('../CookerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiCookerR2 extends CookerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'joyami Smart Rice Cooker S1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:cooker:0000A00B:chunmi-r2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:cooker:00007815:chunmi-r2:1","description":"Cooker"}');
    this.createServiceByString('{"siid":4,"type":"urn:chunmi-spec:service:custom:00007801:chunmi-r2:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('cooker:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-r2:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"},{"value":3,"description":"Keep Warm"},{"value":4,"description":"Delay"}]}');
    this.addPropertyByString('cooker:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:chunmi-r2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":9,"description":"Top-sensor-bad"},{"value":10,"description":"Bot-sensor-bad"},{"value":11,"description":"Line-bad"}]}');
    this.addPropertyByString('cooker:auto-keep-warm', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:auto-keep-warm:0000002B:chunmi-r2:1","description":"Auto Keep Warm","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"En-Keepwarm"},{"value":2,"description":"Dis-Keepwarm"}]}');
    this.addPropertyByString('cooker:cook-mode', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:cook-mode:00000037:chunmi-r2:1","description":"Cook Mode","format":"uint8","access":[],"unit":"none","valueList":[{"value":1,"description":"Fine Cook"},{"value":2,"description":"Quick Cook"},{"value":3,"description":"Cook Congee"},{"value":4,"description":"Keep Warm"}]}');
    this.addPropertyByString('custom:cooking-data', '{"siid":4,"piid":15,"type":"urn:chunmi-spec:property:cooking-data:0000000f:chunmi-r2:1","description":"cooking-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:bell', '{"siid":4,"piid":16,"type":"urn:chunmi-spec:property:bell:00000010:chunmi-r2:1","description":"bell","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"Disbell"},{"value":1,"description":"Enbell"}]}');
    this.addPropertyByString('custom:status', '{"siid":4,"piid":17,"type":"urn:chunmi-spec:property:status:00000001:chunmi-r2:1","description":"status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Waiting"},{"value":2,"description":"Runing"},{"value":3,"description":"Keepwarm"},{"value":4,"description":"Pre"},{"value":6,"description":"Pre-set"}]}');
    this.addPropertyByString('custom:phase', '{"siid":4,"piid":18,"type":"urn:chunmi-spec:property:phase:00000002:chunmi-r2:1","description":"phase","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,15,1]}');
    this.addPropertyByString('custom:menu', '{"siid":4,"piid":19,"type":"urn:chunmi-spec:property:menu:00000003:chunmi-r2:1","description":"menu","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:t-cook', '{"siid":4,"piid":20,"type":"urn:chunmi-spec:property:t-cook:00000004:chunmi-r2:1","description":"t-cook","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('custom:t-left', '{"siid":4,"piid":21,"type":"urn:chunmi-spec:property:t-left:00000005:chunmi-r2:1","description":"t-left","format":"uint16","access":["read","notify"],"unit":"seconds","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom:t-pre', '{"siid":4,"piid":22,"type":"urn:chunmi-spec:property:t-pre:00000006:chunmi-r2:1","description":"t-pre","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:t-kw', '{"siid":4,"piid":23,"type":"urn:chunmi-spec:property:t-kw:00000007:chunmi-r2:1","description":"t-kw","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:taste', '{"siid":4,"piid":24,"type":"urn:chunmi-spec:property:taste:00000008:chunmi-r2:1","description":"taste","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Soft"},{"value":1,"description":"Fit"},{"value":2,"description":"Hard"}]}');
    this.addPropertyByString('custom:rice', '{"siid":4,"piid":26,"type":"urn:chunmi-spec:property:rice:00000009:chunmi-r2:1","description":"rice","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom:akw', '{"siid":4,"piid":27,"type":"urn:chunmi-spec:property:akw:0000000a:chunmi-r2:1","description":"akw","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Enkeepwarm"},{"value":2,"description":"Diskeepwarm"}]}');
    this.addPropertyByString('custom:version', '{"siid":4,"piid":28,"type":"urn:chunmi-spec:property:version:0000000b:chunmi-r2:1","description":"version","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[1,9999,1]}');
    this.addPropertyByString('custom:e-code', '{"siid":4,"piid":29,"type":"urn:chunmi-spec:property:e-code:0000000c:chunmi-r2:1","description":"e-code","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":9,"description":"Top-senor-bad"},{"value":10,"description":"Bot-senor-bad"},{"value":11,"description":"Line-bad"},{"value":0,"description":"N-fault"}]}');
    this.addPropertyByString('custom:temp', '{"siid":4,"piid":30,"type":"urn:chunmi-spec:property:temp:0000000d:chunmi-r2:1","description":"temp","format":"uint8","access":["read","notify"],"unit":"celsius","valueRange":[0,150,1]}');
    this.addPropertyByString('custom:push', '{"siid":4,"piid":31,"type":"urn:chunmi-spec:property:push:0000000e:chunmi-r2:1","description":"push","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"En-push"},{"value":1,"description":"Dis-push"}]}');
    this.addPropertyByString('custom:temp-history', '{"siid":4,"piid":32,"type":"urn:chunmi-spec:property:temp-history:00000011:chunmi-r2:1","description":"temp-history","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:boil', '{"siid":4,"piid":33,"type":"urn:chunmi-spec:property:boil:00000012:chunmi-r2:1","description":"boil","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"N-boil"},{"value":1,"description":"Y-boil"}]}');
    this.addPropertyByString('custom:show-led', '{"siid":4,"piid":34,"type":"urn:chunmi-spec:property:show-led:00000013:chunmi-r2:1","description":"show-led","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"En-show-led"},{"value":1,"description":"Dis-show-led"}]}');
  }

  initDeviceActions() {
    this.addActionByString('cooker:start-cook', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-cook:00002806:chunmi-r2:1","description":"Start Cook","in":[6],"out":[]}');
    this.addActionByString('cooker:cancel-cooking', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-r2:1","description":"Cancel Cooking","in":[],"out":[]}');
    this.addActionByString('custom:set-start', '{"siid":4,"aiid":1,"type":"urn:chunmi-spec:action:set-start:00002801:chunmi-r2:1","description":"set-start","in":[15],"out":[]}');
    this.addActionByString('custom:cancel-cooking', '{"siid":4,"aiid":2,"type":"urn:chunmi-spec:action:cancel-cooking:00002802:chunmi-r2:1","description":"cancel-cooking","in":[],"out":[]}');
    this.addActionByString('custom:set-menu', '{"siid":4,"aiid":3,"type":"urn:chunmi-spec:action:set-menu:00002803:chunmi-r2:1","description":"set-menu","in":[15],"out":[]}');
    this.addActionByString('custom:set-factory-reset', '{"siid":4,"aiid":4,"type":"urn:chunmi-spec:action:set-factory-reset:00002804:chunmi-r2:1","description":"set-factory-reset","in":[16],"out":[]}');
    this.addActionByString('custom:set-push', '{"siid":4,"aiid":5,"type":"urn:chunmi-spec:action:set-push:00002805:chunmi-r2:1","description":"set-push","in":[31],"out":[]}');
    this.addActionByString('custom:get-temp-history', '{"siid":4,"aiid":6,"type":"urn:chunmi-spec:action:get-temp-history:00002806:chunmi-r2:1","description":"get-temp-history","in":[],"out":[32]}');
    this.addActionByString('custom:set-show-led', '{"siid":4,"aiid":7,"type":"urn:chunmi-spec:action:set-show-led:00002807:chunmi-r2:1","description":"set-show-led","in":[34],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('cooker:cooking-finished', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:cooking-finished:0000501C:chunmi-r2:1","description":"Cooking Finished","arguments":[]}');
    this.addEventByString('custom:topsensorbad', '{"siid":4,"eiid":1,"type":"urn:chunmi-spec:event:topsensorbad:00005001:chunmi-r2:1","description":"topsensorbad","arguments":[]}');
    this.addEventByString('custom:bottomsensorbad', '{"siid":4,"eiid":2,"type":"urn:chunmi-spec:event:bottomsensorbad:00005002:chunmi-r2:1","description":"bottomsensorbad","arguments":[]}');
    this.addEventByString('custom:wirebroken', '{"siid":4,"eiid":3,"type":"urn:chunmi-spec:event:wirebroken:00005003:chunmi-r2:1","description":"wirebroken","arguments":[]}');
    this.addEventByString('custom:cook-finish', '{"siid":4,"eiid":4,"type":"urn:chunmi-spec:event:cook-finish:00005004:chunmi-r2:1","description":"cook-finish","arguments":[]}');
    this.addEventByString('custom:cooking-complete', '{"siid":4,"eiid":5,"type":"urn:chunmi-spec:event:cooking-complete:00005005:chunmi-r2:1","description":"cooking-complete","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiCookerR2;

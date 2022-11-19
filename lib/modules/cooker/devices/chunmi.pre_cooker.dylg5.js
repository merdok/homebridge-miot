const CookerDevice = require('../CookerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiPre_cookerDylg5 extends CookerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Pressure Cooker 5L';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:pressure-cooker:0000A04B:chunmi-dylg5:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:pressure-cooker:00007861:chunmi-dylg5:1","description":"Pressure Cooker"}');
    this.createServiceByString('{"siid":5,"type":"urn:chunmi-spec:service:custom:00007801:chunmi-dylg5:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('pressure-cooker:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-dylg5:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"},{"value":3,"description":"Keep Warm"},{"value":4,"description":"Delay"},{"value":5,"description":"Fault"}]}');
    this.addPropertyByString('pressure-cooker:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:chunmi-dylg5:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('pressure-cooker:cook-mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:cook-mode:00000037:chunmi-dylg5:1","description":"Cook Mode","format":"uint8","access":[],"unit":"none","valueList":[{"value":1,"description":"Rice"},{"value":2,"description":"Multigrain Porridge"},{"value":3,"description":"Red Meat"},{"value":4,"description":"Poultry"},{"value":5,"description":"Beans"},{"value":12,"description":"Tendons"},{"value":6,"description":"Soup"},{"value":7,"description":"Low Temperature"},{"value":8,"description":"Open Lid"},{"value":9,"description":"Keep Warm"},{"value":10,"description":"Reheat Rice"},{"value":11,"description":"Reheat"}]}');
    this.addPropertyByString('pressure-cooker:left-time', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:left-time:0000003C:chunmi-dylg5:1","description":"Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:cook-data', '{"siid":5,"piid":1,"type":"urn:chunmi-spec:property:cook-data:00000001:chunmi-dylg5:1","description":"cook-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:taste', '{"siid":5,"piid":2,"type":"urn:chunmi-spec:property:taste:00000002:chunmi-dylg5:1","description":"taste","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"嚼劲"},{"value":1,"description":"适中"},{"value":2,"description":"软糯"},{"value":255,"description":"无口感菜谱"}]}');
    this.addPropertyByString('custom:favs', '{"siid":5,"piid":3,"type":"urn:chunmi-spec:property:favs:00000003:chunmi-dylg5:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:cook-status', '{"siid":5,"piid":4,"type":"urn:chunmi-spec:property:cook-status:00000004:chunmi-dylg5:1","description":"cook-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"待机中"},{"value":2,"description":"烹饪中"},{"value":3,"description":"保温中"},{"value":4,"description":"预约中"},{"value":5,"description":"设置时钟"},{"value":6,"description":"预约设置中"},{"value":7,"description":"未锁盖"},{"value":8,"description":"设备异常"}]}');
    this.addPropertyByString('custom:menu-id', '{"siid":5,"piid":7,"type":"urn:chunmi-spec:property:menu-id:00000007:chunmi-dylg5:1","description":"menu-id","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:press-status', '{"siid":5,"piid":8,"type":"urn:chunmi-spec:property:press-status:00000008:chunmi-dylg5:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"未烹饪无压力"},{"value":1,"description":"升温阶段"},{"value":2,"description":"升压阶段"},{"value":3,"description":"保压阶段"}]}');
    this.addPropertyByString('custom:cook-time', '{"siid":5,"piid":9,"type":"urn:chunmi-spec:property:cook-time:00000009:chunmi-dylg5:1","description":"cook-time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:finish-push', '{"siid":5,"piid":10,"type":"urn:chunmi-spec:property:finish-push:0000000a:chunmi-dylg5:1","description":"finish-push","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:cover-state', '{"siid":5,"piid":11,"type":"urn:chunmi-spec:property:cover-state:0000000b:chunmi-dylg5:1","description":"cover-state","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"有盖未锁好"},{"value":1,"description":"无盖/有盖已锁好"}]}');
    this.addPropertyByString('custom:cook-finish-flag', '{"siid":5,"piid":12,"type":"urn:chunmi-spec:property:cook-finish-flag:00000006:chunmi-dylg5:1","description":"cook-finish-flag","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"未完成"},{"value":1,"description":"烹饪完成"}]}');
    this.addPropertyByString('custom:menu-type', '{"siid":5,"piid":13,"type":"urn:chunmi-spec:property:menu-type:0000000c:chunmi-dylg5:1","description":"menu-type","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"官方功能"},{"value":1,"description":"官方食谱"},{"value":2,"description":"自定义食谱"}]}');
    this.addPropertyByString('custom:akw-flg', '{"siid":5,"piid":14,"type":"urn:chunmi-spec:property:akw-flg:0000000d:chunmi-dylg5:1","description":"akw-flg","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,1023,1]}');
    this.addPropertyByString('custom:error-code', '{"siid":5,"piid":15,"type":"urn:chunmi-spec:property:error-code:0000000e:chunmi-dylg5:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":3,"description":"电压过高"},{"value":4,"description":"电压过低"},{"value":5,"description":"底部高温"},{"value":10,"description":"底部温控器损坏"},{"value":11,"description":"硬件通讯故障"},{"value":0,"description":"无故障"}]}');
    this.addPropertyByString('custom:action-out-string', '{"siid":5,"piid":16,"type":"urn:chunmi-spec:property:action-out-string:00000005:chunmi-dylg5:1","description":"action-out-string","format":"string","access":[],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('pressure-cooker:start-cook', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-cook:00002806:chunmi-dylg5:1","description":"Start Cook","in":[3],"out":[]}');
    this.addActionByString('pressure-cooker:cancel-cooking', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-dylg5:1","description":"Cancel Cooking","in":[],"out":[]}');
    this.addActionByString('custom:cooking-start', '{"siid":5,"aiid":1,"type":"urn:chunmi-spec:action:cooking-start:00002801:chunmi-dylg5:1","description":"cooking-start","in":[1],"out":[]}');
    this.addActionByString('custom:set-menu', '{"siid":5,"aiid":2,"type":"urn:chunmi-spec:action:set-menu:00002802:chunmi-dylg5:1","description":"set-menu","in":[1],"out":[]}');
    this.addActionByString('custom:factory-reset', '{"siid":5,"aiid":3,"type":"urn:chunmi-spec:action:factory-reset:00002803:chunmi-dylg5:1","description":"factory-reset","in":[],"out":[]}');
    this.addActionByString('custom:cancel-cooking', '{"siid":5,"aiid":4,"type":"urn:chunmi-spec:action:cancel-cooking:00002804:chunmi-dylg5:1","description":"cancel-cooking","in":[],"out":[]}');
    this.addActionByString('custom:get-inspection-data', '{"siid":5,"aiid":5,"type":"urn:chunmi-spec:action:get-inspection-data:00002805:chunmi-dylg5:1","description":"get-inspection-data","in":[],"out":[16]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom:cook-finish', '{"siid":5,"eiid":1,"type":"urn:chunmi-spec:event:cook-finish:00005001:chunmi-dylg5:1","description":"cook-finish","arguments":[7]}');
    this.addEventByString('custom:cook-complete', '{"siid":5,"eiid":2,"type":"urn:chunmi-spec:event:cook-complete:00005002:chunmi-dylg5:1","description":"cook-complete","arguments":[]}');
    this.addEventByString('custom:high-voltage', '{"siid":5,"eiid":3,"type":"urn:chunmi-spec:event:high-voltage:00005003:chunmi-dylg5:1","description":"high-voltage","arguments":[]}');
    this.addEventByString('custom:low-voltage', '{"siid":5,"eiid":4,"type":"urn:chunmi-spec:event:low-voltage:00005004:chunmi-dylg5:1","description":"low-voltage","arguments":[]}');
    this.addEventByString('custom:b-sensor-bad', '{"siid":5,"eiid":5,"type":"urn:chunmi-spec:event:b-sensor-bad:00005005:chunmi-dylg5:1","description":"b-sensor-bad","arguments":[]}');
    this.addEventByString('custom:b-sensor-high', '{"siid":5,"eiid":6,"type":"urn:chunmi-spec:event:b-sensor-high:00005006:chunmi-dylg5:1","description":"b-sensor-high","arguments":[]}');
    this.addEventByString('custom:wire-broken', '{"siid":5,"eiid":7,"type":"urn:chunmi-spec:event:wire-broken:00005007:chunmi-dylg5:1","description":"wire-broken","arguments":[]}');
    this.addEventByString('custom:cook-start', '{"siid":5,"eiid":8,"type":"urn:chunmi-spec:event:cook-start:00005008:chunmi-dylg5:1","description":"cook-start","arguments":[]}');
    this.addEventByString('custom:cover-unlock', '{"siid":5,"eiid":9,"type":"urn:chunmi-spec:event:cover-unlock:00005009:chunmi-dylg5:1","description":"cover-unlock","arguments":[]}');
    this.addEventByString('custom:cover-lock', '{"siid":5,"eiid":10,"type":"urn:chunmi-spec:event:cover-lock:0000500a:chunmi-dylg5:1","description":"cover-lock","arguments":[]}');
    this.addEventByString('custom:error-message', '{"siid":5,"eiid":11,"type":"urn:chunmi-spec:event:error-message:0000500b:chunmi-dylg5:1","description":"error-message","arguments":[16]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/

  startCookAction() {
    return this.getAction('pressure-cooker:start-cook');
  }

  cancelCookingAction() {
    return this.getAction('pressure-cooker:cancel-cooking');
  }


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiPre_cookerDylg5;

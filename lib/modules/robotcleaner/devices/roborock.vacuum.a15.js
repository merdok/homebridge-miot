const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoborockVacuumA15 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Roborock Vacuum S7';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-a15:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'brush-cleaner:brush-life-level', 'filter:filter-life-level'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:roborock-a15:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:roborock-a15:1","description":"Battery"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:identify:0000782C:roborock-a15:1","description":"Identify"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:roborock-a15:1","description":"Main Cleaning Brush"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:roborock-a15:1","description":"Side Cleaning Brush"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:filter:0000780B:roborock-a15:1","description":"Filter"}');
    this.createServiceByString('{"siid":7,"type":"urn:roborock-spec:service:generic-rpc:00007801:roborock-a15:1","description":"generic-rpc"}');
    this.createServiceByString('{"siid":8,"type":"urn:roborock-spec:service:roborock-vacuum:00007802:roborock-a15:1","description":"roborock-vacuum"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:roborock-a15:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Idle"},{"value":3,"description":"Idle"},{"value":5,"description":"Sweeping"},{"value":6,"description":"Go Charging"},{"value":7,"description":"Sweeping"},{"value":8,"description":"Charging"},{"value":10,"description":"Paused"},{"value":11,"description":"Sweeping"},{"value":12,"description":"Error"},{"value":14,"description":"Updating"},{"value":15,"description":"Go Charging"},{"value":16,"description":"Sweeping"},{"value":17,"description":"Sweeping"},{"value":18,"description":"Sweeping"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:roborock-a15:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":101,"description":"Silent"},{"value":102,"description":"Basic"},{"value":103,"description":"Strong"},{"value":104,"description":"Full Speed"},{"value":105,"description":"Silent"},{"value":106,"description":"Custom"}]}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:room-ids:00000073:roborock-a15:1","description":"Room IDs","format":"string","access":[]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:roborock-a15:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:roborock-a15:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:roborock-a15:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner2:brush-life-level', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:roborock-a15:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:roborock-a15:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('generic-rpc:rpc-in', '{"siid":7,"piid":1,"type":"urn:roborock-spec:property:rpc-in:00000001:roborock-a15:1","description":"rpc-in","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('generic-rpc:rpc-out', '{"siid":7,"piid":2,"type":"urn:roborock-spec:property:rpc-out:00000002:roborock-a15:1","description":"rpc-out","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('roborock-vacuum:consumable-id', '{"siid":8,"piid":1,"type":"urn:roborock-spec:property:consumable-id:00000001:roborock-a15:1","description":"consumable-id","format":"uint8","access":[],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('roborock-vacuum:failed-reason', '{"siid":8,"piid":2,"type":"urn:roborock-spec:property:failed-reason:00000002:roborock-a15:1","description":"failed-reason","format":"uint8","access":[],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('roborock-vacuum:error-code', '{"siid":8,"piid":3,"type":"urn:roborock-spec:property:error-code:00000003:roborock-a15:1","description":"error-code","format":"uint16","access":[],"unit":"none","valueRange":[0,65535,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:roborock-a15:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:roborock-a15:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-mop', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:start-mop:00002834:roborock-a15:1","description":"Start Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-sweep-mop', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:start-sweep-mop:00002835:roborock-a15:1","description":"Start Sweep Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:roborock-a15:1","description":"Start Room Sweep","in":[9],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:roborock-a15:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":6,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:roborock-a15:1","description":"Identify","in":[],"out":[]}');
    this.addActionByString('generic-rpc:generic-rpc-call', '{"siid":7,"aiid":1,"type":"urn:roborock-spec:action:generic-rpc-call:00002801:roborock-a15:1","description":"generic-rpc-call","in":[1],"out":[2]}');
  }

  initDeviceEvents() {
    this.addEventByString('roborock-vacuum:error', '{"siid":8,"eiid":1,"type":"urn:roborock-spec:event:error:00005001:roborock-a15:1","description":"error","arguments":[3]}');
    this.addEventByString('roborock-vacuum:consumable-reminder', '{"siid":8,"eiid":2,"type":"urn:roborock-spec:event:consumable-reminder:00005002:roborock-a15:1","description":"consumable-reminder","arguments":[1]}');
    this.addEventByString('roborock-vacuum:schedule-canceled', '{"siid":8,"eiid":3,"type":"urn:roborock-spec:event:schedule-canceled:00005003:roborock-a15:1","description":"schedule-canceled","arguments":[2]}');
    this.addEventByString('roborock-vacuum:schedule-started', '{"siid":8,"eiid":4,"type":"urn:roborock-spec:event:schedule-started:00005004:roborock-a15:1","description":"schedule-started","arguments":[]}');
    this.addEventByString('roborock-vacuum:schedule-completed', '{"siid":8,"eiid":5,"type":"urn:roborock-spec:event:schedule-completed:00005005:roborock-a15:1","description":"schedule-completed","arguments":[]}');
    this.addEventByString('roborock-vacuum:clean-completed', '{"siid":8,"eiid":6,"type":"urn:roborock-spec:event:clean-completed:00005006:roborock-a15:1","description":"clean-completed","arguments":[]}');
    this.addEventByString('roborock-vacuum:bin-full', '{"siid":8,"eiid":7,"type":"urn:roborock-spec:event:bin-full:00005007:roborock-a15:1","description":"bin-full","arguments":[]}');
    this.addEventByString('roborock-vacuum:low-power-back', '{"siid":8,"eiid":8,"type":"urn:roborock-spec:event:low-power-back:00005008:roborock-a15:1","description":"low-power-back","arguments":[]}');
    this.addEventByString('roborock-vacuum:back-to-origin-succ', '{"siid":8,"eiid":9,"type":"urn:roborock-spec:event:back-to-origin-succ:00005009:roborock-a15:1","description":"back-to-origin-succ","arguments":[]}');
    this.addEventByString('roborock-vacuum:back-to-origin-fail', '{"siid":8,"eiid":10,"type":"urn:roborock-spec:event:back-to-origin-fail:0000500a:roborock-a15:1","description":"back-to-origin-fail","arguments":[]}');
    this.addEventByString('roborock-vacuum:back-to-dock-nearby', '{"siid":8,"eiid":11,"type":"urn:roborock-spec:event:back-to-dock-nearby:0000500b:roborock-a15:1","description":"back-to-dock-nearby","arguments":[]}');
    this.addEventByString('roborock-vacuum:fan-power-downgraded', '{"siid":8,"eiid":12,"type":"urn:roborock-spec:event:fan-power-downgraded:0000500c:roborock-a15:1","description":"fan-power-downgraded","arguments":[]}');
    this.addEventByString('roborock-vacuum:zone-clean-part-done', '{"siid":8,"eiid":13,"type":"urn:roborock-spec:event:zone-clean-part-done:0000500d:roborock-a15:1","description":"zone-clean-part-done","arguments":[]}');
    this.addEventByString('roborock-vacuum:zone-clean-failed', '{"siid":8,"eiid":14,"type":"urn:roborock-spec:event:zone-clean-failed:0000500e:roborock-a15:1","description":"zone-clean-failed","arguments":[]}');
    this.addEventByString('roborock-vacuum:zone-clean-completed', '{"siid":8,"eiid":15,"type":"urn:roborock-spec:event:zone-clean-completed:0000500f:roborock-a15:1","description":"zone-clean-completed","arguments":[]}');
    this.addEventByString('roborock-vacuum:seg-clean-part-done', '{"siid":8,"eiid":16,"type":"urn:roborock-spec:event:seg-clean-part-done:00005010:roborock-a15:1","description":"seg-clean-part-done","arguments":[]}');
    this.addEventByString('roborock-vacuum:seg-clean-failed', '{"siid":8,"eiid":17,"type":"urn:roborock-spec:event:seg-clean-failed:00005011:roborock-a15:1","description":"seg-clean-failed","arguments":[]}');
    this.addEventByString('roborock-vacuum:seg-clean-completed', '{"siid":8,"eiid":18,"type":"urn:roborock-spec:event:seg-clean-completed:00005012:roborock-a15:1","description":"seg-clean-completed","arguments":[]}');
    this.addEventByString('roborock-vacuum:clean-with-new-map', '{"siid":8,"eiid":19,"type":"urn:roborock-spec:event:clean-with-new-map:00005013:roborock-a15:1","description":"clean-with-new-map","arguments":[]}');
    this.addEventByString('roborock-vacuum:water-short-reminder', '{"siid":8,"eiid":20,"type":"urn:roborock-spec:event:water-short-reminder:00005014:roborock-a15:1","description":"water-short-reminder","arguments":[]}');
    this.addEventByString('roborock-vacuum:charge-dust-collect', '{"siid":8,"eiid":21,"type":"urn:roborock-spec:event:charge-dust-collect:00005015:roborock-a15:1","description":"charge-dust-collect","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 5;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 10;
  }

  statusErrorValue() {
    return 12;
  }

  statusGoChargingValue() {
    return 6;
  }

  statusChargingValue() {
    return 8;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = RoborockVacuumA15;

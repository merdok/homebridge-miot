const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DreameVacuumR2205 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Dreame Bot D10 Plus';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-r2205:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:dreame-r2205:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:dreame-r2205:1","description":"Battery"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:dreame-r2205:1","description":"Brush Cleaner"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:dreame-r2205:1","description":"Side Cleaning Brush"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:filter:0000780B:dreame-r2205:1","description":"Filter"}');
    this.createServiceByString('{"siid":4,"type":"urn:dreame-spec:service:vacuum-extend:00007801:dreame-r2205:1","description":"vacuum-extend"}');
    this.createServiceByString('{"siid":5,"type":"urn:dreame-spec:service:do-not-disturb:00007802:dreame-r2205:1","description":"do-not-disturb"}');
    this.createServiceByString('{"siid":6,"type":"urn:dreame-spec:service:map:00007803:dreame-r2205:1","description":"map"}');
    this.createServiceByString('{"siid":7,"type":"urn:dreame-spec:service:audio:00007804:dreame-r2205:1","description":"audio"}');
    this.createServiceByString('{"siid":8,"type":"urn:dreame-spec:service:time:00007805:dreame-r2205:1","description":"time"}');
    this.createServiceByString('{"siid":12,"type":"urn:dreame-spec:service:clean-logs:00007806:dreame-r2205:1","description":"clean-logs"}');
    this.createServiceByString('{"siid":13,"type":"urn:dreame-spec:service:vslam-extend:00007807:dreame-r2205:1","description":"vslam-extend"}');
    this.createServiceByString('{"siid":14,"type":"urn:dreame-spec:service:robot-config:00007808:dreame-r2205:1","description":"robot-config"}');
    this.createServiceByString('{"siid":15,"type":"urn:dreame-spec:service:collect-dust:00007809:dreame-r2205:1","description":"collect-dust"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:dreame-r2205:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Sweeping"},{"value":2,"description":"Idle"},{"value":3,"description":"Paused"},{"value":4,"description":"Error"},{"value":5,"description":"Go Charging"},{"value":6,"description":"Charging"},{"value":7,"description":"Mopping"},{"value":11,"description":"Building"},{"value":12,"description":"Sweeping and Mopping"},{"value":13,"description":"Charging Completed"},{"value":14,"description":"Upgrading"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:dreame-r2205:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:dreame-r2205:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Silent"},{"value":1,"description":"Basic"},{"value":2,"description":"Strong"},{"value":3,"description":"Full Speed"}]}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:room-ids:00000073:dreame-r2205:1","description":"Room IDs","format":"string","access":[]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:dreame-r2205:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:dreame-r2205:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not Charging"},{"value":5,"description":"Go Charging"}]}');
    this.addPropertyByString('brush-cleaner:brush-left-time', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:dreame-r2205:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,300,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:dreame-r2205:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner10:brush-left-time', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:dreame-r2205:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,200,1]}');
    this.addPropertyByString('brush-cleaner10:brush-life-level', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:dreame-r2205:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:dreame-r2205:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":11,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:dreame-r2205:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,1000,1]}');
    this.addPropertyByString('vacuum-extend:work-mode', '{"siid":4,"piid":1,"type":"urn:dreame-spec:property:work-mode:00000001:dreame-r2205:1","description":"work-mode","format":"int32","access":["read","notify"],"valueRange":[0,50,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-time', '{"siid":4,"piid":2,"type":"urn:dreame-spec:property:cleaning-time:00000002:dreame-r2205:1","description":"cleaning-time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,32767,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-area', '{"siid":4,"piid":3,"type":"urn:dreame-spec:property:cleaning-area:00000003:dreame-r2205:1","description":"cleaning-area","format":"uint32","access":["read","notify"],"valueRange":[0,32767,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-mode', '{"siid":4,"piid":4,"type":"urn:dreame-spec:property:cleaning-mode:00000004:dreame-r2205:1","description":"cleaning-mode","format":"int8","access":["read","notify"],"valueList":[{"value":0,"description":"Quiet"},{"value":1,"description":"Standard"},{"value":2,"description":"Medium"},{"value":3,"description":"Strong"}]}');
    this.addPropertyByString('vacuum-extend:mop-mode', '{"siid":4,"piid":5,"type":"urn:dreame-spec:property:mop-mode:00000005:dreame-r2205:1","description":"mop-mode","format":"int8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('vacuum-extend:waterbox-status', '{"siid":4,"piid":6,"type":"urn:dreame-spec:property:waterbox-status:00000006:dreame-r2205:1","description":"waterbox-status","format":"int8","access":["read","notify"],"valueList":[{"value":0,"description":"No"},{"value":1,"description":"Yes"}]}');
    this.addPropertyByString('vacuum-extend:task-status', '{"siid":4,"piid":7,"type":"urn:dreame-spec:property:task-status:00000007:dreame-r2205:1","description":"task-status","format":"int8","access":["read","notify"],"valueRange":[0,20,1]}');
    this.addPropertyByString('vacuum-extend:clean-start-time', '{"siid":4,"piid":8,"type":"urn:dreame-spec:property:clean-start-time:00000008:dreame-r2205:1","description":"clean-start-time","format":"string","access":["notify"]}');
    this.addPropertyByString('vacuum-extend:clean-log-filename', '{"siid":4,"piid":9,"type":"urn:dreame-spec:property:clean-log-filename:00000009:dreame-r2205:1","description":"clean-log-filename","format":"string","access":["notify"]}');
    this.addPropertyByString('vacuum-extend:clean-extend-data', '{"siid":4,"piid":10,"type":"urn:dreame-spec:property:clean-extend-data:0000000a:dreame-r2205:1","description":"clean-extend-data","format":"string","access":["write"]}');
    this.addPropertyByString('vacuum-extend:break-point-restart', '{"siid":4,"piid":11,"type":"urn:dreame-spec:property:break-point-restart:0000000b:dreame-r2205:1","description":"break-point-restart","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:carpet-press', '{"siid":4,"piid":12,"type":"urn:dreame-spec:property:carpet-press:0000000c:dreame-r2205:1","description":"carpet-press","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:cleanlog-status', '{"siid":4,"piid":13,"type":"urn:dreame-spec:property:cleanlog-status:0000000d:dreame-r2205:1","description":"cleanlog-status","format":"uint16","access":[],"valueList":[{"value":0,"description":"Interrupt"},{"value":1,"description":"Complete"}]}');
    this.addPropertyByString('vacuum-extend:serial-number', '{"siid":4,"piid":14,"type":"urn:dreame-spec:property:serial-number:0000000e:dreame-r2205:1","description":"serial-number","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:remote-state', '{"siid":4,"piid":15,"type":"urn:dreame-spec:property:remote-state:0000000f:dreame-r2205:1","description":"remote-state","format":"string","access":["write"]}');
    this.addPropertyByString('vacuum-extend:clean-rags-tip', '{"siid":4,"piid":16,"type":"urn:dreame-spec:property:clean-rags-tip:00000010:dreame-r2205:1","description":"clean-rags-tip","format":"uint32","access":["read","notify","write"],"unit":"minutes","valueRange":[0,120,1]}');
    this.addPropertyByString('vacuum-extend:keep-sweeper-time', '{"siid":4,"piid":17,"type":"urn:dreame-spec:property:keep-sweeper-time:00000011:dreame-r2205:1","description":"keep-sweeper-time","format":"int32","access":["read","notify"],"unit":"minutes","valueRange":[-1,1000000,1]}');
    this.addPropertyByString('vacuum-extend:faults', '{"siid":4,"piid":18,"type":"urn:dreame-spec:property:faults:00000012:dreame-r2205:1","description":"faults","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:nation-matched', '{"siid":4,"piid":19,"type":"urn:dreame-spec:property:nation-matched:00000013:dreame-r2205:1","description":"nation-matched","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:relocation-status', '{"siid":4,"piid":20,"type":"urn:dreame-spec:property:relocation-status:00000014:dreame-r2205:1","description":"relocation-status","format":"int32","access":["read","notify"],"valueRange":[0,1000000,1]}');
    this.addPropertyByString('do-not-disturb:enable', '{"siid":5,"piid":1,"type":"urn:dreame-spec:property:enable:00000001:dreame-r2205:1","description":"enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('do-not-disturb:start-time', '{"siid":5,"piid":2,"type":"urn:dreame-spec:property:start-time:00000002:dreame-r2205:1","description":"start-time","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('do-not-disturb:end-time', '{"siid":5,"piid":3,"type":"urn:dreame-spec:property:end-time:00000003:dreame-r2205:1","description":"end-time","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('map:map-data', '{"siid":6,"piid":1,"type":"urn:dreame-spec:property:map-data:00000001:dreame-r2205:1","description":"map-data","format":"string","access":["notify"]}');
    this.addPropertyByString('map:frame-info', '{"siid":6,"piid":2,"type":"urn:dreame-spec:property:frame-info:00000002:dreame-r2205:1","description":"frame-info","format":"string","access":["write"]}');
    this.addPropertyByString('map:object-name', '{"siid":6,"piid":3,"type":"urn:dreame-spec:property:object-name:00000003:dreame-r2205:1","description":"object-name","format":"string","access":["notify"]}');
    this.addPropertyByString('map:map-extend-data', '{"siid":6,"piid":4,"type":"urn:dreame-spec:property:map-extend-data:00000004:dreame-r2205:1","description":"map-extend-data","format":"string","access":["write"]}');
    this.addPropertyByString('map:robot-time', '{"siid":6,"piid":5,"type":"urn:dreame-spec:property:robot-time:00000005:dreame-r2205:1","description":"robot-time","format":"int64","access":["notify"],"valueRange":[0,999999999999999,1]}');
    this.addPropertyByString('map:result-code', '{"siid":6,"piid":6,"type":"urn:dreame-spec:property:result-code:00000006:dreame-r2205:1","description":"result-code","format":"int16","access":["notify"],"valueRange":[-10000,10000,1]}');
    this.addPropertyByString('map:mult-map-state', '{"siid":6,"piid":7,"type":"urn:dreame-spec:property:mult-map-state:00000007:dreame-r2205:1","description":"mult-map-state","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('map:mult-map-info', '{"siid":6,"piid":8,"type":"urn:dreame-spec:property:mult-map-info:00000008:dreame-r2205:1","description":"mult-map-info","format":"string","access":["read","notify"]}');
    this.addPropertyByString('audio:volume', '{"siid":7,"piid":1,"type":"urn:dreame-spec:property:volume:00000001:dreame-r2205:1","description":"volume","format":"int32","access":["read","notify","write"],"valueRange":[0,100,1]}');
    this.addPropertyByString('audio:voice-packet-id', '{"siid":7,"piid":2,"type":"urn:dreame-spec:property:voice-packet-id:00000002:dreame-r2205:1","description":"voice-packet-id","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('audio:voice-change-state', '{"siid":7,"piid":3,"type":"urn:dreame-spec:property:voice-change-state:00000003:dreame-r2205:1","description":"voice-change-state","format":"string","access":["read","notify"]}');
    this.addPropertyByString('audio:set-voice', '{"siid":7,"piid":4,"type":"urn:dreame-spec:property:set-voice:00000004:dreame-r2205:1","description":"set-voice","format":"string","access":["write"]}');
    this.addPropertyByString('time:time-zone', '{"siid":8,"piid":1,"type":"urn:dreame-spec:property:time-zone:00000001:dreame-r2205:1","description":"time-zone","format":"string","access":["read","notify"]}');
    this.addPropertyByString('time:timer-clean', '{"siid":8,"piid":2,"type":"urn:dreame-spec:property:timer-clean:00000002:dreame-r2205:1","description":"timer-clean","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('time:timer-id', '{"siid":8,"piid":3,"type":"urn:dreame-spec:property:timer-id:00000003:dreame-r2205:1","description":"timer-id","format":"string","access":[]}');
    this.addPropertyByString('clean-logs:first-clean-time', '{"siid":12,"piid":1,"type":"urn:dreame-spec:property:first-clean-time:00000001:dreame-r2205:1","description":"first-clean-time","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-time', '{"siid":12,"piid":2,"type":"urn:dreame-spec:property:total-clean-time:00000002:dreame-r2205:1","description":"total-clean-time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-times', '{"siid":12,"piid":3,"type":"urn:dreame-spec:property:total-clean-times:00000003:dreame-r2205:1","description":"total-clean-times","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-area', '{"siid":12,"piid":4,"type":"urn:dreame-spec:property:total-clean-area:00000004:dreame-r2205:1","description":"total-clean-area","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('collect-dust:auto-collect', '{"siid":15,"piid":1,"type":"urn:dreame-spec:property:auto-collect:00000001:dreame-r2205:1","description":"auto-collect","format":"uint32","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close-auto-collect"},{"value":1,"description":"Open-auto-collect"}]}');
    this.addPropertyByString('collect-dust:clean-times', '{"siid":15,"piid":2,"type":"urn:dreame-spec:property:clean-times:00000002:dreame-r2205:1","description":"clean-times","format":"uint32","access":["read","notify","write"],"valueRange":[1,1000000,1]}');
    this.addPropertyByString('collect-dust:dust-enable', '{"siid":15,"piid":3,"type":"urn:dreame-spec:property:dust-enable:00000003:dreame-r2205:1","description":"dust-enable","format":"uint32","access":["read","notify"],"valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('collect-dust:result-code', '{"siid":15,"piid":4,"type":"urn:dreame-spec:property:result-code:00000004:dreame-r2205:1","description":"result-code","format":"uint32","access":[],"valueRange":[0,100,1]}');
    this.addPropertyByString('collect-dust:dust-status', '{"siid":15,"piid":5,"type":"urn:dreame-spec:property:dust-status:00000005:dreame-r2205:1","description":"dust-status","format":"uint32","access":["read","notify"],"valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:dreame-r2205:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:dreame-r2205:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:dreame-r2205:1","description":"Start Room Sweep","in":[4],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:dreame-r2205:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('brush-cleaner:reset-brush-life', '{"siid":9,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:dreame-r2205:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner10:reset-brush-life', '{"siid":10,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:dreame-r2205:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":11,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:dreame-r2205:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('vacuum-extend:start-clean', '{"siid":4,"aiid":1,"type":"urn:dreame-spec:action:start-clean:00002801:dreame-r2205:1","description":"start-clean","in":[10],"out":[]}');
    this.addActionByString('vacuum-extend:stop-clean', '{"siid":4,"aiid":2,"type":"urn:dreame-spec:action:stop-clean:00002802:dreame-r2205:1","description":"stop-clean","in":[],"out":[]}');
    this.addActionByString('vacuum-extend:start-area-clean', '{"siid":4,"aiid":7,"type":"urn:dreame-spec:action:start-area-clean:00002807:dreame-r2205:2","description":"start-area-clean","in":[10,1],"out":[]}');
    this.addActionByString('map:map-req', '{"siid":6,"aiid":1,"type":"urn:dreame-spec:action:map-req:00002801:dreame-r2205:1","description":"map-req","in":[2],"out":[1,3,5]}');
    this.addActionByString('map:update-map', '{"siid":6,"aiid":2,"type":"urn:dreame-spec:action:update-map:00002802:dreame-r2205:1","description":"update-map","in":[4],"out":[6]}');
    this.addActionByString('audio:position', '{"siid":7,"aiid":1,"type":"urn:dreame-spec:action:position:00002801:dreame-r2205:1","description":"position","in":[],"out":[]}');
    this.addActionByString('audio:play-sound', '{"siid":7,"aiid":2,"type":"urn:dreame-spec:action:play-sound:00002802:dreame-r2205:1","description":"play-sound","in":[],"out":[]}');
    this.addActionByString('time:delete-timer', '{"siid":8,"aiid":1,"type":"urn:dreame-spec:action:delete-timer:00002801:dreame-r2205:1","description":"delete-timer","in":[3],"out":[]}');
    this.addActionByString('collect-dust:start-collect', '{"siid":15,"aiid":1,"type":"urn:dreame-spec:action:start-collect:00002801:dreame-r2205:1","description":"start-collect","in":[],"out":[4]}');
  }

  initDeviceEvents() {
    this.addEventByString('battery:low-battery', '{"siid":3,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:dreame-r2205:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('vacuum-extend:cleanup-completed', '{"siid":4,"eiid":1,"type":"urn:dreame-spec:event:cleanup-completed:00005001:dreame-r2205:1","description":"cleanup-completed","arguments":[]}');
    this.addEventByString('vacuum-extend:finish-withwaternox', '{"siid":4,"eiid":2,"type":"urn:dreame-spec:event:finish-withwaternox:00005002:dreame-r2205:1","description":"finish-withwaternox","arguments":[]}');
    this.addEventByString('vacuum-extend:finish-clean', '{"siid":4,"eiid":3,"type":"urn:dreame-spec:event:finish-clean:00005003:dreame-r2205:1","description":"finish-clean","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 1;
  }

  statusIdleValue() {
    return 2;
  }

  statusPausedValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 6;
  }

  statusMoppingValue() {
    return 7;
  }

  statusSweepingAndMoppingValue() {
    return 12;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DreameVacuumR2205;

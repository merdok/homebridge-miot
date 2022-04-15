const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DreameVacuumMc1808 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mijia 1C Sweeping Vacuum Cleaner';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-mc1808:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['vacuum:status', 'clean:mode', 'vacuum:fault', 'battery:battery-level',
      'battery:charging-state', 'brush-cleaner:brush-left-time', 'brush-cleaner:brush-life-level', 'filter:filter-life-level',
      'filter:filter-left-time', 'clean:total-clean-time', 'clean:total-clean-times', 'clean:total-clean-area'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:battery:00007805:dreame-mc1808:1","description":"Battery"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:vacuum:00007810:dreame-mc1808:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":17,"type":"urn:miot-spec-v2:service:identify:0000782C:dreame-mc1808:1","description":"Identify"}');
    this.createServiceByString('{"siid":26,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:dreame-mc1808:1","description":"Main Cleaning Brush"}');
    this.createServiceByString('{"siid":27,"type":"urn:miot-spec-v2:service:filter:0000780B:dreame-mc1808:1","description":"Filter"}');
    this.createServiceByString('{"siid":28,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:dreame-mc1808:1","description":"Side Cleaning Brush"}');
    this.createServiceByString('{"siid":18,"type":"urn:dreame-spec:service:clean:00000001:dreame-mc1808:1","description":"clean"}');
    this.createServiceByString('{"siid":19,"type":"urn:dreame-spec:service:consumable:0000000F:dreame-mc1808:1","description":"consumable"}');
    this.createServiceByString('{"siid":20,"type":"urn:dreame-spec:service:annoy:0000001A:dreame-mc1808:1","description":"annoy"}');
    this.createServiceByString('{"siid":21,"type":"urn:dreame-spec:service:remote:0000001E:dreame-mc1808:1","description":"remote"}');
    this.createServiceByString('{"siid":22,"type":"urn:dreame-spec:service:warn:00000024:dreame-mc1808:1","description":"warn"}');
    this.createServiceByString('{"siid":23,"type":"urn:dreame-spec:service:map:00000041:dreame-mc1808:1","description":"map"}');
    this.createServiceByString('{"siid":24,"type":"urn:dreame-spec:service:audio:00000045:dreame-mc1808:1","description":"audio"}');
    this.createServiceByString('{"siid":25,"type":"urn:dreame-spec:service:time:00007801:dreame-mc1808:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('battery:battery-level', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:dreame-mc1808:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:dreame-mc1808:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not Charging"},{"value":4,"description":"Charging"},{"value":5,"description":"Go Charging"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:dreame-mc1808:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"}]}');
    this.addPropertyByString('vacuum:status', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:status:00000007:dreame-mc1808:1","description":"Status","format":"int8","access":["read","notify"],"valueList":[{"value":1,"description":"Sweeping"},{"value":2,"description":"Idle"},{"value":3,"description":"Paused"},{"value":4,"description":"Error"},{"value":5,"description":"Go Charging"},{"value":6,"description":"Charging"}]}');
    this.addPropertyByString('brush-cleaner:brush-left-time', '{"siid":26,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:dreame-mc1808:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hour","valueRange":[0,300,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":26,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:dreame-mc1808:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":27,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:dreame-mc1808:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":27,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:dreame-mc1808:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hour","valueRange":[0,300,1]}');
    this.addPropertyByString('brush-cleaner2:brush-left-time', '{"siid":28,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:dreame-mc1808:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hour","valueRange":[0,300,1]}');
    this.addPropertyByString('brush-cleaner2:brush-life-level', '{"siid":28,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:dreame-mc1808:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('clean:work-mode', '{"siid":18,"piid":1,"type":"urn:dreame-spec:property:work-mode:00000002:dreame-mc1808:1","description":"工作模式","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,17,1]}');
    this.addPropertyByString('clean:time-duration', '{"siid":18,"piid":2,"type":"urn:dreame-spec:property:time-duration:00000003:dreame-mc1808:1","description":"time-duration","format":"int32","access":["notify"],"unit":"minutes","valueRange":[0,32767,1]}');
    this.addPropertyByString('clean:size', '{"siid":18,"piid":3,"type":"urn:dreame-spec:property:size:00000004:dreame-mc1808:1","description":"size","format":"string","access":["notify"]}');
    this.addPropertyByString('clean:timer', '{"siid":18,"piid":5,"type":"urn:dreame-spec:property:timer:00000006:dreame-mc1808:1","description":"timer","format":"string","access":["read","write"]}');
    this.addPropertyByString('clean:area', '{"siid":18,"piid":4,"type":"urn:dreame-spec:property:area:00000005:dreame-mc1808:1","description":"area","format":"string","access":["read","write"]}');
    this.addPropertyByString('clean:mode', '{"siid":18,"piid":6,"type":"urn:dreame-spec:property:mode:00000007:dreame-mc1808:1","description":"清扫模式","format":"int32","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"安静"},{"value":1,"description":"标准"},{"value":2,"description":"中档"},{"value":3,"description":"强力"}]}');
    this.addPropertyByString('clean:delete-timer', '{"siid":18,"piid":8,"type":"urn:dreame-spec:property:delete-timer:00000009:dreame-mc1808:1","description":"delete-timer","format":"int32","access":["write"],"valueRange":[0,100,1]}');
    this.addPropertyByString('clean:water-box', '{"siid":18,"piid":9,"type":"urn:dreame-spec:property:water-box:0000000A:dreame-mc1808:1","description":"water-box","format":"int32","access":["notify"],"valueRange":[0,10,1]}');
    this.addPropertyByString('clean:object-name', '{"siid":18,"piid":11,"type":"urn:dreame-spec:property:object-name:00000001:dreame-mc1808:1","description":"清扫地图文件名","format":"string","access":["notify"],"unit":"none"}');
    this.addPropertyByString('clean:start-time', '{"siid":18,"piid":12,"type":"urn:dreame-spec:property:start-time:0000000c:dreame-mc1808:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('clean:total-clean-time', '{"siid":18,"piid":13,"type":"urn:dreame-spec:property:total-clean-time:0000000d:dreame-mc1808:1","description":"","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean:total-clean-times', '{"siid":18,"piid":14,"type":"urn:dreame-spec:property:total-clean-times:0000000e:dreame-mc1808:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean:total-clean-area', '{"siid":18,"piid":15,"type":"urn:dreame-spec:property:total-clean-area:0000000f:dreame-mc1808:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean:clean-log-start-time', '{"siid":18,"piid":16,"type":"urn:dreame-spec:property:clean-log-start-time:00000010:dreame-mc1808:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean:button-led', '{"siid":18,"piid":17,"type":"urn:dreame-spec:property:button-led:00000011:dreame-mc1808:1","description":"","format":"uint16","access":["read","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('clean:task-done', '{"siid":18,"piid":18,"type":"urn:dreame-spec:property:task-done:00000012:dreame-mc1808:1","description":"","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('clean:mopmode', '{"siid":18,"piid":20,"type":"urn:dreame-spec:property:mopmode:0000000b:dreame-mc1808:2","description":"拖地模式下水量设置","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"低档"},{"value":2,"description":"中档"},{"value":3,"description":"高档"}]}');
    this.addPropertyByString('clean:clean-info', '{"siid":18,"piid":21,"type":"urn:dreame-spec:property:clean-info:00000008:dreame-mc1808:2","description":"clean-info","format":"string","access":["write"]}');
    this.addPropertyByString('clean:clean-status', '{"siid":18,"piid":22,"type":"urn:dreame-spec:property:clean-status:00000013:dreame-mc1808:2","description":"clean-status","format":"uint8","access":["read","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('clean:save-map-status', '{"siid":18,"piid":23,"type":"urn:dreame-spec:property:save-map-status:00000014:dreame-mc1808:2","description":"save-map-status","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('consumable:life-sieve', '{"siid":19,"piid":1,"type":"urn:dreame-spec:property:life-sieve:00000010:dreame-mc1808:1","description":"life-sieve","format":"string","access":["read","write"]}');
    this.addPropertyByString('consumable:life-brush-side', '{"siid":19,"piid":2,"type":"urn:dreame-spec:property:life-brush-side:00000011:dreame-mc1808:1","description":"life-brush-side","format":"string","access":["read","write"]}');
    this.addPropertyByString('consumable:life-brush-main', '{"siid":19,"piid":3,"type":"urn:dreame-spec:property:life-brush-main:00000012:dreame-mc1808:1","description":"life-brush-main","format":"string","access":["read","write"]}');
    this.addPropertyByString('annoy:enable', '{"siid":20,"piid":1,"type":"urn:dreame-spec:property:enable:0000001B:dreame-mc1808:1","description":"enable","format":"bool","access":["read","write"]}');
    this.addPropertyByString('annoy:start-time', '{"siid":20,"piid":2,"type":"urn:dreame-spec:property:start-time:0000001C:dreame-mc1808:1","description":"start-time","format":"string","access":["read","write"]}');
    this.addPropertyByString('annoy:stop-time', '{"siid":20,"piid":3,"type":"urn:dreame-spec:property:stop-time:0000001D:dreame-mc1808:1","description":"stop-time","format":"string","access":["read","write"]}');
    this.addPropertyByString('remote:deg', '{"siid":21,"piid":1,"type":"urn:dreame-spec:property:deg:0000001F:dreame-mc1808:1","description":"deg","format":"string","access":["write"]}');
    this.addPropertyByString('remote:speed', '{"siid":21,"piid":2,"type":"urn:dreame-spec:property:speed:00000020:dreame-mc1808:1","description":"speed","format":"string","access":["write"]}');
    this.addPropertyByString('warn:warn-code', '{"siid":22,"piid":1,"type":"urn:dreame-spec:property:warn-code:00000049:dreame-mc1808:1","description":"warn-code","format":"int32","access":["notify"],"valueList":[{"value":0,"description":"normal"},{"value":1,"description":"drop"},{"value":2,"description":"cliff"},{"value":3,"description":"bumper"},{"value":4,"description":"gesture"},{"value":5,"description":"bumper-repeat"},{"value":6,"description":"drop-repeat"},{"value":7,"description":"optical-flow"},{"value":8,"description":"no-box"},{"value":9,"description":"no-tankbox"},{"value":10,"description":"waterbox-empty"},{"value":11,"description":"box-full"},{"value":12,"description":"brush"},{"value":13,"description":"side-brush"},{"value":14,"description":"fan"},{"value":15,"description":"left-wheel-motor"},{"value":16,"description":"right-wheel-motor"},{"value":17,"description":"turn-suffocate"},{"value":18,"description":"forward-suffocate"},{"value":19,"description":"charger-get"},{"value":20,"description":"battery-low"},{"value":21,"description":"charge-fault"},{"value":22,"description":"battery-percentage"},{"value":23,"description":"heart"},{"value":24,"description":"camera-occlusion"},{"value":25,"description":"camera-fault"},{"value":26,"description":"event-battery"},{"value":27,"description":"forward-looking"},{"value":28,"description":"gyroscope"}]}');
    this.addPropertyByString('map:map-view', '{"siid":23,"piid":1,"type":"urn:dreame-spec:property:map-view:00000042:dreame-mc1808:1","description":"map-view","format":"string","access":["read","notify"]}');
    this.addPropertyByString('map:frame-info', '{"siid":23,"piid":2,"type":"urn:dreame-spec:property:frame-info:00000043:dreame-mc1808:1","description":"frame-info","format":"string","access":["write"]}');
    this.addPropertyByString('map:object-name', '{"siid":23,"piid":3,"type":"urn:dreame-spec:property:object-name:00000001:dreame-mc1808:1","description":"","format":"string","access":["notify"],"unit":"none"}');
    this.addPropertyByString('map:map-extend-data', '{"siid":23,"piid":4,"type":"urn:dreame-spec:property:map-extend-data:00000002:dreame-mc1808:2","description":"map-extend-data","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:robot-time', '{"siid":23,"piid":5,"type":"urn:dreame-spec:property:robot-time:00000003:dreame-mc1808:2","description":"","format":"int64","access":[],"unit":"none","valueRange":[0,100000000000000,1]}');
    this.addPropertyByString('audio:volume', '{"siid":24,"piid":1,"type":"urn:dreame-spec:property:volume:00000046:dreame-mc1808:1","description":"volume","format":"int32","access":["read","write","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('audio:voice-packets', '{"siid":24,"piid":3,"type":"urn:dreame-spec:property:voice-packets:00000048:dreame-mc1808:1","description":"语音包ID","format":"string","access":["read","write"],"unit":"none"}');
    this.addPropertyByString('time:time-zone', '{"siid":25,"piid":1,"type":"urn:dreame-spec:property:time-zone:00000001:dreame-mc1808:1","description":"","format":"string","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('battery:start-charge', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:dreame-mc1808:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('vacuum:start-sweep', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:dreame-mc1808:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":3,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:dreame-mc1808:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":17,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:dreame-mc1808:1","description":"Identify","in":[],"out":[]}');
    this.addActionByString('brush-cleaner:reset-brush-life', '{"siid":26,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:dreame-mc1808:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":27,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:dreame-mc1808:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner2:reset-brush-life', '{"siid":28,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:dreame-mc1808:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('clean:start-clean', '{"siid":18,"aiid":1,"type":"urn:dreame-spec:action:start-clean:0000000C:dreame-mc1808:1","description":"开始清扫","in":[],"out":[]}');
    this.addActionByString('clean:stop-clean', '{"siid":18,"aiid":2,"type":"urn:dreame-spec:action:stop-clean:0000000D:dreame-mc1808:1","description":"stop-clean","in":[],"out":[]}');
    this.addActionByString('remote:start-remote', '{"siid":21,"aiid":1,"type":"urn:dreame-spec:action:start-remote:00000021:dreame-mc1808:1","description":"start-remote","in":[1,2],"out":[]}');
    this.addActionByString('remote:stop-remote', '{"siid":21,"aiid":2,"type":"urn:dreame-spec:action:stop-remote:00000022:dreame-mc1808:1","description":"stop-remote","in":[],"out":[]}');
    this.addActionByString('remote:exit-remote', '{"siid":21,"aiid":3,"type":"urn:dreame-spec:action:exit-remote:00000023:dreame-mc1808:1","description":"exit-remote","in":[],"out":[]}');
    this.addActionByString('map:map-req', '{"siid":23,"aiid":1,"type":"urn:dreame-spec:action:map-req:00000044:dreame-mc1808:1","description":"map-req","in":[2],"out":[]}');
    this.addActionByString('map:update-map', '{"siid":23,"aiid":2,"type":"urn:dreame-spec:action:update-map:00002801:dreame-mc1808:2","description":"update-map","in":[4],"out":[]}');
    this.addActionByString('audio:position', '{"siid":24,"aiid":1,"type":"urn:dreame-spec:action:position:00002801:dreame-mc1808:1","description":"","in":[],"out":[]}');
    this.addActionByString('audio:set-voice', '{"siid":24,"aiid":2,"type":"urn:dreame-spec:action:set-voice:00002802:dreame-mc1808:1","description":"","in":[],"out":[]}');
    this.addActionByString('audio:play-sound', '{"siid":24,"aiid":3,"type":"urn:dreame-spec:action:play-sound:00002803:dreame-mc1808:1","description":"","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('battery:low-battery', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:dreame-mc1808:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('clean:finish-clean', '{"siid":18,"eiid":1,"type":"urn:dreame-spec:event:finish-clean:0000000E:dreame-mc1808:1","description":"完成清扫","arguments":[11,12,3,2]}');
    this.addEventByString('clean:finish-with-waterbox', '{"siid":18,"eiid":2,"type":"urn:dreame-spec:event:finish-with-waterbox:00005001:dreame-mc1808:1","description":"","arguments":[]}');
    this.addEventByString('clean:clean-without-box', '{"siid":18,"eiid":3,"type":"urn:dreame-spec:event:clean-without-box:00005002:dreame-mc1808:1","description":"","arguments":[]}');
    this.addEventByString('consumable:warn-sieve', '{"siid":19,"eiid":1,"type":"urn:dreame-spec:event:warn-sieve:00000015:dreame-mc1808:1","description":"warn-sieve","arguments":[]}');
    this.addEventByString('consumable:warn-brush-side', '{"siid":19,"eiid":2,"type":"urn:dreame-spec:event:warn-brush-side:00000016:dreame-mc1808:1","description":"warn-brush-side","arguments":[]}');
    this.addEventByString('consumable:warn-brush-main', '{"siid":19,"eiid":3,"type":"urn:dreame-spec:event:warn-brush-main:00000017:dreame-mc1808:1","description":"warn-brush-main","arguments":[]}');
    this.addEventByString('consumable:warn-sensor', '{"siid":19,"eiid":4,"type":"urn:dreame-spec:event:warn-sensor:00000018:dreame-mc1808:1","description":"warn-sensor","arguments":[]}');
    this.addEventByString('consumable:warn-duster', '{"siid":19,"eiid":5,"type":"urn:dreame-spec:event:warn-duster:00000019:dreame-mc1808:1","description":"warn-duster","arguments":[]}');
    this.addEventByString('consumable:sieve-will-invalid', '{"siid":19,"eiid":6,"type":"urn:dreame-spec:event:sieve-will-invalid:00005001:dreame-mc1808:2","description":"","arguments":[]}');
    this.addEventByString('consumable:side-br-will-invalid', '{"siid":19,"eiid":7,"type":"urn:dreame-spec:event:side-br-will-invalid:00005002:dreame-mc1808:2","description":"","arguments":[]}');
    this.addEventByString('consumable:main-br-will-invalid', '{"siid":19,"eiid":8,"type":"urn:dreame-spec:event:main-br-will-invalid:00005003:dreame-mc1808:2","description":"","arguments":[]}');
    this.addEventByString('warn:device-event', '{"siid":22,"eiid":1,"type":"urn:dreame-spec:event:device-event:00000025:dreame-mc1808:1","description":"device-event","arguments":[1]}');
    this.addEventByString('audio:voice-status', '{"siid":24,"eiid":1,"type":"urn:dreame-spec:event:voice-status:00005001:dreame-mc1808:1","description":"","arguments":[]}');
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

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 2;
  }

  chargingStateGoChargingValue() {
    return 5;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  modeProp() {
    return this.getProperty('clean:mode');
  }

  totalCleanTimeProp() {
    return this.getProperty('clean:total-clean-time');
  }

  totalCleanTimesProp() {
    return this.getProperty('clean:total-clean-times');
  }

  totalCleanAreaProp() {
    return this.getProperty('clean:total-clean-area');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DreameVacuumMc1808;

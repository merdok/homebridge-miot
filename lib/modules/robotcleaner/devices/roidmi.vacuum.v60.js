const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoidmiVacuumV60 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Roidmi Eve Plus';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roidmi-v60:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'battery:charging-state', 'brush-cleaner:brush-left-time', 'brush-cleaner:brush-life-level', 'filter:filter-life-level',
      'filter:filter-left-time', 'custom:clean-time', 'custom:total-clean-time', 'custom:total-clean-areas'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:roidmi-v60:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:speaker:0000781C:roidmi-v60:1","description":"Speaker"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:roidmi-v60:1","description":"Battery"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:filter:0000780B:roidmi-v60:1","description":"Filter"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:roidmi-v60:1","description":"Brush Cleaner"}');
    this.createServiceByString('{"siid":12,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:roidmi-v60:1","description":"Brush Cleaner"}');
    this.createServiceByString('{"siid":15,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:roidmi-v60:1","description":"Brush Cleaner"}');
    this.createServiceByString('{"siid":8,"type":"urn:roidmi-spec:service:custom:00007801:roidmi-v60:1","description":"custom"}');
    this.createServiceByString('{"siid":13,"type":"urn:roidmi-spec:service:map:00007802:roidmi-v60:1","description":"map"}');
    this.createServiceByString('{"siid":14,"type":"urn:roidmi-spec:service:sweep:00007803:roidmi-v60:1","description":"sweep"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:roidmi-v60:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Dormant"},{"value":2,"description":"Idle"},{"value":3,"description":"Paused"},{"value":4,"description":"Sweeping"},{"value":5,"description":"Go Charging"},{"value":6,"description":"Charging"},{"value":7,"description":"Error"},{"value":8,"description":"Rfctrl"},{"value":9,"description":"Fullcharge"},{"value":10,"description":"Shutdown"},{"value":11,"description":"Findchargerpause"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:roidmi-v60:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Low Battery Find Charger"},{"value":2,"description":"Low Battery And Poweroff"},{"value":3,"description":"Wheel Trap"},{"value":4,"description":"Collision Error"},{"value":5,"description":"Tile Do Task"},{"value":6,"description":"Lidar Point Error"},{"value":7,"description":"Front Wall Error"},{"value":8,"description":"Psd Dirty"},{"value":9,"description":"Middle Brush Fatal"},{"value":10,"description":"Sid Brush"},{"value":11,"description":"Fan Speed Error"},{"value":12,"description":"Lidar Cover"},{"value":13,"description":"Garbage Box Full"},{"value":14,"description":"Garbage Box Out"},{"value":15,"description":"Garbage Box Full Out"},{"value":16,"description":"Physical Trapped"},{"value":17,"description":"Pick Up Do Task"},{"value":18,"description":"No Water Box Do Task"},{"value":19,"description":"Water Box Empty"},{"value":20,"description":"Clean Cannot Arrive"},{"value":21,"description":"Start Form Forbid"},{"value":22,"description":"Drop"},{"value":23,"description":"Kit Water Pump"},{"value":24,"description":"Find Charger Failed"},{"value":25,"description":"Low Power Clean"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:roidmi-v60:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Silent"},{"value":2,"description":"Basic"},{"value":3,"description":"Strong"},{"value":4,"description":"Full Speed"},{"value":0,"description":"Sweep"}]}');
    this.addPropertyByString('vacuum:sweep-type', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:sweep-type:000000D3:roidmi-v60:1","description":"Sweep Type","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Sweep"},{"value":1,"description":"Mop"},{"value":2,"description":"Mop And Sweep"}]}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:room-ids:00000073:roidmi-v60:1","description":"Room IDs","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('vacuum:on', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:on:00000006:roidmi-v60:1","description":"Switch Status","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Open"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:roidmi-v60:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:roidmi-v60:1","description":"Charging State","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"},{"value":3,"description":"Not chargeable"}]}');
    this.addPropertyByString('speaker:volume', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:volume:00000013:roidmi-v60:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('speaker:mute', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:mute:00000040:roidmi-v60:1","description":"Mute","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:roidmi-v60:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:roidmi-v60:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,10000,1]}');
    this.addPropertyByString('brush-cleaner:brush-left-time', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:roidmi-v60:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,65535,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":11,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:roidmi-v60:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner2:brush-left-time', '{"siid":12,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:roidmi-v60:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,10000,1]}');
    this.addPropertyByString('brush-cleaner2:brush-life-level', '{"siid":12,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:roidmi-v60:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner3:brush-left-time', '{"siid":15,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:roidmi-v60:1","description":"Brush Left Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('brush-cleaner3:brush-life-level', '{"siid":15,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:roidmi-v60:1","description":"Brush Life Level","format":"uint32","access":["read","notify"],"unit":"percentage","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:mop', '{"siid":8,"piid":1,"type":"urn:roidmi-spec:property:mop:00000001:roidmi-v60:1","description":"mop","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:work-station-freq', '{"siid":8,"piid":2,"type":"urn:roidmi-spec:property:work-station-freq:00000002:roidmi-v60:1","description":"work-station-freq","format":"uint8","access":["read","notify","write"],"unit":"none","valueRange":[0,3,1]}');
    this.addPropertyByString('custom:timing', '{"siid":8,"piid":6,"type":"urn:roidmi-spec:property:timing:00000006:roidmi-v60:1","description":"timing","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:clean-area', '{"siid":8,"piid":7,"type":"urn:roidmi-spec:property:clean-area:00000007:roidmi-v60:1","description":"clean-area","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('custom:uid', '{"siid":8,"piid":8,"type":"urn:roidmi-spec:property:uid:00000008:roidmi-v60:1","description":"uid","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:auto-boost', '{"siid":8,"piid":9,"type":"urn:roidmi-spec:property:auto-boost:00000009:roidmi-v60:1","description":"auto-boost","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:forbid-mode', '{"siid":8,"piid":10,"type":"urn:roidmi-spec:property:forbid-mode:0000000a:roidmi-v60:1","description":"forbid-mode","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:water-level', '{"siid":8,"piid":11,"type":"urn:roidmi-spec:property:water-level:0000000b:roidmi-v60:1","description":"water-level","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":1,"description":"First"},{"value":2,"description":"Second"},{"value":3,"description":"Three"},{"value":4,"description":"Fourth"},{"value":0,"description":"Mop"}]}');
    this.addPropertyByString('custom:total-clean-time', '{"siid":8,"piid":13,"type":"urn:roidmi-spec:property:total-clean-time:0000000d:roidmi-v60:1","description":"","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:total-clean-areas', '{"siid":8,"piid":14,"type":"urn:roidmi-spec:property:total-clean-areas:0000000e:roidmi-v60:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:clean-counts', '{"siid":8,"piid":18,"type":"urn:roidmi-spec:property:clean-counts:00000012:roidmi-v60:1","description":"clean-counts","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:clean-time', '{"siid":8,"piid":19,"type":"urn:roidmi-spec:property:clean-time:00000013:roidmi-v60:1","description":"","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:double-clean', '{"siid":8,"piid":20,"type":"urn:roidmi-spec:property:double-clean:00000014:roidmi-v60:1","description":"double-clean","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:edge-sweep', '{"siid":8,"piid":21,"type":"urn:roidmi-spec:property:edge-sweep:00000015:roidmi-v60:1","description":"edge-sweep","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:led-switch', '{"siid":8,"piid":22,"type":"urn:roidmi-spec:property:led-switch:00000016:roidmi-v60:1","description":"led-switch","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:lidar-collision', '{"siid":8,"piid":23,"type":"urn:roidmi-spec:property:lidar-collision:00000017:roidmi-v60:1","description":"lidar-collision","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:station-key', '{"siid":8,"piid":24,"type":"urn:roidmi-spec:property:station-key:00000018:roidmi-v60:1","description":"station-key","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:station-led', '{"siid":8,"piid":25,"type":"urn:roidmi-spec:property:station-led:00000019:roidmi-v60:1","description":"station-led","format":"bool","access":["notify","read","write"],"unit":"none"}');
    this.addPropertyByString('custom:current-audio', '{"siid":8,"piid":26,"type":"urn:roidmi-spec:property:current-audio:00000003:roidmi-v60:1","description":"current-audio","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:audio', '{"siid":8,"piid":27,"type":"urn:roidmi-spec:property:audio:00000004:roidmi-v60:1","description":"audio","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('custom:progress', '{"siid":8,"piid":28,"type":"urn:roidmi-spec:property:progress:00000005:roidmi-v60:1","description":"progress","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:station-type', '{"siid":8,"piid":29,"type":"urn:roidmi-spec:property:station-type:0000000c:roidmi-v60:1","description":"station-type","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('custom:voice-conf', '{"siid":8,"piid":30,"type":"urn:roidmi-spec:property:voice-conf:0000000f:roidmi-v60:1","description":"voice-conf","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('map:clean-path', '{"siid":13,"piid":2,"type":"urn:roidmi-spec:property:clean-path:00000002:roidmi-v60:1","description":"clean-path","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:restricted-zone', '{"siid":13,"piid":3,"type":"urn:roidmi-spec:property:restricted-zone:00000003:roidmi-v60:1","description":"restricted-zone","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:auto-area', '{"siid":13,"piid":4,"type":"urn:roidmi-spec:property:auto-area:00000004:roidmi-v60:1","description":"auto-area","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:map-memory', '{"siid":13,"piid":5,"type":"urn:roidmi-spec:property:map-memory:00000005:roidmi-v60:1","description":"map-memory","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('map:map-name', '{"siid":13,"piid":6,"type":"urn:roidmi-spec:property:map-name:00000006:roidmi-v60:1","description":"map-name","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:use-auto-area', '{"siid":13,"piid":7,"type":"urn:roidmi-spec:property:use-auto-area:00000007:roidmi-v60:1","description":"use-auto-area","format":"bool","access":["write","read","notify"],"unit":"none"}');
    this.addPropertyByString('map:path-type', '{"siid":13,"piid":8,"type":"urn:roidmi-spec:property:path-type:00000008:roidmi-v60:1","description":"path-type","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Y-Mopping"},{"value":2,"description":"Repeat-Mopping"}]}');
    this.addPropertyByString('sweep:sweep-mode', '{"siid":14,"piid":1,"type":"urn:roidmi-spec:property:sweep-mode:00000001:roidmi-v60:1","description":"sweep-mode","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Total"},{"value":2,"description":"Area"},{"value":3,"description":"Curpoint"},{"value":4,"description":"Point"},{"value":7,"description":"Smart"},{"value":8,"description":"AmartArea"},{"value":9,"description":"DepthTotal"},{"value":10,"description":"AlongWall"},{"value":0,"description":"Idle"}]}');
    this.addPropertyByString('sweep:clean-info', '{"siid":14,"piid":2,"type":"urn:roidmi-spec:property:clean-info:00000002:roidmi-v60:1","description":"clean-info","format":"string","access":[],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:roidmi-v60:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:roidmi-v60:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:roidmi-v60:1","description":"Start Room Sweep","in":[9],"out":null}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:roidmi-v60:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":10,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:roidmi-v60:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner:reset-brush-life', '{"siid":11,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:roidmi-v60:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner2:reset-brush-life', '{"siid":12,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:roidmi-v60:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner3:reset-brush-life', '{"siid":15,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:roidmi-v60:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('custom:find-robot', '{"siid":8,"aiid":1,"type":"urn:roidmi-spec:action:find-robot:00002801:roidmi-v60:1","description":"find-robot","in":[],"out":[]}');
    this.addActionByString('custom:stop-find-charge', '{"siid":8,"aiid":4,"type":"urn:roidmi-spec:action:stop-find-charge:00002804:roidmi-v60:1","description":"stop-find-charge","in":[],"out":[]}');
    this.addActionByString('custom:continue-sweep', '{"siid":8,"aiid":5,"type":"urn:roidmi-spec:action:continue-sweep:00002805:roidmi-v60:1","description":"continue-sweep","in":[],"out":[]}');
    this.addActionByString('custom:start-dust', '{"siid":8,"aiid":6,"type":"urn:roidmi-spec:action:start-dust:00002806:roidmi-v60:1","description":"start-dust","in":[],"out":[]}');
    this.addActionByString('custom:pause', '{"siid":8,"aiid":8,"type":"urn:roidmi-spec:action:pause:00002808:roidmi-v60:1","description":"pause","in":[],"out":[]}');
    this.addActionByString('custom:pause-find-charge', '{"siid":8,"aiid":9,"type":"urn:roidmi-spec:action:pause-find-charge:00002809:roidmi-v60:1","description":"pause-find-charge","in":[],"out":[]}');
    this.addActionByString('custom:continue-find-charge', '{"siid":8,"aiid":10,"type":"urn:roidmi-spec:action:continue-find-charge:0000280a:roidmi-v60:1","description":"continue-find-charge","in":[],"out":[]}');
    this.addActionByString('custom:update-audio', '{"siid":8,"aiid":11,"type":"urn:roidmi-spec:action:update-audio:00002807:roidmi-v60:1","description":"update-audio","in":[27],"out":[]}');
    this.addActionByString('custom:set-voice', '{"siid":8,"aiid":12,"type":"urn:roidmi-spec:action:set-voice:00002802:roidmi-v60:1","description":"set-voice","in":[27],"out":[]}');
    this.addActionByString('map:request-path', '{"siid":13,"aiid":2,"type":"urn:roidmi-spec:action:request-path:00002802:roidmi-v60:1","description":"request-path","in":[2],"out":[]}');
    this.addActionByString('map:change-area-name', '{"siid":13,"aiid":4,"type":"urn:roidmi-spec:action:change-area-name:00002804:roidmi-v60:1","description":"change-area-name","in":[6],"out":[]}');
    this.addActionByString('map:set-auto-area', '{"siid":13,"aiid":6,"type":"urn:roidmi-spec:action:set-auto-area:00002806:roidmi-v60:1","description":"set-auto-area","in":[4],"out":[]}');
    this.addActionByString('map:local-map', '{"siid":13,"aiid":9,"type":"urn:roidmi-spec:action:local-map:00002809:roidmi-v60:1","description":"local-map","in":[6],"out":[]}');
    this.addActionByString('map:area-custom', '{"siid":13,"aiid":10,"type":"urn:roidmi-spec:action:area-custom:0000280a:roidmi-v60:1","description":"area-custom","in":[4],"out":[]}');
    this.addActionByString('map:area-order', '{"siid":13,"aiid":11,"type":"urn:roidmi-spec:action:area-order:0000280b:roidmi-v60:1","description":"area-order","in":[4],"out":[]}');
    this.addActionByString('sweep:start-sweep', '{"siid":14,"aiid":1,"type":"urn:roidmi-spec:action:start-sweep:00002801:roidmi-v60:1","description":"start-sweep","in":[1,2],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('battery:low-battery', '{"siid":3,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:roidmi-v60:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('custom:none', '{"siid":8,"eiid":1,"type":"urn:roidmi-spec:event:none:00005001:roidmi-v60:1","description":"none","arguments":[]}');
    this.addEventByString('custom:poweroff-on-charger', '{"siid":8,"eiid":2,"type":"urn:roidmi-spec:event:poweroff-on-charger:00005002:roidmi-v60:1","description":"poweroff-on-charger","arguments":[]}');
    this.addEventByString('custom:restart-and-bulidmap', '{"siid":8,"eiid":3,"type":"urn:roidmi-spec:event:restart-and-bulidmap:00005003:roidmi-v60:1","description":"restart-and-bulidmap","arguments":[]}');
    this.addEventByString('custom:enter-silent-mod', '{"siid":8,"eiid":4,"type":"urn:roidmi-spec:event:enter-silent-mod:00005004:roidmi-v60:1","description":"enter-silent-mod","arguments":[]}');
    this.addEventByString('custom:time-to-work', '{"siid":8,"eiid":5,"type":"urn:roidmi-spec:event:time-to-work:00005005:roidmi-v60:1","description":"time-to-work","arguments":[]}');
    this.addEventByString('custom:low-power-to-clean', '{"siid":8,"eiid":6,"type":"urn:roidmi-spec:event:low-power-to-clean:00005006:roidmi-v60:1","description":"low-power-to-clean","arguments":[]}');
    this.addEventByString('custom:resume-task', '{"siid":8,"eiid":7,"type":"urn:roidmi-spec:event:resume-task:00005007:roidmi-v60:1","description":"resume-task","arguments":[]}');
    this.addEventByString('custom:clean-finished', '{"siid":8,"eiid":8,"type":"urn:roidmi-spec:event:clean-finished:00005008:roidmi-v60:1","description":"clean-finished","arguments":[]}');
    this.addEventByString('custom:low-bat-warn', '{"siid":8,"eiid":9,"type":"urn:roidmi-spec:event:low-bat-warn:00005009:roidmi-v60:1","description":"low-bat-warn","arguments":[]}');
    this.addEventByString('custom:mop-plug-in', '{"siid":8,"eiid":10,"type":"urn:roidmi-spec:event:mop-plug-in:0000500a:roidmi-v60:1","description":"mop-plug-in","arguments":[]}');
    this.addEventByString('custom:mop-plug-out', '{"siid":8,"eiid":11,"type":"urn:roidmi-spec:event:mop-plug-out:0000500b:roidmi-v60:1","description":"mop-plug-out","arguments":[]}');
    this.addEventByString('custom:reboot', '{"siid":8,"eiid":12,"type":"urn:roidmi-spec:event:reboot:0000500c:roidmi-v60:1","description":"reboot","arguments":[]}');
    this.addEventByString('custom:collect-dust-start', '{"siid":8,"eiid":13,"type":"urn:roidmi-spec:event:collect-dust-start:0000500d:roidmi-v60:2","description":"collect-dust-start","arguments":[]}');
    this.addEventByString('custom:collect-dust-done', '{"siid":8,"eiid":14,"type":"urn:roidmi-spec:event:collect-dust-done:0000500e:roidmi-v60:2","description":"collect-dust-done","arguments":[]}');
    this.addEventByString('custom:collect-dust-full', '{"siid":8,"eiid":15,"type":"urn:roidmi-spec:event:collect-dust-full:0000500f:roidmi-v60:2","description":"collect-dust-full","arguments":[]}');
    this.addEventByString('custom:collect-dust-no-bag', '{"siid":8,"eiid":16,"type":"urn:roidmi-spec:event:collect-dust-no-bag:00005010:roidmi-v60:2","description":"collect-dust-no-bag","arguments":[]}');
    this.addEventByString('custom:collect-dust-no-fan', '{"siid":8,"eiid":17,"type":"urn:roidmi-spec:event:collect-dust-no-fan:00005011:roidmi-v60:2","description":"collect-dust-no-fan","arguments":[]}');
    this.addEventByString('custom:shutdown', '{"siid":8,"eiid":18,"type":"urn:roidmi-spec:event:shutdown:00005012:roidmi-v60:2","description":"shutdown","arguments":[]}');
    this.addEventByString('custom:take-down-mop', '{"siid":8,"eiid":19,"type":"urn:roidmi-spec:event:take-down-mop:00005013:roidmi-v60:2","description":"take-down-mop","arguments":[]}');
    this.addEventByString('custom:clear-filter', '{"siid":8,"eiid":20,"type":"urn:roidmi-spec:event:clear-filter:00005014:roidmi-v60:2","description":"clear-filter","arguments":[]}');
    this.addEventByString('map:map-update', '{"siid":13,"eiid":2,"type":"urn:roidmi-spec:event:map-update:00005002:roidmi-v60:1","description":"map-update","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 4;
  }

  statusIdleValue() {
    return 2;
  }

  statusPausedValue() {
    return 3;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 6;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  cleanTimeProp() {
    return this.getProperty('custom:clean-time');
  }

  totalCleanTimeProp() {
    return this.getProperty('custom:total-clean-time');
  }

  totalCleanAreaProp() {
    return this.getProperty('custom:total-clean-areas');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = RoidmiVacuumV60;

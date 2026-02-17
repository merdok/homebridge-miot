const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiVacuumC102gl extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Robot Cleaner X20+';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:xiaomi-c102gl:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:xiaomi-c102gl:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:xiaomi-c102gl:1","description":"Battery"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:xiaomi-c102gl:1","description":"Main Cleaning Brush"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:xiaomi-c102gl:1","description":"Side Cleaning Brush"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:filter:0000780B:xiaomi-c102gl:1","description":"Filter"}');
    this.createServiceByString('{"siid":18,"type":"urn:miot-spec-v2:service:mop:000078C2:xiaomi-c102gl:1","description":"Mop"}');
    this.createServiceByString('{"siid":4,"type":"urn:xiaomi-spec:service:vacuum-extend:00007801:xiaomi-c102gl:1","description":"vacuum-extend"}');
    this.createServiceByString('{"siid":5,"type":"urn:xiaomi-spec:service:do-not-disturb:00007802:xiaomi-c102gl:1","description":"do-not-disturb"}');
    this.createServiceByString('{"siid":6,"type":"urn:xiaomi-spec:service:map:00007803:xiaomi-c102gl:1","description":"map"}');
    this.createServiceByString('{"siid":7,"type":"urn:xiaomi-spec:service:audio:00007804:xiaomi-c102gl:1","description":"audio"}');
    this.createServiceByString('{"siid":8,"type":"urn:xiaomi-spec:service:time:00007805:xiaomi-c102gl:1","description":"time"}');
    this.createServiceByString('{"siid":12,"type":"urn:xiaomi-spec:service:clean-logs:00007806:xiaomi-c102gl:1","description":"clean-logs"}');
    this.createServiceByString('{"siid":13,"type":"urn:xiaomi-spec:service:vslam-extend:00007807:xiaomi-c102gl:1","description":"vslam-extend"}');
    this.createServiceByString('{"siid":14,"type":"urn:xiaomi-spec:service:robot-config:00007808:xiaomi-c102gl:1","description":"robot-config"}');
    this.createServiceByString('{"siid":15,"type":"urn:xiaomi-spec:service:collect-dust:00007809:xiaomi-c102gl:1","description":"collect-dust"}');
    this.createServiceByString('{"siid":16,"type":"urn:xiaomi-spec:service:sensor:0000780a:xiaomi-c102gl:1","description":"sensor"}');
    this.createServiceByString('{"siid":17,"type":"urn:xiaomi-spec:service:waterbox-sieve:0000780b:xiaomi-c102gl:1","description":"waterbox-sieve"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:xiaomi-c102gl:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Sweeping"},{"value":2,"description":"Idle"},{"value":3,"description":"Paused"},{"value":4,"description":"Error"},{"value":5,"description":"Go Charging"},{"value":6,"description":"Charging"},{"value":7,"description":"Mopping"},{"value":8,"description":"Drying"},{"value":9,"description":"Washing"},{"value":10,"description":"Go Washing"},{"value":11,"description":"Building"},{"value":12,"description":"Sweeping And Mopping"},{"value":13,"description":"Charging Completed"},{"value":14,"description":"Upgrading"},{"value":19,"description":"WaterInspecting"},{"value":21,"description":"WashingMopPause"},{"value":22,"description":"DustCollecting"},{"value":23,"description":"RemoteClean"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-c102gl:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-c102gl:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Silent"},{"value":1,"description":"Basic"},{"value":2,"description":"Strong"},{"value":3,"description":"Full Speed"}]}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:room-ids:00000073:xiaomi-c102gl:1","description":"Room IDs","format":"string","access":[]}');
    this.addPropertyByString('vacuum:dry-left-time', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:dry-left-time:00000174:xiaomi-c102gl:1","description":"Dry Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,9999,1]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:xiaomi-c102gl:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:xiaomi-c102gl:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not Charging"},{"value":5,"description":"Go Charging"}]}');
    this.addPropertyByString('brush-cleaner:brush-left-time', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:xiaomi-c102gl:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,300,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:xiaomi-c102gl:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner10:brush-left-time', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:xiaomi-c102gl:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,200,1]}');
    this.addPropertyByString('brush-cleaner10:brush-life-level', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:xiaomi-c102gl:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:xiaomi-c102gl:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":11,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:xiaomi-c102gl:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,1000,1]}');
    this.addPropertyByString('mop:mop-life-level', '{"siid":18,"piid":1,"type":"urn:miot-spec-v2:property:mop-life-level:00000175:xiaomi-c102gl:1","description":"Mop Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('mop:mop-left-time', '{"siid":18,"piid":2,"type":"urn:miot-spec-v2:property:mop-left-time:00000176:xiaomi-c102gl:1","description":"Mop Left Time","format":"uint16","access":["notify","read"],"unit":"hours","valueRange":[0,9999,1]}');
    this.addPropertyByString('vacuum-extend:work-mode', '{"siid":4,"piid":1,"type":"urn:xiaomi-spec:property:work-mode:00000001:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,50,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-time', '{"siid":4,"piid":2,"type":"urn:xiaomi-spec:property:cleaning-time:00000002:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,32767,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-area', '{"siid":4,"piid":3,"type":"urn:xiaomi-spec:property:cleaning-area:00000003:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,32767,1]}');
    this.addPropertyByString('vacuum-extend:cleaning-mode', '{"siid":4,"piid":4,"type":"urn:xiaomi-spec:property:cleaning-mode:00000004:xiaomi-c102gl:1","description":"","format":"int8","access":["read","notify"],"valueList":[{"value":0,"description":"Quiet"},{"value":1,"description":"Standard"},{"value":2,"description":"Medium"},{"value":3,"description":"Strong"}]}');
    this.addPropertyByString('vacuum-extend:mop-mode', '{"siid":4,"piid":5,"type":"urn:xiaomi-spec:property:mop-mode:00000005:xiaomi-c102gl:1","description":"","format":"int8","access":["read","notify","write"],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('vacuum-extend:waterbox-status', '{"siid":4,"piid":6,"type":"urn:xiaomi-spec:property:waterbox-status:00000006:xiaomi-c102gl:1","description":"","format":"int8","access":["read","notify"],"valueList":[{"value":0,"description":"No"},{"value":1,"description":"Yes"}]}');
    this.addPropertyByString('vacuum-extend:task-status', '{"siid":4,"piid":7,"type":"urn:xiaomi-spec:property:task-status:00000007:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify"],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:clean-start-time', '{"siid":4,"piid":8,"type":"urn:xiaomi-spec:property:clean-start-time:00000008:xiaomi-c102gl:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('vacuum-extend:clean-log-filename', '{"siid":4,"piid":9,"type":"urn:xiaomi-spec:property:clean-log-filename:00000009:xiaomi-c102gl:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('vacuum-extend:clean-extend-data', '{"siid":4,"piid":10,"type":"urn:xiaomi-spec:property:clean-extend-data:0000000a:xiaomi-c102gl:1","description":"","format":"string","access":["write"]}');
    this.addPropertyByString('vacuum-extend:break-point-restart', '{"siid":4,"piid":11,"type":"urn:xiaomi-spec:property:break-point-restart:0000000b:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:carpet-press', '{"siid":4,"piid":12,"type":"urn:xiaomi-spec:property:carpet-press:0000000c:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:cleanlog-status', '{"siid":4,"piid":13,"type":"urn:xiaomi-spec:property:cleanlog-status:0000000d:xiaomi-c102gl:1","description":"","format":"uint16","access":[],"valueList":[{"value":0,"description":"Interrupt"},{"value":1,"description":"Complete"}]}');
    this.addPropertyByString('vacuum-extend:serial-number', '{"siid":4,"piid":14,"type":"urn:xiaomi-spec:property:serial-number:0000000e:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:remote-state', '{"siid":4,"piid":15,"type":"urn:xiaomi-spec:property:remote-state:0000000f:xiaomi-c102gl:1","description":"","format":"string","access":["write"]}');
    this.addPropertyByString('vacuum-extend:clean-rags-tip', '{"siid":4,"piid":16,"type":"urn:xiaomi-spec:property:clean-rags-tip:00000010:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify","write"],"unit":"minutes","valueRange":[0,120,1]}');
    this.addPropertyByString('vacuum-extend:keep-sweeper-time', '{"siid":4,"piid":17,"type":"urn:xiaomi-spec:property:keep-sweeper-time:00000011:xiaomi-c102gl:1","description":"","format":"int32","access":["read","notify"],"unit":"minutes","valueRange":[-1,1000000,1]}');
    this.addPropertyByString('vacuum-extend:faults', '{"siid":4,"piid":18,"type":"urn:xiaomi-spec:property:faults:00000012:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:nation-matched', '{"siid":4,"piid":19,"type":"urn:xiaomi-spec:property:nation-matched:00000013:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('vacuum-extend:relocation-status', '{"siid":4,"piid":20,"type":"urn:xiaomi-spec:property:relocation-status:00000014:xiaomi-c102gl:1","description":"","format":"int32","access":["read","notify"],"valueRange":[0,1000000,1]}');
    this.addPropertyByString('vacuum-extend:laser-switch', '{"siid":4,"piid":21,"type":"urn:xiaomi-spec:property:laser-switch:00000015:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:camera-switch', '{"siid":4,"piid":22,"type":"urn:xiaomi-spec:property:camera-switch:00000016:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:clean-setting', '{"siid":4,"piid":23,"type":"urn:xiaomi-spec:property:clean-setting:00000017:xiaomi-c102gl:1","description":"","format":"uint32","access":[],"valueRange":[0,999999999,1]}');
    this.addPropertyByString('vacuum-extend:stop-map', '{"siid":4,"piid":24,"type":"urn:xiaomi-spec:property:stop-map:00000018:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:wash-station', '{"siid":4,"piid":25,"type":"urn:xiaomi-spec:property:wash-station:00000019:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify"],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:custom-enable', '{"siid":4,"piid":26,"type":"urn:xiaomi-spec:property:custom-enable:0000001a:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:child-lock', '{"siid":4,"piid":27,"type":"urn:xiaomi-spec:property:child-lock:0000001b:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:sensitivity', '{"siid":4,"piid":28,"type":"urn:xiaomi-spec:property:sensitivity:0000001c:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Mid"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('vacuum-extend:mop-way', '{"siid":4,"piid":29,"type":"urn:xiaomi-spec:property:mop-way:0000001d:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:clean-cancel', '{"siid":4,"piid":30,"type":"urn:xiaomi-spec:property:clean-cancel:0000001e:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify"],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:y-clean', '{"siid":4,"piid":31,"type":"urn:xiaomi-spec:property:y-clean:0000001f:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:electric-water', '{"siid":4,"piid":32,"type":"urn:xiaomi-spec:property:electric-water:00000020:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:carpet-recognition', '{"siid":4,"piid":33,"type":"urn:xiaomi-spec:property:carpet-recognition:00000021:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:smart-wash-switch', '{"siid":4,"piid":34,"type":"urn:xiaomi-spec:property:smart-wash-switch:00000022:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:warn-status', '{"siid":4,"piid":35,"type":"urn:xiaomi-spec:property:warn-status:00000023:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:carpet-excape', '{"siid":4,"piid":36,"type":"urn:xiaomi-spec:property:carpet-excape:00000024:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":1,"description":"Escape"},{"value":2,"description":"Auto"}]}');
    this.addPropertyByString('vacuum-extend:clean-fluid-switch', '{"siid":4,"piid":37,"type":"urn:xiaomi-spec:property:clean-fluid-switch:00000025:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('vacuum-extend:capability', '{"siid":4,"piid":38,"type":"urn:xiaomi-spec:property:capability:00000026:xiaomi-c102gl:1","description":"","format":"uint32","access":[],"valueRange":[0,999999999,1]}');
    this.addPropertyByString('vacuum-extend:save-water-tips', '{"siid":4,"piid":39,"type":"urn:xiaomi-spec:property:save-water-tips:00000027:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:drying-time', '{"siid":4,"piid":40,"type":"urn:xiaomi-spec:property:drying-time:00000028:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:no-water-info', '{"siid":4,"piid":41,"type":"urn:xiaomi-spec:property:no-water-info:00000029:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:cruise-map-id', '{"siid":4,"piid":42,"type":"urn:xiaomi-spec:property:cruise-map-id:0000002a:xiaomi-c102gl:1","description":"","format":"uint32","access":[],"valueRange":[0,999999999,1]}');
    this.addPropertyByString('vacuum-extend:cruise-map-name', '{"siid":4,"piid":43,"type":"urn:xiaomi-spec:property:cruise-map-name:0000002b:xiaomi-c102gl:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('vacuum-extend:cruise-task-type', '{"siid":4,"piid":44,"type":"urn:xiaomi-spec:property:cruise-task-type:0000002c:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:auto-install-mop', '{"siid":4,"piid":45,"type":"urn:xiaomi-spec:property:auto-install-mop:0000002d:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:mop-wash-mode', '{"siid":4,"piid":46,"type":"urn:xiaomi-spec:property:mop-wash-mode:0000002e:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:clean-disable-mode', '{"siid":4,"piid":47,"type":"urn:xiaomi-spec:property:clean-disable-mode:0000002f:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:clean-quick', '{"siid":4,"piid":48,"type":"urn:xiaomi-spec:property:clean-quick:00000030:xiaomi-c102gl:1","description":"","format":"uint32","access":[],"valueRange":[0,999999999,1]}');
    this.addPropertyByString('vacuum-extend:reloc-enable', '{"siid":4,"piid":49,"type":"urn:xiaomi-spec:property:reloc-enable:00000031:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:clean-switch-set', '{"siid":4,"piid":50,"type":"urn:xiaomi-spec:property:clean-switch-set:00000032:xiaomi-c102gl:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('vacuum-extend:auto-water', '{"siid":4,"piid":51,"type":"urn:xiaomi-spec:property:auto-water:00000033:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:mop-in-station', '{"siid":4,"piid":52,"type":"urn:xiaomi-spec:property:mop-in-station:00000034:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:mop-pad-installed', '{"siid":4,"piid":53,"type":"urn:xiaomi-spec:property:mop-pad-installed:00000035:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:water-self-check', '{"siid":4,"piid":54,"type":"urn:xiaomi-spec:property:water-self-check:00000036:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:dry-stop-remind', '{"siid":4,"piid":55,"type":"urn:xiaomi-spec:property:dry-stop-remind:00000037:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('vacuum-extend:int-message-prompt', '{"siid":4,"piid":56,"type":"urn:xiaomi-spec:property:int-message-prompt:00000038:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('do-not-disturb:enable', '{"siid":5,"piid":1,"type":"urn:xiaomi-spec:property:enable:00000001:xiaomi-c102gl:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('do-not-disturb:start-time', '{"siid":5,"piid":2,"type":"urn:xiaomi-spec:property:start-time:00000002:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('do-not-disturb:end-time', '{"siid":5,"piid":3,"type":"urn:xiaomi-spec:property:end-time:00000003:xiaomi-c102gl:1","description":"","format":"string","access":["notify","write","read"]}');
    this.addPropertyByString('map:map-data', '{"siid":6,"piid":1,"type":"urn:xiaomi-spec:property:map-data:00000001:xiaomi-c102gl:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('map:frame-info', '{"siid":6,"piid":2,"type":"urn:xiaomi-spec:property:frame-info:00000002:xiaomi-c102gl:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('map:object-name', '{"siid":6,"piid":3,"type":"urn:xiaomi-spec:property:object-name:00000003:xiaomi-c102gl:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('map:map-extend-data', '{"siid":6,"piid":4,"type":"urn:xiaomi-spec:property:map-extend-data:00000004:xiaomi-c102gl:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('map:robot-time', '{"siid":6,"piid":5,"type":"urn:xiaomi-spec:property:robot-time:00000005:xiaomi-c102gl:1","description":"","format":"int64","access":["notify"],"valueRange":[0,999999999999999,1]}');
    this.addPropertyByString('map:result-code', '{"siid":6,"piid":6,"type":"urn:xiaomi-spec:property:result-code:00000006:xiaomi-c102gl:1","description":"","format":"int16","access":["notify"],"valueRange":[-10000,10000,1]}');
    this.addPropertyByString('audio:volume', '{"siid":7,"piid":1,"type":"urn:xiaomi-spec:property:volume:00000001:xiaomi-c102gl:1","description":"","format":"uint8","access":["read","notify","write"],"valueRange":[0,100,1]}');
    this.addPropertyByString('audio:voice-packet-id', '{"siid":7,"piid":2,"type":"urn:xiaomi-spec:property:voice-packet-id:00000002:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('audio:voice-change-state', '{"siid":7,"piid":3,"type":"urn:xiaomi-spec:property:voice-change-state:00000003:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('audio:set-voice', '{"siid":7,"piid":4,"type":"urn:xiaomi-spec:property:set-voice:00000004:xiaomi-c102gl:1","description":"","format":"string","access":["write"]}');
    this.addPropertyByString('time:time-zone', '{"siid":8,"piid":1,"type":"urn:xiaomi-spec:property:time-zone:00000001:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('time:timer-clean', '{"siid":8,"piid":2,"type":"urn:xiaomi-spec:property:timer-clean:00000002:xiaomi-c102gl:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('time:timer-id', '{"siid":8,"piid":3,"type":"urn:xiaomi-spec:property:timer-id:00000003:xiaomi-c102gl:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('time:timer-cancel-reason', '{"siid":8,"piid":4,"type":"urn:xiaomi-spec:property:timer-cancel-reason:00000004:xiaomi-c102gl:1","description":"","format":"uint8","access":[],"valueRange":[0,255,1]}');
    this.addPropertyByString('clean-logs:first-clean-time', '{"siid":12,"piid":1,"type":"urn:xiaomi-spec:property:first-clean-time:00000001:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-time', '{"siid":12,"piid":2,"type":"urn:xiaomi-spec:property:total-clean-time:00000002:xiaomi-c102gl:1","description":"total-clean-time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-times', '{"siid":12,"piid":3,"type":"urn:xiaomi-spec:property:total-clean-times:00000003:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-logs:total-clean-area', '{"siid":12,"piid":4,"type":"urn:xiaomi-spec:property:total-clean-area:00000004:xiaomi-c102gl:1","description":"","format":"uint32","access":["read","notify"],"valueRange":[0,4294967295,1]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:xiaomi-c102gl:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:xiaomi-c102gl:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:xiaomi-c102gl:1","description":"Start Room Sweep","in":[4],"out":[]}');
    this.addActionByString('vacuum:start-dust-arrest', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:start-dust-arrest:00002873:xiaomi-c102gl:1","description":"Start Dust Arrest","in":[],"out":[]}');
    this.addActionByString('vacuum:start-mop-wash', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:start-mop-wash:00002875:xiaomi-c102gl:1","description":"Start Mop Wash","in":[],"out":[]}');
    this.addActionByString('vacuum:start-dry', '{"siid":2,"aiid":8,"type":"urn:miot-spec-v2:action:start-dry:00002877:xiaomi-c102gl:1","description":"Start Dry","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-dry', '{"siid":2,"aiid":9,"type":"urn:miot-spec-v2:action:stop-dry:00002878:xiaomi-c102gl:1","description":"Stop Dry","in":[],"out":[]}');
    this.addActionByString('vacuum:start-eject', '{"siid":2,"aiid":10,"type":"urn:miot-spec-v2:action:start-eject:00002879:xiaomi-c102gl:1","description":"Start Eject","in":[],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:xiaomi-c102gl:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('brush-cleaner:reset-brush-life', '{"siid":9,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:xiaomi-c102gl:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner10:reset-brush-life', '{"siid":10,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:xiaomi-c102gl:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":11,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:xiaomi-c102gl:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('mop:reset-mop-life', '{"siid":18,"aiid":1,"type":"urn:miot-spec-v2:action:reset-mop-life:0000287B:xiaomi-c102gl:1","description":"Reset Mop Life","in":[],"out":[]}');
    this.addActionByString('vacuum-extend:start-clean', '{"siid":4,"aiid":1,"type":"urn:xiaomi-spec:action:start-clean:00002801:xiaomi-c102gl:1","description":"start-clean","in":[10],"out":[]}');
    this.addActionByString('vacuum-extend:stop-clean', '{"siid":4,"aiid":2,"type":"urn:xiaomi-spec:action:stop-clean:00002802:xiaomi-c102gl:1","description":"stop-clean","in":[],"out":[]}');
    this.addActionByString('map:map-req', '{"siid":6,"aiid":1,"type":"urn:xiaomi-spec:action:map-req:00002801:xiaomi-c102gl:1","description":"map-req","in":[2],"out":[1,3,5]}');
    this.addActionByString('map:update-map', '{"siid":6,"aiid":2,"type":"urn:xiaomi-spec:action:update-map:00002802:xiaomi-c102gl:1","description":"update-map","in":[4],"out":[6]}');
    this.addActionByString('audio:position', '{"siid":7,"aiid":1,"type":"urn:xiaomi-spec:action:position:00002801:xiaomi-c102gl:1","description":"position","in":[],"out":[]}');
    this.addActionByString('audio:play-sound', '{"siid":7,"aiid":2,"type":"urn:xiaomi-spec:action:play-sound:00002802:xiaomi-c102gl:1","description":"play-sound","in":[],"out":[]}');
    this.addActionByString('time:delete-timer', '{"siid":8,"aiid":1,"type":"urn:xiaomi-spec:action:delete-timer:00002801:xiaomi-c102gl:1","description":"delete-timer","in":[3],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('vacuum:dust-arrest-complete', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:dust-arrest-complete:0000503D:xiaomi-c102gl:1","description":"Dust Arrest Complete","arguments":[]}');
    this.addEventByString('vacuum:mop-wash-complete', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:mop-wash-complete:0000503E:xiaomi-c102gl:1","description":"Mop Wash Complete","arguments":[]}');
    this.addEventByString('vacuum:dry-complete', '{"siid":2,"eiid":3,"type":"urn:miot-spec-v2:event:dry-complete:0000503F:xiaomi-c102gl:1","description":"Dry Complete","arguments":[]}');
    this.addEventByString('vacuum:eject-complete', '{"siid":2,"eiid":4,"type":"urn:miot-spec-v2:event:eject-complete:00005040:xiaomi-c102gl:1","description":"Eject Complete","arguments":[]}');
    this.addEventByString('battery:low-battery', '{"siid":3,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:xiaomi-c102gl:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('vacuum-extend:cleanup-completed', '{"siid":4,"eiid":1,"type":"urn:xiaomi-spec:event:cleanup-completed:00005001:xiaomi-c102gl:1","description":"cleanup-completed","arguments":[]}');
    this.addEventByString('vacuum-extend:finish-withwaternox', '{"siid":4,"eiid":2,"type":"urn:xiaomi-spec:event:finish-withwaternox:00005002:xiaomi-c102gl:1","description":"finish-withwaternox","arguments":[]}');
    this.addEventByString('vacuum-extend:finish-clean', '{"siid":4,"eiid":3,"type":"urn:xiaomi-spec:event:finish-clean:00005003:xiaomi-c102gl:1","description":"finish-clean","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiVacuumC102gl;
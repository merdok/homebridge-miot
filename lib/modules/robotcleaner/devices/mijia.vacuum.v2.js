const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class MijiaVacuumV2 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Robot Vacuum Mop G1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:mijia-v2:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'alarm:alarm', 'battery:charging-state', 'brush-cleaner:brush-left-time', 'brush-cleaner:brush-life-level',
      'filter:filter-life-level', 'filter:filter-left-time', 'clean-record:clean-time', 'clean-record:clean-area',
      'clean-record:total-clean-time', 'clean-record:total-clean-count', 'clean-record:total-clean-area'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:mijia-v2:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:mijia-v2:1","description":"Battery"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:mijia-v2:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:identify:0000782C:mijia-v2:1","description":"Identify"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:filter:0000780B:mijia-v2:1","description":"Filter"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:mijia-v2:1","description":"Main Cleaning Brush"}');
    this.createServiceByString('{"siid":15,"type":"urn:miot-spec-v2:service:brush-cleaner:0000784C:mijia-v2:1","description":"Side Cleaning Brush"}');
    this.createServiceByString('{"siid":7,"type":"urn:mijia-spec:service:map:00007801:mijia-v2:1","description":"地图"}');
    this.createServiceByString('{"siid":8,"type":"urn:mijia-spec:service:remote-control:00007802:mijia-v2:1","description":"虚拟遥控器"}');
    this.createServiceByString('{"siid":9,"type":"urn:mijia-spec:service:clean-record:00007803:mijia-v2:1","description":"清扫记录"}');
    this.createServiceByString('{"siid":12,"type":"urn:mijia-spec:service:language:00007804:mijia-v2:1","description":"语音语言"}');
    this.createServiceByString('{"siid":13,"type":"urn:mijia-spec:service:go-charging:00007805:mijia-v2:1","description":"回充"}');
    this.createServiceByString('{"siid":16,"type":"urn:mijia-spec:service:other-status:00007806:mijia-v2:1","description":"其他状态水箱拖板"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:mijia-v2:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Sweeping"},{"value":3,"description":"Paused"},{"value":4,"description":"Error"},{"value":5,"description":"Charging"},{"value":6,"description":"Go Charging"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:mijia-v2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Left-wheel-error"},{"value":2,"description":"Right-whelel-error"},{"value":3,"description":"Cliff-error"},{"value":4,"description":"Low-battery-error"},{"value":5,"description":"Bump-error"},{"value":6,"description":"Main-brush-error"},{"value":7,"description":"Side-brush-error"},{"value":8,"description":"Fan-motor-error"},{"value":9,"description":"Dustbin-error"},{"value":10,"description":"Charging-error"},{"value":11,"description":"No-wate-error"},{"value":12,"description":"Pick-up-error"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:mijia-v2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Auto-clean"},{"value":2,"description":"Spot-clean"},{"value":3,"description":"Wallflow-clean"}]}');
    this.addPropertyByString('vacuum:target-water-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-water-level:00000069:mijia-v2:1","description":"Target Water Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('vacuum:fan-level', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:fan-level:00000016:mijia-v2:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Silence"},{"value":1,"description":"Stanrd"},{"value":2,"description":"Middle"},{"value":3,"description":"Enchance"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:mijia-v2:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:mijia-v2:1","description":"Charging State","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Not-charging"},{"value":1,"description":"Charging"},{"value":2,"description":"Charging-competely"}]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:mijia-v2:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:volume', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:volume:00000013:mijia-v2:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:mijia-v2:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":11,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:mijia-v2:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,18000,1]}');
    this.addPropertyByString('brush-cleaner:brush-life-level', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:mijia-v2:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner:brush-left-time', '{"siid":14,"piid":2,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:mijia-v2:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"days","valueRange":[0,18000,1]}');
    this.addPropertyByString('brush-cleaner2:brush-life-level', '{"siid":15,"piid":1,"type":"urn:miot-spec-v2:property:brush-life-level:00000085:mijia-v2:1","description":"Brush Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('brush-cleaner2:brush-left-time', '{"siid":15,"piid":2,"type":"urn:miot-spec-v2:property:brush-left-time:00000086:mijia-v2:1","description":"Brush Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,9000,1]}');
    this.addPropertyByString('map:points', '{"siid":7,"piid":1,"type":"urn:mijia-spec:property:points:00000001:mijia-v2:1","description":"地图点数据","format":"string","access":["notify"],"unit":"none"}');
    this.addPropertyByString('map:map-switch', '{"siid":7,"piid":2,"type":"urn:mijia-spec:property:map-switch:00000002:mijia-v2:2","description":"map-switch","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('remote-control:direction-key', '{"siid":8,"piid":1,"type":"urn:mijia-spec:property:direction-key:00000001:mijia-v2:1","description":"方向键","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""},{"value":3,"description":""},{"value":4,"description":""}]}');
    this.addPropertyByString('clean-record:clean-area', '{"siid":9,"piid":1,"type":"urn:mijia-spec:property:clean-area:00000001:mijia-v2:1","description":"清扫面积","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('clean-record:clean-time', '{"siid":9,"piid":2,"type":"urn:mijia-spec:property:clean-time:00000002:mijia-v2:1","description":"清扫时间","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('clean-record:total-clean-area', '{"siid":9,"piid":3,"type":"urn:mijia-spec:property:total-clean-area:00000003:mijia-v2:1","description":"总清扫面积","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-record:total-clean-time', '{"siid":9,"piid":4,"type":"urn:mijia-spec:property:total-clean-time:00000004:mijia-v2:1","description":"总清扫时间","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('clean-record:total-clean-count', '{"siid":9,"piid":5,"type":"urn:mijia-spec:property:total-clean-count:00000005:mijia-v2:1","description":"总清扫次数","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('clean-record:current-clean-record', '{"siid":9,"piid":6,"type":"urn:mijia-spec:property:current-clean-record:00000006:mijia-v2:1","description":"current-clean-record","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('language:language', '{"siid":12,"piid":1,"type":"urn:mijia-spec:property:language:00000001:mijia-v2:1","description":"语音语言","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"English"},{"value":1,"description":"简体中文"},{"value":2,"description":"Español"},{"value":3,"description":"Русский"},{"value":4,"description":"Italiano"},{"value":5,"description":"Français"},{"value":6,"description":"Deutsch"},{"value":7,"description":"한국어"},{"value":8,"description":"Polski"}]}');
    this.addPropertyByString('language:not-disturb-switch', '{"siid":12,"piid":2,"type":"urn:mijia-spec:property:not-disturb-switch:00000002:mijia-v2:1","description":"勿扰模式开关","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('language:not-disturb-time', '{"siid":12,"piid":3,"type":"urn:mijia-spec:property:not-disturb-time:00000003:mijia-v2:2","description":"not-disturb-time","format":"int32","access":["read","notify","write"],"valueRange":[0,23592359,1]}');
    this.addPropertyByString('language:time-zone', '{"siid":12,"piid":4,"type":"urn:mijia-spec:property:time-zone:00000004:mijia-v2:2","description":"time-zone","format":"int32","access":["read","notify","write"],"valueRange":[-12,12,1]}');
    this.addPropertyByString('other-status:mop-status', '{"siid":16,"piid":1,"type":"urn:mijia-spec:property:mop-status:00000001:mijia-v2:1","description":"拖布状态","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('other-status:log-str', '{"siid":16,"piid":2,"type":"urn:mijia-spec:property:log-str:00000002:mijia-v2:1","description":"log-str","format":"string","access":[],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:mijia-v2:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:mijia-v2:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-charge', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-charge:00002802:mijia-v2:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('identify:identify', '{"siid":6,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:mijia-v2:1","description":"Identify","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":11,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:mijia-v2:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner:reset-brush-life', '{"siid":14,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:mijia-v2:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('brush-cleaner2:reset-brush-life', '{"siid":15,"aiid":1,"type":"urn:miot-spec-v2:action:reset-brush-life:00002830:mijia-v2:1","description":"Reset Brush Life","in":[],"out":[]}');
    this.addActionByString('go-charging:start-charging', '{"siid":13,"aiid":1,"type":"urn:mijia-spec:action:start-charging:00002801:mijia-v2:1","description":"开始回充","in":[],"out":[]}');
    this.addActionByString('go-charging:stop-charging', '{"siid":13,"aiid":2,"type":"urn:mijia-spec:action:stop-charging:00002802:mijia-v2:1","description":"停止回充","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('map:map-points', '{"siid":7,"eiid":1,"type":"urn:mijia-spec:event:map-points:00005001:mijia-v2:1","description":"地图坐标点","arguments":[1]}');
    this.addEventByString('map:redraw-map', '{"siid":7,"eiid":2,"type":"urn:mijia-spec:event:redraw-map:00005002:mijia-v2:1","description":"redraw-map","arguments":[]}');
    this.addEventByString('clean-record:current-clean-record', '{"siid":9,"eiid":1,"type":"urn:mijia-spec:event:current-clean-record:00005001:mijia-v2:1","description":"current-clean-record","arguments":[6]}');
    this.addEventByString('other-status:temp-log', '{"siid":16,"eiid":1,"type":"urn:mijia-spec:event:temp-log:00005001:mijia-v2:1","description":"temp-log","arguments":[2]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 2;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusGoChargingValue() {
    return 6;
  }

  statusChargingValue() {
    return 5;
  }

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 0;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  cleanTimeProp() {
    return this.getProperty('clean-record:clean-time');
  }

  cleanAreaProp() {
    return this.getProperty('clean-record:clean-area');
  }

  totalCleanTimeProp() {
    return this.getProperty('clean-record:total-clean-time');
  }

  totalCleanTimesProp() {
    return this.getProperty('clean-record:total-clean-count');
  }

  totalCleanAreaProp() {
    return this.getProperty('clean-record:total-clean-area');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/

  startChargeAction() {
    return this.getAction('vacuum:start-charge');
  }


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = MijiaVacuumV2;

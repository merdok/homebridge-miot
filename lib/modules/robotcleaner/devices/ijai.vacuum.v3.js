const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IjaiVacuumV3 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Robot Vacuum-Mop 2 Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:ijai-v3:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:ijai-v3:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:ijai-v3:1","description":"Battery"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:ijai-v3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:ijai-spec:service:sweep:00007801:ijai-v3:1","description":"sweep"}');
    this.createServiceByString('{"siid":8,"type":"urn:ijai-spec:service:order:00007802:ijai-v3:1","description":"order"}');
    this.createServiceByString('{"siid":9,"type":"urn:ijai-spec:service:point-zone:00007803:ijai-v3:1","description":"point-zone"}');
    this.createServiceByString('{"siid":10,"type":"urn:ijai-spec:service:map:00007804:ijai-v3:1","description":"map"}');
    this.createServiceByString('{"siid":12,"type":"urn:ijai-spec:service:disturb:00007806:ijai-v3:1","description":"disturb"}');
    this.createServiceByString('{"siid":14,"type":"urn:ijai-spec:service:language:00007807:ijai-v3:1","description":"language"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:ijai-v3:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Sleep"},{"value":1,"description":"Idle"},{"value":2,"description":"Paused"},{"value":3,"description":"Go Charging"},{"value":4,"description":"Charging"},{"value":5,"description":"Sweeping"},{"value":6,"description":"Sweeping and Mopping"},{"value":7,"description":"Mopping"},{"value":8,"description":"Upgrading"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:ijai-v3:1","description":"Device Fault","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,3000,1]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:ijai-v3:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Sweep"},{"value":1,"description":"Sweep And Mop"},{"value":2,"description":"Mop"}]}');
    this.addPropertyByString('vacuum:sweep-type', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:sweep-type:000000D3:ijai-v3:1","description":"Sweep Type","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Global"},{"value":1,"description":"Mop"},{"value":2,"description":"Edge"},{"value":3,"description":"Area"},{"value":4,"description":"Point"},{"value":5,"description":"Remote"},{"value":6,"description":"Explore"},{"value":7,"description":"Room"},{"value":8,"description":"Floor"}]}');
    this.addPropertyByString('vacuum:on', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:on:00000006:ijai-v3:1","description":"Switch Status","format":"string","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('vacuum:room-ids', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:room-ids:00000073:ijai-v3:1","description":"Room IDs","format":"string","access":[]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:ijai-v3:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:ijai-v3:1","description":"Alarm","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Play"}]}');
    this.addPropertyByString('alarm:volume', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:volume:00000013:ijai-v3:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,10,1]}');
    this.addPropertyByString('sweep:repeat-state', '{"siid":7,"piid":1,"type":"urn:ijai-spec:property:repeat-state:00000001:ijai-v3:1","description":"repeat-state","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('sweep:door-state', '{"siid":7,"piid":3,"type":"urn:ijai-spec:property:door-state:00000003:ijai-v3:1","description":"door-state","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"无"},{"value":1,"description":"尘盒"},{"value":2,"description":"水箱"},{"value":3,"description":"二合一水箱"}]}');
    this.addPropertyByString('sweep:cloth-state', '{"siid":7,"piid":4,"type":"urn:ijai-spec:property:cloth-state:00000004:ijai-v3:1","description":"cloth-state","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"没装"},{"value":1,"description":"装了"}]}');
    this.addPropertyByString('sweep:suction-state', '{"siid":7,"piid":5,"type":"urn:ijai-spec:property:suction-state:00000005:ijai-v3:1","description":"suction-state","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"节能"},{"value":2,"description":"标准"},{"value":3,"description":"强劲"}]}');
    this.addPropertyByString('sweep:water-state', '{"siid":7,"piid":6,"type":"urn:ijai-spec:property:water-state:00000006:ijai-v3:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"低"},{"value":1,"description":"中"},{"value":2,"description":"高"}]}');
    this.addPropertyByString('sweep:mop-route', '{"siid":7,"piid":7,"type":"urn:ijai-spec:property:mop-route:00000007:ijai-v3:1","description":"mop-route","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"弓字"},{"value":1,"description":"Y 字"}]}');
    this.addPropertyByString('sweep:side-brush-life', '{"siid":7,"piid":8,"type":"urn:ijai-spec:property:side-brush-life:00000008:ijai-v3:1","description":"side-brush-life","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('sweep:side-brush-hours', '{"siid":7,"piid":9,"type":"urn:ijai-spec:property:side-brush-hours:00000009:ijai-v3:1","description":"side-brush-hours","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('sweep:main-brush-life', '{"siid":7,"piid":10,"type":"urn:ijai-spec:property:main-brush-life:0000000a:ijai-v3:1","description":"main-brush-life","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('sweep:main-brush-hours', '{"siid":7,"piid":11,"type":"urn:ijai-spec:property:main-brush-hours:0000000b:ijai-v3:1","description":"main-brush-hours","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,360,1]}');
    this.addPropertyByString('sweep:hypa-life', '{"siid":7,"piid":12,"type":"urn:ijai-spec:property:hypa-life:0000000c:ijai-v3:1","description":"hypa-life","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('sweep:hypa-hours', '{"siid":7,"piid":13,"type":"urn:ijai-spec:property:hypa-hours:0000000d:ijai-v3:1","description":"hypa-hours","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('sweep:mop-life', '{"siid":7,"piid":14,"type":"urn:ijai-spec:property:mop-life:0000000e:ijai-v3:1","description":"mop-life","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('sweep:mop-hours', '{"siid":7,"piid":15,"type":"urn:ijai-spec:property:mop-hours:0000000f:ijai-v3:1","description":"mop-hours","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('sweep:direction', '{"siid":7,"piid":16,"type":"urn:ijai-spec:property:direction:00000010:ijai-v3:1","description":"direction","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"上（前进）"},{"value":2,"description":"左"},{"value":3,"description":"右"},{"value":4,"description":"下（后退）"},{"value":5,"description":"停止"},{"value":10,"description":"退出模式"}]}');
    this.addPropertyByString('sweep:consumable-index', '{"siid":7,"piid":17,"type":"urn:ijai-spec:property:consumable-index:00000011:ijai-v3:1","description":"consumable-index","format":"uint8","access":[],"unit":"none","valueList":[{"value":1,"description":"主刷"},{"value":2,"description":"边刷"},{"value":3,"description":"滤网"},{"value":4,"description":"拖布"}]}');
    this.addPropertyByString('sweep:time-zone', '{"siid":7,"piid":20,"type":"urn:ijai-spec:property:time-zone:00000014:ijai-v3:1","description":"time-zone","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[-99999,99999,1]}');
    this.addPropertyByString('sweep:cur-lang', '{"siid":7,"piid":21,"type":"urn:ijai-spec:property:cur-lang:00000015:ijai-v3:1","description":"cur-lang","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('sweep:cleaning-time', '{"siid":7,"piid":22,"type":"urn:ijai-spec:property:cleaning-time:00000002:ijai-v3:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,120,1]}');
    this.addPropertyByString('sweep:cleaning-area', '{"siid":7,"piid":23,"type":"urn:ijai-spec:property:cleaning-area:00000012:ijai-v3:1","description":"","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,1200,1]}');
    this.addPropertyByString('sweep:clean-room-ids', '{"siid":7,"piid":24,"type":"urn:ijai-spec:property:clean-room-ids:00000013:ijai-v3:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('sweep:clean-room-mode', '{"siid":7,"piid":25,"type":"urn:ijai-spec:property:clean-room-mode:00000016:ijai-v3:1","description":"","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"全局"},{"value":1,"description":"沿边"}]}');
    this.addPropertyByString('sweep:clean-room-oper', '{"siid":7,"piid":26,"type":"urn:ijai-spec:property:clean-room-oper:00000017:ijai-v3:1","description":"clean-room-oper","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"停止"},{"value":1,"description":"开始"},{"value":2,"description":"暂停"},{"value":3,"description":"假暂停"}]}');
    this.addPropertyByString('sweep:record-start-time', '{"siid":7,"piid":27,"type":"urn:ijai-spec:property:record-start-time:00000018:ijai-v3:1","description":"record-start-time","format":"uint32","access":[],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('sweep:record-use-time', '{"siid":7,"piid":28,"type":"urn:ijai-spec:property:record-use-time:00000019:ijai-v3:1","description":"record-use-time","format":"uint32","access":[],"unit":"seconds","valueRange":[0,99999,1]}');
    this.addPropertyByString('sweep:record-clean-area', '{"siid":7,"piid":29,"type":"urn:ijai-spec:property:record-clean-area:0000001a:ijai-v3:1","description":"","format":"uint32","access":[],"unit":"none","valueRange":[0,99999,1]}');
    this.addPropertyByString('sweep:record-map-url', '{"siid":7,"piid":30,"type":"urn:ijai-spec:property:record-map-url:0000001b:ijai-v3:1","description":"record-map-url","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('sweep:record-clean-mode', '{"siid":7,"piid":31,"type":"urn:ijai-spec:property:record-clean-mode:0000001c:ijai-v3:1","description":"record-clean-mode","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Mopping"},{"value":2,"description":"Corner"},{"value":3,"description":"Local"},{"value":4,"description":"Point"},{"value":5,"description":"Explore"},{"value":6,"description":"Room"},{"value":7,"description":"Material"}]}');
    this.addPropertyByString('sweep:record-clean-way', '{"siid":7,"piid":32,"type":"urn:ijai-spec:property:record-clean-way:0000001d:ijai-v3:1","description":"record-clean-way","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"扫地"},{"value":1,"description":"扫拖"},{"value":2,"description":"单拖"}]}');
    this.addPropertyByString('sweep:clean-current-map', '{"siid":7,"piid":33,"type":"urn:ijai-spec:property:clean-current-map:0000001e:ijai-v3:1","description":"clean-current-map","format":"uint32","access":[],"unit":"none","valueRange":[1,4294967295,1]}');
    this.addPropertyByString('sweep:clean-preference', '{"siid":7,"piid":34,"type":"urn:ijai-spec:property:clean-preference:0000001f:ijai-v3:1","description":"clean-preference","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('sweep:record-task-status', '{"siid":7,"piid":37,"type":"urn:ijai-spec:property:record-task-status:00000022:ijai-v3:1","description":"","format":"uint32","access":[],"unit":"none","valueList":[{"value":1,"description":"正常结束"},{"value":2,"description":"app 停止"},{"value":3,"description":"按键停止"},{"value":4,"description":"异常"},{"value":5,"description":"xx"}]}');
    this.addPropertyByString('sweep:clean-prefer-type', '{"siid":7,"piid":38,"type":"urn:ijai-spec:property:clean-prefer-type:00000023:ijai-v3:1","description":"","format":"uint8","access":[],"unit":"none","valueList":[{"value":1,"description":"房间定制"},{"value":2,"description":"地板材质定制"},{"value":0,"description":"自动清扫"}]}');
    this.addPropertyByString('sweep:clean-prefer-on', '{"siid":7,"piid":39,"type":"urn:ijai-spec:property:clean-prefer-on:00000024:ijai-v3:1","description":"","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('sweep:clean-preference-ii', '{"siid":7,"piid":40,"type":"urn:ijai-spec:property:clean-preference-ii:00000025:ijai-v3:1","description":"clean-preference-ii","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('sweep:clean-prefer-on-ii', '{"siid":7,"piid":41,"type":"urn:ijai-spec:property:clean-prefer-on-ii:00000026:ijai-v3:1","description":"","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('sweep:go-charging', '{"siid":7,"piid":43,"type":"urn:ijai-spec:property:go-charging:00000028:ijai-v3:1","description":"go-charging","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"停止回充"},{"value":1,"description":"开始回充"}]}');
    this.addPropertyByString('sweep:multi-prop-vacuum', '{"siid":7,"piid":45,"type":"urn:ijai-spec:property:multi-prop-vacuum:0000002a:ijai-v3:1","description":"multi-prop-vacuum","format":"string","access":["read","notify"]}');
    this.addPropertyByString('sweep:tank-shake', '{"siid":7,"piid":48,"type":"urn:ijai-spec:property:tank-shake:00000027:ijai-v3:1","description":"tank-shake","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('sweep:shake-shift', '{"siid":7,"piid":50,"type":"urn:ijai-spec:property:shake-shift:00000021:ijai-v3:1","description":"shake-shift","format":"uint8","access":["read","notify","write"],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Mid"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('order:order-id', '{"siid":8,"piid":1,"type":"urn:ijai-spec:property:order-id:00000001:ijai-v3:1","description":"order-id","format":"uint8","access":["write"],"unit":"none","valueRange":[0,100,1]}');
    this.addPropertyByString('order:enable', '{"siid":8,"piid":2,"type":"urn:ijai-spec:property:enable:00000002:ijai-v3:1","description":"enable","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"否"},{"value":1,"description":"是"}]}');
    this.addPropertyByString('order:day', '{"siid":8,"piid":3,"type":"urn:ijai-spec:property:day:00000003:ijai-v3:1","description":"day","format":"uint8","access":["write"],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('order:hour', '{"siid":8,"piid":4,"type":"urn:ijai-spec:property:hour:00000004:ijai-v3:1","description":"hour","format":"uint8","access":["write"],"unit":"none","valueRange":[0,23,1]}');
    this.addPropertyByString('order:minute', '{"siid":8,"piid":5,"type":"urn:ijai-spec:property:minute:00000005:ijai-v3:1","description":"minute","format":"uint8","access":["write"],"unit":"none","valueRange":[0,59,1]}');
    this.addPropertyByString('order:repeat', '{"siid":8,"piid":6,"type":"urn:ijai-spec:property:repeat:00000006:ijai-v3:1","description":"repeat","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"单次任务"},{"value":1,"description":"重复任务"}]}');
    this.addPropertyByString('order:clean-way', '{"siid":8,"piid":7,"type":"urn:ijai-spec:property:clean-way:00000007:ijai-v3:1","description":"clean-way","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"扫地"},{"value":1,"description":"扫拖"},{"value":2,"description":"单拖"}]}');
    this.addPropertyByString('order:suction', '{"siid":8,"piid":8,"type":"urn:ijai-spec:property:suction:00000008:ijai-v3:1","description":"","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"节能"},{"value":2,"description":"标准"},{"value":3,"description":"强劲"}]}');
    this.addPropertyByString('order:water', '{"siid":8,"piid":9,"type":"urn:ijai-spec:property:water:00000009:ijai-v3:1","description":"water","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"低水量"},{"value":1,"description":"中水量"},{"value":2,"description":"高水量"}]}');
    this.addPropertyByString('order:twice-clean', '{"siid":8,"piid":10,"type":"urn:ijai-spec:property:twice-clean:0000000a:ijai-v3:1","description":"twice-clean","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"否"},{"value":1,"description":"是"}]}');
    this.addPropertyByString('order:mapid', '{"siid":8,"piid":11,"type":"urn:ijai-spec:property:mapid:0000000b:ijai-v3:1","description":"mapid","format":"uint32","access":["write"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('order:room-count', '{"siid":8,"piid":12,"type":"urn:ijai-spec:property:room-count:0000000c:ijai-v3:1","description":"room-count","format":"uint8","access":["write"],"unit":"none","valueRange":[0,64,1]}');
    this.addPropertyByString('order:room-data', '{"siid":8,"piid":13,"type":"urn:ijai-spec:property:room-data:0000000d:ijai-v3:1","description":"","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('order:time-zone', '{"siid":8,"piid":14,"type":"urn:ijai-spec:property:time-zone:0000000e:ijai-v3:1","description":"","format":"int32","access":["write"],"unit":"none","valueRange":[-43200,43200,1]}');
    this.addPropertyByString('order:orderdata', '{"siid":8,"piid":15,"type":"urn:ijai-spec:property:orderdata:0000000f:ijai-v3:1","description":"orderdata","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('order:room-preference', '{"siid":8,"piid":16,"type":"urn:ijai-spec:property:room-preference:00000010:ijai-v3:1","description":"room-preference","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('order:prefer-type', '{"siid":8,"piid":17,"type":"urn:ijai-spec:property:prefer-type:00000011:ijai-v3:1","description":"prefer-type","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"Empty"},{"value":1,"description":"Room-preference"},{"value":2,"description":"Material-preference"}]}');
    this.addPropertyByString('order:all-enable-count', '{"siid":8,"piid":18,"type":"urn:ijai-spec:property:all-enable-count:00000012:ijai-v3:1","description":"all-enable-count","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('order:is-global', '{"siid":8,"piid":19,"type":"urn:ijai-spec:property:is-global:00000013:ijai-v3:1","description":"is-global","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"Area"},{"value":1,"description":"Global"}]}');
    this.addPropertyByString('point-zone:zone-points', '{"siid":9,"piid":2,"type":"urn:ijai-spec:property:zone-points:00000002:ijai-v3:1","description":"zone-points","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('point-zone:restrict-points', '{"siid":9,"piid":3,"type":"urn:ijai-spec:property:restrict-points:00000003:ijai-v3:1","description":"","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('point-zone:pause-type', '{"siid":9,"piid":4,"type":"urn:ijai-spec:property:pause-type:00000004:ijai-v3:1","description":"pause-type","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"暂停"},{"value":1,"description":"假暂停（启动不需要重定位）"}]}');
    this.addPropertyByString('point-zone:target-point', '{"siid":9,"piid":5,"type":"urn:ijai-spec:property:target-point:00000005:ijai-v3:1","description":"target-point","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('point-zone:map-id', '{"siid":9,"piid":7,"type":"urn:ijai-spec:property:map-id:00000006:ijai-v3:1","description":"map-id","format":"uint32","access":[],"unit":"none","valueRange":[1,4294967295,1]}');
    this.addPropertyByString('point-zone:map-type', '{"siid":9,"piid":8,"type":"urn:ijai-spec:property:map-type:00000007:ijai-v3:1","description":"map-type","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"0"},{"value":1,"description":"1"},{"value":2,"description":"2"},{"value":3,"description":"3"}]}');
    this.addPropertyByString('point-zone:timestamp', '{"siid":9,"piid":9,"type":"urn:ijai-spec:property:timestamp:00000008:ijai-v3:1","description":"timestamp","format":"uint32","access":[],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('map:remember-state', '{"siid":10,"piid":1,"type":"urn:ijai-spec:property:remember-state:00000001:ijai-v3:1","description":"remember-state","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('map:cur-map-id', '{"siid":10,"piid":2,"type":"urn:ijai-spec:property:cur-map-id:00000002:ijai-v3:1","description":"cur-map-id","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('map:map-num', '{"siid":10,"piid":3,"type":"urn:ijai-spec:property:map-num:00000003:ijai-v3:1","description":"map-num","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,5,1]}');
    this.addPropertyByString('map:map-list', '{"siid":10,"piid":4,"type":"urn:ijai-spec:property:map-list:00000004:ijai-v3:1","description":"map-list","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:cur-cleaning-path', '{"siid":10,"piid":5,"type":"urn:ijai-spec:property:cur-cleaning-path:00000005:ijai-v3:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('map:upload-id', '{"siid":10,"piid":6,"type":"urn:ijai-spec:property:upload-id:00000006:ijai-v3:1","description":"","format":"uint32","access":[],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('map:upload-type', '{"siid":10,"piid":7,"type":"urn:ijai-spec:property:upload-type:00000007:ijai-v3:1","description":"","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"实时图"},{"value":1,"description":"指哪图"},{"value":2,"description":"划区图"},{"value":3,"description":"记忆图"}]}');
    this.addPropertyByString('map:map-name', '{"siid":10,"piid":8,"type":"urn:ijai-spec:property:map-name:00000008:ijai-v3:1","description":"map-name","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:room-id', '{"siid":10,"piid":9,"type":"urn:ijai-spec:property:room-id:00000009:ijai-v3:1","description":"room-id","format":"uint8","access":[],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('map:room-name', '{"siid":10,"piid":10,"type":"urn:ijai-spec:property:room-name:0000000a:ijai-v3:1","description":"room-name","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:arrange-room-ids', '{"siid":10,"piid":11,"type":"urn:ijai-spec:property:arrange-room-ids:0000000b:ijai-v3:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:split-points', '{"siid":10,"piid":12,"type":"urn:ijai-spec:property:split-points:0000000c:ijai-v3:1","description":"split-points","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:lang', '{"siid":10,"piid":13,"type":"urn:ijai-spec:property:lang:0000000d:ijai-v3:1","description":"lang","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:build-map', '{"siid":10,"piid":14,"type":"urn:ijai-spec:property:build-map:0000000e:ijai-v3:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"不新建图（不写）"},{"value":1,"description":"只建图不清扫"},{"value":2,"description":"建图+清扫（暂时无效）"}]}');
    this.addPropertyByString('map:start-cleaning-point', '{"siid":10,"piid":15,"type":"urn:ijai-spec:property:start-cleaning-point:0000000f:ijai-v3:1","description":"start-cleaning-point","format":"uint32","access":[],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('map:end-cleaning-point', '{"siid":10,"piid":16,"type":"urn:ijai-spec:property:end-cleaning-point:00000010:ijai-v3:1","description":"end-cleaning-point","format":"uint32","access":[],"unit":"none","valueRange":[1,4294967295,1]}');
    this.addPropertyByString('map:room-id-name-list', '{"siid":10,"piid":17,"type":"urn:ijai-spec:property:room-id-name-list:00000011:ijai-v3:1","description":"","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:timestamp', '{"siid":10,"piid":18,"type":"urn:ijai-spec:property:timestamp:00000012:ijai-v3:1","description":"timestamp","format":"uint32","access":[],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('map:has-new-map', '{"siid":10,"piid":19,"type":"urn:ijai-spec:property:has-new-map:00000013:ijai-v3:1","description":"has-new-map","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Without Map To Save"},{"value":1,"description":"Wait To Rename Map"}]}');
    this.addPropertyByString('map:test-for-upload-map', '{"siid":10,"piid":20,"type":"urn:ijai-spec:property:test-for-upload-map:00000014:ijai-v3:1","description":"test-for-upload-map","format":"uint8","access":[],"unit":"none","valueList":[{"value":1,"description":"RealMap"},{"value":2,"description":"MemoryMap"}]}');
    this.addPropertyByString('map:renew-map', '{"siid":10,"piid":21,"type":"urn:ijai-spec:property:renew-map:00000015:ijai-v3:1","description":"renew-map","format":"uint8","access":[],"unit":"none","valueList":[{"value":0,"description":"False"},{"value":1,"description":"True"}]}');
    this.addPropertyByString('map:mijia-room-list', '{"siid":10,"piid":22,"type":"urn:ijai-spec:property:mijia-room-list:00000016:ijai-v3:1","description":"mijia-room-list","format":"string","access":[]}');
    this.addPropertyByString('map:map-uploads', '{"siid":10,"piid":23,"type":"urn:ijai-spec:property:map-uploads:00000017:ijai-v3:1","description":"map-uploads","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Upload"},{"value":1,"description":"Do Not Upload"}]}');
    this.addPropertyByString('disturb:dnd-enable', '{"siid":12,"piid":1,"type":"urn:ijai-spec:property:dnd-enable:00000001:ijai-v3:1","description":"dnd-enable","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('disturb:dnd-start-hour', '{"siid":12,"piid":2,"type":"urn:ijai-spec:property:dnd-start-hour:00000002:ijai-v3:1","description":"dnd-start-hour","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,23,1]}');
    this.addPropertyByString('disturb:dnd-start-minute', '{"siid":12,"piid":3,"type":"urn:ijai-spec:property:dnd-start-minute:00000003:ijai-v3:1","description":"dnd-start-minute","format":"uint8","access":["read","notify"],"unit":"minutes","valueRange":[0,59,1]}');
    this.addPropertyByString('disturb:dnd-end-hour', '{"siid":12,"piid":4,"type":"urn:ijai-spec:property:dnd-end-hour:00000004:ijai-v3:1","description":"dnd-end-hour","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,23,1]}');
    this.addPropertyByString('disturb:dnd-end-minute', '{"siid":12,"piid":5,"type":"urn:ijai-spec:property:dnd-end-minute:00000005:ijai-v3:1","description":"dnd-end-minute","format":"uint8","access":["read","notify"],"unit":"minutes","valueRange":[0,59,1]}');
    this.addPropertyByString('disturb:dnd-timezone', '{"siid":12,"piid":6,"type":"urn:ijai-spec:property:dnd-timezone:00000006:ijai-v3:1","description":"dnd-timezone","format":"int32","access":[],"unit":"none","valueRange":[-99999,99999,1]}');
    this.addPropertyByString('disturb:multi-prop-dnd', '{"siid":12,"piid":7,"type":"urn:ijai-spec:property:multi-prop-dnd:00000007:ijai-v3:1","description":"multi-prop-dnd","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('language:target-voice', '{"siid":14,"piid":1,"type":"urn:ijai-spec:property:target-voice:00000001:ijai-v3:1","description":"target-voice","format":"string","access":[]}');
    this.addPropertyByString('language:cur-voice', '{"siid":14,"piid":2,"type":"urn:ijai-spec:property:cur-voice:00000002:ijai-v3:1","description":"cur-voice","format":"string","access":[]}');
    this.addPropertyByString('language:download-status', '{"siid":14,"piid":3,"type":"urn:ijai-spec:property:download-status:00000003:ijai-v3:1","description":"download-status","format":"uint8","access":[],"valueRange":[0,22,1]}');
    this.addPropertyByString('language:download-progress', '{"siid":14,"piid":4,"type":"urn:ijai-spec:property:download-progress:00000004:ijai-v3:1","description":"download-progress","format":"uint8","access":[],"valueRange":[0,100,1]}');
    this.addPropertyByString('language:voice-url', '{"siid":14,"piid":5,"type":"urn:ijai-spec:property:voice-url:00000005:ijai-v3:1","description":"voice-url","format":"string","access":[]}');
    this.addPropertyByString('language:voice-mdfive', '{"siid":14,"piid":6,"type":"urn:ijai-spec:property:voice-mdfive:00000006:ijai-v3:1","description":"voice-mdfive","format":"string","access":[]}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:ijai-v3:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:ijai-v3:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:start-only-sweep', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:start-only-sweep:0000283A:ijai-v3:1","description":"Start Only Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:start-sweep-mop', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:start-sweep-mop:00002835:ijai-v3:1","description":"Start Sweep Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-mop', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:start-mop:00002834:ijai-v3:1","description":"Start Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-room-sweep', '{"siid":2,"aiid":7,"type":"urn:miot-spec-v2:action:start-room-sweep:00002826:ijai-v3:1","description":"Start Room Sweep","in":[10],"out":[]}');
    this.addActionByString('battery:start-charge', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:start-charge:00002802:ijai-v3:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('sweep:reset-consumable', '{"siid":7,"aiid":1,"type":"urn:ijai-spec:action:reset-consumable:00002801:ijai-v3:1","description":"reset-consumable","in":[17],"out":[]}');
    this.addActionByString('sweep:set-calibration', '{"siid":7,"aiid":2,"type":"urn:ijai-spec:action:set-calibration:00002802:ijai-v3:1","description":"set-calibration","in":[],"out":[]}');
    this.addActionByString('sweep:set-room-clean', '{"siid":7,"aiid":3,"type":"urn:ijai-spec:action:set-room-clean:00002803:ijai-v3:1","description":"set-room-clean","in":[24,25,26],"out":[]}');
    this.addActionByString('sweep:set-preference-clean', '{"siid":7,"aiid":4,"type":"urn:ijai-spec:action:set-preference-clean:00002804:ijai-v3:1","description":"set-preference-clean","in":[34,33],"out":[]}');
    this.addActionByString('sweep:get-preference-clean', '{"siid":7,"aiid":5,"type":"urn:ijai-spec:action:get-preference-clean:00002805:ijai-v3:1","description":"get-preference-clean","in":[33],"out":[34,39,40,41]}');
    this.addActionByString('sweep:set-preference-type', '{"siid":7,"aiid":6,"type":"urn:ijai-spec:action:set-preference-type:00002806:ijai-v3:1","description":"set-preference-type","in":[38],"out":[]}');
    this.addActionByString('sweep:set-go-charging', '{"siid":7,"aiid":7,"type":"urn:ijai-spec:action:set-go-charging:00002807:ijai-v3:1","description":"set-go-charging","in":[43],"out":[]}');
    this.addActionByString('sweep:erase-preference', '{"siid":7,"aiid":8,"type":"urn:ijai-spec:action:erase-preference:00002808:ijai-v3:1","description":"erase-preference","in":[24,33,38],"out":[]}');
    this.addActionByString('sweep:set-preference-ii', '{"siid":7,"aiid":9,"type":"urn:ijai-spec:action:set-preference-ii:00002809:ijai-v3:1","description":"set-preference-ii","in":[34,33],"out":[]}');
    this.addActionByString('sweep:get-preference-ii', '{"siid":7,"aiid":10,"type":"urn:ijai-spec:action:get-preference-ii:0000280a:ijai-v3:1","description":"get-preference-ii","in":[33],"out":[34,39,40,41]}');
    this.addActionByString('order:add', '{"siid":8,"aiid":1,"type":"urn:ijai-spec:action:add:00002801:ijai-v3:1","description":"add","in":[1,2,3,4,5,6,11,14,12,16],"out":[]}');
    this.addActionByString('order:del', '{"siid":8,"aiid":2,"type":"urn:ijai-spec:action:del:00002802:ijai-v3:1","description":"del","in":[1],"out":[]}');
    this.addActionByString('order:get', '{"siid":8,"aiid":3,"type":"urn:ijai-spec:action:get:00002803:ijai-v3:1","description":"get","in":[],"out":[15]}');
    this.addActionByString('order:add-ii', '{"siid":8,"aiid":4,"type":"urn:ijai-spec:action:add-ii:00002804:ijai-v3:1","description":"add-ii","in":[1,2,3,4,5,6,11,12,14,16,17,19],"out":[]}');
    this.addActionByString('order:get-map-order-count', '{"siid":8,"aiid":5,"type":"urn:ijai-spec:action:get-map-order-count:00002805:ijai-v3:1","description":"get-map-order-count","in":[11],"out":[18]}');
    this.addActionByString('point-zone:start-point-clean', '{"siid":9,"aiid":1,"type":"urn:ijai-spec:action:start-point-clean:00002801:ijai-v3:1","description":"start-point-clean","in":[],"out":[]}');
    this.addActionByString('point-zone:pause-point-clean', '{"siid":9,"aiid":2,"type":"urn:ijai-spec:action:pause-point-clean:00002802:ijai-v3:1","description":"pause-point-clean","in":[4],"out":[]}');
    this.addActionByString('point-zone:start-zone-clean', '{"siid":9,"aiid":3,"type":"urn:ijai-spec:action:start-zone-clean:00002803:ijai-v3:1","description":"start-zone-clean","in":[],"out":[]}');
    this.addActionByString('point-zone:pause-zone-clean', '{"siid":9,"aiid":4,"type":"urn:ijai-spec:action:pause-zone-clean:00002804:ijai-v3:1","description":"pause-zone-clean","in":[4],"out":[]}');
    this.addActionByString('point-zone:set-virtual-wall', '{"siid":9,"aiid":6,"type":"urn:ijai-spec:action:set-virtual-wall:00002806:ijai-v3:1","description":"set-virtual-wall","in":[3],"out":[7,8,9]}');
    this.addActionByString('point-zone:set-zone-point', '{"siid":9,"aiid":8,"type":"urn:ijai-spec:action:set-zone-point:00002808:ijai-v3:1","description":"set-zone-point","in":[2],"out":[7,8,9]}');
    this.addActionByString('point-zone:start-point-clean-ii', '{"siid":9,"aiid":9,"type":"urn:ijai-spec:action:start-point-clean-ii:00002807:ijai-v3:1","description":"start-point-clean-ii","in":[5],"out":[7,8,9]}');
    this.addActionByString('map:get-map-list', '{"siid":10,"aiid":1,"type":"urn:ijai-spec:action:get-map-list:00002801:ijai-v3:1","description":"get-map-list","in":[],"out":[4]}');
    this.addActionByString('map:upload-by-mapid', '{"siid":10,"aiid":2,"type":"urn:ijai-spec:action:upload-by-mapid:00002802:ijai-v3:1","description":"upload-by-mapid","in":[6],"out":[6,7,18]}');
    this.addActionByString('map:set-cur-map', '{"siid":10,"aiid":3,"type":"urn:ijai-spec:action:set-cur-map:00002803:ijai-v3:1","description":"set-cur-map","in":[6],"out":[]}');
    this.addActionByString('map:del-map', '{"siid":10,"aiid":4,"type":"urn:ijai-spec:action:del-map:00002804:ijai-v3:1","description":"del-map","in":[6],"out":[]}');
    this.addActionByString('map:rename-map', '{"siid":10,"aiid":5,"type":"urn:ijai-spec:action:rename-map:00002805:ijai-v3:1","description":"rename-map","in":[6,8],"out":[]}');
    this.addActionByString('map:upload-by-maptype', '{"siid":10,"aiid":6,"type":"urn:ijai-spec:action:upload-by-maptype:00002806:ijai-v3:1","description":"upload-by-maptype","in":[7],"out":[6,7,18]}');
    this.addActionByString('map:rename-room', '{"siid":10,"aiid":7,"type":"urn:ijai-spec:action:rename-room:00002807:ijai-v3:1","description":"rename-room","in":[6,9,10],"out":[6,7,18]}');
    this.addActionByString('map:arrange-room', '{"siid":10,"aiid":8,"type":"urn:ijai-spec:action:arrange-room:00002808:ijai-v3:1","description":"arrange-room","in":[6,11,13],"out":[6,7,18]}');
    this.addActionByString('map:split-room', '{"siid":10,"aiid":9,"type":"urn:ijai-spec:action:split-room:00002809:ijai-v3:1","description":"split-room","in":[6,9,12,13],"out":[6,7,18]}');
    this.addActionByString('map:reset-map', '{"siid":10,"aiid":10,"type":"urn:ijai-spec:action:reset-map:0000280a:ijai-v3:1","description":"reset-map","in":[],"out":[]}');
    this.addActionByString('map:build-new-map', '{"siid":10,"aiid":11,"type":"urn:ijai-spec:action:build-new-map:0000280b:ijai-v3:1","description":"build-new-map","in":[14],"out":[]}');
    this.addActionByString('map:get-cur-path', '{"siid":10,"aiid":12,"type":"urn:ijai-spec:action:get-cur-path:0000280c:ijai-v3:1","description":"get-cur-path","in":[15,16],"out":[5]}');
    this.addActionByString('map:get-map-room-list', '{"siid":10,"aiid":13,"type":"urn:ijai-spec:action:get-map-room-list:0000280d:ijai-v3:1","description":"get-map-room-list","in":[2],"out":[17]}');
    this.addActionByString('map:upload-by-mapid-ii', '{"siid":10,"aiid":14,"type":"urn:ijai-spec:action:upload-by-mapid-ii:0000280e:ijai-v3:1","description":"upload-by-mapid-ii","in":[6],"out":[6,7,18,21]}');
    this.addActionByString('map:upload-by-maptype-ii', '{"siid":10,"aiid":15,"type":"urn:ijai-spec:action:upload-by-maptype-ii:0000280f:ijai-v3:1","description":"upload-by-maptype-ii","in":[7],"out":[6,7,18,21]}');
    this.addActionByString('map:reset-map-ii', '{"siid":10,"aiid":16,"type":"urn:ijai-spec:action:reset-map-ii:00002810:ijai-v3:1","description":"reset-map-ii","in":[],"out":[18]}');
    this.addActionByString('map:build-map-ii', '{"siid":10,"aiid":17,"type":"urn:ijai-spec:action:build-map-ii:00002811:ijai-v3:1","description":"build-map-ii","in":[14],"out":[18]}');
    this.addActionByString('map:set-mijia-room-list', '{"siid":10,"aiid":18,"type":"urn:ijai-spec:action:set-mijia-room-list:00002812:ijai-v3:1","description":"set-mijia-room-list","in":[6,22],"out":[]}');
    this.addActionByString('disturb:set-notdisturb', '{"siid":12,"aiid":1,"type":"urn:ijai-spec:action:set-notdisturb:00002801:ijai-v3:1","description":"set-notdisturb","in":[1,2,3,4,5,6],"out":[]}');
    this.addActionByString('language:download-voice', '{"siid":14,"aiid":1,"type":"urn:ijai-spec:action:download-voice:00002801:ijai-v3:1","description":"download-voice","in":[1,5,6],"out":[]}');
    this.addActionByString('language:get-download-status', '{"siid":14,"aiid":2,"type":"urn:ijai-spec:action:get-download-status:00002802:ijai-v3:1","description":"get-download-status","in":[],"out":[1,2,3,4]}');
  }

  initDeviceEvents() {
    this.addEventByString('battery:low-battery', '{"siid":3,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:ijai-v3:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('battery:low-battery2', '{"siid":3,"eiid":2,"type":"urn:miot-spec-v2:event:low-battery:00005003:ijai-v3:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('sweep:clean-end', '{"siid":7,"eiid":1,"type":"urn:ijai-spec:event:clean-end:00005001:ijai-v3:1","description":"clean-end","arguments":[27,28,29,30,31,32,33,34,37]}');
    this.addEventByString('sweep:clean-end-lite', '{"siid":7,"eiid":2,"type":"urn:ijai-spec:event:clean-end-lite:00005002:ijai-v3:1","description":"clean-end-lite","arguments":[]}');
    this.addEventByString('sweep:build-end-lite', '{"siid":7,"eiid":3,"type":"urn:ijai-spec:event:build-end-lite:00005003:ijai-v3:1","description":"build-end-lite","arguments":[]}');
    this.addEventByString('map:map-change', '{"siid":10,"eiid":1,"type":"urn:ijai-spec:event:map-change:00005001:ijai-v3:1","description":"map-change","arguments":[2]}');
    this.addEventByString('map:global-push', '{"siid":10,"eiid":2,"type":"urn:ijai-spec:event:global-push:00005002:ijai-v3:1","description":"global-push","arguments":[]}');
    this.addEventByString('map:arrange-end', '{"siid":10,"eiid":3,"type":"urn:ijai-spec:event:arrange-end:00005003:ijai-v3:1","description":"arrange-end","arguments":[2]}');
    this.addEventByString('map:upload-verify', '{"siid":10,"eiid":4,"type":"urn:ijai-spec:event:upload-verify:00005004:ijai-v3:1","description":"upload-verify","arguments":[6,7,18]}');
    this.addEventByString('map:cleaning-path', '{"siid":10,"eiid":5,"type":"urn:ijai-spec:event:cleaning-path:00005005:ijai-v3:1","description":"cleaning-path","arguments":[5]}');
    this.addEventByString('map:test-upload-map', '{"siid":10,"eiid":6,"type":"urn:ijai-spec:event:test-upload-map:00005006:ijai-v3:1","description":"test-upload-map","arguments":[20,18]}');
    this.addEventByString('map:clear-path', '{"siid":10,"eiid":7,"type":"urn:ijai-spec:event:clear-path:00005007:ijai-v3:1","description":"clear-path","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusSweepingValue() {
    return 5;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 2;
  }

  statusGoChargingValue() {
    return 3;
  }

  statusChargingValue() {
    return 4;
  }

  statusMopppingValue() {
    return 7;
  }

  statusUpdatingValue() {
    return 8;
  }

  statusSleepValue() {
    return 0;
  }

  statusSweepingAndMoppingValue() {
    return 6;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  mainBrushLeftTimeProp() {
    return this.getProperty('sweep:main-brush-hours');
  }

  mainBrushLifeLevelProp() {
    return this.getProperty('sweep:main-brush-life');
  }

  sideBrushLeftTimeProp() {
    return this.getProperty('sweep:side-brush-hours');
  }

  sideBrushLifeLevelProp() {
    return this.getProperty('sweep:side-brush-life');
  }

  filterLeftTimeProp() {
    return this.getProperty('sweep:hypa-hours');
  }

  filterLifeLevelProp() {
    return this.getProperty('sweep:hypa-life');
  }

  cleanTimeProp() {
    return this.getProperty('sweep:cleaning-time');
  }

  cleanAreaProp() {
    return this.getProperty('sweep:cleaning-area');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = IjaiVacuumV3;

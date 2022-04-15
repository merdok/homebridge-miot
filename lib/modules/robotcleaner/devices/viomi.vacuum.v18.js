const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiVacuumV18 extends RobotCleanerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Viomi Robot Vacuum S9';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v18:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  devicePropertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'viomi-vacuum:main-brush-hours', 'viomi-vacuum:main-brush-life', 'viomi-vacuum:side-brush-hours', 'viomi-vacuum:side-brush-life',
      'viomi-vacuum:hypa-hours', 'viomi-vacuum:hypa-life', 'viomi-vacuum:clean-use-time', 'viomi-vacuum:clean-area'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:vacuum:00007810:viomi-v18:1","description":"Robot Cleaner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:viomi-v18:1","description":"Battery"}');
    this.createServiceByString('{"siid":4,"type":"urn:viomi-spec:service:viomi-vacuum:00007801:viomi-v18:1","description":"扫地机"}');
    this.createServiceByString('{"siid":5,"type":"urn:viomi-spec:service:order:00007802:viomi-v18:1","description":"预约、勿扰相关"}');
    this.createServiceByString('{"siid":6,"type":"urn:viomi-spec:service:point-zone:00007803:viomi-v18:1","description":"指哪扫那 划区 虚拟墙"}');
    this.createServiceByString('{"siid":7,"type":"urn:viomi-spec:service:map:00007804:viomi-v18:1","description":"地图相关"}');
    this.createServiceByString('{"siid":8,"type":"urn:viomi-spec:service:voice:00007805:viomi-v18:1","description":"声音相关"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('vacuum:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:viomi-v18:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Sleep"},{"value":1,"description":"Idle"},{"value":2,"description":"Paused"},{"value":3,"description":"Go Charging"},{"value":4,"description":"Charging"},{"value":5,"description":"Sweeping"},{"value":6,"description":"Sweeping and Mopping"},{"value":7,"description":"Mopping"}]}');
    this.addPropertyByString('vacuum:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:viomi-v18:1","description":"Device Fault","format":"uint32","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Error"},{"value":1,"description":"Low Battery Find Charge"},{"value":2,"description":"Low Bat Need Poweroff"},{"value":3,"description":"Wheel Trap"},{"value":4,"description":"Collision Error"},{"value":5,"description":"Tile Do Task"},{"value":6,"description":"Lidar Point Err"},{"value":7,"description":"Front Wall Err"},{"value":8,"description":"Along Wall Err"},{"value":9,"description":"Mid Brush Err"},{"value":10,"description":"Side Brush Err"},{"value":11,"description":"Fan Err"},{"value":12,"description":"Lidar Cover"},{"value":13,"description":"Garbage Full"},{"value":14,"description":"Garbage Out"},{"value":15,"description":"Garbage Full Out"},{"value":16,"description":"Trapped"},{"value":17,"description":"Pick Up"},{"value":20,"description":"Cannot Arrive"},{"value":21,"description":"Start From Forbid"},{"value":22,"description":"Drop"},{"value":23,"description":"Kit Water Pump"},{"value":24,"description":"Find Charge Failed"},{"value":18,"description":"Garbage Out"},{"value":25,"description":"No Mop Clean"},{"value":26,"description":"Low Battery Cant Clean"}]}');
    this.addPropertyByString('vacuum:wdr-mode', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:wdr-mode:00000088:viomi-v18:1","description":"Wide Dynamic Range Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"0"},{"value":1,"description":"1"},{"value":2,"description":"2"}]}');
    this.addPropertyByString('vacuum:door-state', '{"siid":2,"piid":12,"type":"urn:miot-spec-v2:property:door-state:0000006B:viomi-v18:1","description":"Door State","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"0"},{"value":1,"description":"1"},{"value":2,"description":"2"},{"value":3,"description":"3"}]}');
    this.addPropertyByString('vacuum:contact-state', '{"siid":2,"piid":13,"type":"urn:miot-spec-v2:property:contact-state:0000007C:viomi-v18:1","description":"Contact State","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"0"},{"value":1,"description":"1"}]}');
    this.addPropertyByString('vacuum:stream-address', '{"siid":2,"piid":14,"type":"urn:miot-spec-v2:property:stream-address:0000005E:viomi-v18:1","description":"Stream URL","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('vacuum:contact-state2', '{"siid":2,"piid":15,"type":"urn:miot-spec-v2:property:contact-state:0000007C:viomi-v18:1","description":"Contact State","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,999,1]}');
    this.addPropertyByString('vacuum:contact-state3', '{"siid":2,"piid":16,"type":"urn:miot-spec-v2:property:contact-state:0000007C:viomi-v18:1","description":"Contact State","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,1200,1]}');
    this.addPropertyByString('vacuum:mute', '{"siid":2,"piid":17,"type":"urn:miot-spec-v2:property:mute:00000040:viomi-v18:1","description":"Mute","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,10,1]}');
    this.addPropertyByString('vacuum:sweep-type', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:sweep-type:000000D3:viomi-v18:1","description":"Sweep Type","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Total"},{"value":2,"description":"Wall"},{"value":3,"description":"Zone"},{"value":4,"description":"Point"},{"value":5,"description":"Control"}]}');
    this.addPropertyByString('vacuum:mode', '{"siid":2,"piid":19,"type":"urn:miot-spec-v2:property:mode:00000008:viomi-v18:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Silent"},{"value":1,"description":"Basic"},{"value":2,"description":"Medium"},{"value":3,"description":"Strong"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:viomi-v18:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('viomi-vacuum:repeat-state', '{"siid":4,"piid":1,"type":"urn:viomi-spec:property:repeat-state:00000001:viomi-v18:1","description":"","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('viomi-vacuum:remember-state', '{"siid":4,"piid":3,"type":"urn:viomi-spec:property:remember-state:00000003:viomi-v18:1","description":"","format":"uint8","access":["write","notify","read"],"unit":"none","valueList":[{"value":0,"description":"关"},{"value":1,"description":"开"}]}');
    this.addPropertyByString('viomi-vacuum:mop-route', '{"siid":4,"piid":6,"type":"urn:viomi-spec:property:mop-route:00000006:viomi-v18:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"弓字形"},{"value":1,"description":"Y字形"}]}');
    this.addPropertyByString('viomi-vacuum:side-brush-life', '{"siid":4,"piid":8,"type":"urn:viomi-spec:property:side-brush-life:00000008:viomi-v18:1","description":"边刷剩余寿命百分比","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('viomi-vacuum:side-brush-hours', '{"siid":4,"piid":9,"type":"urn:viomi-spec:property:side-brush-hours:00000009:viomi-v18:1","description":"边刷剩余寿命小时","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('viomi-vacuum:main-brush-life', '{"siid":4,"piid":10,"type":"urn:viomi-spec:property:main-brush-life:0000000a:viomi-v18:1","description":"主刷剩余寿命百分比","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('viomi-vacuum:main-brush-hours', '{"siid":4,"piid":11,"type":"urn:viomi-spec:property:main-brush-hours:0000000b:viomi-v18:1","description":"主刷剩余寿命小时","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,360,1]}');
    this.addPropertyByString('viomi-vacuum:hypa-life', '{"siid":4,"piid":12,"type":"urn:viomi-spec:property:hypa-life:0000000c:viomi-v18:1","description":"","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('viomi-vacuum:hypa-hours', '{"siid":4,"piid":13,"type":"urn:viomi-spec:property:hypa-hours:0000000d:viomi-v18:1","description":"","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('viomi-vacuum:mop-life', '{"siid":4,"piid":14,"type":"urn:viomi-spec:property:mop-life:0000000e:viomi-v18:1","description":"拖布剩余寿命百分比","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('viomi-vacuum:mop-hours', '{"siid":4,"piid":15,"type":"urn:viomi-spec:property:mop-hours:0000000f:viomi-v18:1","description":"拖布剩余寿命小时","format":"uint8","access":["read","notify"],"unit":"hours","valueRange":[0,180,1]}');
    this.addPropertyByString('viomi-vacuum:direction', '{"siid":4,"piid":16,"type":"urn:viomi-spec:property:direction:00000010:viomi-v18:1","description":"","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"向前"},{"value":2,"description":"向左"},{"value":3,"description":"向右"},{"value":4,"description":"向后"},{"value":5,"description":"停止"}]}');
    this.addPropertyByString('viomi-vacuum:suction-grade', '{"siid":4,"piid":17,"type":"urn:viomi-spec:property:suction-grade:00000011:viomi-v18:1","description":"","format":"uint8","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"安静"},{"value":1,"description":"标准"},{"value":2,"description":"中档"},{"value":3,"description":"强力"}]}');
    this.addPropertyByString('viomi-vacuum:water-grade', '{"siid":4,"piid":18,"type":"urn:viomi-spec:property:water-grade:00000012:viomi-v18:1","description":"出水量大小","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"1挡"},{"value":1,"description":"2挡"},{"value":2,"description":"3挡"}]}');
    this.addPropertyByString('viomi-vacuum:map-num', '{"siid":4,"piid":23,"type":"urn:viomi-spec:property:map-num:00000015:viomi-v18:1","description":"当前储存的地图数量","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,5,1]}');
    this.addPropertyByString('viomi-vacuum:time-zone', '{"siid":4,"piid":24,"type":"urn:viomi-spec:property:time-zone:00000016:viomi-v18:1","description":"设备时区属性","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[-99999,99999,1]}');
    this.addPropertyByString('viomi-vacuum:clean-start-time', '{"siid":4,"piid":25,"type":"urn:viomi-spec:property:clean-start-time:00000017:viomi-v18:1","description":"清扫开始时间，时间戳，单位秒","format":"int64","access":["read","notify"],"unit":"seconds","valueRange":[0,9999999999,1]}');
    this.addPropertyByString('viomi-vacuum:clean-use-time', '{"siid":4,"piid":26,"type":"urn:viomi-spec:property:clean-use-time:00000018:viomi-v18:1","description":"清扫使用时间，单位秒","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,99999,1]}');
    this.addPropertyByString('viomi-vacuum:clean-area', '{"siid":4,"piid":27,"type":"urn:viomi-spec:property:clean-area:00000019:viomi-v18:1","description":"清扫总面积，单位m2","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,9999,1]}');
    this.addPropertyByString('viomi-vacuum:clean-map-url', '{"siid":4,"piid":28,"type":"urn:viomi-spec:property:clean-map-url:0000001a:viomi-v18:1","description":"清扫地图url","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('viomi-vacuum:clean-mode', '{"siid":4,"piid":29,"type":"urn:viomi-spec:property:clean-mode:0000001b:viomi-v18:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"全局"},{"value":1,"description":"沿边"},{"value":2,"description":"区域"},{"value":3,"description":"定点"}]}');
    this.addPropertyByString('viomi-vacuum:clean-way', '{"siid":4,"piid":30,"type":"urn:viomi-spec:property:clean-way:0000001c:viomi-v18:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"扫地"},{"value":1,"description":"扫拖"},{"value":2,"description":"拖地"}]}');
    this.addPropertyByString('viomi-vacuum:cur-lang', '{"siid":4,"piid":31,"type":"urn:viomi-spec:property:cur-lang:0000001d:viomi-v18:1","description":"设备当前语言de en ru zh ","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('viomi-vacuum:cur-map-id', '{"siid":4,"piid":32,"type":"urn:viomi-spec:property:cur-map-id:0000001e:viomi-v18:1","description":"当前地图id","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('viomi-vacuum:cur-map-url', '{"siid":4,"piid":33,"type":"urn:viomi-spec:property:cur-map-url:0000001f:viomi-v18:1","description":"","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('viomi-vacuum:last-update-time', '{"siid":4,"piid":34,"type":"urn:viomi-spec:property:last-update-time:00000020:viomi-v18:1","description":"last-update-time","format":"int64","access":["read","notify"],"unit":"seconds","valueRange":[0,9999999999,1]}');
    this.addPropertyByString('viomi-vacuum:consumable-index', '{"siid":4,"piid":35,"type":"urn:viomi-spec:property:consumable-index:00000007:viomi-v18:1","description":"consumable-index","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"边刷"},{"value":1,"description":"主刷"},{"value":2,"description":"尘盒"},{"value":3,"description":"拖布"}]}');
    this.addPropertyByString('viomi-vacuum:clean-room-mode', '{"siid":4,"piid":36,"type":"urn:viomi-spec:property:clean-room-mode:00000002:viomi-v18:1","description":"clean-room-mode","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"全局"},{"value":1,"description":"沿边"}]}');
    this.addPropertyByString('viomi-vacuum:clean-room-oper', '{"siid":4,"piid":37,"type":"urn:viomi-spec:property:clean-room-oper:00000013:viomi-v18:1","description":"clean-room-oper","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"停止"},{"value":1,"description":"开始"},{"value":2,"description":"暂停"}]}');
    this.addPropertyByString('viomi-vacuum:clean-room-ids', '{"siid":4,"piid":38,"type":"urn:viomi-spec:property:clean-room-ids:00000014:viomi-v18:1","description":"clean-room-ids","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('viomi-vacuum:has-map', '{"siid":4,"piid":39,"type":"urn:viomi-spec:property:has-map:00000004:viomi-v18:1","description":"has-map","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"没有记忆图"},{"value":1,"description":"有记忆图"}]}');
    this.addPropertyByString('viomi-vacuum:has-newmap', '{"siid":4,"piid":40,"type":"urn:viomi-spec:property:has-newmap:00000005:viomi-v18:1","description":"has-newmap","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"None"},{"value":1,"description":"New"},{"value":2,"description":"Cover"}]}');
    this.addPropertyByString('viomi-vacuum:dust-collection', '{"siid":4,"piid":41,"type":"urn:viomi-spec:property:dust-collection:00000021:viomi-v18:1","description":"dust-collection","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Open"}]}');
    this.addPropertyByString('viomi-vacuum:custom-room-clean', '{"siid":4,"piid":42,"type":"urn:viomi-spec:property:custom-room-clean:00000022:viomi-v18:2","description":"custom-room-clean","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('viomi-vacuum:cleantimes', '{"siid":4,"piid":43,"type":"urn:viomi-spec:property:cleantimes:00000023:viomi-v18:2","description":"cleantimes","format":"uint8","access":["write"],"valueRange":[1,10,1]}');
    this.addPropertyByString('viomi-vacuum:swept-area-type', '{"siid":4,"piid":44,"type":"urn:viomi-spec:property:swept-area-type:00000024:viomi-v18:2","description":"swept-area-type","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"RoomClean"},{"value":1,"description":"AllClean"},{"value":2,"description":"PartClean"}]}');
    this.addPropertyByString('order:order-id', '{"siid":5,"piid":1,"type":"urn:viomi-spec:property:order-id:00000001:viomi-v18:1","description":"预约id","format":"uint8","access":["write"],"unit":"none","valueRange":[0,100,1]}');
    this.addPropertyByString('order:enable', '{"siid":5,"piid":2,"type":"urn:viomi-spec:property:enable:00000002:viomi-v18:1","description":"是否开启该条预约","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('order:day', '{"siid":5,"piid":3,"type":"urn:viomi-spec:property:day:00000003:viomi-v18:1","description":"转换成二进制后，每一位代表一天，1 - 预约 0 - 无预约，bit0-bit6 星期日-星期六","format":"uint16","access":["write"],"unit":"none","valueRange":[0,256,1]}');
    this.addPropertyByString('order:hour', '{"siid":5,"piid":4,"type":"urn:viomi-spec:property:hour:00000004:viomi-v18:1","description":"预约小时（24小时制）","format":"uint8","access":["write"],"unit":"none","valueRange":[0,23,1]}');
    this.addPropertyByString('order:minute', '{"siid":5,"piid":5,"type":"urn:viomi-spec:property:minute:00000005:viomi-v18:1","description":"预约分钟","format":"uint8","access":["write"],"unit":"none","valueRange":[0,59,1]}');
    this.addPropertyByString('order:repeat', '{"siid":5,"piid":6,"type":"urn:viomi-spec:property:repeat:00000006:viomi-v18:1","description":"是否重复","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('order:clean-way', '{"siid":5,"piid":8,"type":"urn:viomi-spec:property:clean-way:00000008:viomi-v18:1","description":"","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"扫地"},{"value":1,"description":"扫拖"},{"value":2,"description":"拖地"}]}');
    this.addPropertyByString('order:suction', '{"siid":5,"piid":9,"type":"urn:viomi-spec:property:suction:00000007:viomi-v18:1","description":"预约吸力大小","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""},{"value":3,"description":""}]}');
    this.addPropertyByString('order:water', '{"siid":5,"piid":10,"type":"urn:viomi-spec:property:water:00000009:viomi-v18:1","description":"预约出水量大小","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""}]}');
    this.addPropertyByString('order:twice-clean', '{"siid":5,"piid":11,"type":"urn:viomi-spec:property:twice-clean:0000000a:viomi-v18:1","description":"是否二次清扫","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('order:mapid', '{"siid":5,"piid":12,"type":"urn:viomi-spec:property:mapid:0000000b:viomi-v18:1","description":"预约的地图id，若没地图则传0","format":"uint32","access":["write"],"unit":"none","valueRange":[0,99999999,1]}');
    this.addPropertyByString('order:room-count', '{"siid":5,"piid":13,"type":"urn:viomi-spec:property:room-count:0000000c:viomi-v18:1","description":"预约的房间数量","format":"uint8","access":["write"],"unit":"none","valueRange":[0,64,1]}');
    this.addPropertyByString('order:room-data', '{"siid":5,"piid":14,"type":"urn:viomi-spec:property:room-data:0000000d:viomi-v18:1","description":"预约的房间数据JSON字符串[{name:\'房间1\',id:10},{name:\'房间2‘,id:11},{...},{...}...]","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('order:dnd-enable', '{"siid":5,"piid":15,"type":"urn:viomi-spec:property:dnd-enable:0000000e:viomi-v18:1","description":" 勿扰是否打开","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":""},{"value":1,"description":""}]}');
    this.addPropertyByString('order:dnd-start-hour', '{"siid":5,"piid":16,"type":"urn:viomi-spec:property:dnd-start-hour:0000000f:viomi-v18:1","description":"勿扰开始小时","format":"uint8","access":["write","read","notify"],"unit":"hours","valueRange":[0,23,1]}');
    this.addPropertyByString('order:dnd-start-minute', '{"siid":5,"piid":17,"type":"urn:viomi-spec:property:dnd-start-minute:00000010:viomi-v18:1","description":"勿扰开始分钟","format":"uint8","access":["read","notify","write"],"unit":"minutes","valueRange":[0,59,1]}');
    this.addPropertyByString('order:dnd-end-hour', '{"siid":5,"piid":18,"type":"urn:viomi-spec:property:dnd-end-hour:00000011:viomi-v18:1","description":"勿扰结束小时","format":"uint8","access":["read","notify","write"],"unit":"hours","valueRange":[0,23,1]}');
    this.addPropertyByString('order:dnd-end-minute', '{"siid":5,"piid":19,"type":"urn:viomi-spec:property:dnd-end-minute:00000012:viomi-v18:1","description":"勿扰结束分钟","format":"uint8","access":["read","notify","write"],"unit":"minutes","valueRange":[0,59,1]}');
    this.addPropertyByString('order:dnd-timezone', '{"siid":5,"piid":20,"type":"urn:viomi-spec:property:dnd-timezone:00000013:viomi-v18:1","description":"时区参数","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[-99999,99999,1]}');
    this.addPropertyByString('order:timestamp', '{"siid":5,"piid":21,"type":"urn:viomi-spec:property:timestamp:00000014:viomi-v18:1","description":"timestamp","format":"int64","access":["notify","write","read"],"unit":"none","valueRange":[-999999,999999,1]}');
    this.addPropertyByString('order:orderdata', '{"siid":5,"piid":22,"type":"urn:viomi-spec:property:orderdata:00000015:viomi-v18:1","description":"N组预约数据逗号分割，每组数据内的具体数据用下划线_分割 {order_id}_{order_enable}_{week}_{hour}_{minute}_{repeat}_{mode}_{suction}_{water}_{twice}_{mapid}_{room_size}_{roomid}_{roomname}","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('point-zone:target-point', '{"siid":6,"piid":1,"type":"urn:viomi-spec:property:target-point:00000001:viomi-v18:1","description":"指哪扫那目标点，XY逗号分割，如’3.23,6.89‘","format":"string","access":["write","read","notify"],"unit":"none"}');
    this.addPropertyByString('point-zone:zone-points', '{"siid":6,"piid":2,"type":"urn:viomi-spec:property:zone-points:00000002:viomi-v18:1","description":"划区的四个顶点坐标 \'x1,y1,x2,y2,x3,y3,x4,y4\'","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('point-zone:restrict-points', '{"siid":6,"piid":3,"type":"urn:viomi-spec:property:restrict-points:00000003:viomi-v18:1","description":"restrict-points","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('point-zone:multiple-zone-points', '{"siid":6,"piid":4,"type":"urn:viomi-spec:property:multiple-zone-points:00000004:viomi-v18:2","description":"multiple-zone-points","format":"string","access":["write"]}');
    this.addPropertyByString('map:map-type', '{"siid":7,"piid":1,"type":"urn:viomi-spec:property:map-type:00000001:viomi-v18:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"上传到url0"},{"value":1,"description":"上传到url1"},{"value":2,"description":"上传到url2"}]}');
    this.addPropertyByString('map:map-id', '{"siid":7,"piid":2,"type":"urn:viomi-spec:property:map-id:00000002:viomi-v18:1","description":"地图id","format":"int64","access":["read","notify","write"],"unit":"none","valueRange":[0,9999999999,1]}');
    this.addPropertyByString('map:map-name', '{"siid":7,"piid":4,"type":"urn:viomi-spec:property:map-name:00000004:viomi-v18:1","description":"地图名字","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('map:lang', '{"siid":7,"piid":5,"type":"urn:viomi-spec:property:lang:00000005:viomi-v18:1","description":"语言参数","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:arrange-room-ids', '{"siid":7,"piid":6,"type":"urn:viomi-spec:property:arrange-room-ids:00000006:viomi-v18:1","description":"要合并的房间id参数，逗号分割，如：‘10,11,12’表示合并房间id为10,11,12的房间；","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:target-room-id', '{"siid":7,"piid":7,"type":"urn:viomi-spec:property:target-room-id:00000007:viomi-v18:1","description":"目标房间id","format":"uint8","access":["write"],"unit":"none","valueRange":[0,128,1]}');
    this.addPropertyByString('map:split-points', '{"siid":7,"piid":8,"type":"urn:viomi-spec:property:split-points:00000008:viomi-v18:1","description":"分割线段的两个端点坐标，如：\'3.45,6.78|4.56,-3.45\'","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:room-name', '{"siid":7,"piid":9,"type":"urn:viomi-spec:property:room-name:00000009:viomi-v18:1","description":"房间名称","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('map:cur-cleaning-path', '{"siid":7,"piid":10,"type":"urn:viomi-spec:property:cur-cleaning-path:0000000a:viomi-v18:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('map:map-list', '{"siid":7,"piid":11,"type":"urn:viomi-spec:property:map-list:0000000b:viomi-v18:1","description":"地图列表数据[{name : \'地图1\',id:1585849584,cur : true},{name : \'地图2\',id : 1585849784,cur : false}]","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('map:last-point-index', '{"siid":7,"piid":12,"type":"urn:viomi-spec:property:last-point-index:0000000c:viomi-v18:1","description":"","format":"int32","access":[],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('map:oper-result', '{"siid":7,"piid":13,"type":"urn:viomi-spec:property:oper-result:0000000d:viomi-v18:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('map:auto-area-id', '{"siid":7,"piid":14,"type":"urn:viomi-spec:property:auto-area-id:0000000e:viomi-v18:1","description":"auto-area-id","format":"int64","access":["read","notify"],"unit":"none","valueRange":[0,9999999999,1]}');
    this.addPropertyByString('map:map-download-url', '{"siid":7,"piid":15,"type":"urn:viomi-spec:property:map-download-url:0000000f:viomi-v18:1","description":"map-download-url","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('map:new-map-oper', '{"siid":7,"piid":16,"type":"urn:viomi-spec:property:new-map-oper:00000003:viomi-v18:1","description":"new-map-oper","format":"uint8","access":[],"unit":"none","valueRange":[0,2,1]}');
    this.addPropertyByString('voice:target-voice', '{"siid":8,"piid":3,"type":"urn:viomi-spec:property:target-voice:00000003:viomi-v18:1","description":"target-voice","format":"string","access":["notify","write","read"],"unit":"none"}');
    this.addPropertyByString('voice:cur-voice', '{"siid":8,"piid":4,"type":"urn:viomi-spec:property:cur-voice:00000004:viomi-v18:1","description":"cur-voice","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('voice:download-status', '{"siid":8,"piid":5,"type":"urn:viomi-spec:property:download-status:00000005:viomi-v18:1","description":"download-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Free"},{"value":1,"description":"Downloading"}]}');
    this.addPropertyByString('voice:download-progress', '{"siid":8,"piid":6,"type":"urn:viomi-spec:property:download-progress:00000006:viomi-v18:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueRange":[0,100,1]}');
    this.addPropertyByString('voice:voice-url', '{"siid":8,"piid":7,"type":"urn:viomi-spec:property:voice-url:00000007:viomi-v18:1","description":"voice-url","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('voice:voice-mdfive', '{"siid":8,"piid":8,"type":"urn:viomi-spec:property:voice-mdfive:00000008:viomi-v18:1","description":"voice-mdfive","format":"string","access":["write"],"unit":"none"}');
  }

  initDeviceActions() {
    this.addActionByString('vacuum:start-sweep', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-sweep:00002804:viomi-v18:1","description":"Start Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-sweeping', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:stop-sweeping:00002805:viomi-v18:1","description":"Stop Sweeping","in":[],"out":[]}');
    this.addActionByString('vacuum:pause', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:pause:0000280C:viomi-v18:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('vacuum:start-charge', '{"siid":2,"aiid":4,"type":"urn:miot-spec-v2:action:start-charge:00002802:viomi-v18:1","description":"Start Charge","in":[],"out":[]}');
    this.addActionByString('vacuum:stop-massage', '{"siid":2,"aiid":5,"type":"urn:miot-spec-v2:action:stop-massage:0000281F:viomi-v18:1","description":"Stop Massage","in":[],"out":[]}');
    this.addActionByString('vacuum:start-mop', '{"siid":2,"aiid":6,"type":"urn:miot-spec-v2:action:start-mop:00002834:viomi-v18:1","description":"Start Mop","in":[],"out":[]}');
    this.addActionByString('vacuum:start-only-sweep', '{"siid":2,"aiid":7,"type":"urn:miot-spec-v2:action:start-only-sweep:0000283A:viomi-v18:1","description":"Start Only Sweep","in":[],"out":[]}');
    this.addActionByString('vacuum:start-sweep-mop', '{"siid":2,"aiid":8,"type":"urn:miot-spec-v2:action:start-sweep-mop:00002835:viomi-v18:1","description":"Start Sweep Mop","in":[],"out":[]}');
    this.addActionByString('viomi-vacuum:reset-map', '{"siid":4,"aiid":7,"type":"urn:viomi-spec:action:reset-map:00002807:viomi-v18:1","description":"重置地图","in":[],"out":[]}');
    this.addActionByString('viomi-vacuum:set-calibration', '{"siid":4,"aiid":10,"type":"urn:viomi-spec:action:set-calibration:0000280a:viomi-v18:1","description":"标定","in":[],"out":[]}');
    this.addActionByString('viomi-vacuum:reset-consumable', '{"siid":4,"aiid":11,"type":"urn:viomi-spec:action:reset-consumable:0000280b:viomi-v18:1","description":"重置指定耗材的使用时间","in":[35],"out":[]}');
    this.addActionByString('viomi-vacuum:set-room-clean', '{"siid":4,"aiid":13,"type":"urn:viomi-spec:action:set-room-clean:00002804:viomi-v18:1","description":"选房间清扫","in":[36,37,38],"out":[]}');
    this.addActionByString('viomi-vacuum:set-custom-clean', '{"siid":4,"aiid":14,"type":"urn:viomi-spec:action:set-custom-clean:00002801:viomi-v18:2","description":"set-custom-clean","in":[],"out":[]}');
    this.addActionByString('order:del', '{"siid":5,"aiid":2,"type":"urn:viomi-spec:action:del:00002802:viomi-v18:1","description":"删除一组预约","in":[1],"out":[]}');
    this.addActionByString('order:get', '{"siid":5,"aiid":3,"type":"urn:viomi-spec:action:get:00002801:viomi-v18:1","description":"获取预约数据","in":[],"out":[22]}');
    this.addActionByString('point-zone:start-point-clean', '{"siid":6,"aiid":1,"type":"urn:viomi-spec:action:start-point-clean:00002801:viomi-v18:1","description":"开始指哪扫那清扫","in":[],"out":[]}');
    this.addActionByString('point-zone:pause-point-clean', '{"siid":6,"aiid":2,"type":"urn:viomi-spec:action:pause-point-clean:00002802:viomi-v18:1","description":"暂停指哪扫那清扫","in":[],"out":[]}');
    this.addActionByString('point-zone:start-zone-clean', '{"siid":6,"aiid":5,"type":"urn:viomi-spec:action:start-zone-clean:00002805:viomi-v18:1","description":"开始区域清扫","in":[],"out":[]}');
    this.addActionByString('point-zone:pause-zone-clean', '{"siid":6,"aiid":6,"type":"urn:viomi-spec:action:pause-zone-clean:00002806:viomi-v18:1","description":"暂停区域清扫","in":[],"out":[]}');
    this.addActionByString('map:upload-by-maptype', '{"siid":7,"aiid":1,"type":"urn:viomi-spec:action:upload-by-maptype:00002801:viomi-v18:1","description":"上传指定类型的地图","in":[],"out":[]}');
    this.addActionByString('map:upload-by-mapid', '{"siid":7,"aiid":2,"type":"urn:viomi-spec:action:upload-by-mapid:00002802:viomi-v18:1","description":"上传指定id的地图","in":[],"out":[]}');
    this.addActionByString('map:set-cur-map', '{"siid":7,"aiid":3,"type":"urn:viomi-spec:action:set-cur-map:00002803:viomi-v18:1","description":"设置当前地图","in":[2,15],"out":[]}');
    this.addActionByString('map:del-map', '{"siid":7,"aiid":5,"type":"urn:viomi-spec:action:del-map:00002805:viomi-v18:1","description":"del-map","in":[2],"out":[]}');
    this.addActionByString('map:rename-map', '{"siid":7,"aiid":7,"type":"urn:viomi-spec:action:rename-map:00002807:viomi-v18:1","description":"重命名地图","in":[2,4],"out":[]}');
    this.addActionByString('map:arrange-room', '{"siid":7,"aiid":8,"type":"urn:viomi-spec:action:arrange-room:00002808:viomi-v18:1","description":"合并房间","in":[2,5,6,14],"out":[13]}');
    this.addActionByString('map:split-room', '{"siid":7,"aiid":9,"type":"urn:viomi-spec:action:split-room:00002809:viomi-v18:1","description":"分割房间","in":[2,5,7,8,14],"out":[]}');
    this.addActionByString('map:rename-room', '{"siid":7,"aiid":10,"type":"urn:viomi-spec:action:rename-room:0000280a:viomi-v18:1","description":"房间重命名","in":[2,7,9,14],"out":[]}');
    this.addActionByString('map:get-map-list', '{"siid":7,"aiid":11,"type":"urn:viomi-spec:action:get-map-list:00002806:viomi-v18:1","description":"获取地图列表数据","in":[],"out":[11]}');
    this.addActionByString('map:get-cleaning-path', '{"siid":7,"aiid":12,"type":"urn:viomi-spec:action:get-cleaning-path:0000280b:viomi-v18:1","description":"get-cleaning-path","in":[12],"out":[10]}');
    this.addActionByString('map:set-new-map', '{"siid":7,"aiid":13,"type":"urn:viomi-spec:action:set-new-map:0000280c:viomi-v18:1","description":"set-new-map","in":[],"out":[]}');
    this.addActionByString('map:deal-new-map', '{"siid":7,"aiid":14,"type":"urn:viomi-spec:action:deal-new-map:00002804:viomi-v18:1","description":"deal-new-map","in":[16],"out":[]}');
    this.addActionByString('voice:find-device', '{"siid":8,"aiid":2,"type":"urn:viomi-spec:action:find-device:00002802:viomi-v18:1","description":"寻找扫地机","in":[],"out":[]}');
    this.addActionByString('voice:download-voice', '{"siid":8,"aiid":3,"type":"urn:viomi-spec:action:download-voice:00002801:viomi-v18:1","description":"download-voice","in":[3,7,8],"out":[]}');
    this.addActionByString('voice:get-downloadstatus', '{"siid":8,"aiid":4,"type":"urn:viomi-spec:action:get-downloadstatus:00002803:viomi-v18:1","description":"get-downloadstatus","in":[],"out":[6,3,4,5]}');
  }

  initDeviceEvents() {
    this.addEventByString('vacuum:exception-occurred', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:exception-occurred:00005011:viomi-v18:1","description":"Exception Occurred","arguments":[2]}');
    this.addEventByString('viomi-vacuum:mop-remind', '{"siid":4,"eiid":1,"type":"urn:viomi-spec:event:mop-remind:00005001:viomi-v18:1","description":"拖布取下提示。当设备开始充电时，拖布未取下触发","arguments":[]}');
    this.addEventByString('viomi-vacuum:wait-remind', '{"siid":4,"eiid":2,"type":"urn:viomi-spec:event:wait-remind:00005002:viomi-v18:1","description":"待机时间超过6小时，推送并自动关机","arguments":[]}');
    this.addEventByString('viomi-vacuum:low-remind', '{"siid":4,"eiid":3,"type":"urn:viomi-spec:event:low-remind:00005003:viomi-v18:1","description":"low-remind","arguments":[]}');
    this.addEventByString('viomi-vacuum:clean-end', '{"siid":4,"eiid":4,"type":"urn:viomi-spec:event:clean-end:00005004:viomi-v18:1","description":"clean-end","arguments":[25,26,27,28,29,30]}');
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

  statusSleepValue() {
    return 0;
  }

  statusSweepingAndMoppingValue() {
    return 6;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  mainBrushLeftTimeProp() {
    return this.getProperty('viomi-vacuum:main-brush-hours');
  }

  mainBrushLifeLevelProp() {
    return this.getProperty('viomi-vacuum:main-brush-life');
  }

  sideBrushLeftTimeProp() {
    return this.getProperty('viomi-vacuum:side-brush-hours');
  }

  sideBrushLifeLevelProp() {
    return this.getProperty('viomi-vacuum:side-brush-life');
  }

  filterLeftTimeProp() {
    return this.getProperty('viomi-vacuum:hypa-hours');
  }

  filterLifeLevelProp() {
    return this.getProperty('viomi-vacuum:hypa-life');
  }

  cleanTimeProp() {
    return this.getProperty('viomi-vacuum:clean-use-time');
  }

  cleanAreaProp() {
    return this.getProperty('viomi-vacuum:clean-area');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/

  startChargeAction() {
    return this.getAction('vacuum:start-charge');
  }


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ViomiVacuumV18;

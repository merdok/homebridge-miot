const AirConditionerDevice = require('../AirConditionerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiAircR24r00 extends AirConditionerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Conditioner KFR-35GW/V1A1 2024';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:xiaomi-r24r00:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-conditioner:0000780F:xiaomi-r24r00:1","description":"Air Conditioner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan-control:00007809:xiaomi-r24r00:1","description":"Fan Control"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:environment:0000780A:xiaomi-r24r00:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:xiaomi-r24r00:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:xiaomi-r24r00:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":20,"type":"urn:miot-spec-v2:service:power-consumption:0000780E:xiaomi-r24r00:1","description":"Power Consumption"}');
    this.createServiceByString('{"siid":21,"type":"urn:miot-spec-v2:service:filter:0000780B:xiaomi-r24r00:1","description":"Filter"}');
    this.createServiceByString('{"siid":22,"type":"urn:miot-spec-v2:service:filter:0000780B:xiaomi-r24r00:1","description":"Filter"}');
    this.createServiceByString('{"siid":8,"type":"urn:xiaomi-spec:service:electricity:00007802:xiaomi-r24r00:1","description":"electricity"}');
    this.createServiceByString('{"siid":9,"type":"urn:xiaomi-spec:service:maintenance:00007801:xiaomi-r24r00:1","description":"maintenance"}');
    this.createServiceByString('{"siid":10,"type":"urn:xiaomi-spec:service:enhance:00007803:xiaomi-r24r00:1","description":"enhance"}');
    this.createServiceByString('{"siid":12,"type":"urn:xiaomi-spec:service:machine-state:00007805:xiaomi-r24r00:1","description":"machine-state"}');
    this.createServiceByString('{"siid":13,"type":"urn:xiaomi-spec:service:flag-bit:00007806:xiaomi-r24r00:1","description":"flag-bit"}');
    this.createServiceByString('{"siid":16,"type":"urn:xiaomi-spec:service:single-smart-scene:00007808:xiaomi-r24r00:1","description":"single-smart-scene"}');
    this.createServiceByString('{"siid":23,"type":"urn:xiaomi-spec:service:like-mode:00007804:xiaomi-r24r00:1","description":"like-mode"}');
    this.createServiceByString('{"siid":27,"type":"urn:xiaomi-spec:service:ai-contrrol:0000780b:xiaomi-r24r00:1","description":"ai-contrrol"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-conditioner:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-r24r00:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:xiaomi-r24r00:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":2,"description":"Cool"},{"value":3,"description":"Dry"},{"value":4,"description":"Fan"},{"value":5,"description":"Heat"}]}');
    this.addPropertyByString('air-conditioner:fault', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:fault:00000009:xiaomi-r24r00:1","description":"Device Fault","format":"string","access":["read","notify"]}');
    this.addPropertyByString('air-conditioner:target-temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:target-temperature:00000021:xiaomi-r24r00:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,31,0.5]}');
    this.addPropertyByString('air-conditioner:eco', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:eco:00000024:xiaomi-r24r00:1","description":"ECO","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:heater', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:heater:00000026:xiaomi-r24r00:1","description":"Heater","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:dryer', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:dryer:00000027:xiaomi-r24r00:1","description":"Dryer","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:sleep-mode', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:sleep-mode:00000028:xiaomi-r24r00:1","description":"Sleep Mode","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:target-humidity', '{"siid":2,"piid":14,"type":"urn:miot-spec-v2:property:target-humidity:00000022:xiaomi-r24r00:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('air-conditioner:un-straight-blowing', '{"siid":2,"piid":15,"type":"urn:miot-spec-v2:property:un-straight-blowing:00000100:xiaomi-r24r00:1","description":"Unstraight Blowing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:favorite-on', '{"siid":2,"piid":19,"type":"urn:miot-spec-v2:property:favorite-on:0000025B:xiaomi-r24r00:1","description":"Favorite On","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:favorite-type', '{"siid":2,"piid":20,"type":"urn:miot-spec-v2:property:favorite-type:0000025C:xiaomi-r24r00:1","description":"Favorite Type","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Cloud Recommendation"},{"value":1,"description":"Custom"}]}');
    this.addPropertyByString('fan-control:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:xiaomi-r24r00:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"},{"value":5,"description":"Level5"},{"value":6,"description":"Level6"},{"value":7,"description":"Level7"},{"value":8,"description":"Level8"}]}');
    this.addPropertyByString('fan-control:vertical-swing', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:xiaomi-r24r00:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan-control:vertical-swing-included-angle', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:vertical-swing-included-angle:0000011A:xiaomi-r24r00:1","description":"Vertical Swing Included Angle","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":2,"description":"Freeze Top"},{"value":3,"description":"Rating Left"},{"value":4,"description":"Freeze Down"},{"value":7,"description":"Middle Top"},{"value":8,"description":"Middle Down"}]}');
    this.addPropertyByString('environment:temperature', '{"siid":4,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:xiaomi-r24r00:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":4,"piid":9,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:xiaomi-r24r00:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:xiaomi-r24r00:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-r24r00:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":6,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:xiaomi-r24r00:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Medium"},{"value":2,"description":"High"}]}');
    this.addPropertyByString('power-consumption:power-consumption', '{"siid":20,"piid":1,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:xiaomi-r24r00:1","description":"Power Consumption","format":"float","access":["read","notify"],"unit":"kWh","valueRange":[0,999999.99,0.01]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":21,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:xiaomi-r24r00:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,101,1]}');
    this.addPropertyByString('filter22:filter-life-level', '{"siid":22,"piid":1,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:xiaomi-r24r00:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,101,1]}');
    this.addPropertyByString('electricity:time-count', '{"siid":8,"piid":5,"type":"urn:xiaomi-spec:property:time-count:00000005:xiaomi-r24r00:1","description":"time-count","format":"uint16","access":["read","notify"],"valueRange":[0,9999,1]}');
    this.addPropertyByString('electricity:electricity-info', '{"siid":8,"piid":7,"type":"urn:xiaomi-spec:property:electricity-info:00000002:xiaomi-r24r00:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('maintenance:clean', '{"siid":9,"piid":1,"type":"urn:xiaomi-spec:property:clean:00000001:xiaomi-r24r00:1","description":"clean","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('maintenance:examine', '{"siid":9,"piid":2,"type":"urn:xiaomi-spec:property:examine:00000002:xiaomi-r24r00:1","description":"examine","format":"string","access":["read","notify","write"]}');
    // this.addPropertyByString('maintenance:error', '{"siid":9,"piid":3,"type":"urn:xiaomi-spec:property:error:00000003:xiaomi-r24r00:1","description":"error","format":"string","access":["notify"]}');
    this.addPropertyByString('maintenance:running-duration', '{"siid":9,"piid":5,"type":"urn:xiaomi-spec:property:running-duration:00000005:xiaomi-r24r00:1","description":"running-duration","format":"float","access":["read","notify"],"valueRange":[0,876000,0.1]}');
    this.addPropertyByString('enhance:fan-percent', '{"siid":10,"piid":1,"type":"urn:xiaomi-spec:property:fan-percent:00000001:xiaomi-r24r00:1","description":"fan-percent","format":"uint8","access":["read","notify","write"],"valueRange":[0,101,1]}');
    this.addPropertyByString('enhance:timer', '{"siid":10,"piid":3,"type":"urn:xiaomi-spec:property:timer:00000003:xiaomi-r24r00:1","description":"timer","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('enhance:sleep-diy', '{"siid":10,"piid":4,"type":"urn:xiaomi-spec:property:sleep-diy:00000002:xiaomi-r24r00:1","description":"sleep-diy","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('enhance:secondpart-of-hswing', '{"siid":10,"piid":5,"type":"urn:xiaomi-spec:property:secondpart-of-hswing:00000004:xiaomi-r24r00:1","description":"secondpart-of-hswing","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('enhance:humidity-range', '{"siid":10,"piid":6,"type":"urn:xiaomi-spec:property:humidity-range:00000005:xiaomi-r24r00:1","description":"humidity-range","format":"string","access":["read","notify"],"unit":"percentage"}');
    this.addPropertyByString('enhance:off-flag', '{"siid":10,"piid":8,"type":"urn:xiaomi-spec:property:off-flag:00000007:xiaomi-r24r00:1","description":"off-flag","format":"bool","access":["write"]}');
    this.addPropertyByString('enhance:room-size', '{"siid":10,"piid":16,"type":"urn:xiaomi-spec:property:room-size:0000000f:xiaomi-r24r00:1","description":"room-size","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Default"},{"value":1,"description":"Room1"},{"value":2,"description":"Room2"},{"value":3,"description":"Room3"},{"value":4,"description":"Room4"},{"value":5,"description":"Room5"},{"value":6,"description":"Other"}]}');
    this.addPropertyByString('enhance:maxfan-select', '{"siid":10,"piid":18,"type":"urn:xiaomi-spec:property:maxfan-select:00000009:xiaomi-r24r00:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('enhance:like-diy', '{"siid":10,"piid":20,"type":"urn:xiaomi-spec:property:like-diy:00000008:xiaomi-r24r00:1","description":"","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('enhance:room-select', '{"siid":10,"piid":21,"type":"urn:xiaomi-spec:property:room-select:00000006:xiaomi-r24r00:2","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('machine-state:indoor-pipe-temp', '{"siid":12,"piid":1,"type":"urn:xiaomi-spec:property:indoor-pipe-temp:00000001:xiaomi-r24r00:1","description":"indoor-pipe-temp","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,100,1]}');
    this.addPropertyByString('machine-state:indoor-fan-speed', '{"siid":12,"piid":3,"type":"urn:xiaomi-spec:property:indoor-fan-speed:00000003:xiaomi-r24r00:1","description":"indoor-fan-speed","format":"uint16","access":["read","notify"],"valueRange":[0,2000,1]}');
    this.addPropertyByString('machine-state:real-heater-switch', '{"siid":12,"piid":4,"type":"urn:xiaomi-spec:property:real-heater-switch:00000002:xiaomi-r24r00:1","description":"real-heater-switch","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('machine-state:realindoor-fan-lever', '{"siid":12,"piid":5,"type":"urn:xiaomi-spec:property:realindoor-fan-lever:00000004:xiaomi-r24r00:1","description":"realindoor-fan-lever","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Lever1"},{"value":2,"description":"Lever2"},{"value":3,"description":"Lever3"},{"value":4,"description":"Lever4"},{"value":5,"description":"Lever5"},{"value":6,"description":"Lever6"},{"value":7,"description":"Lever7"},{"value":8,"description":"Lever8"},{"value":9,"description":"Lever9"},{"value":0,"description":"Lever0"}]}');
    this.addPropertyByString('machine-state:lightactivated-level', '{"siid":12,"piid":6,"type":"urn:xiaomi-spec:property:lightactivated-level:00000005:xiaomi-r24r00:1","description":"lightactivated-level","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"Middle Light"},{"value":2,"description":"High Light"}]}');
    this.addPropertyByString('machine-state:outdoor-temp', '{"siid":12,"piid":7,"type":"urn:xiaomi-spec:property:outdoor-temp:00000006:xiaomi-r24r00:1","description":"outdoor-temp","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-100,100,1]}');
    this.addPropertyByString('machine-state:outdoor-pipe-temp', '{"siid":12,"piid":8,"type":"urn:xiaomi-spec:property:outdoor-pipe-temp:00000007:xiaomi-r24r00:1","description":"outdoor-pipe-temp","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-100,200,1]}');
    this.addPropertyByString('machine-state:outdoor-exhaust-temp', '{"siid":12,"piid":9,"type":"urn:xiaomi-spec:property:outdoor-exhaust-temp:00000008:xiaomi-r24r00:1","description":"outdoor-exhaust-temp","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-100,200,1]}');
    this.addPropertyByString('machine-state:outdoor-fan-lever', '{"siid":12,"piid":10,"type":"urn:xiaomi-spec:property:outdoor-fan-lever:00000009:xiaomi-r24r00:1","description":"outdoor-fan-lever","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Lever0"},{"value":1,"description":"Lever1"},{"value":2,"description":"Lever2"},{"value":3,"description":"Lever3"},{"value":4,"description":"Lever4"},{"value":5,"description":"Lever5"},{"value":6,"description":"Lever6"},{"value":7,"description":"Lever7"},{"value":8,"description":"Lever8"},{"value":9,"description":"Lever9"}]}');
    this.addPropertyByString('machine-state:compressor-frequency', '{"siid":12,"piid":11,"type":"urn:xiaomi-spec:property:compressor-frequency:0000000a:xiaomi-r24r00:1","description":"compressor-frequency","format":"float","access":["read","notify"],"valueRange":[0,120,1]}');
    this.addPropertyByString('machine-state:fourway-valve-switch', '{"siid":12,"piid":12,"type":"urn:xiaomi-spec:property:fourway-valve-switch:0000000b:xiaomi-r24r00:1","description":"fourway-valve-switch","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('machine-state:outdoor-mach-current', '{"siid":12,"piid":13,"type":"urn:xiaomi-spec:property:outdoor-mach-current:0000000c:xiaomi-r24r00:1","description":"outdoor-mach-current","format":"float","access":["read","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('machine-state:outdoor-mach-voltage', '{"siid":12,"piid":14,"type":"urn:xiaomi-spec:property:outdoor-mach-voltage:0000000d:xiaomi-r24r00:1","description":"outdoor-mach-voltage","format":"float","access":["read","notify"],"valueRange":[0,1000,1]}');
    this.addPropertyByString('machine-state:expansion-valve', '{"siid":12,"piid":15,"type":"urn:xiaomi-spec:property:expansion-valve:0000000e:xiaomi-r24r00:1","description":"expansion-valve","format":"uint16","access":["read","notify"],"valueRange":[0,500,1]}');
    this.addPropertyByString('machine-state:longitude-latitude', '{"siid":12,"piid":16,"type":"urn:xiaomi-spec:property:longitude-latitude:0000000f:xiaomi-r24r00:1","description":"longitude-latitude","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('machine-state:version', '{"siid":12,"piid":22,"type":"urn:xiaomi-spec:property:version:00000011:xiaomi-r24r00:1","description":"version","format":"string","access":["read","notify"]}');
    this.addPropertyByString('machine-state:external-serial-no', '{"siid":12,"piid":23,"type":"urn:xiaomi-spec:property:external-serial-no:00000012:xiaomi-r24r00:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('machine-state:bk-serial-no', '{"siid":12,"piid":24,"type":"urn:xiaomi-spec:property:bk-serial-no:00000013:xiaomi-r24r00:1","description":"","format":"string","access":["read","notify"]}');
    this.addPropertyByString('machine-state:module-temp', '{"siid":12,"piid":25,"type":"urn:xiaomi-spec:property:module-temp:00000010:xiaomi-r24r00:1","description":"","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,200,0.1]}');
    this.addPropertyByString('flag-bit:fault-value', '{"siid":13,"piid":1,"type":"urn:xiaomi-spec:property:fault-value:00000001:xiaomi-r24r00:1","description":"fault-value","format":"int16","access":["read","notify"],"valueList":[{"value":0,"description":"No Failure"},{"value":4,"description":"F2.4"},{"value":5,"description":"F3.2"},{"value":6,"description":"P1"},{"value":7,"description":"P2.1"},{"value":8,"description":"P2.2"},{"value":9,"description":"P2.3"},{"value":10,"description":"P2.4"},{"value":11,"description":"P2.5"},{"value":12,"description":"P4"},{"value":13,"description":"P5"},{"value":14,"description":"P6"},{"value":15,"description":"P8"},{"value":16,"description":"PA"},{"value":17,"description":"PC"},{"value":18,"description":"U2"},{"value":19,"description":"U3"},{"value":20,"description":"U4"},{"value":21,"description":"U5"},{"value":22,"description":"U6.1"},{"value":23,"description":"U6.2"},{"value":24,"description":"U8"},{"value":25,"description":"U0"},{"value":26,"description":"C1"},{"value":27,"description":"C2"},{"value":28,"description":"C3"},{"value":29,"description":"C4"},{"value":30,"description":"C5"},{"value":-4,"description":"F2.4 CLEAR"},{"value":-5,"description":"F3.2 CLEAR"},{"value":-6,"description":"P1 CLEAR"},{"value":-7,"description":"P2.1 CLEAR"},{"value":-8,"description":"P2.2 CLEAR"},{"value":-9,"description":"P2.3 CLEAR"},{"value":-10,"description":"P2.4 CLEAR"},{"value":-11,"description":"P2.5 CLEAR"},{"value":-12,"description":"P4 CLEAR"},{"value":-13,"description":"P5 CLEAR"},{"value":-14,"description":"P6 CLEAR"},{"value":-15,"description":"P8 CLEAR"},{"value":-16,"description":"PA CLEAR"},{"value":-17,"description":"PC CLEAR"},{"value":-18,"description":"U2 CLEAR"},{"value":-19,"description":"U3 CLEAR"},{"value":-20,"description":"U4 CLEAR"},{"value":-21,"description":"U5 CLEAR"},{"value":-22,"description":"U6.1 CLEAR"},{"value":-23,"description":"U6.2 CLEAR"},{"value":-24,"description":"U8 CLEAR"},{"value":-25,"description":"U0 CLEAR"},{"value":-26,"description":"C1 CLEAR"},{"value":-27,"description":"C2 CLEAR"},{"value":-28,"description":"C3 CLEAR"},{"value":-29,"description":"C4 CLEAR"},{"value":-30,"description":"C5 CLEAR"},{"value":31,"description":"U1.3"},{"value":32,"description":"U4"},{"value":33,"description":"E2"},{"value":34,"description":"E2"},{"value":35,"description":"E2"},{"value":-31,"description":"DU4"},{"value":-32,"description":"DE2"},{"value":-33,"description":"DE2"},{"value":-34,"description":"DE2"},{"value":-35,"description":"DE2"},{"value":47,"description":"F5"},{"value":-47,"description":"F5 CLEAR"}]}');
    this.addPropertyByString('single-smart-scene:auto-cooling', '{"siid":16,"piid":1,"type":"urn:xiaomi-spec:property:auto-cooling:00000001:xiaomi-r24r00:1","description":"auto-cooling","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('single-smart-scene:automatic-heating', '{"siid":16,"piid":2,"type":"urn:xiaomi-spec:property:automatic-heating:00000002:xiaomi-r24r00:1","description":"automatic-heating","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('single-smart-scene:auto-dry', '{"siid":16,"piid":3,"type":"urn:xiaomi-spec:property:auto-dry:00000003:xiaomi-r24r00:1","description":"auto-dry","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('single-smart-scene:run-dark-sleep', '{"siid":16,"piid":10,"type":"urn:xiaomi-spec:property:run-dark-sleep:00000004:xiaomi-r24r00:1","description":"run-dark-sleep","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('single-smart-scene:reset-defaltfilter', '{"siid":16,"piid":12,"type":"urn:xiaomi-spec:property:reset-defaltfilter:00000006:xiaomi-r24r00:1","description":"","format":"bool","access":["write"]}');
    this.addPropertyByString('like-mode:user-defined-mode', '{"siid":23,"piid":1,"type":"urn:xiaomi-spec:property:user-defined-mode:00000001:xiaomi-r24r00:1","description":"","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('like-mode:recommend-mode', '{"siid":23,"piid":2,"type":"urn:xiaomi-spec:property:recommend-mode:00000002:xiaomi-r24r00:1","description":"","format":"string","access":["write","read","notify"]}');
    this.addPropertyByString('like-mode:always-favorite-on', '{"siid":23,"piid":3,"type":"urn:xiaomi-spec:property:always-favorite-on:00000003:xiaomi-r24r00:2","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('ai-contrrol:ai-compressor-freq', '{"siid":27,"piid":1,"type":"urn:xiaomi-spec:property:ai-compressor-freq:00000001:xiaomi-r24r00:1","description":"","format":"string","access":["write"]}');
    this.addPropertyByString('ai-contrrol:ai-param', '{"siid":27,"piid":2,"type":"urn:xiaomi-spec:property:ai-param:00000002:xiaomi-r24r00:1","description":"","format":"string","access":["notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('air-conditioner:favorite-toggle', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:favorite-toggle:000028B5:xiaomi-r24r00:1","description":"Favorite Toggle","in":[],"out":[]}');
    this.addActionByString('filter:reset-filter-life', '{"siid":21,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:xiaomi-r24r00:1","description":"Reset Filter Life","in":[],"out":[]}');
    this.addActionByString('filter22:reset-filter-life', '{"siid":22,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:xiaomi-r24r00:1","description":"Reset Filter Life","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('maintenance:filtertest', '{"siid":9,"eiid":1,"type":"urn:xiaomi-spec:event:filtertest:00005001:xiaomi-r24r00:1","description":"filtertest","arguments":[]}');
    this.addEventByString('maintenance:error', '{"siid":9,"eiid":2,"type":"urn:xiaomi-spec:event:error:00005002:xiaomi-r24r00:1","description":"error","arguments":[3]}');
    this.addEventByString('maintenance:examine-result', '{"siid":9,"eiid":3,"type":"urn:xiaomi-spec:event:examine-result:00005003:xiaomi-r24r00:1","description":"examine-result","arguments":[2]}');
    this.addEventByString('maintenance:clean-result', '{"siid":9,"eiid":4,"type":"urn:xiaomi-spec:event:clean-result:00005004:xiaomi-r24r00:1","description":"clean-result","arguments":[1]}');
    this.addEventByString('maintenance:button-pressed', '{"siid":9,"eiid":5,"type":"urn:xiaomi-spec:event:button-pressed:00005005:xiaomi-r24r00:1","description":"button-pressed","arguments":[]}');
    this.addEventByString('maintenance:button-released', '{"siid":9,"eiid":6,"type":"urn:xiaomi-spec:event:button-released:00005006:xiaomi-r24r00:1","description":"button-released","arguments":[]}');
    // this.addEventByString('maintenance:running-duration', '{"siid":9,"eiid":8,"type":"urn:xiaomi-spec:event:running-duration:00005008:xiaomi-r24r00:1","description":"running-duration","arguments":[5]}');
    this.addEventByString('maintenance:ai-cool', '{"siid":9,"eiid":15,"type":"urn:xiaomi-spec:event:ai-cool:0000500e:xiaomi-r24r00:1","description":"ai-cool","arguments":[]}');
    this.addEventByString('maintenance:ai-heat', '{"siid":9,"eiid":16,"type":"urn:xiaomi-spec:event:ai-heat:0000500f:xiaomi-r24r00:1","description":"ai-heat","arguments":[]}');
    this.addEventByString('maintenance:ai-dehumidify', '{"siid":9,"eiid":17,"type":"urn:xiaomi-spec:event:ai-dehumidify:00005010:xiaomi-r24r00:1","description":"ai-dehumidify","arguments":[]}');
    this.addEventByString('maintenance:mosquito-tips-five', '{"siid":9,"eiid":22,"type":"urn:xiaomi-spec:event:mosquito-tips-five:0000500c:xiaomi-r24r00:1","description":"mosquito-tips-five","arguments":[]}');
    this.addEventByString('maintenance:mosquito-tips-zero', '{"siid":9,"eiid":23,"type":"urn:xiaomi-spec:event:mosquito-tips-zero:0000500d:xiaomi-r24r00:1","description":"mosquito-tips-zero","arguments":[]}');
    this.addEventByString('maintenance:ifd-tips-five', '{"siid":9,"eiid":25,"type":"urn:xiaomi-spec:event:ifd-tips-five:00005009:xiaomi-r24r00:1","description":"ifd-tips-five","arguments":[]}');
    this.addEventByString('maintenance:ifd-tips-zero', '{"siid":9,"eiid":26,"type":"urn:xiaomi-spec:event:ifd-tips-zero:0000500a:xiaomi-r24r00:1","description":"ifd-tips-zero","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  heatModeValue() {
    return 5;
  }

  coolModeValue() {
    return 2;
  }

  dryModeValue() {
    return 3;
  }

  fanModeValue() {
    return 4;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  indicatorLightIndicatorLightProp() {
    return this.getProperty('indicator-light:on');
  }

  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiAircR24r00;

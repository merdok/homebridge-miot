const AirConditionerDevice = require('../AirConditionerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAirconditionAcn05 extends AirConditionerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Aqara Air Conditioning Companion P3';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:lumi-acn05:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:lumi-acn05:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:illumination-sensor:0000783D:lumi-acn05:1","description":"Illumination Sensor"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v2:service:air-conditioner:0000780F:lumi-acn05:1","description":"Air Conditioner"}');
    this.createServiceByString('{"siid":14,"type":"urn:miot-spec-v2:service:switch:0000780C:lumi-acn05:1","description":"Switch"}');
    this.createServiceByString('{"siid":18,"type":"urn:miot-spec-v2:service:fan-control:00007809:lumi-acn05:1","description":"Fan Control"}');
    this.createServiceByString('{"siid":3,"type":"urn:lumi-spec:service:arming:00007801:lumi-acn05:1","description":"arming"}');
    this.createServiceByString('{"siid":4,"type":"urn:lumi-spec:service:button:00007802:lumi-acn05:1","description":"button"}');
    this.createServiceByString('{"siid":6,"type":"urn:lumi-spec:service:indicator-light:00007803:lumi-acn05:1","description":"indicator-light"}');
    this.createServiceByString('{"siid":7,"type":"urn:lumi-spec:service:accidental-deletion:00007804:lumi-acn05:1","description":"accidental-deletion"}');
    this.createServiceByString('{"siid":9,"type":"urn:lumi-spec:service:play-spec-audio:00007805:lumi-acn05:1","description":"play-spec-audio"}');
    this.createServiceByString('{"siid":11,"type":"urn:lumi-spec:service:ac-function:00007806:lumi-acn05:1","description":"ac-function"}');
    this.createServiceByString('{"siid":12,"type":"urn:lumi-spec:service:power-consumption:00007807:lumi-acn05:1","description":"power-consumption"}');
    this.createServiceByString('{"siid":13,"type":"urn:lumi-spec:service:device-protect:00007808:lumi-acn05:1","description":"device-protect"}');
    this.createServiceByString('{"siid":15,"type":"urn:lumi-spec:service:switch-control:00007809:lumi-acn05:1","description":"switch-control"}');
    this.createServiceByString('{"siid":16,"type":"urn:lumi-spec:service:binding-relationship:0000780a:lumi-acn05:1","description":"binding-relationship"}');
    this.createServiceByString('{"siid":17,"type":"urn:lumi-spec:service:device-info:0000780b:lumi-acn05:1","description":"device-info"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:lumi-acn05:1","description":"Alarm","format":"string","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('alarm:volume', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:volume:00000013:lumi-acn05:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('illumination-sensor:illumination', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:illumination:0000004E:lumi-acn05:1","description":"Illumination","format":"float","access":["read","notify"],"unit":"lux","valueRange":[0,10000,1]}');
    this.addPropertyByString('air-conditioner:on', '{"siid":10,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:lumi-acn05:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:mode', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:lumi-acn05:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Heat"},{"value":2,"description":"Cool"},{"value":3,"description":"Dry"},{"value":4,"description":"Fan"}]}');
    this.addPropertyByString('air-conditioner:fault', '{"siid":10,"piid":3,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-acn05:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('air-conditioner:target-temperature', '{"siid":10,"piid":4,"type":"urn:miot-spec-v2:property:target-temperature:00000021:lumi-acn05:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,31,1]}');
    this.addPropertyByString('switch:on', '{"siid":14,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:lumi-acn05:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan-control:fan-level', '{"siid":18,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:lumi-acn05:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('fan-control:vertical-swing', '{"siid":18,"piid":4,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:lumi-acn05:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('arming:arming-mode', '{"siid":3,"piid":1,"type":"urn:lumi-spec:property:arming-mode:00000001:lumi-acn05:1","description":"arming-mode","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"基础警戒模式"},{"value":1,"description":"在家警戒模式"},{"value":2,"description":"离家警戒模式"},{"value":3,"description":"睡眠警戒模式"}]}');
    this.addPropertyByString('arming:arming-change', '{"siid":3,"piid":2,"type":"urn:lumi-spec:property:arming-change:00000002:lumi-acn05:1","description":"arming-change","format":"int32","access":["write","notify"],"unit":"none","valueList":[{"value":1,"description":"在家警戒模式"},{"value":2,"description":"离家警戒模式"},{"value":3,"description":"睡眠警戒模式"}]}');
    this.addPropertyByString('arming:customize-mode-one', '{"siid":3,"piid":3,"type":"urn:lumi-spec:property:customize-mode-one:00000003:lumi-acn05:1","description":"customize-mode-one","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:customize-mode-two', '{"siid":3,"piid":4,"type":"urn:lumi-spec:property:customize-mode-two:00000004:lumi-acn05:1","description":"customize-mode-two","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:customize-mode-three', '{"siid":3,"piid":5,"type":"urn:lumi-spec:property:customize-mode-three:00000005:lumi-acn05:1","description":"customize-mode-three","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:customize-mode-four', '{"siid":3,"piid":6,"type":"urn:lumi-spec:property:customize-mode-four:00000006:lumi-acn05:1","description":"customize-mode-four","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:customize-mode-five', '{"siid":3,"piid":7,"type":"urn:lumi-spec:property:customize-mode-five:00000007:lumi-acn05:1","description":"customize-mode-five","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:customize-mode-six', '{"siid":3,"piid":8,"type":"urn:lumi-spec:property:customize-mode-six:00000008:lumi-acn05:1","description":"customize-mode-six","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('arming:delay-time-basic', '{"siid":3,"piid":9,"type":"urn:lumi-spec:property:delay-time-basic:00000009:lumi-acn05:1","description":"delay-time-basic","format":"int32","access":["write","read","notify"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-basic', '{"siid":3,"piid":10,"type":"urn:lumi-spec:property:alarm-duration-basic:0000000a:lumi-acn05:1","description":"alarm-duration-basic","format":"int64","access":["read","notify","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-vlume-basic', '{"siid":3,"piid":11,"type":"urn:lumi-spec:property:alarm-vlume-basic:0000000b:lumi-acn05:1","description":"alarm-vlume-basic","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('arming:delay-time-home', '{"siid":3,"piid":12,"type":"urn:lumi-spec:property:delay-time-home:0000000c:lumi-acn05:1","description":"delay-time-home","format":"int32","access":["read","notify","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-home', '{"siid":3,"piid":13,"type":"urn:lumi-spec:property:alarm-duration-home:0000000d:lumi-acn05:1","description":"alarm-duration-home","format":"int64","access":["read","notify","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-home', '{"siid":3,"piid":14,"type":"urn:lumi-spec:property:alarm-volume-home:0000000e:lumi-acn05:1","description":"alarm-volume-home","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('arming:delay-time-away', '{"siid":3,"piid":15,"type":"urn:lumi-spec:property:delay-time-away:0000000f:lumi-acn05:1","description":"delay-time-away","format":"int32","access":["write","read","notify"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-away', '{"siid":3,"piid":16,"type":"urn:lumi-spec:property:alarm-duration-away:00000010:lumi-acn05:1","description":"alarm-duration-away","format":"int64","access":["read","notify","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-away', '{"siid":3,"piid":17,"type":"urn:lumi-spec:property:alarm-volume-away:00000011:lumi-acn05:1","description":"alarm-volume-away","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('arming:delay-time-sleep', '{"siid":3,"piid":18,"type":"urn:lumi-spec:property:delay-time-sleep:00000012:lumi-acn05:1","description":"delay-time-sleep","format":"int32","access":["read","notify","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-sleep', '{"siid":3,"piid":19,"type":"urn:lumi-spec:property:alarm-duration-sleep:00000013:lumi-acn05:1","description":"alarm-duration-sleep","format":"int64","access":["read","notify","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-sleep', '{"siid":3,"piid":20,"type":"urn:lumi-spec:property:alarm-volume-sleep:00000014:lumi-acn05:1","description":"alarm-volume-sleep","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('arming:target-arming-mode', '{"siid":3,"piid":21,"type":"urn:lumi-spec:property:target-arming-mode:00000015:lumi-acn05:1","description":"target-arming-mode","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"基础守护"},{"value":1,"description":"在家守护"},{"value":2,"description":"离家守护"},{"value":3,"description":"睡眠守护"}]}');
    this.addPropertyByString('arming:alarm-auto-log', '{"siid":3,"piid":23,"type":"urn:lumi-spec:property:alarm-auto-log:00000017:lumi-acn05:1","description":"alarm-auto-log","format":"string","access":["notify"],"unit":"none"}');
    this.addPropertyByString('arming:alarm', '{"siid":3,"piid":22,"type":"urn:lumi-spec:property:alarm:00000016:lumi-acn05:1","description":"alarm","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"无报警"},{"value":1,"description":"基础守护报警"},{"value":2,"description":"在家守护报警"},{"value":3,"description":"离家守护报警"},{"value":4,"description":"睡眠守护报警"},{"value":11,"description":"自定义守护1报警"},{"value":12,"description":"自定义守护2报警"},{"value":13,"description":"自定义守护3报警"},{"value":14,"description":"自定义守护4报警"},{"value":15,"description":"自定义守护5报警"},{"value":16,"description":"自定义守护6报警"}]}');
    this.addPropertyByString('arming:sound-name-basic', '{"siid":3,"piid":24,"type":"urn:lumi-spec:property:sound-name-basic:00000018:lumi-acn05:1","description":"sound-name-basic","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('arming:sound-name-home', '{"siid":3,"piid":25,"type":"urn:lumi-spec:property:sound-name-home:00000019:lumi-acn05:1","description":"sound-name-home","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('arming:sound-name-away', '{"siid":3,"piid":26,"type":"urn:lumi-spec:property:sound-name-away:0000001a:lumi-acn05:1","description":"sound-name-away","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('arming:sound-name-sleep', '{"siid":3,"piid":27,"type":"urn:lumi-spec:property:sound-name-sleep:0000001b:lumi-acn05:1","description":"sound-name-sleep","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('arming:stop-preview', '{"siid":3,"piid":28,"type":"urn:lumi-spec:property:stop-preview:0000001c:lumi-acn05:1","description":"stop-preview","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('button:button', '{"siid":4,"piid":1,"type":"urn:lumi-spec:property:button:00000001:lumi-acn05:1","description":"button","format":"int32","access":["notify"],"unit":"none","valueList":[{"value":1,"description":"单击"},{"value":2,"description":"双击"},{"value":3,"description":"三击"},{"value":10,"description":"短按10次"},{"value":16,"description":"长按5秒"},{"value":21,"description":"长按10秒"}]}');
    this.addPropertyByString('indicator-light:indicator-light', '{"siid":6,"piid":1,"type":"urn:lumi-spec:property:indicator-light:00000001:lumi-acn05:1","description":"indicator-light","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('indicator-light:effective-time', '{"siid":6,"piid":2,"type":"urn:lumi-spec:property:effective-time:00000002:lumi-acn05:1","description":"effective-time","format":"string","access":["notify","read","write"],"unit":"none"}');
    this.addPropertyByString('accidental-deletion:on-off', '{"siid":7,"piid":1,"type":"urn:lumi-spec:property:on-off:00000001:lumi-acn05:1","description":"on-off","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('play-spec-audio:play-spec-audio', '{"siid":9,"piid":1,"type":"urn:lumi-spec:property:play-spec-audio:00000001:lumi-acn05:1","description":"play-spec-audio","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('play-spec-audio:play-spec-audio-time', '{"siid":9,"piid":2,"type":"urn:lumi-spec:property:play-spec-audio-time:00000002:lumi-acn05:1","description":"play-spec-audio-time","format":"uint32","access":["write","notify"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('play-spec-audio:play-cycle', '{"siid":9,"piid":3,"type":"urn:lumi-spec:property:play-cycle:00000003:lumi-acn05:1","description":"play-cycle","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"打开"}]}');
    this.addPropertyByString('play-spec-audio:stop-play', '{"siid":9,"piid":4,"type":"urn:lumi-spec:property:stop-play:00000004:lumi-acn05:1","description":"stop-play","format":"uint8","access":["notify","write"],"unit":"none","valueList":[{"value":1,"description":"停止播放"}]}');
    this.addPropertyByString('play-spec-audio:audio-list', '{"siid":9,"piid":5,"type":"urn:lumi-spec:property:audio-list:00000005:lumi-acn05:1","description":"audio-list","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('play-spec-audio:language-list', '{"siid":9,"piid":6,"type":"urn:lumi-spec:property:language-list:00000006:lumi-acn05:1","description":"language-list","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('ac-function:ac-ctrl-range', '{"siid":11,"piid":1,"type":"urn:lumi-spec:property:ac-ctrl-range:00000001:lumi-acn05:1","description":"","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:match-status', '{"siid":11,"piid":2,"type":"urn:lumi-spec:property:match-status:00000002:lumi-acn05:1","description":"match-status","format":"uint8","access":["notify","read"],"unit":"none","valueList":[{"value":0,"description":"Matching"},{"value":1,"description":"Match-Success"},{"value":2,"description":"Match-Error"}]}');
    this.addPropertyByString('ac-function:set-ele-info', '{"siid":11,"piid":3,"type":"urn:lumi-spec:property:set-ele-info:00000003:lumi-acn05:1","description":"set-ele-info","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:ac-type', '{"siid":11,"piid":4,"type":"urn:lumi-spec:property:ac-type:00000004:lumi-acn05:1","description":"ac-type","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Protocol-AC"},{"value":1,"description":"NonStatus-AC"},{"value":2,"description":"Status-AC"}]}');
    this.addPropertyByString('ac-function:ac-mode', '{"siid":11,"piid":5,"type":"urn:lumi-spec:property:ac-mode:00000005:lumi-acn05:1","description":"ac-mode","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":1,"description":"AC-Plug"},{"value":2,"description":"AC-Unplug"}]}');
    this.addPropertyByString('ac-function:brand-id', '{"siid":11,"piid":6,"type":"urn:lumi-spec:property:brand-id:00000006:lumi-acn05:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('ac-function:remote-id', '{"siid":11,"piid":7,"type":"urn:lumi-spec:property:remote-id:00000007:lumi-acn05:1","description":"","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('ac-function:ac-state', '{"siid":11,"piid":9,"type":"urn:lumi-spec:property:ac-state:00000009:lumi-acn05:1","description":"ac-state","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:quick-cool-time', '{"siid":11,"piid":10,"type":"urn:lumi-spec:property:quick-cool-time:00000008:lumi-acn05:1","description":"","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[1,59,1]}');
    this.addPropertyByString('ac-function:quick-cool', '{"siid":11,"piid":11,"type":"urn:lumi-spec:property:quick-cool:0000000a:lumi-acn05:1","description":"quick-cool","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('ac-function:sleep-cfg', '{"siid":11,"piid":12,"type":"urn:lumi-spec:property:sleep-cfg:0000000b:lumi-acn05:1","description":"sleep-cfg","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('ac-function:eco-mode', '{"siid":11,"piid":13,"type":"urn:lumi-spec:property:eco-mode:0000000c:lumi-acn05:1","description":"eco-mode","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('ac-function:eco-mode-time', '{"siid":11,"piid":14,"type":"urn:lumi-spec:property:eco-mode-time:0000000d:lumi-acn05:1","description":"","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[15,1440,1]}');
    this.addPropertyByString('ac-function:match-pro', '{"siid":11,"piid":16,"type":"urn:lumi-spec:property:match-pro:0000000f:lumi-acn05:1","description":"match-pro","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:ir-learn', '{"siid":11,"piid":18,"type":"urn:lumi-spec:property:ir-learn:00000010:lumi-acn05:1","description":"ir-learn","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:ir-learn-del', '{"siid":11,"piid":19,"type":"urn:lumi-spec:property:ir-learn-del:0000000e:lumi-acn05:1","description":"ir-learn-del","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:report-ir-learn', '{"siid":11,"piid":20,"type":"urn:lumi-spec:property:report-ir-learn:00000011:lumi-acn05:1","description":"report-ir-learn","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('ac-function:report-ir-learn-key', '{"siid":11,"piid":21,"type":"urn:lumi-spec:property:report-ir-learn-key:00000012:lumi-acn05:1","description":"report-ir-learn-key","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('ac-function:send-learn-cmd', '{"siid":11,"piid":22,"type":"urn:lumi-spec:property:send-learn-cmd:00000013:lumi-acn05:1","description":"send-learn-cmd","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('ac-function:sleep-status', '{"siid":11,"piid":23,"type":"urn:lumi-spec:property:sleep-status:00000014:lumi-acn05:1","description":"sleep-status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('ac-function:match-download-retry', '{"siid":11,"piid":24,"type":"urn:lumi-spec:property:match-download-retry:00000015:lumi-acn05:1","description":"match-download-retry","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":3,"description":"Download-Retry"}]}');
    this.addPropertyByString('power-consumption:power-consumption', '{"siid":12,"piid":1,"type":"urn:lumi-spec:property:power-consumption:00000001:lumi-acn05:1","description":"power-consumption","format":"float","access":["read","notify"],"unit":"none","valueRange":[0,3.4e+38,0.000001]}');
    this.addPropertyByString('power-consumption:electric-power', '{"siid":12,"piid":2,"type":"urn:lumi-spec:property:electric-power:00000002:lumi-acn05:1","description":"electric-power","format":"float","access":["read","notify"],"unit":"none","valueRange":[0,4000,0.000001]}');
    this.addPropertyByString('device-protect:temperature-alarm', '{"siid":13,"piid":1,"type":"urn:lumi-spec:property:temperature-alarm:00000001:lumi-acn05:1","description":"temperature-alarm","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"正常"},{"value":1,"description":"过温报警"},{"value":2,"description":"过温异常"}]}');
    this.addPropertyByString('device-protect:power-alarm', '{"siid":13,"piid":2,"type":"urn:lumi-spec:property:power-alarm:00000002:lumi-acn05:1","description":"power-alarm","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"正常"},{"value":1,"description":"过载报警"},{"value":2,"description":"过载异常"}]}');
    this.addPropertyByString('switch-control:switch-control', '{"siid":15,"piid":1,"type":"urn:lumi-spec:property:switch-control:00000001:lumi-acn05:1","description":"switch-control","format":"uint8","access":["write","notify"],"unit":"none","valueList":[{"value":2,"description":"toggle"}]}');
    this.addPropertyByString('binding-relationship:weather-bind', '{"siid":16,"piid":1,"type":"urn:lumi-spec:property:weather-bind:00000001:lumi-acn05:1","description":"weather-bind","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('device-info:chip-temperature', '{"siid":17,"piid":1,"type":"urn:lumi-spec:property:chip-temperature:00000001:lumi-acn05:1","description":"chip-temperature","format":"float","access":["notify"],"unit":"celsius","valueRange":[-200,200,0.1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('accidental-deletion:event-unbind', '{"siid":7,"eiid":1,"type":"urn:lumi-spec:event:event-unbind:00005001:lumi-acn05:1","description":"event-unbind","arguments":[]}');
    this.addEventByString('ac-function:eco-mode-prompt', '{"siid":11,"eiid":1,"type":"urn:lumi-spec:event:eco-mode-prompt:00005001:lumi-acn05:1","description":"eco-mode-prompt","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  heatModeValue() {
    return 1;
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


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiAirconditionAcn05;

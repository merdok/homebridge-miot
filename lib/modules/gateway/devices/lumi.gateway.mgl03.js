const GatewayDevice = require('../GatewayDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiGatewayMgl03 extends GatewayDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Gateway v3';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:gateway:0000A019:lumi-mgl03:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:lumi-mgl03:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:lumi-spec:service:arming:00000001:lumi-mgl03:1","description":"arming"}');
    this.createServiceByString('{"siid":4,"type":"urn:lumi-spec:service:button:0000000D:lumi-mgl03:1","description":"button"}');
    this.createServiceByString('{"siid":7,"type":"urn:lumi-spec:service:accidental-deletion:00007801:lumi-mgl03:1","description":"accidental-deletion"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":6,"type":"urn:miot-spec-v2:property:on:00000006:lumi-mgl03:1","description":"enable night indicator light","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关蓝灯常亮和蓝灯闪烁状态"},{"value":1,"description":"指示灯按正常逻辑显示"}]}');
    this.addPropertyByString('arming:arming-mode', '{"siid":3,"piid":1,"type":"urn:lumi-spec:property:arming-mode:00000002:lumi-mgl03:1","description":"arming-mode","format":"int32","access":["read","write","notify"],"valueList":[{"value":0,"description":"basic_arming"},{"value":1,"description":"home_arming"},{"value":2,"description":"away_arming"},{"value":3,"description":"sleep_arming"}]}');
    this.addPropertyByString('arming:arming-change', '{"siid":3,"piid":2,"type":"urn:lumi-spec:property:arming-change:00000003:lumi-mgl03:1","description":"change to basic mode","format":"int32","access":["notify"],"valueList":[{"value":1,"description":"home_arming"},{"value":2,"description":"away_arming"},{"value":3,"description":"sleep_arming"}]}');
    this.addPropertyByString('arming:customize-mode-1', '{"siid":3,"piid":3,"type":"urn:lumi-spec:property:customize-mode-1:00000004:lumi-mgl03:1","description":"customize-mode-1","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:customize-mode-2', '{"siid":3,"piid":4,"type":"urn:lumi-spec:property:customize-mode-2:00000005:lumi-mgl03:1","description":"customize-mode-2","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:customize-mode-3', '{"siid":3,"piid":5,"type":"urn:lumi-spec:property:customize-mode-3:00000006:lumi-mgl03:1","description":"customize-mode-3","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:customize-mode-4', '{"siid":3,"piid":6,"type":"urn:lumi-spec:property:customize-mode-4:00000007:lumi-mgl03:1","description":"customize-mode-4","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:customize-mode-5', '{"siid":3,"piid":7,"type":"urn:lumi-spec:property:customize-mode-5:00000008:lumi-mgl03:1","description":"customize-mode-5","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:customize-mode-6', '{"siid":3,"piid":8,"type":"urn:lumi-spec:property:customize-mode-6:00000009:lumi-mgl03:1","description":"customize-mode-6","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
    this.addPropertyByString('arming:delay-time-basic', '{"siid":3,"piid":9,"type":"urn:lumi-spec:property:delay-time-basic:0000000A:lumi-mgl03:1","description":"基础警戒延时生效时长","format":"int32","access":["read","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-basic', '{"siid":3,"piid":10,"type":"urn:lumi-spec:property:alarm-duration-basic:0000000B:lumi-mgl03:1","description":"基础报警持续时长","format":"int64","access":["read","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-basic', '{"siid":3,"piid":11,"type":"urn:lumi-spec:property:alarm-volume-basic:0000000C:lumi-mgl03:1","description":"alarm-volume-basic","format":"int32","access":["read","write"],"unit":"percentage","valueList":[{"value":0,"description":"静音"},{"value":1,"description":"低音量"},{"value":2,"description":"中音量"},{"value":3,"description":"高音量"}]}');
    this.addPropertyByString('arming:delay-time-home', '{"siid":3,"piid":12,"type":"urn:lumi-spec:property:delay-time-home:0000000F:lumi-mgl03:1","description":"","format":"int32","access":["read","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-home', '{"siid":3,"piid":13,"type":"urn:lumi-spec:property:alarm-duration-home:00000010:lumi-mgl03:1","description":"在家报警持续时长","format":"int64","access":["read","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-home', '{"siid":3,"piid":14,"type":"urn:lumi-spec:property:alarm-volume-home:00000011:lumi-mgl03:1","description":"alarm-volume-home","format":"int32","access":["read","write"],"unit":"percentage","valueList":[{"value":0,"description":"静音"},{"value":1,"description":"低音量"},{"value":2,"description":"中音量"},{"value":3,"description":"高音量"}]}');
    this.addPropertyByString('arming:delay-time-away', '{"siid":3,"piid":15,"type":"urn:lumi-spec:property:delay-time-away:00000012:lumi-mgl03:1","description":"","format":"int32","access":["read","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-away', '{"siid":3,"piid":16,"type":"urn:lumi-spec:property:alarm-duration-away:00000013:lumi-mgl03:1","description":"离线报警持续时长","format":"int64","access":["read","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-away', '{"siid":3,"piid":17,"type":"urn:lumi-spec:property:alarm-volume-away:00000014:lumi-mgl03:1","description":"alarm-volume-away","format":"int32","access":["read","write"],"unit":"percentage","valueList":[{"value":0,"description":"静音"},{"value":1,"description":"低音量"},{"value":2,"description":"中音量"},{"value":3,"description":"高音量"}]}');
    this.addPropertyByString('arming:delay-time-sleep', '{"siid":3,"piid":18,"type":"urn:lumi-spec:property:delay-time-sleep:00000015:lumi-mgl03:1","description":"","format":"int32","access":["read","write"],"unit":"seconds","valueRange":[0,60,5]}');
    this.addPropertyByString('arming:alarm-duration-sleep', '{"siid":3,"piid":19,"type":"urn:lumi-spec:property:alarm-duration-sleep:00000016:lumi-mgl03:1","description":"睡眠报警持续时长","format":"int64","access":["read","write"],"unit":"seconds","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('arming:alarm-volume-sleep', '{"siid":3,"piid":20,"type":"urn:lumi-spec:property:alarm-volume-sleep:00000017:lumi-mgl03:1","description":"alarm-volume-sleep","format":"int32","access":["read","write"],"unit":"percentage","valueList":[{"value":0,"description":"静音"},{"value":1,"description":"低音量"},{"value":2,"description":"中音量"},{"value":3,"description":"高音量"}]}');
    this.addPropertyByString('arming:target-arming-mode', '{"siid":3,"piid":21,"type":"urn:lumi-spec:property:target-arming-mode:00000001:lumi-mgl03:1","description":"网关自带的目标警戒模式。homekit功能需要用到该属性。","format":"int32","access":["read","write","notify"],"valueList":[{"value":0,"description":"basic_arming"},{"value":1,"description":"home_arming"},{"value":2,"description":"away_arming"},{"value":3,"description":"sleep_arming"}]}');
    this.addPropertyByString('arming:alarm', '{"siid":3,"piid":22,"type":"urn:lumi-spec:property:alarm:0000000d:lumi-mgl03:1","description":"","format":"int32","access":["read","write","notify"],"valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""}]}');
    this.addPropertyByString('arming:alarm-auto-log', '{"siid":3,"piid":23,"type":"urn:lumi-spec:property:alarm-auto-log:0000000e:lumi-mgl03:1","description":"","format":"string","access":["notify"]}');
    this.addPropertyByString('button:button', '{"siid":4,"piid":1,"type":"urn:lumi-spec:property:button:0000000E:lumi-mgl03:1","description":"button","format":"int32","access":["notify"],"valueList":[{"value":1,"description":"single_click"},{"value":2,"description":"shock_click_2_times"},{"value":10,"description":"shock_click_10_times"},{"value":21,"description":"long_press_10s"},{"value":3,"description":"shock_click_3_times"},{"value":16,"description":"long_press_5s"}]}');
    this.addPropertyByString('accidental-deletion:on-off', '{"siid":7,"piid":1,"type":"urn:lumi-spec:property:on-off:00000001:lumi-mgl03:1","description":"on-off","format":"uint8","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"关闭"},{"value":1,"description":"开启"}]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('accidental-deletion:event-unbind', '{"siid":7,"eiid":1,"type":"urn:lumi-spec:event:event-unbind:00005001:lumi-mgl03:1","description":"event-unbind","arguments":[]}');
    this.addEventByString('accidental-deletion:homekit-bound', '{"siid":7,"eiid":2,"type":"urn:lumi-spec:event:homekit-bound:00005002:lumi-mgl03:3","description":"homekit-bound","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiGatewayMgl03;

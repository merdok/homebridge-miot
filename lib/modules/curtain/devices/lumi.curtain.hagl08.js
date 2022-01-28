const CurtainDevice = require('../CurtainDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiCurtainHagl08 extends CurtainDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Aqara Curtain Controller A1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:lumi-hagl08:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:curtain:00007816:lumi-hagl08:1","description":"Curtain"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:identify:0000782C:lumi-hagl08:1","description":"Identify"}');
    this.createServiceByString('{"siid":4,"type":"urn:lumi-spec:service:curtain-cfg:00007802:lumi-hagl08:1","description":"curtain-cfg"}');
    this.createServiceByString('{"siid":5,"type":"urn:lumi-spec:service:motor-controller:00007801:lumi-hagl08:1","description":"motor-controller"}');
    this.createServiceByString('{"siid":7,"type":"urn:lumi-spec:service:remote-cfg:00007803:lumi-hagl08:1","description":"remote-cfg"}');
    this.createServiceByString('{"siid":8,"type":"urn:lumi-spec:service:remote-button:00007804:lumi-hagl08:1","description":"remote-button"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('curtain:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-hagl08:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('curtain:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:lumi-hagl08:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Open"},{"value":2,"description":"Close"},{"value":3,"description":"Toggle"}]}');
    this.addPropertyByString('curtain:current-position', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:current-position:00000039:lumi-hagl08:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:status', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:status:00000007:lumi-hagl08:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Stopped"},{"value":1,"description":"Opening"},{"value":2,"description":"Closing"}]}');
    this.addPropertyByString('curtain:target-position', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:target-position:0000003A:lumi-hagl08:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain-cfg:manual-enabled', '{"siid":4,"piid":1,"type":"urn:lumi-spec:property:manual-enabled:00000001:lumi-hagl08:1","description":"manual-enabled","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('curtain-cfg:polarity', '{"siid":4,"piid":2,"type":"urn:lumi-spec:property:polarity:00000002:lumi-hagl08:1","description":"","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Positive"},{"value":1,"description":"Reverse"}]}');
    this.addPropertyByString('curtain-cfg:pos-limit', '{"siid":4,"piid":3,"type":"urn:lumi-spec:property:pos-limit:00000003:lumi-hagl08:1","description":"pos-limit","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Unlimit"},{"value":1,"description":"Limit"}]}');
    this.addPropertyByString('curtain-cfg:en-night-tip-light', '{"siid":4,"piid":4,"type":"urn:lumi-spec:property:en-night-tip-light:00000004:lumi-hagl08:1","description":"en-night-tip-light","format":"int32","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('curtain-cfg:run-time', '{"siid":4,"piid":5,"type":"urn:lumi-spec:property:run-time:00000005:lumi-hagl08:1","description":"run-time","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,255,1]}');
    this.addPropertyByString('curtain-cfg:debug-info', '{"siid":4,"piid":6,"type":"urn:lumi-spec:property:debug-info:00000006:lumi-hagl08:1","description":"debug-info","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('curtain-cfg:light-off-time-range', '{"siid":4,"piid":7,"type":"urn:lumi-spec:property:light-off-time-range:00000007:lumi-hagl08:1","description":"","format":"uint32","access":["read","notify","write"],"unit":"none","valueRange":[0,389748539,1]}');
    this.addPropertyByString('motor-controller:adjust-value', '{"siid":5,"piid":1,"type":"urn:lumi-spec:property:adjust-value:00000001:lumi-hagl08:1","description":"adjust-value","format":"int32","access":["write"],"unit":"none","valueRange":[-100,100,1]}');
    this.addPropertyByString('motor-controller:proportion-incream', '{"siid":5,"piid":2,"type":"urn:lumi-spec:property:proportion-incream:00000002:lumi-hagl08:1","description":"proportion-incream","format":"uint8","access":["write"],"unit":"none","valueRange":[0,100,1]}');
    this.addPropertyByString('motor-controller:proportion-decream', '{"siid":5,"piid":3,"type":"urn:lumi-spec:property:proportion-decream:00000003:lumi-hagl08:1","description":"proportion-decream","format":"uint8","access":["write"],"unit":"none","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-cfg:remote-identify', '{"siid":7,"piid":1,"type":"urn:lumi-spec:property:remote-identify:00000001:lumi-hagl08:1","description":"remote-identify","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('remote-cfg:remote-list', '{"siid":7,"piid":2,"type":"urn:lumi-spec:property:remote-list:00000002:lumi-hagl08:1","description":"","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('remote-cfg:remote-pair', '{"siid":7,"piid":3,"type":"urn:lumi-spec:property:remote-pair:00000003:lumi-hagl08:1","description":"","format":"int32","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Exit"},{"value":1,"description":"Enter"}]}');
    this.addPropertyByString('remote-cfg:remote-pair-status', '{"siid":7,"piid":4,"type":"urn:lumi-spec:property:remote-pair-status:00000004:lumi-hagl08:1","description":"","format":"int32","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"配对成功"},{"value":1,"description":"配对失败"},{"value":2,"description":"配对中"},{"value":3,"description":"退出配对"}]}');
    this.addPropertyByString('remote-cfg:remote-delete', '{"siid":7,"piid":5,"type":"urn:lumi-spec:property:remote-delete:00000005:lumi-hagl08:1","description":"remote-delete","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('remote-button:remote-button-click', '{"siid":8,"piid":1,"type":"urn:lumi-spec:property:remote-button-click:00000001:lumi-hagl08:1","description":"remote-button-click","format":"uint8","access":["notify"],"unit":"none","valueList":[{"value":1,"description":"按键F1"},{"value":2,"description":"按键F2"},{"value":3,"description":"按键F3"}]}');
    this.addPropertyByString('remote-button:f-one-wireless', '{"siid":8,"piid":2,"type":"urn:lumi-spec:property:f-one-wireless:00000002:lumi-hagl08:1","description":"f-one-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-two-wireless', '{"siid":8,"piid":3,"type":"urn:lumi-spec:property:f-two-wireless:00000003:lumi-hagl08:1","description":"f-two-wireless","format":"int32","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-three-wireless', '{"siid":8,"piid":4,"type":"urn:lumi-spec:property:f-three-wireless:00000004:lumi-hagl08:1","description":"f-three-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-one-position', '{"siid":8,"piid":5,"type":"urn:lumi-spec:property:f-one-position:00000005:lumi-hagl08:1","description":"f-one-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-button:f-two-position', '{"siid":8,"piid":6,"type":"urn:lumi-spec:property:f-two-position:00000006:lumi-hagl08:1","description":"f-two-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-button:f-three-position', '{"siid":8,"piid":7,"type":"urn:lumi-spec:property:f-three-position:00000007:lumi-hagl08:1","description":"f-three-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('identify:identify', '{"siid":6,"aiid":1,"type":"urn:miot-spec-v2:action:identify:00002801:lumi-hagl08:1","description":"Identify","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('motor-controller:manual-open-event', '{"siid":5,"eiid":1,"type":"urn:lumi-spec:event:manual-open-event:00005001:lumi-hagl08:1","description":"manual-open-event","arguments":[]}');
    this.addEventByString('motor-controller:manual-close-event', '{"siid":5,"eiid":2,"type":"urn:lumi-spec:event:manual-close-event:00005002:lumi-hagl08:1","description":"manual-close-event","arguments":[]}');
    this.addEventByString('remote-button:remote-button-event', '{"siid":8,"eiid":1,"type":"urn:lumi-spec:event:remote-button-event:00005001:lumi-hagl08:1","description":"remote-button-event","arguments":[1]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusClosingValue() {
    return 2;
  }

  statusStopValue() {
    return 0;
  }

  statusOpeningValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiCurtainHagl08;

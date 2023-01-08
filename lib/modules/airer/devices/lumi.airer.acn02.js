const AirerDevice = require('../AirerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAirerAcn02 extends AirerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Aqara Smart Clothes Drying Rack Lite';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:airer:0000A00D:lumi-acn02:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:airer:00007817:lumi-acn02:1","description":"Airer"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:light:00007802:lumi-acn02:1","description":"Light"}');
    this.createServiceByString('{"siid":4,"type":"urn:lumi-spec:service:airer-user:00007801:lumi-acn02:1","description":"airer-user"}');
    this.createServiceByString('{"siid":6,"type":"urn:lumi-spec:service:remote-button:00007803:lumi-acn02:1","description":"remote-button"}');
    this.createServiceByString('{"siid":7,"type":"urn:lumi-spec:service:device-protect:00007804:lumi-acn02:1","description":"device-protect"}');
    this.createServiceByString('{"siid":8,"type":"urn:lumi-spec:service:light-control:00007805:lumi-acn02:1","description":"light-control"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('airer:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-acn02:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('airer:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:lumi-acn02:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Down"},{"value":2,"description":"Up"},{"value":3,"description":"Auto"}]}');
    this.addPropertyByString('airer:status', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:lumi-acn02:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Pause"},{"value":1,"description":"Downing"},{"value":2,"description":"Uping"}]}');
    this.addPropertyByString('airer:current-position', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:current-position:00000039:lumi-acn02:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('airer:target-position', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-position:0000003A:lumi-acn02:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:lumi-acn02:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('airer-user:pos-limit-cfg', '{"siid":4,"piid":1,"type":"urn:lumi-spec:property:pos-limit-cfg:00000001:lumi-acn02:1","description":"","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Delete_limit"},{"value":1,"description":"Set_up_limit"},{"value":2,"description":"Set_down_limit"}]}');
    this.addPropertyByString('airer-user:pos-limit', '{"siid":4,"piid":2,"type":"urn:lumi-spec:property:pos-limit:00000002:lumi-acn02:1","description":"","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Unlimit"},{"value":1,"description":"Limit"},{"value":2,"description":"Limit_point"}]}');
    this.addPropertyByString('airer-user:mute-mode', '{"siid":4,"piid":3,"type":"urn:lumi-spec:property:mute-mode:00000003:lumi-acn02:1","description":"mute-mode","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('airer-user:tracer-mode', '{"siid":4,"piid":4,"type":"urn:lumi-spec:property:tracer-mode:00000004:lumi-acn02:1","description":"tracer-mode","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('airer-user:tracer-mode-cfg', '{"siid":4,"piid":5,"type":"urn:lumi-spec:property:tracer-mode-cfg:00000005:lumi-acn02:1","description":"tracer-mode-cfg","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('airer-user:run-time', '{"siid":4,"piid":6,"type":"urn:lumi-spec:property:run-time:00000006:lumi-acn02:1","description":"run-time","format":"uint8","access":["read","notify"],"unit":"seconds","valueRange":[0,255,1]}');
    this.addPropertyByString('remote-button:remote-button-click', '{"siid":6,"piid":1,"type":"urn:lumi-spec:property:remote-button-click:00000001:lumi-acn02:1","description":"","format":"uint8","access":["notify"],"unit":"none","valueList":[{"value":1,"description":"按键F1"},{"value":2,"description":"按键F2"},{"value":3,"description":"按键F3"},{"value":4,"description":"按键F4"}]}');
    this.addPropertyByString('remote-button:f-one-wireless', '{"siid":6,"piid":2,"type":"urn:lumi-spec:property:f-one-wireless:00000002:lumi-acn02:1","description":"f-one-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-two-wireless', '{"siid":6,"piid":3,"type":"urn:lumi-spec:property:f-two-wireless:00000003:lumi-acn02:1","description":"f-two-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-three-wireless', '{"siid":6,"piid":4,"type":"urn:lumi-spec:property:f-three-wireless:00000004:lumi-acn02:1","description":"f-three-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-four-wireless', '{"siid":6,"piid":5,"type":"urn:lumi-spec:property:f-four-wireless:00000005:lumi-acn02:1","description":"f-four-wireless","format":"int32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Disable"},{"value":1,"description":"Enable"}]}');
    this.addPropertyByString('remote-button:f-one-position', '{"siid":6,"piid":6,"type":"urn:lumi-spec:property:f-one-position:00000006:lumi-acn02:1","description":"f-one-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-button:f-two-position', '{"siid":6,"piid":7,"type":"urn:lumi-spec:property:f-two-position:00000007:lumi-acn02:1","description":"f-two-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-button:f-three-position', '{"siid":6,"piid":8,"type":"urn:lumi-spec:property:f-three-position:00000008:lumi-acn02:1","description":"f-three-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('remote-button:f-four-position', '{"siid":6,"piid":9,"type":"urn:lumi-spec:property:f-four-position:00000009:lumi-acn02:1","description":"f-four-position","format":"uint8","access":["read","notify","write"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('light-control:light-control', '{"siid":8,"piid":1,"type":"urn:lumi-spec:property:light-control:00000001:lumi-acn02:1","description":"light-control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":2,"description":"toggle"}]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('remote-button:remote-button-event', '{"siid":6,"eiid":1,"type":"urn:lumi-spec:event:remote-button-event:00005001:lumi-acn02:1","description":"remote-button-event","arguments":[1]}');
    this.addEventByString('device-protect:overload-alarm', '{"siid":7,"eiid":1,"type":"urn:lumi-spec:event:overload-alarm:00005001:lumi-acn02:1","description":"overload-alarm","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusUpValue() {
    return 2;
  }

  statusDownValue() {
    return 1;
  }

  statusPauseValue() {
    return 0;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiAirerAcn02;

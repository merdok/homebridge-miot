const CurtainDevice = require('../CurtainDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiCurtainAgl001 extends CurtainDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Curtain Driver E1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:lumi-agl001:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:curtain:00007816:lumi-agl001:1","description":"Curtain"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('curtain:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:lumi-agl001:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('curtain:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:lumi-agl001:1","description":"Motor Control","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Pause"}]}');
    this.addPropertyByString('curtain:on', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:on:00000006:lumi-agl001:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('curtain:status', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:lumi-agl001:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('curtain:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:lumi-agl001:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"}]}');
    this.addPropertyByString('curtain:current-position', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:current-position:00000039:lumi-agl001:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:target-position', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:target-position:0000003A:lumi-agl001:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:motor-reverse', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:motor-reverse:00000072:lumi-agl001:1","description":"Motor Reverse","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('curtain:default-open-position', '{"siid":2,"piid":9,"type":"urn:miot-spec-v2:property:default-open-position:000000C2:lumi-agl001:1","description":"Default Open Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:default-close-position', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:default-close-position:000000C3:lumi-agl001:1","description":"Default Close Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:wake-up-mode', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:wake-up-mode:00000107:lumi-agl001:1","description":"Wake Up Mode","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('curtain:motor-calibrate', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:motor-calibrate:00002836:lumi-agl001:1","description":"Motor Calibrate","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('curtain:curtain-manually-opened', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:curtain-manually-opened:00005021:lumi-agl001:1","description":"Curtain Manually Opened","arguments":[]}');
    this.addEventByString('curtain:curtain-manually-closed', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:curtain-manually-closed:00005022:lumi-agl001:1","description":"Curtain Manually Closed","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusClosingValue() {
    return 0;
  }

  statusStopValue() {
    return 1;
  }

  statusOpeningValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiCurtainAgl001;

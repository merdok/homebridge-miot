const CurtainDevice = require('../CurtainDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DooyaCurtainM2 extends CurtainDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Dooya Curtain';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:dooya-m2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:curtain:00007816:dooya-m2:1","description":"Curtain"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('curtain:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:dooya-m2:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('curtain:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:dooya-m2:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Pause"},{"value":2,"description":"Open"}]}');
    this.addPropertyByString('curtain:status', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:status:00000007:dooya-m2:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Closing"},{"value":1,"description":"Stop"},{"value":2,"description":"Opening"}]}');
    this.addPropertyByString('curtain:current-position', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:current-position:00000039:dooya-m2:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:target-position', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:target-position:0000003A:dooya-m2:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:motor-reverse', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:motor-reverse:00000072:dooya-m2:1","description":"Motor Reverse","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
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

module.exports = DooyaCurtainM2;

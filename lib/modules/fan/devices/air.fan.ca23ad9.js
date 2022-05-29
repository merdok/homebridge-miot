const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class AirFanCa23ad9 extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'AIRMATE CA23-AD9 Air Circulation Fan';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:air-ca23ad9:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:air-ca23ad9:1","description":"Fan"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:air-ca23ad9:1","description":"Switch Status","format":"bool","access":["write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:air-ca23ad9:1","description":"Fan Level","format":"uint8","access":["write","notify"],"valueRange":[1,32,1]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:air-ca23ad9:1","description":"Horizontal Swing","format":"bool","access":["write","notify"]}');
    this.addPropertyByString('fan:vertical-swing', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:air-ca23ad9:1","description":"Vertical Swing","format":"bool","access":["write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:air-ca23ad9:1","description":"Mode","format":"uint8","access":["write","notify"],"valueList":[{"value":1,"description":"Basic"},{"value":2,"description":"Baby Care"}]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  straightWindModeValue() {
    return 1;
  }

  sleepModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = AirFanCa23ad9;

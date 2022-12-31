const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiHeaterV4 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Viomi Kick-Line heater Pro2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:viomi-v4:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:viomi-v4:1","description":"Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:countdown:0000782D:viomi-v4:1","description":"Countdown"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:humidifier:00007818:viomi-v4:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:screen:00007806:viomi-v4:1","description":"Screen"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:viomi-v4:1","description":"Alarm"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:viomi-v4:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:viomi-v4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"NO"},{"value":1,"description":"E"},{"value":2,"description":"E"},{"value":3,"description":"E"}]}');
    this.addPropertyByString('heater:status', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:status:00000007:viomi-v4:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Busy"},{"value":2,"description":"Appointment"}]}');
    this.addPropertyByString('heater:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:viomi-v4:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Auto"},{"value":2,"description":"Strong"}]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:viomi-v4:1","description":"Target Temperature","format":"uint16","access":["read","write","notify"],"unit":"celsius","valueRange":[5,35,1]}');
    this.addPropertyByString('heater:temperature', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:viomi-v4:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('heater:working-time', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:working-time:00000079:viomi-v4:1","description":"Working Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,99999999,1]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:viomi-v4:1","description":"Countdown Time","format":"float","access":["read","write","notify"],"unit":"hours","valueRange":[0,24,0.5]}');
    this.addPropertyByString('humidifier:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:viomi-v4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:fault', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:viomi-v4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('screen:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:viomi-v4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:viomi-v4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  temperatureProp() {
    return this.getProperty('heater:temperature');
  }

  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ViomiHeaterV4;

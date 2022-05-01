const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshowHeaterBs3 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Baseboard Heater 3';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:leshow-bs3:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:heater:0000782E:leshow-bs3:1","description":"Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:countdown:0000782D:leshow-bs3:1","description":"Countdown"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:environment:0000780A:leshow-bs3:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:leshow-bs3:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:leshow-bs3:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:indicator-light:00007803:leshow-bs3:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":8,"type":"urn:leshow-spec:service:fan:00007801:leshow-bs3:1","description":"fan"}');
    this.createServiceByString('{"siid":9,"type":"urn:leshow-spec:service:misc:00007802:leshow-bs3:1","description":"misc"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('heater:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:leshow-bs3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('heater:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:leshow-bs3:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('heater:target-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:target-temperature:00000021:leshow-bs3:1","description":"Target Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[18,28,1]}');
    this.addPropertyByString('heater:temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:temperature:00000020:leshow-bs3:1","description":"Temperature","format":"int32","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('heater:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:leshow-bs3:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Low"},{"value":2,"description":"Max"}]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:leshow-bs3:1","description":"Countdown Time","format":"uint8","access":["read","write","notify"],"unit":"hours","valueRange":[0,12,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":4,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:leshow-bs3:1","description":"Temperature","format":"int32","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:leshow-bs3:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:leshow-bs3:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:leshow-bs3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:on', '{"siid":8,"piid":1,"type":"urn:leshow-spec:property:on:00000001:leshow-bs3:1","description":"on","format":"bool","access":["write","read","notify"],"unit":"none"}');
    this.addPropertyByString('misc:pcbtemp', '{"siid":9,"piid":1,"type":"urn:leshow-spec:property:pcbtemp:00000001:leshow-bs3:1","description":"pcbtemp","format":"int32","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LeshowHeaterBs3;

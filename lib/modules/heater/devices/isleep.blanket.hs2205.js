const HeaterDevice = require('../HeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IsleepBlanketHs2205 extends HeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Painted sleep water heating pad HS2205';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:electric-blanket:0000A069:isleep-hs2205:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:electric-blanket:00007844:isleep-hs2205:1","description":"Electric Blanket"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:isleep-hs2205:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:countdown:0000782D:isleep-hs2205:1","description":"Countdown"}');
    this.createServiceByString('{"siid":4,"type":"urn:isleep-spec:service:custom:00007801:isleep-hs2205:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('electric-blanket:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:isleep-hs2205:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('electric-blanket:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:isleep-hs2205:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Fault Pump"},{"value":2,"description":"Fault Sensor"}]}');
    this.addPropertyByString('electric-blanket:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:isleep-hs2205:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Manual"},{"value":1,"description":"One Key Sleep"},{"value":2,"description":"Quenching-Drying"}]}');
    this.addPropertyByString('electric-blanket:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:isleep-hs2205:1","description":"Target Temperature","format":"int8","access":["read","write","notify"],"unit":"celsius","valueRange":[20,45,1]}');
    this.addPropertyByString('electric-blanket:temperature', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:temperature:00000020:isleep-hs2205:1","description":"Temperature","format":"int8","access":["read","notify"],"unit":"celsius","valueRange":[0,99,1]}');
    this.addPropertyByString('electric-blanket:water-level', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:water-level:0000003D:isleep-hs2205:1","description":"Water Level","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Normal Water Level"},{"value":1,"description":"Low Water Level"},{"value":2,"description":"Water Shortage"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:isleep-hs2205:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('countdown:countdown-time', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:countdown-time:00000055:isleep-hs2205:1","description":"Countdown Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:low-temperature', '{"siid":4,"piid":1,"type":"urn:isleep-spec:property:low-temperature:00000001:isleep-hs2205:1","description":"low-temperature","format":"bool","access":["write","read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:screen-switch', '{"siid":4,"piid":2,"type":"urn:isleep-spec:property:screen-switch:00000002:isleep-hs2205:1","description":"screen-switch","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('custom:key-tone', '{"siid":4,"piid":3,"type":"urn:isleep-spec:property:key-tone:00000003:isleep-hs2205:1","description":"key-tone","format":"bool","access":["write","read","notify"]}');
    this.addPropertyByString('custom:automatic-shutdown', '{"siid":4,"piid":4,"type":"urn:isleep-spec:property:automatic-shutdown:00000004:isleep-hs2205:1","description":"automatic-shutdown","format":"bool","access":["write","read","notify"]}');
    this.addPropertyByString('custom:sleep-level', '{"siid":4,"piid":5,"type":"urn:isleep-spec:property:sleep-level:00000005:isleep-hs2205:1","description":"sleep-level","format":"uint8","access":["write","read","notify"],"valueList":[{"value":0,"description":"28 To 32"},{"value":1,"description":"26 To 30"},{"value":2,"description":"30 To 34"},{"value":3,"description":"32 To 36"}]}');
    this.addPropertyByString('custom:fast-heating', '{"siid":4,"piid":6,"type":"urn:isleep-spec:property:fast-heating:00000006:isleep-hs2205:1","description":"fast-heating","format":"bool","access":["write","read","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('custom:scheduled-shutdown', '{"siid":4,"eiid":1,"type":"urn:isleep-spec:event:scheduled-shutdown:00005001:isleep-hs2205:1","description":"scheduled-shutdown","arguments":[]}');
    this.addEventByString('custom:mite-removal', '{"siid":4,"eiid":2,"type":"urn:isleep-spec:event:mite-removal:00005002:isleep-hs2205:1","description":"mite-removal","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  onProp() {
    return this.getProperty('electric-blanket:on');
  }

  modeProp() {
    return this.getProperty('electric-blanket:mode');
  }

  faultProp() {
    return this.getProperty('electric-blanket:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('electric-blanket:target-temperature');
  }

  temperatureProp() {
    return this.getProperty('electric-blanket:temperature');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = IsleepBlanketHs2205;

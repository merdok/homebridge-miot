const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirfreshUa1 extends FreshAirSystemDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Fresh Air Ventilator C1-80';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:zhimi-ua1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-fresh:00007822:zhimi-ua1:1","description":"Air Fresh"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-ua1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-ua1:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-ua1:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-ua1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-ua1:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":8,"type":"urn:zhimi-spec:service:custom-serveice:00007801:zhimi-ua1:1","description":"custom-serveice"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-fresh:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-ua1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-fresh:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-ua1:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('air-fresh:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-ua1:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('air-fresh:heater', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:heater:00000026:zhimi-ua1:1","description":"Heater","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-ua1:1","description":"Filter Used Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,9999999,1]}');
    this.addPropertyByString('filter:filter-life-level', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:filter-life-level:0000001E:zhimi-ua1:1","description":"Filter Life Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-ua1:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-ua1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":7,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-ua1:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('custom-serveice:motor-a-speed-rpm', '{"siid":8,"piid":1,"type":"urn:zhimi-spec:property:motor-a-speed-rpm:00000001:zhimi-ua1:1","description":"1号直流电机，每分钟转速","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-serveice:motor-b-speed-rpm', '{"siid":8,"piid":2,"type":"urn:zhimi-spec:property:motor-b-speed-rpm:00000002:zhimi-ua1:1","description":"2号直流电机，每分钟转速","format":"uint16","access":["notify","read"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('custom-serveice:motor-status', '{"siid":8,"piid":4,"type":"urn:zhimi-spec:property:motor-status:00000004:zhimi-ua1:1","description":"motor-status","format":"string","access":["notify"],"unit":"none"}');
    this.addPropertyByString('custom-serveice:temperature', '{"siid":8,"piid":5,"type":"urn:zhimi-spec:property:temperature:00000005:zhimi-ua1:1","description":"temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-40,125,0.01]}');
  }

  initDeviceActions() {
    this.addActionByString('filter:reset-filter-life', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:reset-filter-life:00002803:zhimi-ua1:1","description":"Reset Filter Life","in":[1],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom-serveice:fault', '{"siid":8,"eiid":1,"type":"urn:zhimi-spec:event:fault:00005001:zhimi-ua1:1","description":"fault","arguments":[4]}');
    this.addEventByString('custom-serveice:childlock-trigger', '{"siid":8,"eiid":2,"type":"urn:zhimi-spec:event:childlock-trigger:00005002:zhimi-ua1:1","description":"childlock-trigger","arguments":[]}');
    this.addEventByString('custom-serveice:door-opened', '{"siid":8,"eiid":3,"type":"urn:zhimi-spec:event:door-opened:00005003:zhimi-ua1:1","description":"door-opened","arguments":[]}');
    this.addEventByString('custom-serveice:filter-exhausted', '{"siid":8,"eiid":4,"type":"urn:zhimi-spec:event:filter-exhausted:00005004:zhimi-ua1:1","description":"filter-exhausted","arguments":[]}');
    this.addEventByString('custom-serveice:filter-reset', '{"siid":8,"eiid":5,"type":"urn:zhimi-spec:event:filter-reset:00005005:zhimi-ua1:1","description":"filter-reset","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  temperatureProp() {
    return this.getProperty('custom-serveice:temperature');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiAirfreshUa1;

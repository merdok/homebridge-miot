const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirfreshVa4 extends FreshAirSystemDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Fresh Air System XFXTDFR02ZM';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:zhimi-va4:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  propertiesToMonitor() {
    return [];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-fresh:00007822:zhimi-va4:1","description":"Air Fresh"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-va4:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:zhimi-va4:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zhimi-va4:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-va4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-va4:1","description":"Alarm"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-fresh:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-va4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-fresh:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:zhimi-va4:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Interval"},{"value":1,"description":"Sleep"},{"value":2,"description":"Low"},{"value":3,"description":"Medium"},{"value":4,"description":"High"},{"value":5,"description":"Auto"}]}');
    this.addPropertyByString('air-fresh:heater', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:heater:00000026:zhimi-va4:1","description":"Heater","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:air-quality-index', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:air-quality-index:0000001B:zhimi-va4:1","description":"Air Quality Index","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,600,1]}');
    this.addPropertyByString('environment:co2-density', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:co2-density:0000004B:zhimi-va4:1","description":"CO2 Density","format":"float","access":["read","notify"],"unit":"ppm","valueRange":[0,5000,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-va4:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-40,125,0.01]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-va4:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-used-time', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:filter-used-time:00000048:zhimi-va4:1","description":"Filter Used Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,10000,1]}');
    this.addPropertyByString('indicator-light:brightness', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-va4:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"High"},{"value":1,"description":"Low"},{"value":2,"description":"Idle"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-va4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-va4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
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

module.exports = ZhimiAirfreshVa4;

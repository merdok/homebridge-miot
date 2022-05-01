const ThermostatDevice = require('../ThermostatDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CubeeAirrtcTh123w extends ThermostatDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Heatcold UFH Thermostat';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:thermostat:0000A031:cubee-th123w:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:thermostat:0000784A:cubee-th123w:1","description":"Thermostat"}');
    this.createServiceByString('{"siid":4,"type":"urn:cubee-spec:service:heatold:00007801:cubee-th123w:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('thermostat:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cubee-th123w:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('thermostat:status', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:status:00000007:cubee-th123w:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"加热中"},{"value":0,"description":"未加热状态"}]}');
    this.addPropertyByString('thermostat:fault', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:fault:00000009:cubee-th123w:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"无错误"},{"value":1,"description":"传感器错误"},{"value":2,"description":"高温保护"},{"value":3,"description":"低温保护"}]}');
    this.addPropertyByString('thermostat:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:cubee-th123w:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Manual"},{"value":1,"description":"Home"},{"value":2,"description":"Away"},{"value":3,"description":"Smart"},{"value":4,"description":"Sleep"}]}');
    this.addPropertyByString('thermostat:target-temperature', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:cubee-th123w:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[0,90,1]}');
    this.addPropertyByString('thermostat:temperature', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:cubee-th123w:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('heatold:childlock', '{"siid":4,"piid":1,"type":"urn:cubee-spec:property:childlock:00000001:cubee-th123w:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('heatold:sensortype', '{"siid":4,"piid":2,"type":"urn:cubee-spec:property:sensortype:00000002:cubee-th123w:1","description":"","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""}]}');
    this.addPropertyByString('heatold:tempactivate', '{"siid":4,"piid":3,"type":"urn:cubee-spec:property:tempactivate:00000003:cubee-th123w:1","description":"","format":"uint8","access":["read","notify","write"],"valueRange":[1,9,1]}');
    this.addPropertyByString('heatold:tempcomp', '{"siid":4,"piid":4,"type":"urn:cubee-spec:property:tempcomp:00000004:cubee-th123w:1","description":"","format":"int8","access":["read","notify","write"],"valueRange":[-9,9,1]}');
    this.addPropertyByString('heatold:tempfloor', '{"siid":4,"piid":5,"type":"urn:cubee-spec:property:tempfloor:00000005:cubee-th123w:1","description":"","format":"int8","access":["read","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('heatold:maxsettemp', '{"siid":4,"piid":6,"type":"urn:cubee-spec:property:maxsettemp:00000006:cubee-th123w:1","description":"","format":"uint8","access":["read","notify"],"valueRange":[35,90,1]}');
    this.addPropertyByString('heatold:minsettemp', '{"siid":4,"piid":7,"type":"urn:cubee-spec:property:minsettemp:00000007:cubee-th123w:1","description":"","format":"uint8","access":["read","notify"],"valueRange":[0,30,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 0;
  }

  statusHeatingValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CubeeAirrtcTh123w;

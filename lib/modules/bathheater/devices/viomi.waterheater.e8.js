const BathHeaterDevice = require('../BathHeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiWaterheaterE8 extends BathHeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Viomi Water Heater';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:water-heater:0000A02A:viomi-e8:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:water-heater:0000783E:viomi-e8:1","description":"Water Heater"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('water-heater:target-temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:target-temperature:00000021:viomi-e8:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[30,75,1]}');
    this.addPropertyByString('water-heater:temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:viomi-e8:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,255,1]}');
    this.addPropertyByString('water-heater:mode', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:mode:00000008:viomi-e8:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Normal"},{"value":1,"description":"Heat"}]}');
    this.addPropertyByString('water-heater:on', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:on:00000006:viomi-e8:1","description":"Switch Status","format":"bool","access":["read","write"]}');
    this.addPropertyByString('water-heater:status', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:status:00000007:viomi-e8:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Closed"},{"value":1,"description":"Heat"},{"value":2,"description":"Keep"}]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  heatModeValue() {
    return 1;
  }

  idleModeValue() {
    return 0;
  }

  statusHeatValue() {
    return 1;
  }

  statusClosedValue() {
    return 0;
  }

  statusKeepValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  modeProp() {
    return this.getProperty('water-heater:mode');
  }

  statusProp() {
    return this.getProperty('water-heater:status');
  }

  targetTemperatureProp() {
    return this.getProperty('water-heater:target-temperature');
  }

  temperatureProp() {
    return this.getProperty('water-heater:temperature');
  }

  heatingProp() {
    return this.getProperty('water-heater:on');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ViomiWaterheaterE8;

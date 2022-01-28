const KettleDevice = require('../KettleDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiHealth_potV1 extends KettleDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Smart Multipurpose Wi-Fi Kettle';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:health-pot:0000A051:viomi-v1:1';
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
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:health-pot:00007860:viomi-v1:1","description":"Health Pot"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('health-pot:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:viomi-v1:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Delay"},{"value":3,"description":"Cooker Boiling"},{"value":4,"description":"Cooker Heating"},{"value":5,"description":"Keep Warm"},{"value":6,"description":"End"},{"value":7,"description":"Cooker Finish"}]}');
    this.addPropertyByString('health-pot:left-time', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:left-time:0000003C:viomi-v1:1","description":"Left Time","format":"uint32","access":["read","notify"],"unit":"seconds","valueRange":[0,2147483648,1]}');
    this.addPropertyByString('health-pot:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:viomi-v1:1","description":"Mode","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Custom"},{"value":11,"description":"Herbal Tea"},{"value":12,"description":"Fruit Tea"},{"value":13,"description":"Soup"},{"value":14,"description":"Medicinal Dishes"},{"value":15,"description":"Porridge"},{"value":16,"description":"Bird\'s Nest"},{"value":17,"description":"Hot Pot"},{"value":18,"description":"Boiling Water"},{"value":19,"description":"Warm Milk"},{"value":20,"description":"Hot Spring Egg"},{"value":21,"description":"Yogurt"},{"value":22,"description":"Steamed Egg"},{"value":23,"description":"Decocting Medicine"},{"value":24,"description":"Ganoderma Lucidum"},{"value":25,"description":"Disinfect"},{"value":26,"description":"Sugar Water"}]}');
    this.addPropertyByString('health-pot:temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:temperature:00000020:viomi-v1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,100,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  idleModeValue() {
    return 1;
  }

  boilWaterModeValue() {
    return 18;
  }

  statusHeatingValue() {
    return 4;
  }

  statusIdleValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  statusProp() {
    return this.getProperty('health-pot:status');
  }

  modeProp() {
    return this.getProperty('health-pot:mode');
  }

  temperatureProp() {
    return this.getProperty('health-pot:temperature');
  }

  leftTimeProp() {
    return this.getProperty('health-pot:left-time');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ViomiHealth_potV1;

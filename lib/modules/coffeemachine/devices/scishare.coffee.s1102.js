const CoffeeMachineDevice = require('../CoffeeMachineDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ScishareCoffeeS1102 extends CoffeeMachineDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Scishare Capsule Coffee Maker';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:coffee-machine:0000A049:scishare-s1102:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:coffee-machine:00007873:scishare-s1102:1","description":"Coffee Machine"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('coffee-machine:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:scishare-s1102:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Off"},{"value":2,"description":"Idle"},{"value":3,"description":"Preheating"},{"value":4,"description":"Error"},{"value":5,"description":"Busy"}]}');
    this.addPropertyByString('coffee-machine:on', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:on:00000006:scishare-s1102:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusOffValue() {
    return 1;
  }

  statusIdleValue() {
    return 2;
  }

  statusPreheatingValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusBusyValue() {
    return 5;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ScishareCoffeeS1102;

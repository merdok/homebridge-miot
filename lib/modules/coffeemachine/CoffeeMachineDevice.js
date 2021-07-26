const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Actions = require('../../constants/Actions.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CoffeeMachineDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.COFFEE_MACHINE;
  }


  /*----------========== CONFIG ==========----------*/

  statusOffValue() {
    return -1;
  }

  statusIdleValue() {
    return -1;
  }

  statusPreheatingValue() {
    return -1;
  }

  statusErrorValue() {
    return -1;
  }

  statusBusyValue() {
    return -1;
  }

  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isStatusOff() {
    return this.getStatus() === this.statusOffValue();
  }

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusPreheating() {
    return this.getStatus() === this.statusPreheatingValue();
  }

  isStatusError() {
    return this.getStatus() === this.statusErrorValue();
  }

  isStatusBusy() {
    return this.getStatus() === this.statusBusyValue();
  }

  isHeating() {
    return this.isStatusBusy();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CoffeeMachineDevice;

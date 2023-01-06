const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class CoffeeMachineDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.COFFEE_MACHINE;
  }

  getDeviceName() {
    return 'Unknown ceiling fan device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['coffee-machine:status', 'coffee-machine:on'];
  }


  /*----------========== VALUES ==========----------*/

  statusOffValue() {
    return this.getValueForStatus('Off');
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusPreheatingValue() {
    return this.getValueForStatus('Preheating');
  }

  statusErrorValue() {
    return this.getValueForStatus('Error');
  }

  statusBusyValue() {
    return this.getValueForStatus('Busy');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('coffee-machine:on');
  }

  statusProp() {
    return this.getProperty('coffee-machine:status');
  }

  //device specific


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/

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

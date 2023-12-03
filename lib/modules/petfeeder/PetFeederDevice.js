const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class PetFeederDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.PET_FEEDER;
  }

  getDeviceName() {
    return 'Unknown pet feeder device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['pet-feeder:fault'];
  }


  /*----------========== VALUES ==========----------*/

  faultNoFaultsValue() {
    return this.getValueForFault('No Faults');
  }

  faultOkValue() {
    return this.getValueForFault('OK');
  }

  faultErrorValue() {
    return this.getValueForFault('Error');
  }

  faultTimeoutValue() {
    return this.getValueForFault('Timeout');
  }

  /*----------========== PROPERTIES ==========----------*/

  //overrides
  faultProp() {
    return this.getProperty('pet-feeder:fault');
  }


  /*----------========== ACTIONS ==========----------*/

  //device specific
  petFoodOutAction() {
    this.getAction('pet-feeder:pet-food-out');
  }


  /*----------========== FEATURES ==========----------*/

  // pet food out
  supportsPetFoodOutAction() {
    return !!this.petFoodOutAction();
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  async firePetFoodOut(amount = 7) {
    return this.fireAction(this.petFoodOutAction(), [amount]); // use 7 as the default value for feeding-measure
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isFaultNoFaults() {
    return this.getFault() === this.faultNoFaultsValue();
  }

  isFaultOk() {
    return this.getFault() === this.faultOkValue();
  }

  isFaultError() {
    return this.getFault() === this.faultErrorValue();
  }

  isFaultTimeout() {
    return this.getFault() === this.faultTimeoutValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = PetFeederDevice;

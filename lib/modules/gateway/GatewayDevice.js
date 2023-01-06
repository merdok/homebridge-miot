const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class GatewayDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.GATEWAY;
  }

  getDeviceName() {
    return 'Unknown gateway device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['arming:arming-mode'];
  }


  /*----------========== VALUES ==========----------*/

  modeBasicArmingValue() {
    return this.getValueForMode('basic_arming');
  }

  modeHomeArmingValue() {
    return this.getValueForMode('home_arming');
  }

  modeAwayArmingValue() {
    return this.getValueForMode('away_arming');
  }

  modeSleepArmingValue() {
    return this.getValueForMode('sleep_arming');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  modeProp() {
    return this.getProperty('arming:arming-mode');
  }


  //device specific


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isBasicArming() {
    return this.getMode() === this.modeBasicArmingValue();
  }

  isHomeArming() {
    return this.getMode() === this.modeHomeArmingValue();
  }

  isAwayArming() {
    return this.getMode() === this.modeAwayArmingValue();
  }

  isSleepArming() {
    return this.getMode() === this.modeSleepArmingValue();
  }

  setBasicArming() {
    this.setMode(this.modeBasicArmingValue());
  }

  setHomeArming() {
    this.setMode(this.modeHomeArmingValue());
  }

  setAwayArming() {
    this.setMode(this.modeAwayArmingValue());
  }

  setSleepArming() {
    this.setMode(this.modeSleepArmingValue());
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = GatewayDevice;

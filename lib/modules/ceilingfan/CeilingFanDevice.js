const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CeilingFanDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.CEILING_FAN;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // light
  hasBuiltInLight() {
    return this.hasProperty(Properties.LIGHT_POWER);
  }

  // light power off timer
  supportsLightPowerOffTimer() {
    return this.hasProperty(Properties.LIGHT_POWER_OFF_TIME);
  }

  lightPowerOffTimerUnit() {
    return this.supportsPowerOffTimer() ? this.properties[Properties.LIGHT_POWER_OFF_TIME].getUnit() : PropUnit.MINUTES;
  }

  lightPowerOffTimerRange() {
    return this.getPropertyValueRange(Properties.LIGHT_POWER_OFF_TIME);
  }

  // light modes
  supportsLightModes() {
    return this.hasProperty(Properties.LIGHT_MODE);
  }


  /*----------========== GETTERS ==========----------*/

  isLightOn() {
    if (this.hasBuiltInLight()) {
      return this.getPropertyValue(Properties.LIGHT_POWER);
    }
    return false;
  }

  getLightMode() {
    return this.getPropertyValue(Properties.LIGHT_MODE);
  }

  getLightShutdownTimer() {
    let value = this.getPropertyValue(Properties.LIGHT_POWER_OFF_TIME);
    value = this.convertToMinutes(value, this.lightPowerOffTimerUnit());
    return value;
  }


  /*----------========== SETTERS ==========----------*/

  async setLightOn(value) {
    this.setPropertyValue(Properties.LIGHT_POWER, value);
  }

  async setLightMode(lightMode) {
    return this.setPropertyValue(Properties.LIGHT_MODE, lightMode);
  }

  async setLightShutdownTimer(minutes) {
    let value = this.convertMinutesToUnit(minutes, this.lightPowerOffTimerUnit());
    this.setPropertyValue(Properties.LIGHT_POWER_OFF_TIME, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isLightShutdownTimerEnabled() {
    return this.getLightShutdownTimer() > 0;
  }

  turnLightOnIfNecessary() {
    // if the light is turned off then turn it on
    if (this.isLightOn() === false) {
      this.setLightOn(true);
    }
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CeilingFanDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class BathHeaterDevice extends BaseDevice {
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
    return DevTypes.BATH_HEATER;
  }


  /*----------========== CONFIG ==========----------*/

  modeIdleValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // light
  hasBuiltInLight() {
    return this.hasProperty(Properties.LIGHT_POWER);
  }

  // light modes
  supportsLightModes() {
    return this.hasProperty(Properties.LIGHT_MODE);
  }

  lightModes() {
    return this.getPropertyValueList(Properties.LIGHT_MODE);
  }

  // heating
  supportsHeating() {
    return this.hasProperty(Properties.HEATING);
  }

  // blow
  supportsBlow() {
    return this.hasProperty(Properties.BLOW);
  }

  // ventilation
  supportsVentilation() {
    return this.hasProperty(Properties.VENTILATION);
  }

  // target temperature
  supportsTargetTemperature() {
    return this.hasProperty(Properties.TARGET_TEMPERATURE);
  }

  targetTemperatureRange() {
    let range = this.getPropertyValueRange(Properties.TARGET_TEMPERATURE);
    return (range.length > 2) ? range : [10, 35, 1];
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

  getTargetTemperature() {
    return this.getSafePropertyValue(Properties.TARGET_TEMPERATURE);
  }

  isHeating() {
    return this.getPropertyValue(Properties.HEATING);
  }

  isBlow() {
    return this.getPropertyValue(Properties.BLOW);
  }

  isVentilation() {
    return this.getPropertyValue(Properties.VENTILATION);
  }


  /*----------========== SETTERS ==========----------*/

  async setLightOn(value) {
    this.setPropertyValue(Properties.LIGHT_POWER, value);
  }

  async setLightMode(lightMode) {
    return this.setPropertyValue(Properties.LIGHT_MODE, lightMode);
  }

  async setTargetTemperature(targetTemp) {
    this.setPropertyValue(Properties.TARGET_TEMPERATURE, targetTemp);
  }

  async setHeating(value) {
    this.setPropertyValue(Properties.HEATING, value);
  }

  async setBlow(value) {
    this.setPropertyValue(Properties.BLOW, value);
  }

  async setVentilation(value) {
    this.setPropertyValue(Properties.VENTILATION, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  turnLightOnIfNecessary() {
    // if the light is turned off then turn it on
    if (this.isLightOn() === false) {
      this.setLightOn(true);
    }
  }

  startHeatingIfNecessary() {
    // if the light is turned off then turn it on
    if (this.isHeating() === false) {
      this.setHeating(true);
    }
  }

  isIdle() {
    return this.getMode() === this.modeIdleValue();
  }



  /*----------========== HELPERS ==========----------*/


}

module.exports = BathHeaterDevice;

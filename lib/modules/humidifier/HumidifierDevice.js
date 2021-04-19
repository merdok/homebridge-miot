const BaseDevice = require('../../base/BaseDevice.js');
const HumidifierCapabilities = require('./HumidifierCapabilities.js');
const HumidifierProperties = require('./HumidifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // log the total use time if the device supports it
    if (this.supportsPowerTimeReporting()) {
      this.logger.info(`Device power time: ${this.getPowerTime()} minutes.`);
    }
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.HUMIDIFIER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // target humidity
  supportsTargetHumidity() {
    return this.hasProperty(HumidifierProperties.TARGET_HUMIDITY);
  }

  targetHumidityRange() {
    return this.getPropertyValueRange(HumidifierProperties.TARGET_HUMIDITY);
  }

  //water level
  supportsWaterLevelReporting() {
    return this.hasProperty(HumidifierProperties.WATER_LEVEL);
  }

  waterLevelRange() {
    return this.getPropertyValueRange(HumidifierProperties.WATER_LEVEL);
  }

  //dry
  supportsDry() {
    return this.hasProperty(HumidifierProperties.DRY);
  }

  //screen
  screenBrightnessLevels() {
    return this.getPropertyValueList(HumidifierProperties.SCREEN);
  }

  supportsScreenBrightnessLevels() {
    return this.screenBrightnessLevels().length > 0;
  }

  //temperature in fahrenheit
  supportsTemperatureInFahrenheitReporting() {
    return this.hasProperty(HumidifierProperties.TEMPERATURE_FAHRENHEIT);
  }

  //actual speed
  supportsActualSpeedReporting() {
    return this.hasProperty(HumidifierProperties.ACTUAL_SPEED);
  }

  //power time
  supportsPowerTimeReporting() {
    return this.hasProperty(HumidifierProperties.POWER_TIME);
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getSafePropertyValue(HumidifierProperties.TARGET_HUMIDITY);
  }

  isDryEnabled() {
    return this.getPropertyValue(HumidifierProperties.DRY);
  }

  getScreenLevel() {
    return this.getPropertyValue(HumidifierProperties.SCREEN);
  }

  getWaterLevel() {
    return this.getPropertyValue(HumidifierProperties.WATER_LEVEL);
  }

  getWaterLevelPercentage() {
    return this.convertPropValueToPercentage(HumidifierProperties.WATER_LEVEL);
  }

  getTemperatureFahrenheit() {
    return this.getPropertyValue(HumidifierProperties.TEMPERATURE_FAHRENHEIT);
  }

  getActualSpeed() {
    return this.getPropertyValue(HumidifierProperties.ACTUAL_SPEED);
  }

  getPowerTime() {
    return this.getPropertyValue(HumidifierProperties.POWER_TIME);
  }

  isHumidifying() {
    return this.isPowerOn();
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(targetHumidity) {
    this.setPropertyValue(HumidifierProperties.TARGET_HUMIDITY, targetHumidity);
  }

  async setDryEnabled(enabled) {
    this.setPropertyValue(HumidifierProperties.DRY, enabled);
  }

  async setScreenLevel(level) {
    this.setPropertyValue(HumidifierProperties.SCREEN, level);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = HumidifierDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const HumidifierProperties = require('./HumidifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
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


  /*----------========== CONFIG ==========----------*/

  targetHumidityMinVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[0];
    }
    return 0;
  }

  targetHumidityMaxVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[1];
    }
    return 100;
  }

  targetHumidityStepVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[2];
    }
    return 1;
  }


  /*----------========== FEATURES ==========----------*/

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

  powerTimeUnit() {
    return this.supportsPowerTimeReporting() ? this.properties[HumidifierProperties.POWER_TIME].getUnit() : PropUnit.MINUTES;
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
    let value = this.getPropertyValue(HumidifierProperties.POWER_TIME);
    value = this.convertToMinutes(value, this.powerTimeUnit());
    return value;
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

  isHumidifying() {
    return this.isPowerOn();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HumidifierDevice;

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
  supportsDryMode() {
    return this.hasProperty(HumidifierProperties.DRY_MODE);
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

  isAutoMode() {
    if (this.supportsFanLevels() && this.getFanLevel() === 0) {
      return true;
    }
    return false;
  }

  getTargetHumidity() {
    return this.getPropertyValue(HumidifierProperties.TARGET_HUMIDITY);
  }

  isDryEnabled() {
    return this.getPropertyValue(HumidifierProperties.DRY_MODE);
  }

  getScreenLevel() {
    return this.getPropertyValue(HumidifierProperties.SCREEN);
  }

  getWaterLevel() {
    return this.getPropertyValue(HumidifierProperties.WATER_LEVEL);
  }

  getWaterLevelPercentage() {
    return this.convertWaterLevelToPercentage(this.getWaterLevel());
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

  async setAutoModeEnabled(enabled) {
    let level = enabled ? 0 : 1;
    if (this.supportsFanLevels()) {
      this.setFanLevel(0);
    }
  }

  async setTargetHumidity(targetHumidity) {
    this.setPropertyValue(HumidifierProperties.TARGET_HUMIDITY, targetHumidity);
  }

  async setDryModeEnabled(enabled) {
    this.setPropertyValue(HumidifierProperties.DRY_MODE, enabled);
  }

  async setScreenLevel(level) {
    this.setPropertyValue(HumidifierProperties.SCREEN, level);
  }



  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/

  convertWaterLevelToPercentage(waterLevel) {
    if (this.supportsWaterLevelReporting() && this.waterLevelRange().length > 1) {
      let from = this.waterLevelRange()[0];
      let to = this.waterLevelRange()[1];
      let waterLevelPercentage = (((waterLevel - from) * 100) / to - from);
      return waterLevelPercentage;
    }
    return waterLevel;
  }

  convertPercentageToWaterLevel(waterLevelPercentage) {
    if (this.supportsWaterLevelReporting() && this.waterLevelRange().length > 1) {
      let from = this.waterLevelRange()[0];
      let to = this.waterLevelRange()[1];
      let waterLevel = (waterLevelPercentage * (to - from) / 100) + from;
      return waterLevel;
    }
    return waterLevel;
  }


}

module.exports = HumidifierDevice;

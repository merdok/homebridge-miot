const GenericDevice = require('../generic/GenericDevice.js');
const HumidifierCapabilities = require('./HumidifierCapabilities.js');
const HumidifierProperties = require('./HumidifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierDevice extends GenericDevice {
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

  // speed
  supportsSteplessFanSpeed() {
    return this.hasProperty(HumidifierProperties.FAN_SPEED); // free speed selection from 0% to 100%
  }

  // fan levels
  fanLevels() {
    return this.getPropertyValueList(HumidifierProperties.FAN_LEVEL);
  }

  supportsFanLevels() {
    return this.fanLevels().length > 0;
  }

  // target humidity
  supportsTargetHumidity() {
    return this.hasProperty(HumidifierProperties.TARGET_HUMIDITY); // whether a target humidity can be set
  }

  targetHumidityRange() {
    return this.getPropertyValueRange(HumidifierProperties.TARGET_HUMIDITY);
  }

  //water level
  supportsWaterLevelReporting() {
    return this.hasProperty(HumidifierProperties.WATER_LEVEL); // whether water level is reporting
  }

  waterLevelRange() {
    return this.getPropertyValueRange(HumidifierProperties.WATER_LEVEL);
  }

  //dry
  supportsDryMode() {
    return this.hasProperty(HumidifierProperties.DRY_MODE); // whether the humidifier should run without water?
  }

  //screen
  supportsScreenDimControl() {
    return this.hasProperty(HumidifierProperties.SCREEN); // whether the screen can be dimmed
  }

  //temperature in fahrenheit
  supportsTemperatureInFahrenheitReporting() {
    return this.hasProperty(HumidifierProperties.TEMPERATURE_FAHRENHEIT); // whether the temperature can be retrieved in fahrenheit
  }

  //actual speed
  supportsActualSpeedReporting() {
    return this.hasProperty(HumidifierProperties.ACTUAL_SPEED); // whether the actual speed can be reported
  }

  //power time
  supportsPowerTimeReporting() {
    return this.hasProperty(HumidifierProperties.POWER_TIME); // whether the power time can be reported
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/

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


  /*----------========== STATUS ==========----------*/

  getRotationSpeed() {
    return this.getPropertyValue(HumidifierProperties.FAN_SPEED);
  }

  getFanLevel() {
    return this.getPropertyValue(HumidifierProperties.FAN_LEVEL);
  }

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

  isScreenDark() {
    return this.getScreenDimLevel() === 0;
  }

  getScreenDimLevel() {
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


  /*----------========== COMMANDS ==========----------*/

  async setRotationSpeed(speed) {
    this.setPropertyValue(HumidifierProperties.FAN_SPEED, speed);
  }

  async setFanLevel(level) {
    this.setPropertyValue(HumidifierProperties.FAN_LEVEL, level);
  }

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

  async setScreenDark(dark) {
    let level = dark ? 0 : 2;
    this.setScreenLevel(level);
  }

  async setScreenLevel(level) {
    this.setPropertyValue(HumidifierProperties.SCREEN, level);
  }



  /*----------========== HELPERS ==========----------*/


}

module.exports = HumidifierDevice;

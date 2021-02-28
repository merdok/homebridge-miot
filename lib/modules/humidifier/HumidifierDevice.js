const MiotDevice = require('../../MiotDevice.js');
const HumidifierCapabilities = require('./HumidifierCapabilities.js');
const HumidifierProperties = require('./HumidifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierDevice extends MiotDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }

  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // log the humidifier total use time if the fan supports it
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Device total use time: ${this.getUseTime()} minutes.`);
    }
  }

  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.HUMIDIFIER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // speed
  supportsSteplessFanSpeed() {
    return this.properties[HumidifierProperties.FAN_SPEED] !== undefined; // free speed selection from 0% to 100%
  }

  // fan levels
  supportsFanLevels() {
    return this.capabilities[HumidifierCapabilities.FAN_LEVELS] !== undefined ? true : false; // preconfigured fan levels which can be set
  }

  fanLevels() {
    return this.capabilities[HumidifierCapabilities.FAN_LEVELS] || 0; // how many fan levels
  }

  // target humidity
  supportsTargetHumidity() {
    return this.properties[HumidifierProperties.TARGET_HUMIDITY] || false; // whether a target humidity can be set
  }

  targetHumidityRange() {
    return this.capabilities[HumidifierCapabilities.TARGET_HUMIDITY_RANGE] || []; // range for the target humidity
  }

  //water level
  supportsWaterLevelReporting() {
    return this.properties[HumidifierProperties.WATER_LEVEL] !== undefined; // whether water level is reporting
  }

  waterLevelRange() {
    return this.properties[HumidifierCapabilities.WATER_LEVEL_RANGE] || []; // whether water level is reporting
  }

  //dry
  supportsDryMode() {
    return this.properties[HumidifierProperties.DRY_MODE] !== undefined; // whether the humidifier should run without water?
  }

  //screen
  supportsScreenDimControl() {
    return this.properties[HumidifierProperties.SCREEN] !== undefined; // whether the screen can be dimmed
  }

  //temperature in fahrenheit
  supportsTemperatureInFahrenheitReporting() {
    return this.properties[HumidifierProperties.TEMPERATURE_FAHRENHEIT] !== undefined; // whether the temperature can be retrieved in fahrenheit
  }

  //actual speed
  supportsActualSpeedReporting() {
    return this.properties[HumidifierProperties.ACTUAL_SPEED] !== undefined; // whether the actual speed can be reported
  }

  //power time
  supportsPowerTimeReporting() {
    return this.properties[HumidifierProperties.POWER_TIME] !== undefined; // whether the power time can be reported
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/

  adjustTargetHumidityToRange(hum) {
    if (this.supportsTargetHumidity() && this.targetHumidityRange().length > 1) {
      let low = this.targetHumidityRange()[0];
      let high = this.targetHumidityRange()[1];
      if (hum > high) hum = high;
      if (hum < low) hum = low;
      return hum;
    }
    return hum;
  }

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

  getPowertime() {
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

  async setTargetHumidity(humidity) {
    let targetHum = this.adjustTargetHumidityToRange(humidity)
    this.setPropertyValue(HumidifierProperties.TARGET_HUMIDITY, targetHum);
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

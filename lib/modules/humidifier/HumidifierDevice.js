const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../Properties.js');
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
    return this.hasProperty(Properties.TARGET_HUMIDITY);
  }

  targetHumidityRange() {
    return this.getPropertyValueRange(Properties.TARGET_HUMIDITY);
  }

  //water level
  supportsWaterLevelReporting() {
    return this.hasProperty(Properties.WATER_LEVEL);
  }

  waterLevelRange() {
    return this.getPropertyValueRange(Properties.WATER_LEVEL);
  }

  //dry
  supportsDry() {
    return this.hasProperty(Properties.DRY);
  }

  //screen
  screenBrightnessLevels() {
    return this.getPropertyValueList(Properties.SCREEN);
  }

  supportsScreenBrightnessLevels() {
    return this.screenBrightnessLevels().length > 0;
  }

  //temperature in fahrenheit
  supportsTemperatureInFahrenheitReporting() {
    return this.hasProperty(Properties.TEMPERATURE_FAHRENHEIT);
  }

  //actual speed
  supportsActualSpeedReporting() {
    return this.hasProperty(Properties.ACTUAL_SPEED);
  }

  //power time
  supportsPowerTimeReporting() {
    return this.hasProperty(Properties.POWER_TIME);
  }

  powerTimeUnit() {
    return this.supportsPowerTimeReporting() ? this.properties[Properties.POWER_TIME].getUnit() : PropUnit.MINUTES;
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getSafePropertyValue(Properties.TARGET_HUMIDITY);
  }

  isDryEnabled() {
    return this.getPropertyValue(Properties.DRY);
  }

  getScreenLevel() {
    return this.getPropertyValue(Properties.SCREEN);
  }

  getWaterLevel() {
    return this.getPropertyValue(Properties.WATER_LEVEL);
  }

  getWaterLevelPercentage() {
    return this.convertPropValueToPercentage(Properties.WATER_LEVEL);
  }

  getTemperatureFahrenheit() {
    return this.getPropertyValue(Properties.TEMPERATURE_FAHRENHEIT);
  }

  getActualSpeed() {
    return this.getPropertyValue(Properties.ACTUAL_SPEED);
  }

  getPowerTime() {
    let value = this.getPropertyValue(Properties.POWER_TIME);
    value = this.convertToMinutes(value, this.powerTimeUnit());
    return value;
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(targetHumidity) {
    this.setPropertyValue(Properties.TARGET_HUMIDITY, targetHumidity);
  }

  async setDryEnabled(enabled) {
    this.setPropertyValue(Properties.DRY, enabled);
  }

  async setScreenLevel(level) {
    this.setPropertyValue(Properties.SCREEN, level);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isHumidifying() {
    return this.isPowerOn();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HumidifierDevice;

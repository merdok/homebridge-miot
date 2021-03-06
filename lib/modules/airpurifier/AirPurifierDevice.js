const MiotDevice = require('../../MiotDevice.js');
const AirPurifierCapabilities = require('./AirPurifierCapabilities.js');
const AirPurifierProperties = require('./AirPurifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierDevice extends MiotDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }

  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // log the the filter life level when supported
    if (this.supportsFilterLifeLevelReporting()) {
      this.logger.info(`Filter life level: ${this.getFilterLifeLevel()}%.`);
    }
    // log the the filter used time when supported
    if (this.supportsFilterUsedTimeReporting()) {
      this.logger.info(`Filter used time: ${this.getFilterUsedTime()} hours.`);
    }
  }

  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.AIR_PURIFIER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  supportsAutoMode() {
    return this.capabilities[AirPurifierCapabilities.AUTO_MODE_VALUE] !== undefined ? true : false;
  }

  supportsSleepMode() {
    return this.capabilities[AirPurifierCapabilities.SLEEP_MODE_VALUE] !== undefined ? true : false;
  }

  supportsFavoriteMode() {
    return this.capabilities[AirPurifierCapabilities.FAVORITE_MODE_VALUE] !== undefined ? true : false;
  }

  supportsFavoriteSpeed() {
    return this.properties[AirPurifierProperties.FAVORITE_SPEED] !== undefined;
  }

  favoriteSpeedRange() {
    return this.capabilities[AirPurifierCapabilities.FAVORITE_SPEED_RANGE] || [];
  }

  ledBrightnessRange() {
    return this.capabilities[AirPurifierCapabilities.LIGHT_BRIGHTNESS_RANGE] || [];
  }

  supportsLedBrightnesssRange() {
    return this.ledBrightnessRange().length > 0 ? false : true;
  }

  supportsPm25DensityReporting() {
    return this.properties[AirPurifierProperties.PM25_DENSITY] !== undefined;
  }

  supportsFilterLifeLevelReporting() {
    return this.properties[AirPurifierProperties.FILTER_LIFE_LEVEL] !== undefined;
  }

  supportsFilterUsedTimeReporting() {
    return this.properties[AirPurifierProperties.FILTER_USED_TIME] !== undefined;
  }

  supportsFanSpeedRpmReporting() {
    return this.properties[AirPurifierProperties.FAN_SPEED_RPM] !== undefined;
  }

  /*----------========== CAPABILITY HELPERS ==========----------*/


  /*----------========== STATUS ==========----------*/

  getFanLevel() {
    return this.getPropertyValue(AirPurifierProperties.FAN_LEVEL);
  }

  supportsFanLevels() {
    return this.capabilities[AirPurifierCapabilities.FAN_LEVELS] !== undefined ? true : false;
  }

  fanLevels() {
    return this.capabilities[AirPurifierCapabilities.FAN_LEVELS] || 0;
  }

  getMode() {
    return this.getPropertyValue(AirPurifierProperties.MODE);
  }

  isAutoModeEnabled() {
    if (this.supportsAutoMode()) {
      return this.getMode() === AirPurifierCapabilities.AUTO_MODE_VALUE;
    }
    return false;
  }

  isSleepModeEnabled() {
    if (this.supportsSleepMode()) {
      return this.getMode() === AirPurifierCapabilities.SLEEP_MODE_VALUE;
    }
    return false;
  }

  isFavoriteModeEnabled() {
    if (this.supportsFavoriteMode()) {
      return this.getMode() === AirPurifierCapabilities.FAVORITE_MODE_VALUE;
    }
    return false;
  }

  getFavoriteSpeed() {
    let favSpeedVal = this.getPropertyValue(AirPurifierProperties.FAVORITE_SPEED);
    // calulcate percentage if range specified
    if (this.favoriteSpeedRange().length > 0) {
      let min = this.favoriteSpeedRange()[0];
      let max = this.favoriteSpeedRange()[1];
      let favSpeedPercentage = ((favSpeedVal - min) * 100) / (max - min)
      return favSpeedPercentage;
    }
    return favoriteSpeedVal;
  }

  getPm25Density() {
    return this.getPropertyValue(AirPurifierProperties.PM25_DENSITY);
  }

  getFilterLifeLevel() {
    return this.getPropertyValue(AirPurifierProperties.FILTER_LIFE_LEVEL);
  }

  getFilterUsedTime() {
    return this.getPropertyValue(AirPurifierProperties.FILTER_USED_TIME);
  }

  getFanSpeedRpm() {
    return this.getPropertyValue(AirPurifierProperties.FAN_SPEED_RPM);
  }

  // override
  isLedEnabled() {
    if (this.supportsLedBrightnesssRange()) {
      let levels = this.ledBrightnessRange();
      let numOfLevels = levels.length;
      return this.getPropertyValue(AirPurifierProperties.LIGHT) !== levels[numOfLevels - 1]; // last one is usually off
    }
    return this.getPropertyValue(AirPurifierProperties.LIGHT);
  }


  /*----------========== COMMANDS ==========----------*/

  async setFanLevel(level) {
    this.setPropertyValue(AirPurifierProperties.FAN_LEVEL, level);
  }

  async setMode(mode) {
    this.setPropertyValue(AirPurifierProperties.MODE, mode);
  }

  async enableAutoMode() {
    if (this.supportsAutoMode()) {
      this.setMode(AirPurifierCapabilities.AUTO_MODE_VALUE);
    }
  }

  async enableSleepMode() {
    if (this.supportsSleepMode()) {
      this.setMode(AirPurifierCapabilities.SLEEP_MODE_VALUE);
    }
  }

  async enableFavoriteMode() {
    if (this.supportsFavoriteMode()) {
      this.setMode(AirPurifierCapabilities.FAVORITE_MODE_VALUE);
    }
  }

  async setFavoriteSpeed(speedPercent) {
    let favSpeedVal = speedPercent; // speed comes in percent
    // calulcate percentage if range specified
    if (this.favoriteSpeedRange().length > 0) {
      let min = this.favoriteSpeedRange()[0];
      let max = this.favoriteSpeedRange()[1];
      favSpeedVal = (speedPercent * (max - min) / 100) + min;
    }
    this.setPropertyValue(AirPurifierProperties.FAVORITE_SPEED, favSpeedVal);
  }

  // override
  async setLedEnabled(enabled) {
    if (this.supportsLedBrightnesssRange()) {
      let levels = this.ledBrightnessRange();
      let numOfLevels = levels.length;
      let level = 0; // first one is usually full brightness
      if (enabled === false) {
        level = levels[numOfLevels - 1]; // last one is usually off
      }
      this.setPropertyValue(AirPurifierProperties.LIGHT, level);
    }
    this.setPropertyValue(AirPurifierProperties.LIGHT, enabled);
  }

  /*----------========== HELPERS ==========----------*/


}

module.exports = AirPurifierDevice;

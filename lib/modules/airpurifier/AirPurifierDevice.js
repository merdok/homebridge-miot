const GenericDevice = require('../generic/GenericDevice.js');
const AirPurifierCapabilities = require('./AirPurifierCapabilities.js');
const AirPurifierProperties = require('./AirPurifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierDevice extends GenericDevice {
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

  // fan levels
  fanLevels() {
    return this.capabilities[AirPurifierCapabilities.FAN_LEVELS] || 0;
  }

  supportsFanLevels() {
    return this.fanLevels() !== 0;
  }

  // modes
  autoModeValue() {
    return this.capabilities[AirPurifierCapabilities.AUTO_MODE_VALUE];
  }

  supportsAutoMode() {
    return this.autoModeValue() !== undefined;
  }

  sleepModeValue() {
    return this.capabilities[AirPurifierCapabilities.SLEEP_MODE_VALUE];
  }

  supportsSleepMode() {
    return this.sleepModeValue() !== undefined;
  }

  favoriteModeValue() {
    return this.capabilities[AirPurifierCapabilities.FAVORITE_MODE_VALUE];
  }

  supportsFavoriteMode() {
    return this.favoriteModeValue() !== undefined;
  }

  // facvorite speed
  supportsFavoriteSpeed() {
    return this.supportsFavoriteMode() && this.hasProperty(AirPurifierProperties.FAVORITE_SPEED);
  }

  favoriteSpeedRange() {
    return this.getPropertyValueRange(AirPurifierProperties.FAVORITE_SPEED);
  }

  supportsFavoriteSpeedRange() {
    return this.favoriteSpeedRange().length > 2;
  }

  // status
  supportsPm25DensityReporting() {
    return this.hasProperty(AirPurifierProperties.PM25_DENSITY);
  }

  supportsFilterLifeLevelReporting() {
    return this.hasProperty(AirPurifierProperties.FILTER_LIFE_LEVEL);
  }

  supportsFilterUsedTimeReporting() {
    return this.hasProperty(AirPurifierProperties.FILTER_USED_TIME);
  }

  supportsFanSpeedRpmReporting() {
    return this.hasProperty(AirPurifierProperties.FAN_SPEED_RPM);
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/


  /*----------========== STATUS ==========----------*/

  getFanLevel() {
    return this.getPropertyValue(AirPurifierProperties.FAN_LEVEL);
  }

  getMode() {
    // mode is int so try to parse it to an integer to make sure we have the correct type
    let mode = this.getPropertyValue(AirPurifierProperties.MODE);
    if (parseInt(mode)) {
      return parseInt(mode)
    }
    return mode;
  }

  isAutoModeEnabled() {
    if (this.supportsAutoMode()) {
      return this.getMode() === this.autoModeValue();
    }
    return false;
  }

  isSleepModeEnabled() {
    if (this.supportsSleepMode()) {
      return this.getMode() === this.sleepModeValue();
    }
    return false;
  }

  isFavoriteModeEnabled() {
    if (this.supportsFavoriteMode()) {
      return this.getMode() === this.favoriteModeValue();
    }
    return false;
  }

  getFavoriteSpeed() {
    let favSpeedVal = this.getSafePropertyValue(AirPurifierProperties.FAVORITE_SPEED);
    // calulcate percentage if range specified
    if (this.favoriteSpeedRange().length > 1) {
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

  isIdle() {
    if (this.supportsFanSpeedRpmReporting() && this.getFanSpeedRpm() === 0) {
      return true;
    }
    return false;
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
      this.setMode(this.autoModeValue());
    }
  }

  async enableSleepMode() {
    if (this.supportsSleepMode()) {
      this.setMode(this.sleepModeValue());
    }
  }

  async enableFavoriteMode() {
    if (this.supportsFavoriteMode()) {
      this.setMode(this.favoriteModeValue());
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


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirPurifierDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const AirPurifierProperties = require('./AirPurifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // log the the filter life level when supported
    if (this.supportsFilterLifeLevelReporting()) {
      this.logger.info(`Filter life level: ${this.getFilterLifeLevel()}%.`);
    }
    // log the the filter used time when supported
    if (this.supportsFilterUsedTimeReporting()) {
      this.logger.info(`Filter used time: ${this.getFilterUsedTime()} hours.`);
    }
    // log the the filter left time when supported
    if (this.supportsFilterLeftTimeReporting()) {
      this.logger.info(`Filter left time: ${this.getFilterLeftTime()} hours.`);
    }
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.AIR_PURIFIER;
  }


  /*----------========== CONFIG ==========----------*/

  autoModeValue() {
    return -1;
  }

  sleepModeValue() {
    return -1;
  }

  favoriteModeValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // modes
  supportsAutoMode() {
    return this.supportsModes() && this.autoModeValue() !== -1;
  }

  supportsSleepMode() {
    return this.supportsModes() && this.sleepModeValue() !== -1;
  }

  supportsFavoriteMode() {
    return this.supportsModes() && this.favoriteModeValue() !== -1;
  }

  // favorite speed
  supportsFavoriteSpeed() {
    return this.supportsFavoriteMode() && this.hasProperty(AirPurifierProperties.FAVORITE_SPEED) && this.getProperty(AirPurifierProperties.FAVORITE_SPEED).isWritable();
  }

  favoriteSpeedRange() {
    return this.getPropertyValueRange(AirPurifierProperties.FAVORITE_SPEED);
  }

  supportsFavoriteSpeedRange() {
    return this.supportsFavoriteSpeed() && this.favoriteSpeedRange().length > 2;
  }

  // favorite levels
  supportsFavoriteLevel() {
    return this.supportsFavoriteMode() && this.hasProperty(AirPurifierProperties.FAVORITE_LEVEL) && this.getProperty(AirPurifierProperties.FAVORITE_LEVEL).isWritable();
  }

  favoriteLevelsRange() {
    return this.getPropertyValueRange(AirPurifierProperties.FAVORITE_LEVEL);
  }

  supportsFavoriteLevelsRange() {
    return this.supportsFavoriteLevel() && this.favoriteLevelsRange().length > 0;
  }

  //favorite speed control
  supportsFavoriteSpeedControl() {
    return this.supportsFavoriteSpeed() || this.supportsFavoriteLevel();
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

  supportsFilterLeftTimeReporting() {
    return this.hasProperty(AirPurifierProperties.FILTER_LEFT_TIME);
  }


  /*----------========== GETTERS ==========----------*/

  getFavoriteLevel() {
    return this.getPropertyValue(AirPurifierProperties.FAVORITE_LEVEL);
  }

  getFavoriteSpeed() {
    return this.getSafePropertyValue(AirPurifierProperties.FAVORITE_SPEED);
  }

  getFavoriteSpeedPercentage() {
    if (this.supportsFavoriteLevelsRange()) {
      return this.convertPropValueToPercentage(AirPurifierProperties.FAVORITE_LEVEL);
    } else if (this.supportsFavoriteSpeedRange()) {
      return this.convertPropValueToPercentage(AirPurifierProperties.FAVORITE_SPEED);
    }
    return this.getFavoriteSpeed();
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

  getFilterLeftTime() {
    return this.getPropertyValue(AirPurifierProperties.FILTER_LEFT_TIME);
  }


  /*----------========== SETTERS ==========----------*/

  async setFavoriteLevel(level) {
    this.setPropertyValue(AirPurifierProperties.FAVORITE_LEVEL, level);
  }

  async setFavoriteSpeed(speed) {
    this.setPropertyValue(AirPurifierProperties.FAVORITE_SPEED, speed);
  }

  async setFavoriteSpeedPercentage(percentage) {
    if (this.supportsFavoriteLevelsRange()) {
      this.setFavoriteLevel(this.convertPercentageToPropValue(percentage, AirPurifierProperties.FAVORITE_LEVEL));
    } else if (this.supportsFavoriteSpeedRange()) {
      this.setFavoriteSpeed(this.convertPercentageToPropValue(percentage, AirPurifierProperties.FAVORITE_SPEED));
    } else {
      this.setFavoriteSpeed(percentage);
    }
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

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

  getFavoriteSpeedValue() {
    if (this.supportsFavoriteLevelsRange()) {
      return this.getFavoriteLevel();
    }
    return this.getFavoriteSpeed();
  }

  async setFavoriteSpeedValue(value) {
    if (this.supportsFavoriteLevelsRange()) {
      this.setFavoriteLevel(value);
    } else {
      this.setFavoriteSpeed(value);
    }
  }

  isIdle() {
    if (this.supportsFanSpeedRpmReporting() && this.getFanSpeedRpm() === 0) {
      return true;
    }
    return false;
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirPurifierDevice;

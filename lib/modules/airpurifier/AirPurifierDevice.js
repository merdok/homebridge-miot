const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class AirPurifierDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

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


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.AIR_PURIFIER;
  }

  getDeviceName() {
    return 'Unknown air purifier device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['air-purifier:on', 'air-purifier:mode', 'air-purifier:fault', 'air-purifier:fan-level',
      'air-purifier:anion', 'screen:brightness', 'custom-service:favorite-speed', 'environment:air-quality',
      'environment:pm2.5-density', 'environment:relative-humidity', 'environment:temperature', 'environment:tvoc-density',
      'filter:filter-life-level', 'filter:filter-used-time', 'filter:filter-left-time', 'alarm:alarm',
      'indicator-light:on', 'indicator-light:brightness', 'physical-controls-locked:physical-controls-locked', 'motor-speed:favorite-level',
      'motor-speed:motor-speed', 'environment:indoor-temperature', 'custom:childlock', 'custom-service:moto-speed-rpm',
      'custom-service:favorite-level', 'air-purifier-favorite:fan-level'
    ];
  }


  /*----------========== VALUES ==========----------*/

  autoModeValue() {
    return this.getValueForMode('Auto');
  }

  sleepModeValue() {
    return this.getValueForMode('Sleep');
  }

  favoriteModeValue() {
    return this.getValueForMode('Favorite');
  }

  manualModeValue() {
    return this.getValueForMode('Manual');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('air-purifier:on');
  }

  modeProp() {
    return this.getProperty('air-purifier:mode');
  }

  faultProp() {
    return this.getProperty('air-purifier:fault');
  }

  fanLevelProp() {
    return this.getProperty('air-purifier:fan-level');
  }

  speedNowProp() {
    return this.getProperty('motor-speed:motor-speed');
  }

  anionProp() {
    return this.getProperty('air-purifier:anion');
  }

  //device specific
  screenBrightnessProp() {
    return this.getProperty('screen:brightness');
  }

  favoriteSpeedProp() {
    return this.getProperty('custom-service:favorite-speed');
  }

  favoriteLevelProp() {
    return this.getProperty('motor-speed:favorite-level');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // favorite speed
  supportsFavoriteSpeed() {
    return !!this.favoriteSpeedProp() && this.favoriteSpeedProp().isWritable();
  }

  favoriteSpeedRange() {
    return this.getPropertyValueRange(this.favoriteSpeedProp());
  }

  supportsFavoriteSpeedRange() {
    return this.supportsFavoriteSpeed() && this.favoriteSpeedRange().length > 2;
  }

  // favorite levels
  supportsFavoriteLevel() {
    return !!this.favoriteLevelProp() && this.favoriteLevelProp().isWritable();
  }

  favoriteLevelsRange() {
    return this.getPropertyValueRange(this.favoriteLevelProp());
  }

  supportsFavoriteLevelsRange() {
    return this.supportsFavoriteLevel() && this.favoriteLevelsRange().length > 0;
  }

  //favorite speed control
  supportsFavoriteSpeedControl() {
    return this.supportsFavoriteSpeed() || this.supportsFavoriteLevel();
  }

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


  /*----------========== GETTERS ==========----------*/

  getFavoriteLevel() {
    return this.getPropertyValue(this.favoriteLevelProp());
  }

  getFavoriteSpeed() {
    return this.getPropertyValue(this.favoriteSpeedProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setFavoriteLevel(value) {
    return this.setPropertyValue(this.favoriteLevelProp(), value);
  }

  async setFavoriteSpeed(value) {
    return this.setPropertyValue(this.favoriteSpeedProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  getFavoriteSpeedPercentage() {
    if (this.supportsFavoriteLevelsRange()) {
      return this.convertPropValueToPercentage(this.favoriteLevelProp());
    } else if (this.supportsFavoriteSpeedRange()) {
      return this.convertPropValueToPercentage(this.favoriteSpeedProp());
    }
    return this.getFavoriteSpeed();
  }

  async setFavoriteSpeedPercentage(percentage) {
    if (this.supportsFavoriteLevelsRange()) {
      return this.setFavoriteLevel(this.convertPercentageToPropValue(percentage, this.favoriteLevelProp()));
    } else if (this.supportsFavoriteSpeedRange()) {
      return this.setFavoriteSpeed(this.convertPercentageToPropValue(percentage, this.favoriteSpeedProp()));
    } else {
      return this.setFavoriteSpeed(percentage);
    }
  }

  async turnOnFavoriteModeIfNecessary() {
    if (this.isFavoriteModeEnabled() === false) {
      return this.enableFavoriteMode();
    }
  }

  async enableAutoMode() {
    if (this.supportsAutoMode()) {
      return this.setMode(this.autoModeValue());
    }
  }

  async enableSleepMode() {
    if (this.supportsSleepMode()) {
      return this.setMode(this.sleepModeValue());
    }
  }

  async enableFavoriteMode() {
    if (this.supportsFavoriteMode()) {
      return this.setMode(this.favoriteModeValue());
    }
  }

  isIdle() {
    if (this.isStatusIdle() || (this.supportsSpeedNowReporting() && this.getSpeedNow() === 0)) {
      return true;
    }
    return false;
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isAutoModeEnabled() {
    return this.getMode() === this.autoModeValue();
  }

  isSleepModeEnabled() {
    return this.getMode() === this.sleepModeValue();
  }

  isFavoriteModeEnabled() {
    return this.getMode() === this.favoriteModeValue();
  }

  isManualModeEnabled() {
    return this.getMode() === this.manualModeValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirPurifierDevice;

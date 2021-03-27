const GenericDevice = require('../generic/GenericDevice.js');
const CeilingFanCapabilities = require('./CeilingFanCapabilities.js');
const CeilingFanProperties = require('./CeilingFanProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CeilingFanDevice extends GenericDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.CEILING_FAN;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // fake speed control
  supportsFakeSteplessFanSpeed() {
    return (this.capabilities[CeilingFanCapabilities.FAKE_STEPLESS_FAN_CONTROL] !== undefined) && this.supportsFanLevels();
  }

  // speed
  supportsSteplessFanSpeed() {
    return this.hasProperty(CeilingFanProperties.FAN_SPEED) || this.supportsFakeSteplessFanSpeed();
  }

  // fan levels
  fanLevels() {
    return this.getPropertyValueList(CeilingFanProperties.FAN_LEVEL);
  }

  supportsFanLevels() {
    return this.fanLevels().length > 0;
  }

  // modes
  modes() {
    return this.getPropertyValueList(CeilingFanProperties.MODE);
  }

  supportsModes() {
    return this.modes().length > 0;
  }

  // light
  hasBuiltInLight() {
    return this.hasProperty(CeilingFanProperties.LIGHT_POWER);
  }

  supportsLightBrightness() {
    return this.hasProperty(CeilingFanProperties.BRIGHTNESS);
  }

  supportsLightColorTemp() {
    return this.hasProperty(CeilingFanProperties.COLOR_TEMP);
  }

  // light power off timer
  supportsLightPowerOffTimer() {
    return this.hasProperty(CeilingFanProperties.LIGHT_POWER_OFF_TIME);
  }

  // light modes
  lightModes() {
    return this.getPropertyValueList(CeilingFanProperties.LIGHT_MODE);
  }

  supportsLightModes() {
    return this.lightModes().length > 0;
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/


  /*----------========== STATUS ==========----------*/

  getRotationSpeed() {
    if (this.supportsFakeSteplessFanSpeed()) {
      let speedPerLevel = Math.floor(100 / this.fanLevels());
      return speedPerLevel * this.getFanLevel();
    }
    return this.getPropertyValue(CeilingFanProperties.FAN_SPEED);
  }

  getFanLevel() {
    return this.getPropertyValue(CeilingFanProperties.FAN_LEVEL);
  }

  getMode() {
    return this.getPropertyValue(CeilingFanProperties.MODE);
  }

  isLightOn() {
    if (this.hasBuiltInLight()) {
      return this.getPropertyValue(CeilingFanProperties.LIGHT_POWER);
    }
    return false;
  }

  getBrightness() {
    return this.getSafePropertyValue(CeilingFanProperties.BRIGHTNESS);
  }

  getColorTemp() {
    let colorTempKelvin = this.getSafePropertyValue(CeilingFanProperties.COLOR_TEMP);
    let miredVal = 140;
    if (colorTempKelvin > 0) {
      miredVal = 1000000 / colorTempKelvin;
    }
    return miredVal;
  }

  getLightMode() {
    return this.getPropertyValue(CeilingFanProperties.LIGHT_MODE);
  }


  /*----------========== COMMANDS ==========----------*/

  async setRotationSpeed(speed) {
    if (this.supportsFakeSteplessFanSpeed()) {
      let speedPerLevel = Math.floor(100 / this.fanLevels());
      let levelToSet = Math.floor(speed / speedPerLevel);
      this.setFanLevel(levelToSet);
      return;
    }
    this.setPropertyValue(CeilingFanProperties.FAN_SPEED, speed);
  }

  async setFanLevel(level) {
    this.setPropertyValue(CeilingFanProperties.FAN_LEVEL, level);
  }

  async setMode(mode) {
    this.setPropertyValue(CeilingFanProperties.MODE, mode);
  }

  setLightOn(value) {
    this.setPropertyValue(CeilingFanProperties.LIGHT_POWER, value);
  }

  setBrightness(value) {
    this.setPropertyValue(CeilingFanProperties.BRIGHTNESS, value);
  }

  setColorTemp(miredVal) {
    let kelvinVal = 3000;
    if (miredVal > 0) {
      kelvinVal = 1000000 / miredVal;
    }
    this.setPropertyValue(CeilingFanProperties.COLOR_TEMP, kelvinVal);
  }

  setLightMode(lightMode) {
    return this.setPropertyValue(CeilingFanProperties.LIGHT_MODE, lightMode);
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CeilingFanDevice;

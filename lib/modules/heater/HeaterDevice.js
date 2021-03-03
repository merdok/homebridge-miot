const MiotDevice = require('../../MiotDevice.js');
const HeaterCapabilities = require('./HeaterCapabilities.js');
const HeaterProperties = require('./HeaterProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HeaterDevice extends MiotDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }

  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // nothing special yet
  }

  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.HEATER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  heatLevels() {
    return this.capabilities[HeaterCapabilities.HEAT_LEVELS] || [];
  }

  supportsHeatLevels() {
    return this.heatLevels().length > 0 && this.properties[HeaterProperties.HEAT_LEVEL] !== undefined;
  }

  supportsAutoMode() {
    return this.capabilities[HeaterCapabilities.AUTO_MODE_VALUE] !== undefined ? true : false;
  }

  supportsHeatMode() {
    return this.capabilities[HeaterCapabilities.HEAT_MODE_VALUE] !== undefined ? true : false;
  }

  supportsCoolMode() {
    return this.capabilities[HeaterCapabilities.COOL_MODE_VALUE] !== undefined ? true : false;
  }

  supportsModes() {
    return this.supportsAutoMode() && this.supportsHeatMode() && this.properties[HeaterProperties.MODE] !== undefined; // i guess cool mode is irelevant for a heater
  }

  supportsFanSwingMode() {
    return this.capabilities[HeaterCapabilities.FAN_SWING_MODE_VALUE] !== undefined ? true : false;
  }

  supportsFanNotSwingMode() {
    return this.capabilities[HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE] !== undefined ? true : false;
  }

  supportsSwingModes() {
    return this.supportsFanSwingMode() && this.supportsFanNotSwingMode() && this.properties[HeaterProperties.MODE] !== undefined;
  }

  supportsTargetTemperature() {
    return this.properties[HeaterProperties.TARGET_TEMPERATURE] || false;
  }

  targetTemperatureRange() {
    return this.capabilities[HeaterCapabilities.TARGET_TEMPERATURE_RANGE] || [];
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/

  adjustTargetTemperatureToRange(temp) {
    if (this.supportsTargetTemperature() && this.targetTemperatureRange().length > 1) {
      let low = this.targetTemperatureRange()[0];
      let high = this.targetTemperatureRange()[1];
      if (temp > high) temp = high;
      if (temp < low) temp = low;
      return temp;
    }
    return temp;
  }


  /*----------========== STATUS ==========----------*/

  getHeatLevel() {
    return this.getPropertyValue(HeaterProperties.HEAT_LEVEL);
  }

  getTargetTemperature() {
    return this.getPropertyValue(HeaterProperties.TARGET_TEMPERATURE);
  }

  getMode() {
    return this.getPropertyValue(HeaterProperties.MODE);
  }

  isAutoModeEnabled() {
    if (this.supportsAutoMode()) {
      return this.getMode() === HeaterCapabilities.AUTO_MODE_VALUE;
    }
    return false;
  }

  isHeatModeEnabled() {
    if (this.supportsHeatMode()) {
      return this.getMode() === HeaterCapabilities.HEAT_MODE_VALUE;
    }
    return false;
  }

  isCoolModeEnabled() {
    if (this.supportsCoolMode()) {
      return this.getMode() === HeaterCapabilities.COOL_MODE_VALUE;
    }
    return false;
  }

  isFanSwingModeEnabled() {
    if (this.supportsCoolMode()) {
      return this.getMode() === HeaterCapabilities.FAN_SWING_MODE_VALUE;
    }
    return false;
  }

  isFanNotSwingModeEnabled() {
    if (this.supportsCoolMode()) {
      return this.getMode() === HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE;
    }
    return false;
  }

  /*----------========== COMMANDS ==========----------*/

  async setHeatLevel(level) {
    this.setPropertyValue(HeaterProperties.HEAT_LEVEL, level);
  }

  async setTargetTemperature(temp) {
    let targetTemp = this.adjustTargetTemperatureToRange(temp)
    this.setPropertyValue(HeaterProperties.TARGET_TEMPERATURE, targetTemp);
  }

  async setMode(mode) {
    this.setPropertyValue(HeaterProperties.MODE, mode);
  }

  async enableAutoMode() {
    if (this.supportsAutoMode()) {
      this.setMode(HeaterCapabilities.AUTO_MODE_VALUE);
    }
  }

  async enableHeatMode() {
    if (this.supportsHeatMode()) {
      this.setMode(HeaterCapabilities.HEAT_MODE_VALUE);
    }
  }

  async enableCoolMode() {
    if (this.supportsCoolMode()) {
      this.setMode(HeaterCapabilities.COOL_MODE_VALUE);
    }
  }

  async enableFanSwingMode() {
    if (this.supportsCoolMode()) {
      this.setMode(HeaterCapabilities.FAN_SWING_MODE_VALUE);
    }
  }

  async enableFanNotSwingMode() {
    if (this.supportsCoolMode()) {
      this.setMode(HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE);
    }
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HeaterDevice;

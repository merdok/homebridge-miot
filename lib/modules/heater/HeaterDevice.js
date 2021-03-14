const GenericDevice = require('../generic/GenericDevice.js');
const HeaterCapabilities = require('./HeaterCapabilities.js');
const HeaterProperties = require('./HeaterProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HeaterDevice extends GenericDevice {
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

  // heat levels
  heatLevels() {
    return this.capabilities[HeaterCapabilities.HEAT_LEVELS] || [];
  }

  supportsHeatLevels() {
    return this.heatLevels().length > 0 && this.properties[HeaterProperties.HEAT_LEVEL] !== undefined;
  }

  // modes
  autoModeValue() {
    return this.capabilities[HeaterCapabilities.AUTO_MODE_VALUE];
  }

  supportsAutoMode() {
    return this.autoModeValue() !== undefined;
  }

  heatModeValue() {
    return this.capabilities[HeaterCapabilities.HEAT_MODE_VALUE];
  }

  supportsHeatMode() {
    return this.heatModeValue() !== undefined;
  }

  coolModeValue() {
    return this.capabilities[HeaterCapabilities.COOL_MODE_VALUE];
  }

  supportsCoolMode() {
    return this.coolModeValue() !== undefined;
  }

  supportsModes() {
    return this.supportsAutoMode() && this.supportsHeatMode() && this.hasProperty(HeaterProperties.MODE); // i guess cool mode is irelevant for a heater
  }

  // swing mode
  fanSwingModeValue() {
    return this.capabilities[HeaterCapabilities.FAN_SWING_MODE_VALUE];
  }

  supportsFanSwingMode() {
    return this.fanSwingModeValue() !== undefined;
  }

  fanNotSwingModeValue() {
    return this.capabilities[HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE];
  }

  supportsFanNotSwingMode() {
    return this.fanNotSwingModeValue() !== undefined;
  }

  supportsSwingModes() {
    return this.supportsFanSwingMode() && this.supportsFanNotSwingMode() && this.hasProperty(HeaterProperties.MODE);
  }

  // target temperature
  supportsTargetTemperature() {
    return this.hasProperty(HeaterProperties.TARGET_TEMPERATURE);
  }

  targetTemperatureRange() {
    return this.getPropertyValueRange(HeaterProperties.TARGET_TEMPERATURE);
  }

  supportsTargetTemperatureRange() {
    return this.targetTemperatureRange().length > 2;
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/


  /*----------========== STATUS ==========----------*/

  getHeatLevel() {
    return this.getPropertyValue(HeaterProperties.HEAT_LEVEL);
  }

  getTargetTemperature() {
    return this.getSafePropertyValue(HeaterProperties.TARGET_TEMPERATURE);
  }

  getMode() {
    return this.getPropertyValue(HeaterProperties.MODE);
  }

  isAutoModeEnabled() {
    if (this.supportsAutoMode()) {
      return this.getMode() === this.autoModeValue();
    }
    return false;
  }

  isHeatModeEnabled() {
    if (this.supportsHeatMode()) {
      return this.getMode() === this.heatModeValue();
    }
    return false;
  }

  isCoolModeEnabled() {
    if (this.supportsCoolMode()) {
      return this.getMode() === this.coolModeValue();
    }
    return false;
  }

  isFanSwingModeEnabled() {
    if (this.supportsFanSwingMode()) {
      return this.getMode() === this.fanSwingModeValue();
    }
    return false;
  }

  isFanNotSwingModeEnabled() {
    if (this.supportsFanNotSwingMode()) {
      return this.getMode() === this.fanNotSwingModeValue();
    }
    return false;
  }


  /*----------========== COMMANDS ==========----------*/

  async setHeatLevel(level) {
    this.setPropertyValue(HeaterProperties.HEAT_LEVEL, level);
  }

  async setTargetTemperature(targetTemp) {
    this.setPropertyValue(HeaterProperties.TARGET_TEMPERATURE, targetTemp);
  }

  async setMode(mode) {
    this.setPropertyValue(HeaterProperties.MODE, mode);
  }

  async enableAutoMode() {
    if (this.supportsAutoMode()) {
      this.setMode(this.autoModeValue());
    }
  }

  async enableHeatMode() {
    if (this.supportsHeatMode()) {
      this.setMode(this.heatModeValue());
    }
  }

  async enableCoolMode() {
    if (this.supportsCoolMode()) {
      this.setMode(this.coolModeValue());
    }
  }

  async enableFanSwingMode() {
    if (this.supportsFanSwingMode()) {
      this.setMode(this.fanSwingModeValue());
    }
  }

  async enableFanNotSwingMode() {
    if (this.supportsFanNotSwingMode()) {
      this.setMode(this.fanNotSwingModeValue());
    }
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HeaterDevice;

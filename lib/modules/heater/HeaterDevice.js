const BaseDevice = require('../../base/BaseDevice.js');
const HeaterCapabilities = require('./HeaterCapabilities.js');
const HeaterProperties = require('./HeaterProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HeaterDevice extends BaseDevice {
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
    return this.getPropertyValueList(HeaterProperties.HEAT_LEVEL);
  }

  supportsHeatLevels() {
    return this.heatLevels().length > 0;
  }

  // modes
  modes() {
    return this.getPropertyValueList(HeaterProperties.MODE);
  }

  supportsModes() {
    return this.modes().length > 0;
  }

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

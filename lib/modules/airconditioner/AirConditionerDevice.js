const BaseDevice = require('../../base/BaseDevice.js');
const AirConditionerProperties = require('./AirConditionerProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirConditionerDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.AIR_CONDITIONER;
  }


  /*----------========== CONFIG ==========----------*/

  autoModeValue() {
    return -1;
  }

  heatModeValue() {
    return -1;
  }

  coolModeValue() {
    return -1;
  }

  dryModeValue() {
    return -1;
  }

  fanModeValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // vertical swing
  supportsVerticalSwing() {
    return this.hasProperty(AirConditionerProperties.VERTICAL_SWING);
  }

  // target temperature
  supportsTargetTemperature() {
    return this.hasProperty(AirConditionerProperties.TARGET_TEMPERATURE);
  }

  targetTemperatureRange() {
    let range = this.getPropertyValueRange(AirConditionerProperties.TARGET_TEMPERATURE);
    return (range.length > 2) ? range : [10, 35, 1];
  }


  /*----------========== GETTERS ==========----------*/

  getTargetTemperature() {
    return this.getSafePropertyValue(AirConditionerProperties.TARGET_TEMPERATURE);
  }

  isVerticalSwingEnabled() {
    return this.getPropertyValue(AirConditionerProperties.VERTICAL_SWING);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetTemperature(targetTemp) {
    this.setPropertyValue(AirConditionerProperties.TARGET_TEMPERATURE, targetTemp);
  }

  async setVerticalSwingEnabled(enabled) {
    this.setPropertyValue(AirConditionerProperties.VERTICAL_SWING, enabled);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isAutoModeEnabled() {
    return this.getMode() === this.autoModeValue();
  }

  isHeatModeEnabled() {
    return this.getMode() === this.heatModeValue();
  }

  isCoolModeEnabled() {
    return this.getMode() === this.coolModeValue();
  }

  isDryModeEnabled() {
    return this.getMode() === this.dryModeValue();
  }

  isFanModeEnabled() {
    return this.getMode() === this.fanModeValue();
  }

  async enableAutoMode() {
    this.setMode(this.autoModeValue());
  }

  async enableHeatMode() {
    this.setMode(this.heatModeValue());
  }

  async enableCoolMode() {
    this.setMode(this.coolModeValue());
  }

  async enableDryMode() {
    this.setMode(this.dryModeValue());
  }

  async enableFanMode() {
    this.setMode(this.fanModeValue());
  }

  isHeating() {
    return this.isHeatModeEnabled();
  }

  isCooling() {
    return this.isCoolModeEnabled();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirConditionerDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FreshAirSystemDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
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
      this.logger.info(`Filter left time: ${this.getFilterLeftTime()} days.`);
    }
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.FRESH_AIR_SYSTEM;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // heater
  supportsHeater() {
    return this.hasProperty(Properties.HEATER);
  }

  // heat levels
  supportsHeatLevels() {
    return this.hasProperty(Properties.HEAT_LEVEL);
  }

  // filter
  supportsFilterLifeLevelReporting() {
    return this.hasProperty(Properties.FILTER_LIFE_LEVEL);
  }

  supportsFilterUsedTimeReporting() {
    return this.hasProperty(Properties.FILTER_USED_TIME);
  }

  supportsFilterLeftTimeReporting() {
    return this.hasProperty(Properties.FILTER_LEFT_TIME);
  }

  // motor
  supportsMotorASpeedRpmReporting() {
    return this.hasProperty(Properties.MOTOR_A_SPEED_RPM);
  }

  supportsMotorBSpeedRpmReporting() {
    return this.hasProperty(Properties.MOTOR_B_SPEED_RPM);
  }


  /*----------========== GETTERS ==========----------*/

  isHeaterEnabled() {
    return this.getPropertyValue(Properties.HEATER);
  }

  getHeatLevel() {
    return this.getPropertyValue(Properties.HEAT_LEVEL);
  }

  getFilterLifeLevel() {
    return this.getPropertyValue(Properties.FILTER_LIFE_LEVEL);
  }

  getFilterUsedTime() {
    return this.getPropertyValue(Properties.FILTER_USED_TIME);
  }

  getFilterLeftTime() {
    return this.getPropertyValue(Properties.FILTER_LEFT_TIME);
  }

  getMotorASpeedRpm() {
    return this.getPropertyValue(Properties.MOTOR_A_SPEED_RPM);
  }

  getMotorBSpeedRpm() {
    return this.getPropertyValue(Properties.MOTOR_B_SPEED_RPM);
  }


  /*----------========== SETTERS ==========----------*/

  async setHeaterEnabled(enabled) {
    this.setPropertyValue(Properties.HEATER, enabled);
  }

  async setHeatLevel(level) {
    this.setPropertyValue(Properties.HEAT_LEVEL, level);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isIdle() {
    if (this.supportsMotorASpeedRpmReporting() && this.getMotorASpeedRpm() === 0) {
      return true;
    } else if (this.supportsMotorBSpeedRpmReporting() && this.getMotorBSpeedRpm() === 0) {
      return true
    }
    return false;
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = FreshAirSystemDevice;

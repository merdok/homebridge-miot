const BaseDevice = require('../../base/BaseDevice.js');
const FreshAirSystemCapabilities = require('./FreshAirSystemCapabilities.js');
const FreshAirSystemProperties = require('./FreshAirSystemProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FreshAirSystemDevice extends BaseDevice {
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
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.FRESH_AIR_SYSTEM;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // fake speed control
  supportsFakeSteplessFanSpeed() {
    return (this.capabilities[FreshAirSystemCapabilities.FAKE_STEPLESS_FAN_CONTROL] !== undefined) && this.supportsFanLevels();
  }

  // speed
  supportsSteplessFanSpeed() {
    return this.supportsFakeSteplessFanSpeed();
  }

  // heater
  supportsHeater() {
    return this.hasProperty(FreshAirSystemProperties.HEATER);
  }

  // status
  supportsFilterLifeLevelReporting() {
    return this.hasProperty(FreshAirSystemProperties.FILTER_LIFE_LEVEL);
  }

  supportsFilterUsedTimeReporting() {
    return this.hasProperty(FreshAirSystemProperties.FILTER_USED_TIME);
  }

  supportsMotorASpeedRpmReporting() {
    return this.hasProperty(FreshAirSystemProperties.MOTOR_A_SPEED_RPM);
  }

  supportsMotorBSpeedRpmReporting() {
    return this.hasProperty(FreshAirSystemProperties.MOTOR_B_SPEED_RPM);
  }


  /*----------========== GETTERS ==========----------*/

  getRotationSpeed() {
    if (this.supportsFakeSteplessFanSpeed()) {
      let numberOfFanLevels = this.fanLevels().length;
      let speedPerLevel = Math.floor(100 / numberOfFanLevels);
      return speedPerLevel * this.getFanLevel();
    }
    return 0;
  }

  isHeaterEnabled() {
    return this.getPropertyValue(FreshAirSystemProperties.HEATER);
  }

  getFilterLifeLevel() {
    return this.getPropertyValue(FreshAirSystemProperties.FILTER_LIFE_LEVEL);
  }

  getFilterUsedTime() {
    return this.getPropertyValue(FreshAirSystemProperties.FILTER_USED_TIME);
  }

  getMotorASpeedRpm() {
    return this.getPropertyValue(FreshAirSystemProperties.MOTOR_A_SPEED_RPM);
  }

  getMotorBSpeedRpm() {
    return this.getPropertyValue(FreshAirSystemProperties.MOTOR_B_SPEED_RPM);
  }

  isIdle() {
    if (this.supportsMotorASpeedRpmReporting() && this.getMotorASpeedRpm() === 0) {
      return true;
    } else if (this.supportsMotorBSpeedRpmReporting() && this.getMotorBSpeedRpm() === 0) {
      return true
    }
    return false;
  }


  /*----------========== SETTERS ==========----------*/

  async setRotationSpeed(speed) {
    if (this.supportsFakeSteplessFanSpeed()) {
      let numberOfFanLevels = this.fanLevels().length;
      let firstValue = this.fanLevels()[0].value;
      let speedPerLevel = Math.floor(100 / numberOfFanLevels);
      let levelToSet = Math.floor(speed / speedPerLevel);
      levelToSet = firstValue + levelToSet; // sometimes the levels do not start at value 0
      this.setFanLevel(levelToSet);
    }
  }

  async setHeaterEnabled(enabled) {
    this.setPropertyValue(FreshAirSystemProperties.HEATER, enabled);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = FreshAirSystemDevice;

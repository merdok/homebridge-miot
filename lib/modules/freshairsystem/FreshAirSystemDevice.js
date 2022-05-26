const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class FreshAirSystemDevice extends GenericDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
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
      this.logger.info(`Filter left time: ${this.getFilterLeftTime()} days.`);
    }
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.FRESH_AIR_SYSTEM;
  }

  getDeviceName() {
    return 'Unknown fresh air system device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['air-fresh:on', 'air-fresh:fault', 'air-fresh:fan-level', 'air-fresh:mode',
      'air-fresh:heater', 'air-fresh:heat-level', 'filter:filter-used-time', 'filter:filter-life-level',
      'physical-controls-locked:physical-controls-locked', 'alarm:alarm', 'indicator-light:brightness', 'environment:co2-density',
      'environment:pm2.5-density', 'environment:relative-humidity', 'environment:temperature', 'custom-serveice:motor-a-speed-rpm',
      'custom-serveice:motor-b-speed-rpm', 'custom-serveice:temperature', 'custom-serveice:motor-status'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('air-fresh:on');
  }

  modeProp() {
    return this.getProperty('air-fresh:mode');
  }

  faultProp() {
    return this.getProperty('air-fresh:fault');
  }

  fanLevelProp() {
    return this.getProperty('air-fresh:fan-level');
  }

  //device specific
  heaterProp() {
    return this.getProperty('air-fresh:heater');
  }

  heatLevelProp() {
    return this.getProperty('air-fresh:heat-level');
  }

  motorASpeedProp() {
    return this.getProperty('custom-serveice:motor-a-speed-rpm');
  }

  motorBSpeedProp() {
    return this.getProperty('custom-serveice:motor-b-speed-rpm');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // heater
  supportsHeater() {
    return !!this.heaterProp();
  }

  // heat levels
  supportsHeatLevels() {
    return !!this.heatLevelProp();
  }

  // motor
  supportsMotorASpeedRpmReporting() {
    return !!this.motorASpeedProp();
  }

  supportsMotorBSpeedRpmReporting() {
    return !!this.motorBSpeedProp();
  }


  /*----------========== GETTERS ==========----------*/

  isHeaterEnabled() {
    return this.getPropertyValue(this.heaterProp());
  }

  getHeatLevel() {
    return this.getPropertyValue(this.heatLevelProp());
  }

  getMotorASpeedRpm() {
    return this.getPropertyValue(this.motorASpeedProp());
  }

  getMotorBSpeedRpm() {
    return this.getPropertyValue(this.motorBSpeedProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setHeaterEnabled(value) {
    return this.setPropertyValue(this.heaterProp(), value);
  }

  async setHeatLevel(value) {
    return this.setPropertyValue(this.heatLevelProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  isIdle() {
    if (this.supportsMotorASpeedRpmReporting() && this.getMotorASpeedRpm() === 0) {
      return true;
    } else if (this.supportsMotorBSpeedRpmReporting() && this.getMotorBSpeedRpm() === 0) {
      return true
    }
    return !this.isOn();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = FreshAirSystemDevice;

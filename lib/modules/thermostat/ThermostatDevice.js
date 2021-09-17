const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class ThermostatDevice extends BaseDevice {
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
    return DevTypes.THERMOSTAT;
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return -1;
  }

  statusHeatingValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // target temperature
  supportsTargetTemperature() {
    return this.hasProperty(Properties.TARGET_TEMPERATURE);
  }

  targetTemperatureRange() {
    let range = this.getPropertyValueRange(Properties.TARGET_TEMPERATURE);
    return (range.length > 2) ? range : [10, 35, 1];
  }

  // Sensor type
  supportsSensorType() {
    return this.hasProperty(Properties.SENSOR_TYPE);
  }

  // Temp activate
  supportsTempActivate() {
    return this.hasProperty(Properties.TEMP_ACTIVATE);
  }

  // Temp comp
  supportsTempComp() {
    return this.hasProperty(Properties.TEMP_COMP);
  }

  // Temp floor
  supportsTempFloorReporting() {
    return this.hasProperty(Properties.TEMP_FLOOR);
  }

  // Max set temp
  supportsMaxSetTempReporting() {
    return this.hasProperty(Properties.MAX_SET_TEMP);
  }

  // Min set temp
  supportsMinSetTempReporting() {
    return this.hasProperty(Properties.MIN_SET_TEMP);
  }



  /*----------========== GETTERS ==========----------*/

  getTargetTemperature() {
    return this.getSafePropertyValue(Properties.TARGET_TEMPERATURE);
  }

  getSensorType() {
    return this.getSafePropertyValue(Properties.SENSOR_TYPE);
  }

  getTempActivate() {
    return this.getSafePropertyValue(Properties.TEMP_ACTIVATE);
  }

  getTempComp() {
    return this.getSafePropertyValue(Properties.TEMP_COMP);
  }

  getTempFloor() {
    return this.getSafePropertyValue(Properties.TEMP_FLOOR);
  }

  getMaxSetTemp() {
    return this.getSafePropertyValue(Properties.MAX_SET_TEMP);
  }

  getMinSetTemp() {
    return this.getSafePropertyValue(Properties.MIN_SET_TEMP);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetTemperature(targetTemp) {
    this.setPropertyValue(Properties.TARGET_TEMPERATURE, targetTemp);
  }

  async setSensorType(sensorType) {
    this.setPropertyValue(Properties.SENSOR_TYPE, sensorType);
  }

  async setTempActivate(tempActivate) {
    this.setPropertyValue(Properties.TEMP_ACTIVATE, tempActivate);
  }

  async setTempComp(tempComp) {
    this.setPropertyValue(Properties.TEMP_COMP, tempComp);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusHeating() {
    return this.getStatus() === this.statusHeatingValue();
  }

  isCooling() {
    return this.getTargetTemperature() < this.getTemperature();
  }

  startHeating() {
    return this.setTargetTemperature(this.targetTemperatureRange()[1]); // target temp to max
  }

  startCooling() {
    return this.setTargetTemperature(this.targetTemperatureRange()[0]); // target temp to min
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = ThermostatDevice;

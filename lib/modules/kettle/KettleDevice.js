const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class KettleDevice extends BaseDevice {
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
    return DevTypes.KETTLE;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // target temperature
  supportsTargetTemperature() {
    return this.hasProperty(Properties.TARGET_TEMPERATURE);
  }

  targetTemperatureRange() {
    let range = this.getPropertyValueRange(Properties.TARGET_TEMPERATURE);
    return (range.length > 2) ? range : [10, 35, 1];
  }

  // Total Dissolved Solids Sensor
  supportsTdsReporting() {
    return this.hasProperty(Properties.TDS_SENSOR);
  }


  /*----------========== GETTERS ==========----------*/

  getTargetTemperature() {
    return this.getSafePropertyValue(Properties.TARGET_TEMPERATURE);
  }

  getTdsSensor() {
    return this.getSafePropertyValue(Properties.TDS_SENSOR);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetTemperature(targetTemp) {
    this.setPropertyValue(Properties.TARGET_TEMPERATURE, targetTemp);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isHeating() {
    return this.getTargetTemperature() > this.getTemperature();
  }

  startHeating() {
    return this.setTargetTemperature(this.targetTemperatureRange()[1]); // heat to max
  }

  stopHeating() {
    return this.setTargetTemperature(this.targetTemperatureRange()[0]); // set temp to min
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = KettleDevice;

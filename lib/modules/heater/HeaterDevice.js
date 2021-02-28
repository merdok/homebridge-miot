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
    // log the heater total use time if the heater supports it
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Device total use time: ${this.getUseTime()} minutes.`);
    }
  }

  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.HEATER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  supportsTargetTemperature() {
    return this.properties[HeaterProperties.TARGET_TEMPERATURE] || false; // whether a target temperature can be set
  }

  targetTemperatureRange() {
    return this.capabilities[HeaterCapabilities.TARGET_TEMPERATURE_RANGE] || []; // range for the target temperature
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

  getTargetTemperature() {
    return this.getPropertyValue(HeaterProperties.TARGET_TEMPERATURE);
  }


  /*----------========== COMMANDS ==========----------*/

  async setTargetTemperature(temp) {
    let targetTemp = this.adjustTargetTemperatureToRange(temp)
    this.setPropertyValue(HeaterProperties.TARGET_TEMPERATURE, targetTemp);
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HeaterDevice;

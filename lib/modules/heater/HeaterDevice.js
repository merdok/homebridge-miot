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
      this.logger.info(`Heater total use time: ${this.getUseTime()} minutes.`);
    }
  }

  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.HEATER;
  }


  /*----------========== CAPABILITIES ==========----------*/

  supportsTargetTemperature() {
    return this.capabilities[HeaterProperties.TARGET_TEMPERATURE] || false; // whether a target temperature can be set
  }

  targetTemperatureRange() {
    return this.capabilities[HeaterCapabilities.TARGET_TEMPERATURE_RANGE] || []; // range for the target temperature
  }

  // power off timer
  supportsPowerOffTimer() {
    return this.properties[HeaterProperties.POWER_OFF_TIME] !== undefined; // if a power off timer can be configured
  }

  powerOffTimerUnit() {
    return this.capabilities[HeaterCapabilities.POWER_OFF_TIMER_UNIT] || ''; // the unit of the power off timer
  }

  powerOffTimerRange() {
    return this.capabilities[HeaterCapabilities.POWER_OFF_TIMER_RANGE] || []; // range for the power off timer
  }

  // alarm
  supportsBuzzerControl() {
    return this.properties[HeaterProperties.ALARM] !== undefined; // if buzzer can be configured on/off
  }

  // led
  supportsLedControl() {
    return this.properties[HeaterProperties.LIGHT] !== undefined; // if indicator light can be configured on/off
  }

  supportsLedBrightness() {
    return this.capabilities[HeaterCapabilities.LED_BRIGHTNESS_CONTROL] || false; // if indicator light can be controlled like a light bulb with 0 to 100% percent values
  }

  // temperature
  supportsTemperatureReporting() {
    return this.properties[HeaterProperties.TEMPERATURE] !== undefined; // whether the fan has a built in temperature sensor which can be read
  }

  // relative humidity
  supportsRelativeHumidityReporting() {
    return this.properties[HeaterProperties.RELATIVE_HUMIDITY] !== undefined; // whether the fan has a built in humidity sensor which can be read
  }

  // use time
  supportsUseTimeReporting() {
    return this.properties[HeaterProperties.USE_TIME] !== undefined; // whether the fan returns use time
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/

  adjustTargetTemperatureToRange(temp) {
    if (this.supportsTargetTemperature() && this.targetTemperatureRange().length > 1) {
      let low = this.targetTemperatureRange()[0];
      let high = this.targetTemperatureRange()[1];
      if (temp > high) angle = high;
      if (temp < low) angle = low;
      return temp;
    }
    return temp;
  }


  /*----------========== STATUS ==========----------*/

  getTargetTemperature() {
    return this.getPropertyValue(HeaterProperties.TARGET_TEMPERATURE);
  }

  isBuzzerEnabled() {
    return this.getPropertyValue(FanProperties.ALARM);
  }

  isLedEnabled() {
    return this.getPropertyValue(FanProperties.LIGHT);
  }

  getLedBrightness() {
    return this.isLedEnabled() ? 100 : 0;
  }

  getShutdownTimer() {
    let value = this.getPropertyValue(Properties.POWER_OFF_TIME);
    if (this.powerOffTimerUnit() === 'seconds') {
      return Math.ceil(value / 60); // convert to minutes
    } else if (this.powerOffTimerUnit() === 'hours') {
      return value * 60; // convert to hours
    } else {
      return value;
    }
  }

  isShutdownTimerEnabled() {
    return this.getShutdownTimer() > 0;
  }

  getTemperature() {
    return this.getPropertyValue(FanProperties.TEMPERATURE);
  }

  getRelativeHumidity() {
    return this.getPropertyValue(FanProperties.RELATIVE_HUMIDITY);
  }

  getUseTime() {
    return this.getPropertyValue(FanProperties.USE_TIME);
  }


  /*----------========== COMMANDS ==========----------*/

  async setTargetTemperature(temp) {
    let targetTemp = this.adjustTargetTemperatureToRange(temp)
    this.setPropertyValue(HeaterProperties.TARGET_TEMPERATURE, targetTemp);
  }

  async setBuzzerEnabled(enabled) {
    this.setPropertyValue(FanProperties.ALARM, enabled);
  }

  async setLedEnabled(enabled) {
    this.setPropertyValue(FanProperties.LIGHT, enabled);
  }

  async setLedBrightness(brightness) {
    let enabled = brightness > 0 ? true : false;
    this.setLedEnabled(enabled);
  }

  async setShutdownTimer(minutes) {
    if (this.powerOffTimerUnit() === 'seconds') {
      let seconds = minutes * 60;
      this.setPropertyValue(FanProperties.POWER_OFF_TIME, seconds);
    } else if (this.powerOffTimerUnit() === 'hours') {
      let hours = minutes / 60;
      this.setPropertyValue(FanProperties.POWER_OFF_TIME, hours);
    } else {
      this.setPropertyValue(FanProperties.POWER_OFF_TIME, minutes);
    }
  }



  /*----------========== HELPERS ==========----------*/


}

module.exports = HeaterDevice;

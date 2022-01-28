const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class CeilingFanDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.CEILING_FAN;
  }

  getDeviceName() {
    return 'Unknown ceiling fan device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['light:on', 'light:brightness', 'light:color-temperature', 'light:mode',
      'fan:on', 'fan:fan-level', 'fan:mode', 'fan:status',
      'light:off-delay-time'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('light:on');
  }

  modeProp() {
    return this.getProperty('light:mode');
  }

  brightnessProp() {
    return this.getProperty('light:brightness');
  }

  colorTemperatureProp() {
    return this.getProperty('light:color-temperature');
  }

  statusProp() {
    return this.getProperty('fan:status');
  }

  offDelayProp() {
    return this.getProperty('light:off-delay-time');
  }

  fanLevelProp() {
    return this.getProperty('fan:fan-level');
  }

  //device specific
  fanOnProp() {
    return this.getProperty('fan:on');
  }

  fanModeProp() {
    return this.getProperty('fan:mode');
  }

  fanOffDelayProp() {
    return this.getProperty('fan:off-delay');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // fan on
  supportsFanOn() {
    return !!this.fanOnProp();
  }

  // fan modes
  supportsFanModes() {
    return !!this.fanModeProp();
  }

  // fan off delay
  supportsFanOffDelay() {
    return !!this.fanOffDelayProp();
  }


  /*----------========== GETTERS ==========----------*/

  isFanOn() {
    return this.getPropertyValue(this.fanOnProp());
  }

  getFanMode() {
    return this.getPropertyValue(this.fanModeProp());
  }

  getFanOffDelay() {
    return this.getPropertyValue(this.fanOffDelayProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setFanOn(isOn) {
    return this.setPropertyValue(this.fanOnProp(), isOn);
  }

  async setFanMode(mode) {
    return this.setPropertyValue(this.fanModeProp(), mode);
  }

  async setFanOffDelay(value) {
    return this.setPropertyValue(this.fanOffDelayProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  isLightShutdownTimerEnabled() {
    return this.getLightShutdownTimer() > 0;
  }

  turnLightOnIfNecessary() {
    // if the light is turned off then turn it on
    if (this.isLightOn() === false) {
      this.setLightOn(true);
    }
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = CeilingFanDevice;

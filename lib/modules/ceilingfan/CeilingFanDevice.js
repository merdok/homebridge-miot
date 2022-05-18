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
    return this.getProperty('fan:on');
  }

  modeProp() {
    return this.getProperty('fan:mode');
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
    return this.getProperty('fan:off-delay');
  }

  fanLevelProp() {
    return this.getProperty('fan:fan-level');
  }

  //device specific
  lightOnProp() {
    return this.getProperty('light:on');
  }

  lightModeProp() {
    return this.getProperty('light:mode');
  }

  lightOffDelayProp() {
    return this.getProperty('light:off-delay-time');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // light on
  supportsLightOn() {
    return !!this.lightOnProp();
  }

  // light modes
  supportsLightModes() {
    return !!this.lightModeProp();
  }

  // light off delay
  supportsLightOffDelay() {
    return !!this.lightOffDelayProp();
  }


  /*----------========== GETTERS ==========----------*/

  isLightOn() {
    return this.getPropertyValue(this.lightOnProp());
  }

  getLightMode() {
    return this.getPropertyValue(this.lightModeProp());
  }

  getLightOffDelay() {
    return this.getPropertyValue(this.lightOffDelayProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setLightOn(isOn) {
    return this.setPropertyValue(this.lightOnProp(), isOn);
  }

  async setLightMode(mode) {
    return this.setPropertyValue(this.lightModeProp(), mode);
  }

  async setLightOffDelay(value) {
    return this.setPropertyValue(this.lightOffDelayProp(), value);
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

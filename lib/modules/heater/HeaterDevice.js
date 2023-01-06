const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class HeaterDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.HEATER;
  }

  getDeviceName() {
    return 'Unknown heater device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['heater:on', 'heater:mode', 'heater:fault', 'heater:target-temperature',
      'countdown:countdown-time', 'private-service:use-time', 'heater:heat-level', 'electric-blanket:on',
      'electric-blanket:fault', 'electric-blanket:mode', 'electric-blanket:target-temperature', 'electric-blanket:temperature',
      'electric-blanket:water-level', 'heater:temperature'
    ];
  }


  /*----------========== VALUES ==========----------*/

  fanSwingModeValue() {
    return this.getValueForMode('Fan swing');
  }

  fanNotSwingModeValue() {
    return this.getValueForMode('Fan not swing');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('heater:on');
  }

  modeProp() {
    return this.getProperty('heater:mode');
  }

  faultProp() {
    return this.getProperty('heater:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('heater:target-temperature');
  }

  offDelayProp() {
    return this.getProperty('countdown:countdown-time');
  }

  useTimeProp() {
    return this.getProperty('private-service:use-time');
  }

  //device specific
  heatLevelProp() {
    return this.getProperty('heater:heat-level');
  }

  fanOnProp() {
    return this.getProperty('fan:on');
  }

  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  // heat levels
  supportsHeatLevels() {
    return !!this.heatLevelProp();
  }

  // swing mode
  supportsFanSwingMode() {
    return this.fanSwingModeValue() !== -1;
  }

  supportsFanNotSwingMode() {
    return this.fanNotSwingModeValue() !== -1;
  }

  supportsSwingModes() {
    return this.supportsModes() && this.supportsFanSwingMode() && this.supportsFanNotSwingMode();
  }

  // fan
  supportsFanOn() {
    return !!this.fanOnProp();
  }


  /*----------========== GETTERS ==========----------*/

  getHeatLevel() {
    return this.getPropertyValue(this.heatLevelProp());
  }

  isFanOn() {
    return this.getPropertyValue(this.fanOnProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setHeatLevel(value) {
    return this.setPropertyValue(this.heatLevelProp(), value);
  }

  async setFanOn(value) {
    return this.setPropertyValue(this.fanOnProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  async enableFanSwingMode() {
    if (this.supportsFanSwingMode()) {
      return this.setMode(this.fanSwingModeValue());
    }
  }

  async enableFanNotSwingMode() {
    if (this.supportsFanNotSwingMode()) {
      return this.setMode(this.fanNotSwingModeValue());
    }
  }

  isHeating() {
    return this.isOn();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isFanSwingModeEnabled() {
    return this.getMode() === this.fanSwingModeValue();
  }

  isFanNotSwingModeEnabled() {
    return this.getMode() === this.fanNotSwingModeValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = HeaterDevice;

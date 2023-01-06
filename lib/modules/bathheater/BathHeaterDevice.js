const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class BathHeaterDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.BATH_HEATER;
  }

  getDeviceName() {
    return 'Unknown bath heater device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['light:on', 'light:brightness', 'light:mode', 'ptc-bath-heater:mode',
      'ptc-bath-heater:heating', 'ptc-bath-heater:blow', 'ptc-bath-heater:ventilation', 'ptc-bath-heater:target-temperature',
      'ptc-bath-heater:temperature'
    ];
  }


  /*----------========== VALUES ==========----------*/

  idleModeValue() {
    return this.getValueForMode('Idle');
  }

  heatModeValue() {
    return this.getValueForMode('Heat');
  }

  statusHeatValue() {
    return this.getValueForStatus('Heat');
  }

  statusClosedValue() {
    return this.getValueForStatus('Closed');
  }

  statusKeepValue() {
    return this.getValueForStatus('Keep');
  }


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

  targetTemperatureProp() {
    return this.getProperty('ptc-bath-heater:target-temperature');
  }

  //device specific
  heaterModeProp() {
    return this.getProperty('ptc-bath-heater:mode');
  }

  heatingProp() {
    return this.getProperty('ptc-bath-heater:heating');
  }

  blowProp() {
    return this.getProperty('ptc-bath-heater:blow');
  }

  ventilationProp() {
    return this.getProperty('ptc-bath-heater:ventilation');
  }

  temperatureProp() {
    return this.getProperty('ptc-bath-heater:temperature');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // heater mode
  supportsHeaterMode() {
    return !!this.heaterModeProp();
  }

  // heating
  supportsHeating() {
    return !!this.heatingProp();
  }

  // blow
  supportsBlow() {
    return !!this.blowProp();
  }

  // ventilation
  supportsVentilation() {
    return !!this.ventilationProp();
  }


  /*----------========== GETTERS ==========----------*/

  getHeaterMode() {
    return this.getPropertyValue(this.heaterModeProp());
  }

  isHeating() {
    return this.getPropertyValue(this.heatingProp());
  }

  isBlow() {
    return this.getPropertyValue(this.blowProp());
  }

  isVentilation() {
    return this.getPropertyValue(this.ventilationProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setHeaterMode(value) {
    return this.setPropertyValue(this.heaterModeProp(), value);
  }

  async setHeating(value) {
    return this.setPropertyValue(this.heatingProp(), value);
  }

  async setBlow(value) {
    return this.setPropertyValue(this.blowProp(), value);
  }

  async setVentilation(value) {
    return this.setPropertyValue(this.ventilationProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  isBathHeaterEnabled() {
    if (this.supportsHeating()) {
      return this.isHeating();
    } else if (this.supportsHeaterMode()) {
      return this.isHeatModeEnabled();
    }
    return false;
  }

  async setBathHeaterEnabled(enabled) {
    if (this.supportsHeating()) {
      return this.setHeating(enabled);
    } else if (this.supportsHeaterMode()) {
      let mode = enabled ? this.heatModeValue() : this.idleModeValue();
      return this.setHeaterMode(mode);
    }
  }

  async startHeatingIfNecessary() {
    if (this.isBathHeaterEnabled() === false) {
      return this.setBathHeaterEnabled(true);
    }
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isIdleModeEnabled() {
    return this.getHeaterMode() === this.idleModeValue();
  }

  isHeatModeEnabled() {
    return this.getHeaterMode() === this.heatModeValue();
  }

  isStatusHeating() {
    return this.getStatus() === this.statusHeatValue();
  }

  isStatusClosed() {
    return this.getStatus() === this.statusClosedValue();
  }

  isStatusKeep() {
    return this.getStatus() === this.statusKeepValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = BathHeaterDevice;

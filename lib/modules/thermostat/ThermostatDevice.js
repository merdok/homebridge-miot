const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class ThermostatDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.THERMOSTAT;
  }

  getDeviceName() {
    return 'Unknown thermostat device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['thermostat:on', 'thermostat:status', 'thermostat:fault', 'thermostat:mode',
      'thermostat:target-temperature', 'thermostat:temperature', 'heatold:childlock'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusHeatingValue() {
    return this.getValueForStatus('Heating');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('thermostat:on');
  }

  modeProp() {
    return this.getProperty('thermostat:mode');
  }

  statusProp() {
    return this.getProperty('thermostat:status');
  }

  faultProp() {
    return this.getProperty('thermostat:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('thermostat:target-temperature');
  }

  temperatureProp() {
    return this.getProperty('thermostat:temperature');
  }

  physicalControlsLockedProp() {
    return this.getProperty('heatold:childlock');
  }

  //device specific


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isCooling() {
    return this.getTargetTemperature() < this.getTemperature();
  }

  startHeating() {
    return this.setTargetTemperature(this.targetTemperatureRange()[1]); // target temp to max
  }

  startCooling() {
    return this.setTargetTemperature(this.targetTemperatureRange()[0]); // target temp to min
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusHeating() {
    return this.getStatus() === this.statusHeatingValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = ThermostatDevice;

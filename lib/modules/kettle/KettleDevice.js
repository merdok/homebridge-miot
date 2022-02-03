const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class KettleDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.KETTLE;
  }

  getDeviceName() {
    return 'Unknown kettle device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['kettle:temperature', 'kettle:target-temperature', 'kettle:mode', 'tds-sensor:tds-out'];
  }


  /*----------========== VALUES ==========----------*/

  idleModeValue() {
    return this.getValueForMode('Common');
  }

  boilWaterModeValue() {
    return this.getValueForMode(['Boiling Water', 'Boiled Water']);
  }

  statusHeatingValue() {
    return this.getValueForStatus('Heating');
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  modeProp() {
    return this.getProperty('kettler:mode');
  }

  targetTemperatureProp() {
    return this.getProperty('kettle:target-temperature');
  }

  temperatureProp() {
    return this.getProperty('kettle:temperature');
  }

  //device specific
  tdsSensorTdsOutProp() {
    return this.getProperty('tds-sensor:tds-out');
  }

  leftTimeProp() {
    return null;
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // Total Dissolved Solids Sensor
  supportsTdsReporting() {
    return !!this.tdsSensorTdsOutProp();
  }

  // left time
  supportsLeftTimeReporting() {
    return !!this.leftTimeProp();
  }


  /*----------========== GETTERS ==========----------*/

  getTdsSensor() {
    return this.getPropertyValue(this.tdsSensorTdsOutProp());
  }

  getLeftTime() {
    return this.getPropertyValue(this.leftTimeProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isHeating() {
    if (this.supportsStatusReporting()) {
      return this.getStatus() === this.statusHeatingValue();
    } else if (this.supportsTargetTemperature()) {
      return this.getTargetTemperature() > this.getTemperature();
    } else if (this.supportsModes()) {
      return this.getMode() === this.boilWaterModeValue();
    }
    return false;
  }

  async startHeating() {
    if (this.supportsTargetTemperature()) {
      return this.setTargetTemperature(this.targetTemperatureRange()[1]); // heat to max
    } else if (this.supportsModes()) {
      return this.setMode(this.statusHeatingValue());
    }
  }

  async stopHeating() {
    if (this.supportsTargetTemperature()) {
      return this.setTargetTemperature(this.targetTemperatureRange()[0]); // set temp to min
    } else if (this.supportsModes()) {
      return this.setMode(this.idleModeValue());
    }
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = KettleDevice;

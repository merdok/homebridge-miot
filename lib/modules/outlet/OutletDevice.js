const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class OutletDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.OUTLET;
  }

  getDeviceName() {
    return 'Unknown outlet device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['switch:on', 'custome:off-memory', 'switch:status', 'switch:temperature',
      'switch:mode', 'switch:power-consumption', 'switch:countdown-time'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('switch:on');
  }

  modeProp() {
    return this.getProperty('switch:mode');
  }

  statusProp() {
    return this.getProperty('switch:status');
  }

  temperatureProp() {
    return this.getProperty('switch:temperature');
  }

  offDelayProp() {
    return this.getProperty('switch:countdown-time');
  }

  //device specific
  offMemoryProp() {
    return this.getProperty('custome:off-memory');
  }

  powerConsumptionProp() {
    return this.getProperty('switch:power-consumption');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== SERVICES ==========----------*/

  getAllSwitchServices() {
    return this.getAllServicesByType('switch') || [];
  }


  /*----------========== FEATURES ==========----------*/

  //multiply outlets
  hasMultiplySwitchServices() {
    return this.getAllSwitchServices().length > 1;
  }

  //off memory
  supportsOffMemory() {
    return !!this.offMemoryProp();
  }

  //power consumption
  supportsPowerConsumptionReporting() {
    return !!this.powerConsumptionProp();
  }


  /*----------========== GETTERS ==========----------*/

  getOffMemory() {
    return this.getPropertyValue(this.offMemoryProp());
  }

  getPowerConsumption() {
    return this.getPropertyValue(this.powerConsumptionProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setOffMemory(value) {
    return this.setPropertyValue(this.offMemoryProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = OutletDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class PlantMonitorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.PLANT_MONITOR;
  }

  getDeviceName() {
    return 'Unknown plant monitor device';
  }

  getMainService() {
    return this.getServiceByType('plant-monitor');
  }

  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['plant-monitor:relative-humidity', 'plant-monitor:soil-ec', 'plant-monitor:illumination'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  relativeHumidityProp() {
    return this.getProperty('plant-monitor:relative-humidity');
  }

  illuminationProp() {
    return this.getProperty('plant-monitor:illumination');
  }


  //device specific
  soilEcProp() {
    return this.getProperty('plant-monitor:soil-ec');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // soil ec
  supportsSoilEcReporting() {
    return !!this.soilEcProp();
  }


  /*----------========== GETTERS ==========----------*/

  getSoilEc() {
    return this.getPropertyValue(this.soilEcProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = PlantMonitorDevice;

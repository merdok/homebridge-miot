const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class OccupancySensorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.OCCUPANCY_SENSOR;
  }

  getDeviceName() {
    return 'Unknown occupancy sensor device';
  }

  getMainService() {
    return this.getServiceByType('occupancy-sensor');
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['occupancy-sensor:occupancy-status', 'battery:battery-level'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides


  //device specific
  occupancyStatusProp() {
    return this.getProperty('occupancy-sensor:occupancy-status');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/

  getOccupancyStatus() {
    return this.getPropertyValue(this.occupancyStatusProp());
  }

  isOccupied() {
    // occupancy-status is a numeric enum: 0 = No One, >= 1 = presence (1 Has One, 2 Quick Check).
    // treat any non-zero value as occupied.
    return this.getOccupancyStatus() >= 1;
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = OccupancySensorDevice;

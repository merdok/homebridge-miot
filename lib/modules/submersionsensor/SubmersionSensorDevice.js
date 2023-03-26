const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class SubmersionSensorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.SUBMERSION_SENSOR;
  }

  getDeviceName() {
    return 'Unknown submersion sensor device';
  }

  getMainService() {
    return this.getServiceByType('submersion-sensor');
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['submersion-sensor:submersion-state', 'battery:battery-level'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides


  //device specific
  submersionStateProp() {
    return this.getProperty('submersion-sensor:submersion-state');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/

  isSubmersionStateOn() {
    return this.getPropertyValue(this.submersionStateProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = SubmersionSensorDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class ContactSensorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.CONTACT_SENSOR;
  }

  getDeviceName() {
    return 'Unknown contact sensor device';
  }

  getMainService() {
    return this.getServiceByType('magnet-sensor');
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['magnet-sensor:illumination', 'magnet-sensor:contact-state', 'battery:battery-level'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides


  //device specific
  contactStateProp() {
    return this.getProperty('magnet-sensor:contact-state');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/

  isContactStateOn() {
    return this.getPropertyValue(this.contactStateProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = ContactSensorDevice;

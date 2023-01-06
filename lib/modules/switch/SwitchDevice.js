const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class SwitchDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.SWITCH;
  }

  getDeviceName() {
    return 'Unknown switch device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['switch:on', 'switch:mode'];
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


  //device specific


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // multiply switch services
  getAllSwitchServices() {
    return this.getAllServicesByType('switch') || [];
  }

  hasMultiplySwitchServices() {
    return this.getAllSwitchServices().length > 1;
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = SwitchDevice;

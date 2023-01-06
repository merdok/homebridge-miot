const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all

class UnknownDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }

  initDeviceServices() {
    if (!this.getMiotSpec()) {
      this.createService(2, 'urn:generic-spec:service:generic-switch:generic-device:1', 'Generic service');
    }
  }

  initDeviceProperties() {
    if (!this.getMiotSpec()) {
      this.addProperty('generic:on', 2, 1, 'urn:generic-spec:property:on:00000000:generic-device:1', 'Generic on', PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    }
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return [];
  }

  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  onProp() {
    return this.findPropertyByType('on');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = UnknownDevice;

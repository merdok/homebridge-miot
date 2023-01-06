const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all

class GenericDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.GENERIC;
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return this.getGenericDevPropsToMonitor();
  }

  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getPropFromMainService('on');
  }

  statusProp() {
    return this.getPropFromMainService('status');
  }

  faultProp() {
    return this.getPropFromMainService('fault');
  }

  modeProp() {
    return this.getPropFromMainService('mode');
  }

  //device specific
  motorControlProp() {
    return this.getPropFromMainService('motor-control');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // motor control
  supportsMotorControl() {
    return !!this.motorControlProp();
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/

  getMainDeviceService() {
    if (this.getAllServices() && this.getAllServices().length > 0) {
      return this.getAllServices()[0]; // usually the first one
    }
  }

  getPropFromMainService(propType) {
    const maintService = this.getMainDeviceService();
    if (maintService) {
      return maintService.getPropertyByType(propType);
    }
    return null;
  }

  getGenericDevPropsToMonitor() {
    if (!this.genericDevPropsToMonitor) {
      this.genericDevPropsToMonitor = [];
      if (this.onProp()) {
        this.genericDevPropsToMonitor.push(this.onProp().getName());
      }
      if (this.statusProp()) {
        this.genericDevPropsToMonitor.push(this.statusProp().getName());
      }
      if (this.faultProp()) {
        this.genericDevPropsToMonitor.push(this.faultProp().getName());
      }
      if (this.modeProp()) {
        this.genericDevPropsToMonitor.push(this.modeProp().getName());
      }
      if (this.motorControlProp()) {
        this.genericDevPropsToMonitor.push(this.motorControlProp().getName());
      }
    }
    return this.genericDevPropsToMonitor;
  }

}

module.exports = GenericDevice;

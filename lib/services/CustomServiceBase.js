let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Properties = require('../constants/Properties.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class CustomServiceBase {
  constructor(serviceName, accessoryObj, prop, linkedProp, api, logger) {
    this.serviceName = serviceName;
    this.accessoryObj = accessoryObj;
    this.prop = prop;
    this.linkedProp = linkedProp;
    this.api = api;
    this.logger = logger;

    // init the hap constants
    // for myself
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;

    // for superclasses
    this.initHapConstants();

    //variables
    this.isValid = false;

    // check if we have mandatory stuff
    try {
      if (!prop) throw new Error(`Missing property for ${serviceName}!`);
      if (!accessoryObj) throw new Error(`Missing accessory object for ${serviceName}!`);
    } catch (error) {
      this.logger.warn(error);
      this.logger.warn(`Cannot create custom service!`);
      return;
    }

    // prepare the custom service
    this.isValid = this.prepareService();
  }

  /*----------========== GENERAL SETUP ==========----------*/

  initHapConstants() {
    //implemented by superclasses
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareService() {
    //implemented by superclasses
    return false;
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateServiceStatus() {
    //implemented by superclasses
  }

  /*----------========== STATE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/

  getAccessoryObj() {
    return this.accessoryObj;
  }

  getServiceName() {
    return this.serviceName;
  }

  getProp() {
    return this.prop;
  }

  getLinkedProp() {
    return this.linkedProp;
  }

  isServiceValid() {
    return this.isValid;
  }


  /*----------========== HELPERS ==========----------*/

  isBoolean() {
    return this.getProp() && this.getProp().getFormat() === PropFormat.BOOL;
  }

  hasValueRange() {
    return this.getProp() && this.getProp().hasValueRange();
  }

  valueRange() {
    return this.getProp().getValueRange();
  }

  hasValueList() {
    return this.getProp() && this.getProp().hasValueList();
  }

  valueList() {
    return this.getProp().getValueList();
  }

  /*----------========== LINKED PROP HELPERS ==========----------*/

  checkLinkedPropStatus() {
    // if no linked prop specified then just ignore it and allow
    if (!this.getLinkedProp()) {
      return true;
    }

    // if linked prop prop format is not bool then also allow
    if (this.getLinkedProp().getFormat() !== PropFormat.BOOL) {
      return true;
    }

    // get the prop value and use it as status check
    return this.getLinkedProp().getValue();
  }

  enableLinkedPropIfNecessary() {
    // if no linked prop specified then do nothing
    if (!this.getLinkedProp()) {
      return;
    }

    // if linked prop prop format is not bool then also do nothing
    if (this.getLinkedProp().getFormat() !== PropFormat.BOOL) {
      return;
    }

    // enable the linked prop if it was disabled
    if (this.getLinkedProp().getValue() === false) {
      this.getLinkedProp().setValue(true);
    }
  }


  /*----------========== PROXY CAllS on ACCESSORY OBJ ==========----------*/

  isMiotDeviceConnected() {
    return this.getAccessoryObj().isMiotDeviceConnected();
  }

  addAccessoryService(service) {
    this.getAccessoryObj().addAccessoryService(service);
  }


}


module.exports = CustomServiceBase;

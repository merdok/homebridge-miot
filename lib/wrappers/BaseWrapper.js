let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Properties = require('../constants/Properties.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class BaseWrapper {
  constructor(wrapperName, accessoryObj, prop, linkedProp, configuration, api, logger) {
    this.wrapperName = wrapperName;
    this.accessoryObj = accessoryObj;
    this.prop = prop;
    this.linkedProp = linkedProp;
    this.configuration = configuration;
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
      if (!prop) throw new Error(`Missing property for ${wrapperName}!`);
      if (!accessoryObj) throw new Error(`Missing accessory object for ${wrapperName}!`);
    } catch (error) {
      this.logger.warn(error);
      this.logger.warn(`Cannot create a property wrapper!`);
      return;
    }

    // prepare the custom service
    this.isValid = this.prepareWrapper();
  }

  /*----------========== GENERAL SETUP ==========----------*/

  initHapConstants() {
    //implemented by superclasses
  }

  getWrapperType() {
    return "Generic";
  }


  /*----------========== SETUP WRAPPER ==========----------*/

  prepareWrapper() {
    //implemented by superclasses
    return false;
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/


  /*----------========== WRAPPER PROTOCOL ==========----------*/

  updateWrapperStatus() {
    //implemented by superclasses
  }


  /*----------========== STATE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/

  getAccessoryObj() {
    return this.accessoryObj;
  }

  getWrapperName() {
    return this.wrapperName;
  }

  getProp() {
    return this.prop;
  }

  getLinkedProp() {
    return this.linkedProp;
  }

  getConfiguration() {
    return this.configuration;
  }

  isWrapperValid() {
    return this.isValid;
  }

  getLogger() {
    return this.logger;
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

  isWriteOnly() {
    return this.getProp() && this.getProp().isWriteOnly();
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/

  isLinkedPropValid() {
    // if no linked prop specified then do nothing
    if (!this.getLinkedProp()) {
      return false;
    }

    // if linked prop prop format is not bool then also do nothing
    if (this.getLinkedProp().getFormat() !== PropFormat.BOOL) {
      return false;
    }

    return true;
  }

  checkLinkedPropStatus() {
    //if not valid  then just ignore it and allow
    if (!this.isLinkedPropValid()) {
      return true;
    }

    // get the prop value and use it as status check
    return this.getLinkedProp().getValue();
  }

  enableLinkedPropIfNecessary() {
    if (!this.isLinkedPropValid()) {
      return;
    }

    // enable the linked prop if it was disabled
    if (this.getLinkedProp().getValue() === false) {
      this.getLinkedProp().setValue(true);
    }
  }

  disableLinkedPropIfNecessary() {
    if (!this.isLinkedPropValid()) {
      return;
    }

    // disable the linked prop if it was enabled
    if (this.getLinkedProp().getValue() === true) {
      this.getLinkedProp().setValue(false);
    }
  }


  /*----------========== PROXY CAllS on ACCESSORY OBJ ==========----------*/

  isMiotDeviceConnected() {
    return this.getAccessoryObj().isMiotDeviceConnected();
  }

  addAccessoryService(service) {
    this.getAccessoryObj().addAccessoryService(service);
  }

  getDevice() {
    return this.getAccessoryObj().getDevice();
  }


}


module.exports = BaseWrapper;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class BasePropertyWrapper {
  constructor(wrapperName, device, accessory, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, api, logger) {

    if (new.target === BasePropertyWrapper) {
      throw new Error('Cannot instantiate BasePropertyWrapper directly!')
    }

    this.wrapperName = wrapperName;
    this.device = device;
    this.accessory = accessory;
    this.prop = prop;
    this.linkedProp = linkedProp;
    this.fixedValue = fixedValue;
    this.linkedPropFixedValue = linkedPropFixedValue;
    this.configuration = configuration;
    this.api = api;
    this.logger = logger;

    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;

    //variables
    this.isValid = false;

    // check if we have mandatory stuff
    try {
      if (!prop) throw new Error(`Missing property for ${wrapperName}!`);
      if (!device) throw new Error(`Missing device for ${wrapperName}!`);
      if (!accessory) throw new Error(`Missing accessory for ${wrapperName}!`);
    } catch (error) {
      this.logger.warn(error);
      this.logger.warn(`Cannot create a property wrapper!`);
      return;
    }

    this.logger.deepDebug(`<-W-> Creating ${this.wrapperName} wrapper of type ${this.getWrapperType()} for property ${this.prop.getName()}`);

    // prepare the custom service
    this.isValid = this.prepareWrapper();
  }

  /*----------========== PROPERTY WRAPPER INFO ==========----------*/

  getWrapperType() {
    return 'Generic';
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

  getDevice() {
    return this.device;
  }

  getAccessory() {
    return this.accessory;
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

  getFixedValue() {
    return this.fixedValue;
  }

  getLinkedPropFixedValue() {
    return this.linkedPropFixedValue;
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


  /*----------========== CONVENIENCE ==========----------*/

  createStatefulSwitch(name, id, getterFn, setterFn) {
    let newStatefulSwitch = new Service.Switch(name, id);
    newStatefulSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(getterFn.bind(this))
      .onSet(setterFn.bind(this));

    return newStatefulSwitch;
  }

  createStatlessSwitch(name, id, setterFn) {
    let newStatelessSwitch = new Service.Switch(name, id);
    newStatelessSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(this.isStatelessSwitchOn.bind(this))
      .onSet(setterFn.bind(this));

    return newStatelessSwitch;
  }

  isStatelessSwitchOn() {
    return false;
  }


  /*----------========== HELPERS ==========----------*/

  generateServiceId(suffix) {
    let serviceId = this.getProp().getName();
    serviceId = serviceId.replace(/-./g, x => x[1].toUpperCase()); // kebap case to camel case
    serviceId = serviceId.replace(/:./g, x => x[1].toUpperCase()); // : to camel case
    serviceId = serviceId + 'Service';

    if (this.getFixedValue()) {
      serviceId = serviceId + this.getFixedValue();
    }

    if (suffix) {
      serviceId = serviceId + suffix;
    }

    // make sure we do not have duplicate service names
    let counter = 0;
    let finalServiceId = serviceId;
    while (this.hasAccessoryServiceById(finalServiceId)) {
      counter = counter + 1;
      finalServiceId = serviceId + counter;
    }

    return finalServiceId;
  }

  setPropValue(value) {
    this.getDevice().setPropertyValue(this.getProp(), value);
  }

  getPropValue() {
    return this.getProp().getValue();
  }

  isBoolean() {
    return this.getProp() && this.getProp().getFormat() === PropFormat.BOOL;
  }

  isString() {
    return this.getProp() && this.getProp().getFormat() === PropFormat.STRING;
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

  isWritable() {
    return this.getProp() && this.getProp().isWritable();
  }

  isWriteOnly() {
    return this.getProp() && this.getProp().isWriteOnly();
  }

  getUnit() {
    return this.getProp() ? this.getProp().getUnit() : PropUnit.NONE;
  }

  hasFixedValue() {
    return typeof this.getFixedValue() !== 'undefined' && this.getFixedValue() !== null;
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/

  hasLinkedPropFixedValue() {
    return typeof this.getLinkedPropFixedValue() !== 'undefined' && this.getLinkedPropFixedValue() !== null;
  }

  isLinkedPropBoolean() {
    return this.getLinkedProp() && this.getLinkedProp().getFormat() === PropFormat.BOOL;
  }

  checkLinkedPropStatus() {
    //if no linked prop specified then just ignore it and allow
    if (!this.getLinkedProp()) {
      return true;
    }

    // if the linked property value is set then check whether the prop value is qeual to the linked prop value
    if (this.hasLinkedPropFixedValue()) {
      return this.getLinkedProp().getValue() === this.getLinkedPropFixedValue();
    }

    // if boolean then return the value as status check
    if (this.isLinkedPropBoolean()) {
      return this.getLinkedProp().getValue();
    }

    return true
  }

  enableLinkedPropIfNecessary() {
    if (!this.getLinkedProp() || !this.isLinkedPropBoolean()) {
      return;
    }

    // enable the linked prop if it was disabled
    if (this.getLinkedProp().getValue() === false) {
      this.getDevice().setPropertyValue(this.getLinkedProp(), true);
    }
  }

  disableLinkedPropIfNecessary() {
    if (!this.getLinkedProp() || !this.isLinkedPropBoolean()) {
      return;
    }

    // disable the linked prop if it was enabled
    if (this.getLinkedProp().getValue() === true) {
      this.getDevice().setPropertyValue(this.getLinkedProp(), false);
    }
  }


  /*----------========== PROXY CAllS on ACCESSORY OBJ ==========----------*/

  addAccessoryService(service) {
    this.getAccessory().addService(service);
  }

  hasAccessoryServiceById(serviceId) {
    return !!this.getAccessory().getService(serviceId);
  }


  /*----------========== PROXY CAllS on DEVICE ==========----------*/

  isMiotDeviceConnected() {
    return this.getDevice().isConnected();
  }


}


module.exports = BasePropertyWrapper;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class BaseService {
  constructor(serviceId, serviceName, miotService, device, accessory, api, logger) {

    if (new.target === BaseService) {
      throw new Error('Cannot instantiate BaseService directly!')
    }

    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.miotService = miotService;
    this.device = device;
    this.accessory = accessory;
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
      if (!miotService) throw new Error(`Missing miot service for ${serviceName || serviceId}!`);
      if (!device) throw new Error(`Missing device for ${serviceName || serviceId}!`);
      if (!accessory) throw new Error(`Missing accessory for ${serviceName || serviceId}!`);
    } catch (error) {
      this.logger.warn(error);
      this.logger.warn(`Cannot create a custom service! Missing information!`);
      return;
    }

    this.logger.deepDebug(`<-S-> Creating ${serviceName || serviceId} custom service of type ${this.getServiceType()} for service ${miotService.getRawType()}`);

    // prepare the custom service
    try {
      this.isValid = this.prepareService();
    } catch (err) {
      this.isValid = false;
      this.logger.warn(`Failed to create custom service with name ${serviceName || serviceId}! Error during service creation! Skipping...`);
      this.logger.debug(err);
    }
  }

  /*----------========== SERVICE INFO ==========----------*/

  getServiceType() {
    return 'Generic';
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


  /*----------========== SERVICE PROPERTIES ==========----------*/


  /*----------========== GETTERS ==========----------*/

  getDevice() {
    return this.device;
  }

  getAccessory() {
    return this.accessory;
  }

  getServiceId() {
    let serviceId = this.serviceId;
    if (!serviceId) {
      serviceId = `${this.getServiceDesc() + this.getServiceSiid()}`;
    }
    return serviceId;
  }

  getServiceName() {
    return this.serviceName;
  }

  getMiotService() {
    return this.miotService;
  }

  isServiceValid() {
    return this.isValid;
  }

  getLogger() {
    return this.logger;
  }


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/

  getServiceSiid() {
    let siid = this.getMiotService().getId();
    return siid;
  }

  getServiceDesc() {
    let serviceDesc = this.getMiotService().getDescription();
    return serviceDesc;
  }


  /*----------========== ACCESSORY ACTIONS ==========----------*/

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

  getPropertyValue(propObj) {
    return this.getDevice().getPropertyValue(propObj);
  }

  async setPropertyValue(propObj, value) {
    return this.getDevice().setPropertyValue(propObj, value);
  }

  getPropertyValueRange(propObj) {
    return this.getDevice().getPropertyValueRange(propObj);
  }

  addPropertyToMonitor(prop) {
    return this.getDevice().addPropertyToMonitor(prop);
  }


}


module.exports = BaseService;

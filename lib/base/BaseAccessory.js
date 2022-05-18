let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const DevTypes = require('../constants/DevTypes.js');
const PropertyWrapper = require('../wrappers/PropertyWrapper.js');
const PropertyMonitorWrapper = require('../wrappers/PropertyMonitorWrapper.js');
const PropValueListWrapper = require('../wrappers/PropValueListWrapper.js');
const OffDelayWrapper = require('../wrappers/OffDelayWrapper.js');
const OutletService = require('../services/OutletService.js');
const LightService = require('../services/LightService.js');


class BaseAccessory {
  constructor(name, device, uuid, config, api, logger) {

    if (new.target === BaseAccessory) {
      throw new Error("Cannot instantiate BaseAccessory directly!")
    }

    this.api = api;
    this.logger = logger;

    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;

    // check if we have mandatory device info
    try {
      if (!device) throw new Error(`Missing miot device for ${config.name}!`);
      if (!uuid) throw new Error(`Missing uuid for ${config.name}!`);
      if (this.getAccessoryType() !== device.getType()) throw new Error(`Accessory type ${this.getAccessoryType()} cannot be used for device type ${device.getType()}!`);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`Something went wrong!`);
      this.logger.error(`Failed to create accessory, missing mandatory information!`);
      return;
    }

    // variables
    this.name = name;
    this.uuid = uuid;
    this.device = device;
    this.config = config;
    this.accessories = [];
    this.propertyWrappers = [];
    this.customServices = [];

    // init accessory object
    this.initAccessoryObject();

    // init accessories
    this.accessories = this.initAccessories(this.getName(), this.getUuid()) || this.accessories;
    if (this.accessories && this.accessories.length > 0) {
      this.setupMainAccessoryService();
      this.setupAdditionalAccessoryServices();

      //not needed right now
      //  this.getAccessory().on('identify', () => {
      //    this.log("%s identified!", this.getAccessory().displayName);
      //  });

    } else {
      this.logger.warn(`Something went wrong! Could initialize the accessory!`);
    }
  }


  /*----------========== INIT ==========----------*/

  initAccessoryObject() {
    //implemented by superclasses
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    //implemented by superclasses
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    //implemented by superclasses
  }

  setupAdditionalAccessoryServices() {
    //implemented by superclasses
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/


  /*----------========== SERVICES STATUS ==========----------*/

  updateAccessoryStatus() {
    // called by index.js on device status update
    this.updateAllCustomWrapperStatus();
    this.updateAllCustomServiceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== SWITCH SERVICE HELPERS ==========----------*/

  createStatefulSwitch(name, id, getterFn, setterFn) {
    let newStatefulSwitch = new Service.Switch(name, id);
    newStatefulSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(getterFn.bind(this))
      .onSet(setterFn.bind(this));

    return newStatefulSwitch;
  }


  /*----------========== STATELESS SWITCH SERVICES HELPERS ==========----------*/

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


  /*----------========== GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  getUuid() {
    return this.uuid;
  }

  getDevice() {
    return this.device;
  }

  getConfig() {
    return this.config;
  }

  getAccessory() {
    return this.accessories[0];
  }

  getAccessories() {
    return this.accessories;
  }

  getLogger() {
    return this.logger;
  }


  /*----------========== INFORMATION SERVICE ==========----------*/

  updateInformationService(name, manufacturer, model, deviceId, pluginVer) {
    if (this.getAccessory()) {
      // remove the preconstructed information service, since i will be adding my own
      this.getAccessory().removeService(this.getAccessory().getService(Service.AccessoryInformation));

      this.informationService = new Service.AccessoryInformation();
      this.informationService
        .setCharacteristic(Characteristic.Name, name)
        .setCharacteristic(Characteristic.Manufacturer, manufacturer)
        .setCharacteristic(Characteristic.Model, model)
        .setCharacteristic(Characteristic.SerialNumber, deviceId)
        .setCharacteristic(Characteristic.FirmwareRevision, pluginVer);

      this.addAccessoryService(this.informationService);
    }
  }


  /*----------========== PROPERTY WRAPPERS ==========----------*/

  createAndAddWrapper(wrapperClass, wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration) {
    if (wrapperClass) {
      if (prop) {
        let newWrapper = new wrapperClass(wrapperName, this.getDevice(), this.getAccessory(), prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, this.api, this.logger);
        if (newWrapper) {
          if (newWrapper.isWrapperValid()) {
            this.logger.debug(`Successfully created ${wrapperName} wrapper of type ${newWrapper.getWrapperType()}!`);
            this.propertyWrappers.push(newWrapper);
            return newWrapper;
          } else {
            this.logger.warn(`Cannot add ${wrapperName} wrapper! Invalid property!`);
          }
        } else {
          this.logger.debug(`Failed to create ${wrapperName} wrapper! Missing required data!`);
        }
      } else {
        this.logger.debug(`Cannot add ${wrapperName} wrapper! Property not found on the device!`);
      }
    } else {
      this.logger.debug(`Cannot add ${wrapperName} wrapper! Wrong or missing property wrapper class!`);
    }
    return null;
  }

  addPropValueListWrapper(wrapperName, prop, linkedProp) {
    return this.createAndAddWrapper(PropValueListWrapper, wrapperName, prop, linkedProp, null, null, null);
  }

  addPropWrapper(wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue) {
    return this.createAndAddWrapper(PropertyWrapper, wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue, null);
  }

  addPropMonitorWrapper(wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue) {
    return this.createAndAddWrapper(PropertyMonitorWrapper, wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue, null);
  }

  addOffDelayWrapper(wrapperName, prop, linkedProp) {
    return this.createAndAddWrapper(OffDelayWrapper, wrapperName, prop, linkedProp, null, null, null);
  }

  updateAllCustomWrapperStatus() {
    this.propertyWrappers.forEach((custWrapper, i) => {
      custWrapper.updateWrapperStatus();
    });
  }


  /*----------========== CUSTOM SERVICES ==========----------*/

  createAndAddCustomService(custServiceClass, serviceId, serviceName, miotService) {
    if (custServiceClass) {
      if (miotService) {
        let newCustService = new custServiceClass(serviceId, serviceName, miotService, this.getDevice(), this.getAccessory(), this.api, this.logger);
        if (newCustService) {
          if (newCustService.isServiceValid()) {
            this.logger.debug(`Successfully created ${serviceName || serviceId} custom service of type ${newCustService.getServiceType()}!`);
            this.customServices.push(newCustService);
            return newCustService;
          } else {
            this.logger.warn(`Cannot add ${serviceName || serviceId} custom service! Invalid service!`);
          }
        } else {
          this.logger.debug(`Failed to create ${serviceName || serviceId} custom service! Missing required data!`);
        }
      } else {
        this.logger.debug(`Cannot add ${serviceName || serviceId} custom service! Service not found on the device!`);
      }
    } else {
      this.logger.debug(`Cannot add ${serviceName || serviceId} custom service! Wrong or missing custom service class!`);
    }
    return null;
  }

  addOutletService(serviceId, serviceName, miotService) {
    return this.createAndAddCustomService(OutletService, serviceId, serviceName, miotService);
  }

  addLightService(serviceId, serviceName, miotService) {
    return this.createAndAddCustomService(LightService, serviceId, serviceName, miotService);
  }

  updateAllCustomServiceStatus() {
    this.customServices.forEach((custService, i) => {
      custService.updateServiceStatus();
    });
  }


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/

  getConfigValue(configKey, defaultValue) {
    let configValue = this.getConfig()[configKey];
    if (configValue == undefined) {
      return defaultValue;
    }
    return configValue;
  }

  addAccessoryService(service) {
    this.getAccessory().addService(service);
  }

  hasAccessoryServiceById(serviceId) {
    return !!this.getAccessory().getService(serviceId);
  }

  isMiotDeviceConnected() {
    return this.getDevice() && this.getDevice().isConnected();
  }


}


module.exports = BaseAccessory;

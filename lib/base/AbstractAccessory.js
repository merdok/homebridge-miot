let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const DevTypes = require('../constants/DevTypes.js');
const PropertyWrapper = require('../wrappers/PropertyWrapper.js');
const PropertyMonitorWrapper = require('../wrappers/PropertyMonitorWrapper.js');
const PropValueListWrapper = require('../wrappers/PropValueListWrapper.js');
const OffDelayWrapper = require('../wrappers/OffDelayWrapper.js');
const OutletService = require('../services/OutletService.js');
const LightService = require('../services/LightService.js');


class AbstractAccessory {
  constructor(name, device, uuid, config, api, logger) {

    if (new.target === AbstractAccessory) {
      throw new Error("Cannot instantiate AbstractAccessory directly!")
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
      // setup main accessory service
      this.setupMainAccessoryService();

      // setup additional accessory services
      let isOnlyMainService = this.getConfigValue('onlyMainService', false);
      if (!isOnlyMainService) {
        this.setupAdditionalAccessoryServices();
        //TODO: consider battery service as main service?
      }

      // setup customization services, should only be implemented in BaseAccessory
      this.setupCustomizationServices();

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

  setupCustomizationServices() {
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
    newStatefulSwitch.addOptionalCharacteristic(Characteristic.ConfiguredName);
    newStatefulSwitch.setCharacteristic(Characteristic.ConfiguredName, name);
    newStatefulSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(getterFn.bind(this))
      .onSet(setterFn.bind(this));

    return newStatefulSwitch;
  }


  /*----------========== STATELESS SWITCH SERVICES HELPERS ==========----------*/

  createStatlessSwitch(name, id, setterFn) {
    let newStatelessSwitch = new Service.Switch(name, id);
    newStatelessSwitch.addOptionalCharacteristic(Characteristic.ConfiguredName);
    newStatelessSwitch.setCharacteristic(Characteristic.ConfiguredName, name);
    newStatelessSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(this.isStatelessSwitchOn.bind(this))
      .onSet((value) => {
        setterFn.bind(this)(value);
        setTimeout(() => {
          if (newStatelessSwitch) newStatelessSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        }, Constants.BUTTON_RESET_TIMEOUT);
      });

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

  createWrapper(wrapperClass, wrapperName, prop) {
    if (wrapperClass) {
      if (prop) {
        let newWrapper = new wrapperClass(wrapperName, prop, this.getDevice(), this.getAccessory(), this.api, this.logger);
        if (newWrapper) {
          return newWrapper;
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

  initAndAddWrapper(wrapper) {
    if (wrapper) {
      wrapper.initWrapper();
      if (wrapper.isWrapperValid()) {
        this.logger.debug(`Successfully created ${wrapper.getWrapperName()} wrapper of type ${wrapper.getWrapperType()}!`);
        this.propertyWrappers.push(wrapper);
        return wrapper;
      } else {
        this.logger.warn(`Cannot add ${wrapper.getWrapperName()} wrapper! Invalid property!`);
      }
    } else {
      this.logger.debug(`Cannot initialize wrapper! Missing wrapper object!`);
    }
    return null;
  }

  addPropValueListWrapper(wrapperName, prop, linkedProp) {
    const newValListWrapper = this.createWrapper(PropValueListWrapper, wrapperName, prop);
    if (newValListWrapper) {
      newValListWrapper.setLinkedProp(linkedProp);
      return this.initAndAddWrapper(newValListWrapper);
    }
    return null;
  }

  addPropWrapper(wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration) {
    const newPropWrapper = this.createWrapper(PropertyWrapper, wrapperName, prop);
    if (newPropWrapper) {
      newPropWrapper.setFixedValue(fixedValue);
      newPropWrapper.setLinkedProp(linkedProp);
      newPropWrapper.setLinkedPropFixedValue(linkedPropFixedValue);
      newPropWrapper.setConfiguration(configuration);
      return this.initAndAddWrapper(newPropWrapper);
    }
    return null;
  }

  addPropMonitorWrapper(wrapperName, prop, linkedProp, fixedValue, linkedPropFixedValue, fixedValueOperator) {
    const newPropMonitorWrapper = this.createWrapper(PropertyMonitorWrapper, wrapperName, prop);
    if (newPropMonitorWrapper) {
      newPropMonitorWrapper.setFixedValue(fixedValue);
      newPropMonitorWrapper.setFixedValueOperator(fixedValueOperator);
      newPropMonitorWrapper.setLinkedProp(linkedProp);
      newPropMonitorWrapper.setLinkedPropFixedValue(linkedPropFixedValue);
      return this.initAndAddWrapper(newPropMonitorWrapper);
    }
    return null;
  }

  addOffDelayWrapper(wrapperName, prop, linkedProp) {
    const newOffDelayWrapper = this.createWrapper(OffDelayWrapper, wrapperName, prop);
    if (newOffDelayWrapper) {
      newOffDelayWrapper.setLinkedProp(linkedProp);
      return this.initAndAddWrapper(newOffDelayWrapper);
    }
    return null;
  }

  updateAllCustomWrapperStatus() {
    this.propertyWrappers.forEach((custWrapper, i) => {
      custWrapper.updateWrapperStatus();
    });
  }


  /*----------========== CUSTOM SERVICES ==========----------*/

  createCustomService(custServiceClass, serviceId, serviceName, miotService) {
    if (custServiceClass) {
      if (miotService) {
        let newCustService = new custServiceClass(serviceId, serviceName, miotService, this.getDevice(), this.getAccessory(), this.api, this.logger);
        if (newCustService) {
          return newCustService;
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

  initAndAddCustomService(customService) {
    if (customService) {
      customService.initService();
      if (customService.isServiceValid()) {
        this.logger.debug(`Successfully created ${customService.getServiceName() || customService.getServiceId()} custom service of type ${customService.getServiceType()}!`);
        this.customServices.push(customService);
        return customService;
      } else {
        this.logger.warn(`Cannot add ${customService.getServiceName() || customService.getServiceId()} custom service! Invalid service!`);
      }
    } else {
      this.logger.debug(`Cannot initialize custom service! Missing custom service object!`);
    }
    return null;
  }

  addOutletService(serviceId, serviceName, miotService) {
    const newOutletService = this.createCustomService(OutletService, serviceId, serviceName, miotService);
    if (newOutletService) {
      return this.initAndAddCustomService(newOutletService);
    }
    return null;
  }

  addLightService(serviceId, serviceName, miotService) {
    const newLightService = this.createCustomService(LightService, serviceId, serviceName, miotService);
    if (newLightService) {
      return this.initAndAddCustomService(newLightService);
    }
    return null;
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


module.exports = AbstractAccessory;

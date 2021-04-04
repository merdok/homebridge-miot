let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class GenericAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    this.log = log;
    this.api = api;
    this.logger = logger;

    // init the hap constants
    this.initHapConstants();

    // check if we have mandatory device info
    try {
      if (!miotDevice) throw new Error(`Missing miot device for ${config.name}!`);
      if (!uuid) throw new Error(`Missing uuid for ${config.name}!`);
      if (this.getAccessoryType() !== miotDevice.getType()) throw new Error(`Accessory type ${this.getAccessoryType()} cannot be used for device type ${miotDevice.getType()}!`);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`Something went wrong!`);
      this.logger.error(`Failed to create accessory, missing mandatory information!`);
      return;
    }

    // configuration
    this.initConfigProperties(config);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotDevice = miotDevice;
    this.accessory = null;

    // init
    this.initAccessory();
    this.setupAccessoryServices();

    // return self
    return this;
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initHapConstants() {
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;
  }

  initConfigProperties(config) {
    //none for generic
  }

  getAccessoryType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.SWITCH);
  }

  setupAccessoryServices() {
    // prepare the switch service
    this.prepareSwitchService();

    // additional services
    //none
  }

  prepareSwitchService() {
    this.powerSwitchService = this.createStatefulSwitch('Power', 'powerSwitchService', this.getPowerState, this.setPowerState);
    this.accessory.addService(this.powerSwitchService);
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICES STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.getDevice()) {
      if (this.powerSwitchService) this.powerSwitchService.getCharacteristic(Characteristic.On).updateValue(this.getPowerState());
    }
  }


  /*----------========== SWITCH SERVICE HELPERS ==========----------*/

  createStatefulSwitch(name, id, setter, getter) {
    let adjustedName = this.getName() + ' ' + name;
    let newStatefulSWitch = new Service.Switch(adjustedName, id);
    newStatefulSWitch
      .getCharacteristic(Characteristic.On)
      .onGet(setter.bind(this))
      .onSet(getter.bind(this));

    return newStatefulSWitch;
  }


  /*----------========== GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  getUuid() {
    return this.uuid;
  }

  getDevice() {
    return this.miotDevice;
  }

  getAccessory() {
    return this.accessory;
  }


  /*----------========== HELPERS ==========----------*/

  getPropValue(prop, defaultValue) {
    if (prop == undefined) {
      return defaultValue;
    }
    return prop;
  }

  isMiotDeviceConnected() {
    return this.getDevice() && this.getDevice().isConnected();
  }


}


module.exports = GenericAccessory;

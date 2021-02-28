let Service, Characteristic, Accessory, HapStatusError, HAPStatus;

class GenericAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    this.log = log;
    this.api = api;
    this.logger = logger;

    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;

    // check if we have mandatory device info
    try {
      if (!miotDevice) throw new Error(`Missing miot device for ${config.name}!`);
      if (!uuid) throw new Error(`Missing uuid for ${config.name}!`);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`Something went wrong!`);
      this.logger.error(`Failed to create accessory, missing mandatory information!`);
      return;
    }

    // configuration
    // none for the generic accessory

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotGenericDevice = miotDevice;
    this.genericAccesory = null;

    this.initAccessory();

    // return the generic accessory
    return this.genericAccesory;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    // prepare the switch accessory
    this.genericAccesory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.SWITCH);

    // prepare accessory services
    this.setupAccessoryServices();
  }

  setupAccessoryServices() {
    // prepare the switch service
    this.prepareSwitchService();

    // additional services
    //none
  }

  prepareSwitchService() {
    this.powerSwitchService = new Service.Switch(this.name + ' Power', 'powerSwitchService');
    this.powerSwitchService
      .getCharacteristic(Characteristic.On)
      .onGet(this.getPowerState.bind(this))
      .onSet(this.setPowerState.bind(this));

    this.genericAccesory.addService(this.powerSwitchService);
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotGenericDevice.isPowerOn();
    }
    return false;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.miotGenericDevice.setPowerOn(isPowerOn);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotGenericDevice) {
      if (this.powerSwitchService) this.powerSwitchService.getCharacteristic(Characteristic.On).updateValue(this.getPowerState());
    }
  }


  /*----------========== HELPERS ==========----------*/

  getPropValue(prop, defaultValue) {
    if (prop == undefined) {
      return defaultValue;
    }
    return prop;
  }

  isMiotDeviceConnected() {
    return this.miotGenericDevice && this.miotGenericDevice.isConnected();
  }


}


module.exports = GenericAccessory;

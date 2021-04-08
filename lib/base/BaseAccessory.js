let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const DevTypes = require('../constants/DevTypes.js');


class BaseAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    this.log = log;
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
    this.accessory = this.initAccessory();
    if (this.accessory) {
      this.setupMainAccessoryService();
      this.setupAdditionalAccessoryServices();
    } else {
      this.logger.warn(`Something went wrong! Could initialize the accessory!`);
    }

    // return self
    return this;
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initHapConstants() {
    //implemented by superclasses
  }

  initConfigProperties(config) {
    //implemented by superclasses
  }

  getAccessoryType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    //implemented by superclasses
  }

  setupMainAccessoryService() {
    //implemented by superclasses
  }

  setupAdditionalAccessoryServices() {
    //implemented by superclasses
  }

  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareBuzzerControlService() {
    if (this.getDevice().supportsBuzzerControl()) {
      this.buzzerService = this.createStatefulSwitch('Buzzer', 'buzzerService', this.getBuzzerValue, this.setBuzzerValue);
      this.addAccessoryService(this.buzzerService);
    }
  }

  prepareLedControlService() {
    if (this.getDevice().supportsLedControl()) {
      if (this.getDevice().supportsLedControlBrightness()) {
        // if brightness supported then add a lightbulb for controlling
        this.ledBrightnessService = new Service.Lightbulb('LED', 'ledBrightnessService');
        this.ledBrightnessService
          .getCharacteristic(Characteristic.On)
          .onGet(this.getLedValue.bind(this))
          .onSet(this.setLedValue.bind(this));
        this.ledBrightnessService
          .addCharacteristic(new Characteristic.Brightness())
          .onGet(this.getLedBrightnessValue.bind(this))
          .onSet(this.setLedBrightnessValue.bind(this));
        this.addAccessoryService(this.ledBrightnessService);
      } else {
        // if not then just a simple switch
        this.ledService = this.createStatefulSwitch('LED', 'ledService', this.getLedValue, this.setLedValue);
        this.addAccessoryService(this.ledService);
      }
    }
  }

  prepareShutdownTimerService() {
    if (this.getDevice().supportsPowerOffTimer()) {
      this.shutdownTimerService = new Service.Lightbulb('Shutdown timer', 'shutdownTimerService');
      this.shutdownTimerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getShutdownTimerValue.bind(this))
        .onSet(this.setShutdownTimerValue.bind(this));
      this.shutdownTimerService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getShutdownTimerBrightnessValue.bind(this))
        .onSet(this.setShutdownTimerBrightnessValue.bind(this));

      this.addAccessoryService(this.shutdownTimerService);
    }
  }

  prepareTemperatureService() {
    if (this.getDevice().supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor('Temperature', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperatureValue.bind(this));
      this.addAccessoryService(this.temperatureService);
    }
  }

  prepareRelativeHumidityService() {
    if (this.getDevice().supportsRelativeHumidityReporting()) {
      this.relativeHumidityService = new Service.HumiditySensor('Humidity', 'relativeHumidityService');
      this.relativeHumidityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.relativeHumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .onGet(this.getCurrentRelativeHumidityValue.bind(this));
      this.addAccessoryService(this.relativeHumidityService);
    }
  }

  // ----- characteristics

  addChildLockCharacteristic(service) {
    if (this.getDevice().supportsChildLock() && service) {
      service
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControlsState.bind(this))
        .onSet(this.setLockPhysicalControlsState.bind(this));
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getBuzzerValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerValue(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLedEnabled();
    }
    return false;
  }

  setLedValue(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.getDevice().isLedEnabled() === false) {
        this.getDevice().setLedEnabled(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedBrightnessValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getLedValue();
    }
    return 0;
  }

  setLedBrightnessValue(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLedValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimerValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isShutdownTimerEnabled();
    }
    return false;
  }

  setShutdownTimerValue(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false) { // only if disabling, enabling will automatically set it to 100%
        this.getDevice().setShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimerBrightnessValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getShutdownTimer();
    }
    return 0;
  }

  setShutdownTimerBrightnessValue(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setShutdownTimer(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperatureValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTemperature();
    }
    return 0;
  }

  getCurrentRelativeHumidityValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getRelativeHumidity();
    }
    return 0;
  }

  getLockPhysicalControlsState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControlsState(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.getDevice().setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICES STATUS ==========----------*/

  // called by index.js on device status update
  updateDeviceStatus() {
    if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.getBuzzerValue());
    if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.getLedValue());
    if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.getLedValue());
    if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLedBrightnessValue());
    if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.getShutdownTimerValue());
    if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getShutdownTimerBrightnessValue());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperatureValue());
    if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidityValue());
  }


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
      .onGet(this.getStatelessSwitchValue.bind(this))
      .onSet(setterFn.bind(this));

    return newStatelessSwitch;
  }

  getStatelessSwitchValue() {
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

  addAccessoryService(service) {
    this.accessory.addService(service);
  }

  isMiotDeviceConnected() {
    return this.getDevice() && this.getDevice().isConnected();
  }


}


module.exports = BaseAccessory;

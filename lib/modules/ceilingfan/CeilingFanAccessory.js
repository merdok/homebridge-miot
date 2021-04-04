let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CeilingFanAccessory {
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
    this.miotCeilingFanDevice = miotDevice;
    this.accessory = null;

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
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.fanModeControl = this.getPropValue(config['fanModeControl'], false);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.lightModeControl = this.getPropValue(config['lightModeControl'], false);
  }

  getAccessoryType() {
    return DevTypes.CEILING_FAN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.FAN);
  }

  setupAccessoryServices() {
    this.prepareFanService();

    this.prepareShutdownTimerService();
    this.prepareFanLevelControlServices();
    this.prepareFanModeControlServices();

    this.prepareLightService();
    this.prepareLightModeControlServices();
  }

  prepareFanService() {
    this.fanService = new Service.Fanv2(this.name, 'fanService');
    this.fanService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getPowerState.bind(this))
      .onSet(this.setPowerState.bind(this));
    this.fanService
      .addCharacteristic(Characteristic.CurrentFanState)
      .onGet(this.getCurrentFanState.bind(this));

    if (this.miotCeilingFanDevice.supportsSteplessFanSpeed()) {
      this.fanService
        .addCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    this.accessory.addService(this.fanService);
  }


  prepareShutdownTimerService() {
    if (this.shutdownTimer && this.miotCeilingFanDevice.supportsPowerOffTimer()) {
      this.shutdownTimerService = new Service.Lightbulb(this.name + ' Shutdown timer', 'shutdownTimerService');
      this.shutdownTimerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getShutdownTimerEnabled.bind(this))
        .onSet(this.setShutdownTimerEnabled.bind(this));
      this.shutdownTimerService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getShutdownTimer.bind(this))
        .onSet(this.setShutdownTimer.bind(this));

      this.accessory.addService(this.shutdownTimerService);
    }
  }

  prepareFanLevelControlServices() {
    if (this.fanLevelControl && this.miotCeilingFanDevice.supportsFanLevels()) {
      this.fanLevelControlServices = new Array();
      this.miotCeilingFanDevice.fanLevels().forEach((fanLevel, i) => {
        let fanLevelValue = fanLevel.value;
        let fanLevelName = fanLevel.description;
        let tmpFanLevelSwitch = new Service.Switch('Fan Level - ' + fanLevelName, 'fanLevelControlService' + fanLevelValue);
        tmpFanLevelSwitch
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getFanLevelSwitchState(fanLevelValue);
          })
          .onSet((state) => {
            this.setFanLevelSwitchState(state, fanLevelValue);
          });

        this.accessory.addService(tmpFanLevelSwitch);
        this.fanLevelControlServices.push(tmpFanLevelSwitch);
      });
    }
  }

  prepareFanModeControlServices() {
    if (this.fanModeControl && this.miotCeilingFanDevice.supportsModes()) {
      this.fanModeControlServices = new Array();
      this.miotCeilingFanDevice.modes().forEach((mode, i) => {
        let modeValue = mode.value;
        let modeName = mode.description;
        let tmpFanModeSwitch = new Service.Switch('Mode - ' + modeName, 'fanModeControlService' + modeValue);
        tmpFanModeSwitch
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getModeSwitchState(modeValue);
          })
          .onSet((state) => {
            this.setModeSwitchState(state, modeValue);
          });

        this.accessory.addService(tmpFanModeSwitch);
        this.fanModeControlServices.push(tmpFanModeSwitch);
      });
    }
  }

  prepareLightService() {
    if (this.miotCeilingFanDevice.hasBuiltInLight()) {
      this.lightService = new Service.Lightbulb(this.name + ' Light', 'lightService');
      this.lightService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLightOnState.bind(this))
        .onSet(this.setLightOnState.bind(this));

      if (this.miotCeilingFanDevice.supportsLightBrightness()) {
        this.lightService
          .addCharacteristic(new Characteristic.Brightness())
          .onGet(this.getLightBrightness.bind(this))
          .onSet(this.setLightBrightness.bind(this));
      }

      if (this.miotCeilingFanDevice.supportsLightColorTemp()) {
        this.lightService
          .addCharacteristic(new Characteristic.ColorTemperature())
          .onGet(this.getLightColorTemp.bind(this))
          .onSet(this.setLightColorTemp.bind(this));
      }

      this.accessory.addService(this.lightService);
    }
  }

  prepareLightModeControlServices() {
    if (this.lightModeControl && this.miotCeilingFanDevice.supportsLightModes()) {
      this.lightModeControlServices = new Array();
      this.miotCeilingFanDevice.lightModes().forEach((mode, i) => {
        let modeValue = mode.value;
        let modeName = mode.description;
        let tmpLightModeSwitch = new Service.Switch('Light Mode - ' + modeName, 'lightModeControlService' + modeValue);
        tmpLightModeSwitch
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getLightModeSwitchState(modeValue);
          })
          .onSet((state) => {
            this.setLightModeSwitchState(state, modeValue);
          });

        this.accessory.addService(tmpLightModeSwitch);
        this.lightModeControlServices.push(tmpLightModeSwitch);
      });
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn === false || this.miotCeilingFanDevice.isPowerOn() === false) {
        this.miotCeilingFanDevice.setPowerOn(isPowerOn);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.isPowerOn() ? Characteristic.CurrentFanState.BLOWING_AIR : Characteristic.CurrentFanState.IDLE;
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }

  getShutdownTimerEnabled() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.isShutdownTimerEnabled();
    }
    return false;
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.getRotationSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the rotation slider
      if (this.rotationSpeedTimeout) clearTimeout(this.rotationSpeedTimeout);
      this.rotationSpeedTimeout = setTimeout(() => this.miotCeilingFanDevice.setRotationSpeed(value), 500);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setShutdownTimerEnabled(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false) { // only if disabling, enabling will automatically set it to 100%
        this.miotCeilingFanDevice.setShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimer() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.getShutdownTimer();
    }
    return 0;
  }

  setShutdownTimer(level) {
    if (this.isMiotDeviceConnected()) {
      this.miotCeilingFanDevice.setShutdownTimer(level);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getFanLevelSwitchState(level) {
    if (this.isMiotDeviceConnected() && this.miotCeilingFanDevice.isPowerOn()) {
      return this.miotCeilingFanDevice.getFanLevel() === level;
    }
    return false;
  }

  setFanLevelSwitchState(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.miotCeilingFanDevice.turnOnIfNecessary();
        this.miotCeilingFanDevice.setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getModeSwitchState(mode) {
    if (this.isMiotDeviceConnected() && this.miotCeilingFanDevice.isPowerOn()) {
      return this.miotCeilingFanDevice.getMode() === mode;
    }
    return false;
  }

  setModeSwitchState(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.miotCeilingFanDevice.turnOnIfNecessary();
        this.miotCeilingFanDevice.setMode(mode);
      }
      setTimeout(() => {
        this.updateModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightOnState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.isLightOn();
    }
    return false;
  }

  setLightOnState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.miotCeilingFanDevice.isLightOn() === false) {
        this.miotCeilingFanDevice.setLightOn(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.getBrightness();
    }
    return 0;
  }

  setLightBrightness(brightness) {
    if (this.isMiotDeviceConnected()) {
      this.miotCeilingFanDevice.setBrightness(brightness);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightColorTemp() {
    if (this.isMiotDeviceConnected()) {
      return this.miotCeilingFanDevice.getColorTemp();
    }
    return 140;
  }

  setLightColorTemp(colorTemp) {
    if (this.isMiotDeviceConnected()) {
      this.miotCeilingFanDevice.setColorTemp(colorTemp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightModeSwitchState(mode) {
    if (this.isMiotDeviceConnected() && this.miotCeilingFanDevice.isLightOn()) {
      return this.miotCeilingFanDevice.getLightMode() === mode;
    }
    return false;
  }

  setLightModeSwitchState(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.miotCeilingFanDevice.turnLightOnIfNecessary();
        this.miotCeilingFanDevice.setLightMode(mode);
      }
      setTimeout(() => {
        this.updateLightModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotCeilingFanDevice) {
      if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getPowerState());
      if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
      if (this.fanService && this.miotCeilingFanDevice.supportsSteplessFanSpeed()) this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.getShutdownTimerEnabled());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getShutdownTimer());
      this.updateFanLevelSwitches();
      this.updateModeSwitches();

      if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.getLightOnState());
      if (this.lightService && this.miotCeilingFanDevice.supportsLightBrightness()) this.lightService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLightBrightness());
      if (this.lightService && this.miotCeilingFanDevice.supportsLightColorTemp()) this.lightService.getCharacteristic(Characteristic.ColorTemperature).updateValue(this.getLightColorTemp());
      this.updateLightModeSwitches();
    }
  }

  getAccessory() {
    return this.accessory;
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateFanLevelSwitches() {
    if (this.fanLevelControlServices) {
      let currentLevel = this.miotCeilingFanDevice.getFanLevel();
      this.fanLevelControlServices.forEach((tmpFanLevelSwitch, i) => {
        let fanLevel = this.miotCeilingFanDevice.fanLevels()[i];
        let fanLevelValue = fanLevel.value;
        let isSwitchOn = (currentLevel === fanLevelValue) && this.miotCeilingFanDevice.isPowerOn();
        tmpFanLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateModeSwitches() {
    if (this.fanModeControlServices) {
      let currentMode = this.miotCeilingFanDevice.getMode();
      this.fanModeControlServices.forEach((tmpFanModeSwitch, i) => {
        let mode = this.miotCeilingFanDevice.modes()[i];
        let modeValue = mode.value;
        let isSwitchOn = (currentMode === modeValue) && this.miotCeilingFanDevice.isPowerOn();
        tmpFanModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateLightModeSwitches() {
    if (this.lightModeControlServices) {
      let currentMode = this.miotCeilingFanDevice.getLightMode();
      this.lightModeControlServices.forEach((tmpLightModeSwitch, i) => {
        let mode = this.miotCeilingFanDevice.lightModes()[i];
        let modeValue = mode.value;
        let isSwitchOn = (currentMode === modeValue) && this.miotCeilingFanDevice.isLightOn();
        tmpLightModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
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
    return this.miotCeilingFanDevice && this.miotCeilingFanDevice.isConnected();
  }


}


module.exports = CeilingFanAccessory;

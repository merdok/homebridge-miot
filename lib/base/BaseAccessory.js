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
      this.buzzerService = this.createStatefulSwitch('Buzzer', 'buzzerService', this.isBuzzerOn, this.setBuzzerOn);
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
          .onGet(this.isLedOn.bind(this))
          .onSet(this.setLedOn.bind(this));
        this.ledBrightnessService
          .addCharacteristic(new Characteristic.Brightness())
          .onGet(this.getLedBrightness.bind(this))
          .onSet(this.setLedBrightness.bind(this));
        this.addAccessoryService(this.ledBrightnessService);
      } else {
        // if not then just a simple switch
        this.ledService = this.createStatefulSwitch('LED', 'ledService', this.isLedOn, this.setLedOn);
        this.addAccessoryService(this.ledService);
      }
    }
  }

  prepareScreenControlService() {
    if (this.getDevice().supportsScreenControl()) {
      if (this.getDevice().supportsScreenBrightnessList()) {
        this.screenLevelControlServices = new Array();
        this.getDevice().screenBrightnessList().forEach((level, i) => {
          let levelVal = level.value;
          let levelDesc = level.description;
          let tmpScreenLevelSwitch = this.createStatefulSwitch('Screen - ' + levelDesc, 'screenLevelControlService' + levelVal, () => {
            return this.isScreenLevelSwitchOn(levelVal);
          }, (value) => {
            this.setScreenLevelSwitchOn(value, levelVal);
          });
          this.addAccessoryService(tmpScreenLevelSwitch);
          this.screenLevelControlServices.push(tmpScreenLevelSwitch);
        });
      } else if (this.getDevice().supportsScreenBrightnessRange()) {
        this.screenBrightnessControlService = new Service.Lightbulb('Screen', 'screenBrightnessControlService');
        this.screenBrightnessControlService
          .getCharacteristic(Characteristic.On)
          .onGet(this.isScreenOn.bind(this))
          .onSet(this.setScreenOn.bind(this));
        this.screenBrightnessControlService
          .addCharacteristic(new Characteristic.Brightness())
          .onGet(this.getScreenBrightness.bind(this))
          .onSet(this.setScreenBrightness.bind(this));
        this.addAccessoryService(this.screenBrightnessControlService);
      }

      if (this.getDevice().supportsSimpleScreenControl() && this.getDevice().supportsScreenBrightnessRange() === false) {
        this.screenService = this.createStatefulSwitch('Screen', 'screenService', this.isScreenOn, this.setScreenOn);
        this.addAccessoryService(this.screenService);
      }
    }
  }

  prepareShutdownTimerService() {
    if (this.getDevice().supportsPowerOffTimer()) {
      this.shutdownTimerService = new Service.Lightbulb('Shutdown timer', 'shutdownTimerService');
      this.shutdownTimerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isShutdownTimerOn.bind(this))
        .onSet(this.setShutdownTimerOn.bind(this));
      this.shutdownTimerService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getShutdownTimerBrightness.bind(this))
        .onSet(this.setShutdownTimerBrightness.bind(this));

      this.addAccessoryService(this.shutdownTimerService);
    }
  }

  prepareModeControlServices() {
    if (this.getDevice().supportsModes()) {
      this.modeControlServices = new Array();
      this.getDevice().modes().forEach((mode, i) => {
        let modeVal = mode.value;
        let modeDesc = mode.description;
        let tmpFanModeSwitch = this.createStatefulSwitch('Mode - ' + modeDesc, 'modeControlService' + modeVal, () => {
          return this.isModeSwitchOn(modeVal);
        }, (value) => {
          this.setModeSwitchOn(value, modeVal);
        });
        this.addAccessoryService(tmpFanModeSwitch);
        this.modeControlServices.push(tmpFanModeSwitch);
      });
    }
  }

  prepareFanLevelControlServices() {
    if (this.getDevice().supportsFanLevels()) {
      this.fanLevelControlServices = new Array();
      this.getDevice().fanLevels().forEach((fanLevel, i) => {
        let fanLevelVal = fanLevel.value;
        let fanLevelDesc = fanLevel.description;
        let tmpFanLevelSwitch = this.createStatefulSwitch('Fan Level - ' + fanLevelDesc, 'fanLevelControlService' + fanLevelVal, () => {
          return this.isFanLevelSwitchOn(fanLevelVal);
        }, (value) => {
          this.setFanLevelSwitchOn(value, fanLevelVal);
        });
        this.addAccessoryService(tmpFanLevelSwitch);
        this.fanLevelControlServices.push(tmpFanLevelSwitch);
      });
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
        .onGet(this.getCurrentTemperature.bind(this));
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
        .onGet(this.getCurrentRelativeHumidity.bind(this));
      this.addAccessoryService(this.relativeHumidityService);
    }
  }


  // ----- characteristics

  addChildLockCharacteristic(service) {
    if (this.getDevice().supportsChildLock() && service) {
      this.childLockCharacteristic = service.addCharacteristic(Characteristic.LockPhysicalControls);
      this.childLockCharacteristic
        .onGet(this.getLockPhysicalControlsState.bind(this))
        .onSet(this.setLockPhysicalControlsState.bind(this));
    }
  }

  addRotationSpeedCharacteristic(service) {
    if (this.getDevice().supportsRotationSpeed() && service) {
      this.rotationSpeedCharacteristic = service.addCharacteristic(Characteristic.RotationSpeed);
      this.rotationSpeedCharacteristic
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }
  }

  addBrightnessCharacteristic(service) {
    if (this.getDevice().supportsBrightness() && service) {
      this.brightnessCharacteristic = service.addCharacteristic(new Characteristic.Brightness());
      this.brightnessCharacteristic
        .onGet(this.getBrightness.bind(this))
        .onSet(this.setBrightness.bind(this));
    }
  }

  addColorTemperatureCharacteristic(service) {
    if (this.getDevice().supportsColorTemp() && service) {
      this.colorTemperatureCharacteristic = service.addCharacteristic(new Characteristic.ColorTemperature());
      this.colorTemperatureCharacteristic
        .onGet(this.getColorTemperature.bind(this))
        .onSet(this.setColorTemperature.bind(this));
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  // buzzer
  isBuzzerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setBuzzerEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // led
  isLedOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLedEnabled();
    }
    return false;
  }

  setLedOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLedEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getLedValue();
    }
    return 0;
  }

  setLedBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLedValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  //screen
  isScreenLevelSwitchOn(level) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getScreenBrightnessValue() === level;
    }
    return false;
  }

  setScreenLevelSwitchOn(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().setScreenBrightnessValue(level);
      }
      setTimeout(() => {
        this.updateScreenLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isScreenOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isScreenEnabled();
    }
    return false;
  }

  setScreenOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setScreenEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getScreenBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getScreenBrightnessPercentage();
    }
    return 0;
  }

  setScreenBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setScreenBrightnessPercentage(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // shutdown timer
  isShutdownTimerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isShutdownTimerEnabled();
    }
    return false;
  }

  setShutdownTimerOn(value) {
    if (this.isMiotDeviceConnected()) {
      if (value === false) { // only if disabling, enabling will automatically set it to 100%
        this.getDevice().setShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimerBrightness() {
    if (this.isMiotDeviceConnected()) {
      return Math.min(this.getDevice().getShutdownTimer(), 100);
    }
    return 0;
  }

  setShutdownTimerBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setShutdownTimer(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // mode
  isModeSwitchOn(mode) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getMode() === mode;
    }
    return false;
  }

  setModeSwitchOn(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().setMode(mode);
      }
      setTimeout(() => {
        this.updateModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // fan level
  isFanLevelSwitchOn(level) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getFanLevel() === level;
    }
    return false;
  }

  setFanLevelSwitchOn(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // temperature
  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTemperature();
    }
    return 0;
  }

  // humidity
  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getRelativeHumidity();
    }
    return 0;
  }


  // ----- characteristics

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

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFanSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the rotation slider
      if (this.rotationSpeedTimeout) clearTimeout(this.rotationSpeedTimeout);
      this.rotationSpeedTimeout = setTimeout(() => this.getDevice().setFanSpeed(value), 500);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getBrightness();
    }
    return 0;
  }

  setBrightness(brightness) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setBrightness(brightness);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getColorTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getColorTemp();
    }
    return 140;
  }

  setColorTemperature(colorTemp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setColorTemp(colorTemp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICES STATUS ==========----------*/

  // called by index.js on device status update
  updateDeviceStatus() {
    if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.isBuzzerOn());
    if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.isLedOn());
    if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.isLedOn());
    if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLedBrightness());
    if (this.screenService) this.screenService.getCharacteristic(Characteristic.On).updateValue(this.isScreenOn());
    if (this.screenBrightnessControlService) this.screenBrightnessControlService.getCharacteristic(Characteristic.On).updateValue(this.isScreenOn());
    if (this.screenBrightnessControlService) this.screenBrightnessControlService.getCharacteristic(Characteristic.Brightness).updateValue(this.getScreenBrightness());
    if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.isShutdownTimerOn());
    if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getShutdownTimerBrightness());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
    this.updateScreenLevelSwitches();
    this.updateModeSwitches();
    this.updateFanLevelSwitches();

    if (this.childLockCharacteristic) this.childLockCharacteristic.updateValue(this.getLockPhysicalControlsState());
    if (this.rotationSpeedCharacteristic) this.rotationSpeedCharacteristic.updateValue(this.getRotationSpeed());
    if (this.brightnessCharacteristic) this.brightnessCharacteristic.updateValue(this.getBrightness());
    if (this.colorTemperatureCharacteristic) this.colorTemperatureCharacteristic.updateValue(this.getColorTemperature());
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateScreenLevelSwitches() {
    if (this.screenLevelControlServices) {
      let currentLevel = this.getDevice().getScreenBrightnessValue();
      this.screenLevelControlServices.forEach((tmpScreenLevelSwitch, i) => {
        let level = this.getDevice().screenBrightnessList()[i];
        let levelVal = level.value;
        let isSwitchOn = (currentLevel === levelVal) && this.getDevice().isPowerOn();
        tmpScreenLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateModeSwitches() {
    if (this.modeControlServices) {
      let currentMode = this.getDevice().getMode();
      this.modeControlServices.forEach((tmpFanModeSwitch, i) => {
        let mode = this.getDevice().modes()[i];
        let modeVal = mode.value;
        let isSwitchOn = (currentMode === modeVal) && this.getDevice().isPowerOn();
        tmpFanModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateFanLevelSwitches() {
    if (this.fanLevelControlServices) {
      let currentLevel = this.getDevice().getFanLevel();
      this.fanLevelControlServices.forEach((tmpFanLevelSwitch, i) => {
        let fanLevel = this.getDevice().fanLevels()[i];
        let fanLevelVal = fanLevel.value;
        let isSwitchOn = (currentLevel === fanLevelVal) && this.getDevice().isPowerOn();
        tmpFanLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
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
    return this.miotDevice;
  }

  getAccessory() {
    return this.accessory;
  }

  getLogger() {
    return this.logger;
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

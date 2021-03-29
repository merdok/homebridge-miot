let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');

class AirPurifierAccessory {
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
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], false);
    this.modeControl = this.getPropValue(config['modeControl'], false);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotDevice = miotDevice;
    this.accessory = null;

    this.initAccessory();
    this.setupAccessoryServices();

    // return self
    return this;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.AIR_PURIFIER);
  }

  setupAccessoryServices() {
    this.prepareAccessoryService();

    this.prepareBuzzerControlService();
    this.prepareLedControlService();
    this.prepareFanLevelControlServices();
    this.prepareModeControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.preparePm25DensityService();
  }

  prepareAccessoryService() {
    this.airPurifierService = new Service.AirPurifier(this.name, 'airPurifierService');

    this.airPurifierService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getPowerState.bind(this))
      .onSet(this.setPowerState.bind(this));

    this.airPurifierService
      .getCharacteristic(Characteristic.CurrentAirPurifierState)
      .onGet(this.getCurrentAirPurifierState.bind(this));

    this.airPurifierService
      .getCharacteristic(Characteristic.TargetAirPurifierState)
      .onGet(this.getTargetAirPurifierState.bind(this))
      .onSet(this.setTargetAirPurifierState.bind(this));

    // if supports child lock and child lock service enabled then add it
    if (this.childLockControl && this.miotDevice.supportsChildLock()) {
      this.airPurifierService
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControls.bind(this))
        .onSet(this.setLockPhysicalControls.bind(this));
    }

    if (this.miotDevice.supportsFavoriteSpeed()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    if (this.miotDevice.supportsFilterLifeLevelReporting()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.FilterChangeIndication)
        .onGet(this.getFilterChangeIndication.bind(this));
      this.airPurifierService
        .getCharacteristic(Characteristic.FilterLifeLevel)
        .onGet(this.getFilterLifeLevel.bind(this));
    }

    this.accessory.addService(this.airPurifierService);
  }

  prepareBuzzerControlService() {
    if (this.buzzerControl && this.miotDevice.supportsBuzzerControl()) {
      this.buzzerService = new Service.Switch(this.name + ' Buzzer', 'buzzerService');
      this.buzzerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getBuzzerState.bind(this))
        .onSet(this.setBuzzerState.bind(this));
      this.accessory.addService(this.buzzerService);
    }
  }

  prepareLedControlService() {
    if (this.ledControl && this.miotDevice.supportsLedControl()) {
      this.ledService = new Service.Switch(this.name + ' LED', 'ledService');
      this.ledService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLedState.bind(this))
        .onSet(this.setLedState.bind(this));
      this.accessory.addService(this.ledService);
    }
  }

  prepareFavoriteModeService() {
    if (this.miotDevice.supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor(this.name + ' Temp', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));

      this.accessory.addService(this.temperatureService);
    }
  }

  prepareFanLevelControlServices() {
    if (this.fanLevelControl && this.miotDevice.supportsFanLevels()) {
      this.fanLevelControlServices = new Array();
      this.miotDevice.fanLevels().forEach((fanLevel, i) => {
        let fanLevelValue = fanLevel.value;
        let fanLevelName = fanLevel.description;
        let tmpFanLevelSwitch = new Service.Switch('Fan Level - ' + fanLevelName, 'fanLevelControlService' + fanLevelValue);
        tmpFanLevelSwitch
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getFanLevelState(fanLevelValue);
          })
          .onSet((state) => {
            this.setFanLevelState(state, fanLevelValue);
          });

        this.accessory.addService(tmpFanLevelSwitch);
        this.fanLevelControlServices.push(tmpFanLevelSwitch);
      });
    }
  }

  prepareModeControlServices() {
    if (this.modeControl && this.miotDevice.supportsModes()) {
      this.modeControlServices = new Array();
      this.miotDevice.modes().forEach((mode, i) => {
        let modeValue = mode.value;
        let modeName = mode.description;
        let tmpFanModeSwitch = new Service.Switch('Mode - ' + modeName, 'modeControlService' + modeValue);
        tmpFanModeSwitch
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getModeSwitchState(modeValue);
          })
          .onSet((state) => {
            this.setModeSwitchState(state, modeValue);
          });

        this.accessory.addService(tmpFanModeSwitch);
        this.modeControlServices.push(tmpFanModeSwitch);
      });
    }
  }

  prepareTemperatureService() {
    if (this.miotDevice.supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor(this.name + ' Temp', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));

      this.accessory.addService(this.temperatureService);
    }
  }

  prepareRelativeHumidityService() {
    if (this.miotDevice.supportsRelativeHumidityReporting()) {
      this.relativeHumidityService = new Service.HumiditySensor(this.name + ' Humidity', 'relativeHumidityService');
      this.relativeHumidityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.relativeHumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .onGet(this.getCurrentRelativeHumidity.bind(this));

      this.accessory.addService(this.relativeHumidityService);
    }
  }

  preparePm25DensityService() {
    if (this.miotDevice.supportsPm25DensityReporting()) {
      this.airQualityService = new Service.AirQualitySensor(this.name + ' Air Quality', 'airQualityService');
      this.airQualityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.airQualityService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getAirQualityStatusActive.bind(this));
      this.airQualityService
        .getCharacteristic(Characteristic.AirQuality)
        .onGet(this.getAirQuality.bind(this));
      this.airQualityService
        .getCharacteristic(Characteristic.PM2_5Density)
        .onGet(this.getPM25Density.bind(this));

      this.accessory.addService(this.airQualityService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn === false || this.miotDevice.isPowerOn() === false) {
        this.miotDevice.setPowerOn(isPowerOn);
        this.airPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState).updateValue(Characteristic.CurrentAirPurifierState.IDLE);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentAirPurifierState() {
    if (this.isMiotDeviceConnected() && this.miotDevice.isPowerOn()) {
      if (this.miotDevice.isIdle()) {
        return Characteristic.CurrentAirPurifierState.IDLE;
      } else {
        return Characteristic.CurrentAirPurifierState.PURIFYING_AIR;
      }
    }
    return Characteristic.CurrentAirPurifierState.INACTIVE;
  }

  getTargetAirPurifierState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isAutoModeEnabled() ? Characteristic.TargetAirPurifierState.AUTO : Characteristic.TargetAirPurifierState.MANUAL;
    }
    return Characteristic.TargetAirPurifierState.MANUAL;
  }

  setTargetAirPurifierState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetAirPurifierState.AUTO) {
        this.miotDevice.enableAutoMode();
      } else {
        this.miotDevice.enableFavoriteMode();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLockPhysicalControls() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControls(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.miotDevice.setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.getFavoriteSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      if (this.miotDevice.isFavoriteModeEnabled() === false) {
        this.miotDevice.enableFavoriteMode(); // enable the favorite mode if it was disabled
      }
      this.miotDevice.setFavoriteSpeed(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getBuzzerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotDevice.setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isLedEnabled();
    }
    return false;
  }

  setLedState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.miotDevice.isLedEnabled() === false) {
        this.miotDevice.setLedEnabled(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getFanLevelState(level) {
    if (this.isMiotDeviceConnected() && this.miotDevice.isPowerOn()) {
      return this.miotDevice.getFanLevel() === level;
    }
    return false;
  }

  setFanLevelState(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.turnDeviceOnIfNecessary();
        this.miotDevice.setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getModeSwitchState(mode) {
    if (this.isMiotDeviceConnected() && this.miotDevice.isPowerOn()) {
      return this.miotDevice.getMode() === mode;
    }
    return false;
  }

  setModeSwitchState(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.turnDeviceOnIfNecessary();
        this.miotDevice.setMode(mode);
      }
      setTimeout(() => {
        this.updateModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.getTemperature();
    }
    return 0;
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.getRelativeHumidity();
    }
    return 0;
  }

  getAirQualityStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.isPowerOn();
    }
    return false;
  }

  getAirQuality() {
    if (this.isMiotDeviceConnected() && this.miotDevice.isPowerOn()) {
      let pm25Density = this.miotDevice.getPm25Density();
      if (pm25Density <= 7) {
        return Characteristic.AirQuality.EXCELLENT;
      } else if (pm25Density > 7 && pm25Density <= 15) {
        return Characteristic.AirQuality.GOOD;
      } else if (pm25Density > 15 && pm25Density <= 30) {
        return Characteristic.AirQuality.FAIR;
      } else if (pm25Density > 30 && pm25Density <= 55) {
        return Characteristic.AirQuality.INFERIOR;
      } else if (pm25Density > 55) {
        return Characteristic.AirQuality.POOR;
      }
      return Characteristic.AirQuality.UNKNOWN;
    }
    return Characteristic.AirQuality.UNKNOWN;
  }

  getPM25Density() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.getPm25Density();
    }
    return 0;
  }

  getFilterChangeIndication() {
    if (this.isMiotDeviceConnected() && this.miotDevice.isPowerOn()) {
      let lifeLevel = this.miotDevice.getFilterLifeLevel();
      if (lifeLevel <= 5) {
        return Characteristic.FilterChangeIndication.CHANGE_FILTER;
      }
      return Characteristic.FilterChangeIndication.FILTER_OK;
    }
    return Characteristic.FilterChangeIndication.FILTER_OK;
  }

  getFilterLifeLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.miotDevice.getFilterLifeLevel();
    }
    return 0;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotDevice) {
      if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.Active).updateValue(this.getPowerState());
      if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState).updateValue(this.getCurrentAirPurifierState());
      if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.TargetAirPurifierState).updateValue(this.getTargetAirPurifierState());
      if (this.airPurifierService && this.childLockControl && this.miotDevice.supportsChildLock()) this.airPurifierService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControls());
      if (this.airPurifierService && this.miotDevice.supportsFavoriteSpeed()) this.airPurifierService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
      if (this.airPurifierService && this.miotDevice.supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndication());
      if (this.airPurifierService && this.miotDevice.supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevel());
      if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.getBuzzerState());
      if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
      if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getAirQualityStatusActive());
      if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.AirQuality).updateValue(this.getAirQuality());
      if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.PM2_5Density).updateValue(this.getPM25Density());
      this.updateFanLevelSwitches();
      this.updateModeSwitches();
    }
  }

  getAccessory() {
    return this.accessory;
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateFanLevelSwitches() {
    if (this.fanLevelControlServices) {
      let currentLevel = this.miotDevice.getFanLevel();
      this.fanLevelControlServices.forEach((tmpFanLevelSwitch, i) => {
        let fanLevel = this.miotDevice.fanLevels()[i];
        let fanLevelValue = fanLevel.value;
        let isSwitchOn = (currentLevel === fanLevelValue) && this.miotDevice.isPowerOn();
        tmpFanLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateModeSwitches() {
    if (this.modeControlServices) {
      let currentMode = this.miotDevice.getMode();
      this.modeControlServices.forEach((tmpFanModeSwitch, i) => {
        let mode = this.miotDevice.modes()[i];
        let modeValue = mode.value;
        let isSwitchOn = (currentMode === modeValue) && this.miotDevice.isPowerOn();
        tmpFanModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
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
    return this.miotDevice && this.miotDevice.isConnected();
  }

  turnDeviceOnIfNecessary() {
    // if the device is turned off then turn it on
    if (this.miotDevice.isPowerOn() === false) {
      this.miotDevice.setPowerOn(true);
    }
  }


}


module.exports = AirPurifierAccessory;

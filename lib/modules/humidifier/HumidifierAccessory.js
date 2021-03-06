let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');


class HumidifierAccessory {
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
    this.screenControl = this.getPropValue(config['screenControl'], true);
    this.dryModeControl = this.getPropValue(config['dryModeControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], false);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotHumidifierDevice = miotDevice;
    this.humidifierAccesory = null;

    this.initAccessory();

    // return self
    return this;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    // prepare the humidifier accessory
    this.humidifierAccesory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.AIR_HUMIDIFIER);

    // prepare accessory services
    this.setupAccessoryServices();
  }

  setupAccessoryServices() {
    // prepare the humidifier service
    this.prepareHumidifierService();

    // additional services
    this.prepareBuzzerControlService();
    this.prepareScreenControlService();
    this.prepareLedControlService();
    this.prepareDryModeControlService();
    this.prepareFanLevelControlService();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }

  prepareHumidifierService() {
    this.humidifierService = new Service.HumidifierDehumidifier(this.name, 'humidifierAccesory');

    this.humidifierService.getCharacteristic(Characteristic.Active)
      .onGet(this.getPowerState.bind(this))
      .onSet(this.setPowerState.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState)
      .onGet(this.getCurrentHumidifierDehumidifierState.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.TargetHumidifierDehumidifierState)
      .onGet(this.getTargetHumidifierDehumidifierState.bind(this))
      .onSet(this.setTargetHumidifierDehumidifierState.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .onGet(this.getCurrentRelativeHumidity.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold)
      .onGet(this.getRelativeHumidityHumidifierThreshold.bind(this))
      .onSet(this.setRelativeHumidityHumidifierThreshold.bind(this));

    if (this.miotHumidifierDevice.supportsChildLock()) {
      this.humidifierService
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControls.bind(this))
        .onSet(this.setLockPhysicalControls.bind(this));
    }

    if (this.miotHumidifierDevice.supportsSteplessFanSpeed()) {
      this.humidifierService
        .getCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    if (this.miotHumidifierDevice.supportsWaterLevelReporting()) {
      this.humidifierService
        .getCharacteristic(Characteristic.WaterLevel)
        .onGet(this.getWaterLevel.bind(this));
    }


    this.humidifierAccesory.addService(this.humidifierService);
  }

  prepareBuzzerControlService() {
    if (this.buzzerControl && this.miotHumidifierDevice.supportsBuzzerControl()) {
      this.buzzerService = new Service.Switch(this.name + ' Buzzer', 'buzzerService');
      this.buzzerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getBuzzerState.bind(this))
        .onSet(this.setBuzzerState.bind(this));
      this.humidifierAccesory.addService(this.buzzerService);
    }
  }

  prepareScreenControlService() {
    if (this.screenControl && this.miotHumidifierDevice.supportsScreenDimControl()) {
      this.screenControlService = new Service.Switch(this.name + ' Screen', 'screenControlService');
      this.screenControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getScreenDimState.bind(this))
        .onSet(this.setScreenDimState.bind(this));
      this.humidifierAccesory.addService(this.screenControlService);
    }
  }

  prepareLedControlService() {
    if (this.ledControl && this.miotHumidifierDevice.supportsLedControl()) {
      this.ledService = new Service.Switch(this.name + ' LED', 'ledService');
      this.ledService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getLedState.bind(this))
        .onSet(this.setLedState.bind(this));
      this.humidifierAccesory.addService(this.ledService);
    }
  }

  prepareDryModeControlService() {
    if (this.dryModeControl && this.miotHumidifierDevice.supportsDryMode()) {
      this.dryModeControlService = new Service.Switch(this.name + ' Dry Mode', 'dryModeControlService');
      this.dryModeControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getDryModeState.bind(this))
        .onSet(this.setDryModeState.bind(this));
      this.humidifierAccesory.addService(this.dryModeControlService);
    }
  }

  prepareFanLevelControlService() {
    if (this.fanLevelControl && this.miotHumidifierDevice.supportsFanLevels()) {
      this.fanLevelControlService = new Array();
      for (let i = 0; i < this.miotHumidifierDevice.fanLevels(); i++) {
        let name = i === 0 ? (this.name + ' Auto') : (this.name + ' Level ' + i);
        let tmpFanLevelButton = new Service.Switch(name, 'levelControlService' + i);
        tmpFanLevelButton
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getFanLevelState(i);
          })
          .onSet((state) => {
            this.setFanLevelState(state, i);
          });
        this.humidifierAccesory.addService(tmpFanLevelButton);
        this.fanLevelControlService.push(tmpFanLevelButton);
      }
    }
  }

  prepareTemperatureService() {
    if (this.miotHumidifierDevice.supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor(this.name + ' Temp', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));

      this.humidifierAccesory.addService(this.temperatureService);
    }
  }

  prepareRelativeHumidityService() {
    if (this.miotHumidifierDevice.supportsRelativeHumidityReporting()) {
      this.relativeHumidityService = new Service.HumiditySensor(this.name + ' Humidity', 'relativeHumidityService');
      this.relativeHumidityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.relativeHumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .onGet(this.getCurrentRelativeHumidity.bind(this));

      this.humidifierAccesory.addService(this.relativeHumidityService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn === false || this.miotHumidifierDevice.isPowerOn() === false) {
        this.miotHumidifierDevice.setPowerOn(isPowerOn);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHumidifierDehumidifierState() {
    if (this.isMiotDeviceConnected()) {
      if (this.miotHumidifierDevice.supportsDryMode() && this.miotHumidifierDevice.isDryEnabled()) return Characteristic.CurrentHumidifierDehumidifierState.DEHUMIDIFYING;
      return this.miotHumidifierDevice.isPowerOn() ? Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING : Characteristic.CurrentHumidifierDehumidifierState.IDLE;
    }
    return Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
  }


  getTargetHumidifierDehumidifierState() {
    if (this.isMiotDeviceConnected()) {
      if (this.miotHumidifierDevice.supportsDryMode() && this.miotHumidifierDevice.isDryEnabled()) return Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER;
      return this.miotHumidifierDevice.isAutoMode() ? Characteristic.TargetHumidifierDehumidifierState.AUTO : Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER;
    }
    return Characteristic.TargetHumidifierDehumidifierState.AUTO;
  }

  setTargetHumidifierDehumidifierState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetHumidifierDehumidifierState.AUTO) {
        this.miotHumidifierDevice.setAutoModeEnabled(true);
      } else if (state === Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER && this.miotHumidifierDevice.supportsDryMode()) {
        this.miotHumidifierDevice.setDryModeEnabled(true);
      } else {
        this.miotHumidifierDevice.setFanLevel(1);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getRelativeHumidity();
    }
    return 0;
  }

  getRelativeHumidityHumidifierThreshold() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getTargetHumidity();
    }
    return 0;
  }

  setRelativeHumidityHumidifierThreshold(hum) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setTargetHumidity(hum);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLockPhysicalControls() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControls(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.miotHumidifierDevice.setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getRotationSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setRotationSpeed(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getWaterLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getWaterLevelPercentage();
    }
    return 0;
  }

  getBuzzerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getScreenDimState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isScreenDark() === false;
    }
    return false;
  }

  setScreenDimState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setScreenDark(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isLedEnabled();
    }
    return false;
  }

  setLedState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.miotHumidifierDevice.isLedEnabled() === false) {
        this.miotHumidifierDevice.setLedEnabled(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getDryModeState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isDryEnabled();
    }
    return false;
  }

  setDryModeState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setDryModeEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getTemperature();
    }
    return 0;
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getRelativeHumidity();
    }
    return 0;
  }

  getFanLevelState(level) {
    if (this.isMiotDeviceConnected() && this.miotHumidifierDevice.isPowerOn()) {
      return this.miotHumidifierDevice.getFanLevel() === level;
    }
    return false;
  }

  setFanLevelState(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        // if fan turned off then turn it on
        if (this.miotHumidifierDevice.isPowerOn() === false) {
          this.miotHumidifierDevice.setPowerOn(true);
        }
        this.miotHumidifierDevice.setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelButtons();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotHumidifierDevice) {
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.Active).updateValue(this.getPowerState());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState).updateValue(this.getCurrentHumidifierDehumidifierState());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.TargetHumidifierDehumidifierState).updateValue(this.getTargetHumidifierDehumidifierState());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold).updateValue(this.getRelativeHumidityHumidifierThreshold());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControls());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
      if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.WaterLevel).updateValue(this.getWaterLevel());
      if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.getBuzzerState());
      if (this.screenControlService) this.screenControlService.getCharacteristic(Characteristic.On).updateValue(this.getScreenDimState());
      if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.dryModeControlService) this.dryModeControlService.getCharacteristic(Characteristic.On).updateValue(this.getDryModeState());
      if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
      this.updateFanLevelButtons();
    }
  }

  getAccessory() {
    return this.humidifierAccesory;
  }


  /*----------========== HELPERS ==========----------*/

  getPropValue(prop, defaultValue) {
    if (prop == undefined) {
      return defaultValue;
    }
    return prop;
  }

  isMiotDeviceConnected() {
    return this.miotHumidifierDevice && this.miotHumidifierDevice.isConnected();
  }

  updateFanLevelButtons() {
    if (this.fanLevelControlService) {
      let currentLevel = this.miotHumidifierDevice.getFanLevel();
      this.fanLevelControlService.forEach((tmpFanLevelButton, i) => {
        let fanLevelValue = i;
        if (currentLevel === fanLevelValue && this.miotHumidifierDevice.isPowerOn()) {
          tmpFanLevelButton.getCharacteristic(Characteristic.On).updateValue(true);
        } else {
          tmpFanLevelButton.getCharacteristic(Characteristic.On).updateValue(false);
        }
      });
    }
  }


}


module.exports = HumidifierAccessory;

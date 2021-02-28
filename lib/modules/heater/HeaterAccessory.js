let Service, Characteristic, Accessory, HapStatusError, HAPStatus;

class HeaterAccessory {
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
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.childLockControl = this.getPropValue(config['childLockControl'], false);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotHeaterDevice = miotDevice;
    this.heaterAccesory = null;

    this.initAccessory();

    // return the fan accessory
    return this.heaterAccesory;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    // prepare the fan accessory
    this.heaterAccesory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.THERMOSTAT);

    // prepare accessory services
    this.setupAccessoryServices();
  }

  setupAccessoryServices() {
    // prepare the fan service
    this.prepareHeaterService();

    // additional services
    this.prepareBuzzerControlService();
    this.prepareLedControlService();
    this.prepareChildLockService();
    this.prepareShutdownTimerService();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }

  prepareHeaterService() {
    this.heaterService = new Service.Thermostat(this.name, 'heaterService');

    this.heaterService
      .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
      .onGet(this.getCurrentHeatingCoolingState.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .onGet(this.getTargetHeatingCoolingState.bind(this))
      .onSet(this.setTargetHeatingCoolingState.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.TargetTemperature)
      .onGet(this.getTargetTemperature.bind(this))
      .onSet(this.setTargetTemperature.bind(this));

    this.heaterService
      .addCharacteristic(Characteristic.LockPhysicalControls)
      .onGet(this.getLockPhysicalControls.bind(this))
      .onSet(this.setLockPhysicalControls.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      //  .onGet(this.getTargetTemperature.bind(this))
      //  .onSet(this.setTargetTemperature.bind(this));
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS)


    this.heaterAccesory.addService(this.heaterService);
  }

  prepareBuzzerControlService() {
    if (this.buzzerControl && this.miotHeaterDevice.supportsBuzzerControl()) {
      this.buzzerService = new Service.Switch(this.name + ' Buzzer', 'buzzerService');
      this.buzzerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getBuzzer.bind(this))
        .onSet(this.setBuzzer.bind(this));

      this.heaterAccesory.addService(this.buzzerService);
    }
  }

  prepareLedControlService() {
    if (this.ledControl && this.miotHeaterDevice.supportsLedControl()) {
      if (this.miotHeaterDevice.supportsLedBrightness()) {
        // if brightness supported then add a lightbulb for controlling
        this.ledBrightnessService = new Service.Lightbulb(this.name + ' LED', 'ledBrightnessService');
        this.ledBrightnessService
          .getCharacteristic(Characteristic.On)
          .onGet(this.getLed.bind(this))
          .onSet(this.setLed.bind(this));
        this.ledBrightnessService
          .addCharacteristic(new Characteristic.Brightness())
          .onGet(this.getLedBrightness.bind(this))
          .onSet(this.setLedBrightness.bind(this));

        this.heaterAccesory.addService(this.ledBrightnessService);
      } else {
        // if not then just a simple switch
        this.ledService = new Service.Switch(this.name + ' LED', 'ledService');
        this.ledService
          .getCharacteristic(Characteristic.On)
          .onGet(this.getLed.bind(this))
          .onSet(this.setLed.bind(this));

        this.heaterAccesory.addService(this.ledService);
      }
    }
  }

  prepareChildLockService() {
    if (this.childLockControl && this.miotHeaterDevice.supportsChildLock()) {
      this.childLockService = new Service.Switch(this.name + ' Child Lock', 'childLockService');
      this.childLockService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getChildLockState.bind(this))
        .onSet(this.setChildLockState.bind(this));

      this.heaterAccesory.addService(this.childLockService);
    }
  }

  prepareShutdownTimerService() {
    if (this.shutdownTimer && this.miotHeaterDevice.supportsPowerOffTimer()) {
      this.shutdownTimerService = new Service.Lightbulb(this.name + ' Shutdown timer', 'shutdownTimerService');
      this.shutdownTimerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getShutdownTimerEnabled.bind(this))
        .onSet(this.setShutdownTimerEnabled.bind(this));
      this.shutdownTimerService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getShutdownTimer.bind(this))
        .onSet(this.setShutdownTimer.bind(this));

      this.heaterAccesory.addService(this.shutdownTimerService);
    }
  }

  prepareTemperatureService() {
    if (this.miotHeaterDevice.supportsTemperatureReporting()) {
      this.temperatureService = new Service.TemperatureSensor(this.name + ' Temp', 'temperatureService');
      this.temperatureService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));

      this.heaterAccesory.addService(this.temperatureService);
    }
  }

  prepareRelativeHumidityService() {
    if (this.miotHeaterDevice.supportsRelativeHumidityReporting()) {
      this.relativeHumidityService = new Service.HumiditySensor(this.name + ' Humidity', 'relativeHumidityService');
      this.relativeHumidityService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.relativeHumidityService
        .getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .onGet(this.getCurrentRelativeHumidity.bind(this));

      this.heaterAccesory.addService(this.relativeHumidityService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentHeatingCoolingState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isPowerOn() ? Characteristic.CurrentHeatingCoolingState.HEAT : Characteristic.CurrentHeatingCoolingState.COOL;
    }
    return Characteristic.CurrentHeatingCoolingState.OFF;
  }


  getTargetHeatingCoolingState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isPowerOn() ? Characteristic.TargetHeatingCoolingState.HEAT : Characteristic.TargetHeatingCoolingState.COOL;
    }
    return Characteristic.TargetHeatingCoolingState.OFF;
  }

  setTargetHeatingCoolingState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = (state === Characteristic.TargetHeatingCoolingState.HEAT) || (state === Characteristic.TargetHeatingCoolingState.AUTO);
      if (isPowerOn === false || this.miotHeaterDevice.isPowerOn() === false) {
        this.miotHeaterDevice.setPowerOn(isPowerOn);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getTemperature();
    }
    return 0;
  }

  getTargetTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getTargetTemperature();
    }
    return 0;
  }

  setTargetTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLockPhysicalControls() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControls(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.miotHeaterDevice.setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getBuzzer() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isBuzzerEnabled();
    }
    return false;
  }

  setBuzzer(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLed() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isLedEnabled();
    }
    return false;
  }

  setLed(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.miotHeaterDevice.isLedEnabled() === false) {
        this.miotHeaterDevice.setLedEnabled(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getLedBrightness();
    }
    return 0;
  }

  setLedBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setLedBrightness(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getChildLockState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isChildLockActive();
    }
    return false;
  }

  setChildLockState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setChildLock(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimerEnabled() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isShutdownTimerEnabled();
    }
    return false;
  }

  setShutdownTimerEnabled(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false) { // only if disabling, enabling will automatically set it to 100%
        this.miotHeaterDevice.setShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimer() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getShutdownTimer();
    }
    return 0;
  }

  setShutdownTimer(level) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setShutdownTimer(level);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getTemperature();
    }
    return 0;
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getRelativeHumidity();
    }
    return 0;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotHeaterDevice) {
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(this.getCurrentHeatingCoolingState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeatingCoolingState).updateValue(this.getTargetHeatingCoolingState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetTemperature).updateValue(this.getTargetTemperature());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControls());
      if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.miotHeaterDevice.isBuzzerEnabled());
      if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.miotHeaterDevice.isLedEnabled());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.miotHeaterDevice.isLedEnabled());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.miotHeaterDevice.getLedLevel());
      if (this.childLockService) this.childLockService.getCharacteristic(Characteristic.On).updateValue(this.miotHeaterDevice.isChildLockActive());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.miotHeaterDevice.isShutdownTimerEnabled());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.miotHeaterDevice.getShutdownTimer());
      if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.miotHeaterDevice.getTemperature());
      if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.miotHeaterDevice.getRelativeHumidity());
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
    return this.miotHeaterDevice && this.miotHeaterDevice.isConnected();
  }


}


module.exports = HeaterAccessory;

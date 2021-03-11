let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');

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
    this.heatLevelControl = this.getPropValue(config['heatLevelControl'], false);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotHeaterDevice = miotDevice;
    this.heaterAccesory = null;

    this.initAccessory();

    // return self
    return this;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    // prepare the heater accessory
    this.heaterAccesory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.AIR_HEATER);

    // prepare accessory services
    this.setupAccessoryServices();
  }

  setupAccessoryServices() {
    // prepare the heater service
    this.prepareHeaterService();

    // additional services
    this.prepareBuzzerControlService();
    this.prepareLedControlService();
    this.prepareShutdownTimerService();
    this.prepareHeatLevelControlService();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }

  prepareHeaterService() {
    this.heaterService = new Service.HeaterCooler(this.name, 'heaterService');

    this.heaterService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getPowerState.bind(this))
      .onSet(this.setPowerState.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .onGet(this.getCurrentHeaterCoolerState.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .onGet(this.getTargetHeaterCoolerState.bind(this))
      .onSet(this.setTargetHeaterCoolerState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHeatingCoolingState.HEAT,
        validValues: [Characteristic.TargetHeaterCoolerState.AUTO, Characteristic.TargetHeaterCoolerState.HEAT]
      });

    // if supports cool mode then allow cool mode setting
    if (this.miotHeaterDevice.supportsCoolMode()) {
      this.heaterService
        .getCharacteristic(Characteristic.TargetHeaterCoolerState)
        .setProps({
          maxValue: Characteristic.TargetHeaterCoolerState.COOL,
          validValues: [Characteristic.TargetHeaterCoolerState.AUTO, Characteristic.TargetHeaterCoolerState.HEAT, Characteristic.TargetHeaterCoolerState.COOL]
        });
    }

    this.heaterService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .onGet(this.getTargetTemperature.bind(this))
      .onSet(this.setTargetTemperature.bind(this));

    // if supports temperature range then adjust the service with the temperature ranges
    if (this.miotHeaterDevice.supportsTargetTemperatureRange()) {
      this.heaterService
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .setProps({
          minValue: this.miotHeaterDevice.targetTemperatureRange()[0] || 10,
          maxValue: this.miotHeaterDevice.targetTemperatureRange()[1] || 35,
          minStep: this.miotHeaterDevice.targetTemperatureRange()[2] || 1
        });
    }

    if (this.miotHeaterDevice.supportsChildLock()) {
      this.heaterService
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControls.bind(this))
        .onSet(this.setLockPhysicalControls.bind(this));
    }

    if (this.miotHeaterDevice.supportsSwingModes()) {
      this.heaterService
        .addCharacteristic(Characteristic.SwingMode)
        .onGet(this.getSwingMode.bind(this))
        .onSet(this.setSwingMode.bind(this));
    }

    this.heaterService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      //  .onGet(this.getTargetTemperature.bind(this))
      //  .onSet(this.setTargetTemperature.bind(this));
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);


    this.heaterAccesory.addService(this.heaterService);
  }

  prepareBuzzerControlService() {
    if (this.buzzerControl && this.miotHeaterDevice.supportsBuzzerControl()) {
      this.buzzerService = new Service.Switch(this.name + ' Buzzer', 'buzzerService');
      this.buzzerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getBuzzerState.bind(this))
        .onSet(this.setBuzzerState.bind(this));
      this.heaterAccesory.addService(this.buzzerService);
    }
  }

  prepareLedControlService() {
    if (this.ledControl && this.miotHeaterDevice.supportsLedControl()) {
      if (this.miotHeaterDevice.supportsLedControlBrightness()) {
        // if brightness supported then add a lightbulb for controlling
        this.ledBrightnessService = new Service.Lightbulb(this.name + ' LED', 'ledBrightnessService');
        this.ledBrightnessService
          .getCharacteristic(Characteristic.On)
          .onGet(this.getLedState.bind(this))
          .onSet(this.setLedState.bind(this));
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
          .onGet(this.getLedState.bind(this))
          .onSet(this.setLedState.bind(this));
        this.heaterAccesory.addService(this.ledService);
      }
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

  prepareHeatLevelControlService() {
    if (this.heatLevelControl && this.miotHeaterDevice.supportsHeatLevels()) {
      this.heatLevelControlService = new Array();
      this.miotHeaterDevice.heatLevels().forEach((heatLevel, i) => {
        let heatLevelValue = heatLevel.value;
        let heatLevelName = heatLevel.description;
        let tmpHeatLevelButton = new Service.Switch(this.name + ' ' + heatLevelName, 'heatLevelControlService' + heatLevelValue);
        tmpHeatLevelButton
          .getCharacteristic(Characteristic.On)
          .onGet(() => {
            return this.getHeatLevelState(heatLevelValue);
          })
          .onSet((state) => {
            this.setHeatLevelState(state, heatLevelValue);
          });

        this.heaterAccesory.addService(tmpHeatLevelButton);
        this.heatLevelControlService.push(tmpHeatLevelButton);
      });
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

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn === false || this.miotHeaterDevice.isPowerOn() === false) {
        this.miotHeaterDevice.setPowerOn(isPowerOn);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isPowerOn() ? Characteristic.CurrentHeaterCoolerState.HEATING : Characteristic.CurrentHeaterCoolerState.IDLE;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetHeaterCoolerState() {
    if (this.isMiotDeviceConnected() && this.miotHeaterDevice.isPowerOn()) {
      if (this.miotHeaterDevice.supportsModes()) {
        if (this.miotHeaterDevice.isAutoModeEnabled()) {
          return Characteristic.TargetHeaterCoolerState.AUTO;
        } else if (this.miotHeaterDevice.isHeatModeEnabled()) {
          return Characteristic.TargetHeaterCoolerState.HEAT;
        } else if (this.miotHeaterDevice.isCoolModeEnabled()) {
          return Characteristic.TargetHeaterCoolerState.COOL;
        } else {
          return Characteristic.TargetHeaterCoolerState.HEAT;
        }
      }
      return Characteristic.TargetHeaterCoolerState.HEAT;
    }
    return Characteristic.TargetHeaterCoolerState.AUTO;
  }

  setTargetHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      if (this.miotHeaterDevice.supportsModes()) {
        if (state === Characteristic.TargetHeaterCoolerState.AUTO) {
          this.miotHeaterDevice.enableAutoMode();
        } else if (state === Characteristic.TargetHeaterCoolerState.HEAT) {
          this.miotHeaterDevice.enableHeatMode();
        } else {
          this.miotHeaterDevice.enableCoolMode();
        }
      } else {
        this.miotHeaterDevice.setTargetTemperature(this.miotHeaterDevice.getTargetTemperature());
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getTargetTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.getTargetTemperature();
    }
    if (this.miotHeaterDevice.supportsTargetTemperatureRange()) {
      // if supports temperature range then return the minimum when the device is not connected
      return this.miotHeaterDevice.targetTemperatureRange()[0];
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

  getSwingMode() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isFanSwingModeEnabled() ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED;
    }
    return Characteristic.SwingMode.SWING_DISABLED;
  }

  setSwingMode(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.SwingMode.SWING_ENABLED) {
        this.miotHeaterDevice.enableFanSwingMode();
      } else {
        this.miotHeaterDevice.enableFanNotSwingMode();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getBuzzerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHeaterDevice.setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHeaterDevice.isLedEnabled();
    }
    return false;
  }

  setLedState(state) {
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

  getHeatLevelState(level) {
    if (this.isMiotDeviceConnected() && this.miotHeaterDevice.isPowerOn()) {
      return this.miotHeaterDevice.getHeatLevel() === level;
    }
    return false;
  }

  setHeatLevelState(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        // if fan turned off then turn it on
        if (this.miotHeaterDevice.isPowerOn() === false) {
          this.miotHeaterDevice.setPowerOn(true);
        }
        this.miotHeaterDevice.setHeatLevel(level);
      }
      setTimeout(() => {
        this.updateHeatLevelButtons();
      }, Constants.BUTTON_RESET_TIMEOUT);
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
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.Active).updateValue(this.getPowerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      //if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(this.getTargetTemperature());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getTargetTemperature());
      if (this.heaterService && this.miotHeaterDevice.supportsChildLock()) this.heaterService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControls());
      if (this.heaterService && this.miotHeaterDevice.supportsSwingModes()) this.heaterService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingMode());
      if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.getBuzzerState());
      if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLedBrightness());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.getShutdownTimerEnabled());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getShutdownTimer());
      if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
      this.updateHeatLevelButtons();
    }
  }

  getAccessory() {
    return this.heaterAccesory;
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

  updateHeatLevelButtons() {
    if (this.heatLevelControlService) {
      let currentLevel = this.miotHeaterDevice.getHeatLevel();
      this.heatLevelControlService.forEach((tmpHeatLevelButton, i) => {
        let heatLevel = this.miotHeaterDevice.heatLevels()[i];
        let heatLevelValue = heatLevel.value;
        if (currentLevel === heatLevelValue && this.miotHeaterDevice.isPowerOn()) {
          tmpHeatLevelButton.getCharacteristic(Characteristic.On).updateValue(true);
        } else {
          tmpHeatLevelButton.getCharacteristic(Characteristic.On).updateValue(false);
        }
      });
    }
  }


}


module.exports = HeaterAccessory;

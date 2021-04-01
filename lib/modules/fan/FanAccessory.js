let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FanAccessory {
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
    this.initConfigProperties(config);

    // variables
    this.name = name;
    this.uuid = uuid;
    this.miotFanDevice = miotDevice;
    this.accessory = null;

    this.initAccessory();
    this.setupAccessoryServices();

    // return self
    return this;
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initConfigProperties(config) {
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.horizontalSwingControl = this.getPropValue(config['horizontalSwingControl'], false);
    this.verticalSwingControl = this.getPropValue(config['verticalSwingControl'], false);
    this.horizontalMoveControl = this.getPropValue(config['horizontalMoveControl'], false);
    this.verticalMoveControl = this.getPropValue(config['verticalMoveControl'], false);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], true);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.ioniserControl = this.getPropValue(config['ioniserControl'], false);
    this.horizontalAngleButtons = this.getPropValue(config['horizontalAngleButtons']);
  }

  getAccessoryType() {
    return DevTypes.FAN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.name, this.uuid, this.api.hap.Accessory.Categories.FAN);
  }

  setupAccessoryServices() {
    this.prepareFanService();

    this.prepareHorizontalMoveControlService();
    this.prepareVerticalMoveControlService();
    this.prepareBuzzerControlService();
    this.prepareLedControlService();
    this.prepareVerticalSwingControlService();
    this.prepareHorizontalAngleButtonsService();
    this.prepareShutdownTimerService();
    this.prepareHorizontalSwingControlService();
    this.prepareFanLevelControlServices();
    this.prepareModeControlServices();
    this.prepareIoniserControlService();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.prepareBatteryService();
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

    // if supports child lock and child lock service enabled then add it
    if (this.childLockControl && this.miotFanDevice.supportsChildLock()) {
      this.fanService
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControls.bind(this))
        .onSet(this.setLockPhysicalControls.bind(this));
    }

    if (this.miotFanDevice.supportsSteplessFanSpeed()) {
      this.fanService
        .addCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    if (this.miotFanDevice.supportsHorizontalSwing()) {
      this.fanService
        .addCharacteristic(Characteristic.SwingMode)
        .onGet(this.getHorizontalSwingMode.bind(this))
        .onSet(this.setHorizontalSwingMode.bind(this));

      // additonaly use the rotation direction switch as convinience to turn on or off horizontal swing
      this.fanService
        .addCharacteristic(Characteristic.RotationDirection)
        .onGet(this.getRotationDirection.bind(this))
        .onSet(this.setRotationDirection.bind(this));
    }

    this.accessory.addService(this.fanService);
  }

  prepareHorizontalMoveControlService() {
    if (this.horizontalMoveControl && this.miotFanDevice.supportsHorizontalMove()) {
      this.moveLeftService = new Service.Switch(this.name + ' Move left', 'moveLeftService');
      this.moveLeftService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getMoveFanSwitch.bind(this))
        .onSet((state) => {
          this.setMoveFanSwitch(state, 'left');
        });
      this.accessory.addService(this.moveLeftService);

      this.moveRightService = new Service.Switch(this.name + ' Move right', 'moveRightService');
      this.moveRightService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getMoveFanSwitch.bind(this))
        .onSet((state) => {
          this.setMoveFanSwitch(state, 'right');
        });
      this.accessory.addService(this.moveRightService);
    }
  }

  prepareVerticalMoveControlService() {
    if (this.verticalMoveControl && this.miotFanDevice.supportsVerticalMove()) {
      this.moveUpService = new Service.Switch(this.name + ' Move up', 'moveUpService');
      this.moveUpService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getMoveFanSwitch.bind(this))
        .onSet((state) => {
          this.setMoveFanSwitch(state, 'up');
        });
      this.accessory.addService(this.moveUpService);


      this.moveDownService = new Service.Switch(this.name + ' Move down', 'moveDownService');
      this.moveDownService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getMoveFanSwitch.bind(this))
        .onSet((state) => {
          this.setMoveFanSwitch(state, 'down');
        });
      this.accessory.addService(this.moveDownService);
    }
  }

  prepareBuzzerControlService() {
    if (this.buzzerControl && this.miotFanDevice.supportsBuzzerControl()) {
      this.buzzerService = new Service.Switch(this.name + ' Buzzer', 'buzzerService');
      this.buzzerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getBuzzerState.bind(this))
        .onSet(this.setBuzzerState.bind(this));
      this.accessory.addService(this.buzzerService);
    }
  }

  prepareLedControlService() {
    if (this.ledControl && this.miotFanDevice.supportsLedControl()) {
      if (this.miotFanDevice.supportsLedControlBrightness()) {
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

        this.accessory.addService(this.ledBrightnessService);
      } else {
        // if not then just a simple switch
        this.ledService = new Service.Switch(this.name + ' LED', 'ledService');
        this.ledService
          .getCharacteristic(Characteristic.On)
          .onGet(this.getLedState.bind(this))
          .onSet(this.setLedState.bind(this));
        this.accessory.addService(this.ledService);
      }
    }
  }

  prepareShutdownTimerService() {
    if (this.shutdownTimer && this.miotFanDevice.supportsPowerOffTimer()) {
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

  prepareHorizontalSwingControlService() {
    if (this.horizontalSwingControl && this.miotFanDevice.supportsHorizontalSwing()) {
      this.horizontalSwingControlService = new Service.Switch(this.name + ' H_Swing', 'horizontalSwingControlService');
      this.horizontalSwingControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getHorizontalSwingSwitch.bind(this))
        .onSet(this.setHorizontalSwingSwitch.bind(this));
      this.accessory.addService(this.horizontalSwingControlService);
    }
  }

  prepareVerticalSwingControlService() {
    if (this.verticalSwingControl && this.miotFanDevice.supportsVerticalSwing()) {
      this.verticalSwingControlService = new Service.Switch(this.name + ' V_Swing', 'verticalSwingControlService');
      this.verticalSwingControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getVerticalSwingSwitch.bind(this))
        .onSet(this.setVerticalSwingSwitch.bind(this));
      this.accessory.addService(this.verticalSwingControlService);
    }
  }

  prepareHorizontalAngleButtonsService() {
    if (this.miotFanDevice.supportsHorizontalSwingAngle() === false && this.miotFanDevice.supportsHorizontalSwingLevels() === false) {
      return;
    }

    if (this.horizontalAngleButtons === false) {
      return;
    }

    if (this.horizontalAngleButtons === undefined || this.horizontalAngleButtons === null) {
      if (this.miotFanDevice.supportsHorizontalSwingLevels()) {
        // if the fan supports osicllation levels, and user did not specify the property then show all oscillation levels
        this.horizontalAngleButtons = this.miotFanDevice.horizontalSwingLevels();
      } else {
        return;
      }
    }

    if (Array.isArray(this.horizontalAngleButtons) === false) {
      this.logger.warn('The horizontal angle buttons service needs to be defined as an array! Please correct your config.json if you want to use the Service.');
      return;
    }

    this.horizontalAngleButtonsService = new Array();
    this.horizontalAngleButtons.forEach((value, i) => {
      let parsedValue = parseInt(value);

      if (this.checkAngleButtonValue(parsedValue) === false) {
        return;
      }

      this.horizontalAngleButtons[i] = parsedValue;

      let tmpHorizontalAngleButton = new Service.Switch(this.name + ' H_Angle - ' + parsedValue, 'angleButtonService' + i);
      tmpHorizontalAngleButton
        .getCharacteristic(Characteristic.On)
        .onGet(() => {
          return this.getHorizontalAngleButtonState(parsedValue);
        })
        .onSet((state) => {
          this.setHorizontalAngleButtonState(state, parsedValue);
        });
      this.accessory.addService(tmpHorizontalAngleButton);
      this.horizontalAngleButtonsService.push(tmpHorizontalAngleButton);
    });
  }

  prepareFanLevelControlServices() {
    if (this.fanLevelControl && this.miotFanDevice.supportsFanLevels()) {
      this.fanLevelControlServices = new Array();
      this.miotFanDevice.fanLevels().forEach((fanLevel, i) => {
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

  prepareModeControlServices() {
    if (this.modeControl && this.miotFanDevice.supportsModes()) {
      this.modeControlServices = new Array();
      this.miotFanDevice.modes().forEach((mode, i) => {
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

  prepareIoniserControlService() {
    if (this.ioniserControl && this.miotFanDevice.supportsIoniser()) {
      this.ioniserControlService = new Service.Switch(this.name + ' Ioniser', 'ioniserControlService');
      this.ioniserControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getIoniserState.bind(this))
        .onSet(this.setIoniserState.bind(this));
      this.accessory.addService(this.ioniserControlService);
    }
  }

  prepareTemperatureService() {
    if (this.miotFanDevice.supportsTemperatureReporting()) {
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
    if (this.miotFanDevice.supportsRelativeHumidityReporting()) {
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

  prepareBatteryService() {
    if (this.miotFanDevice.hasBuiltInBattery() && (this.miotFanDevice.supportsBatteryLevelReporting() || this.miotFanDevice.supportsBatteryPowerReporting())) {
      this.batteryService = new Service.BatteryService(this.name + ' Battery', 'batteryService');
      this.batteryService
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);

      if (this.miotFanDevice.supportsBatteryPowerReporting()) {
        this.batteryService
          .getCharacteristic(Characteristic.ChargingState)
          .onGet(this.getBatteryChargingState.bind(this));
      }

      if (this.miotFanDevice.supportsBatteryLevelReporting()) {
        this.batteryService
          .getCharacteristic(Characteristic.BatteryLevel)
          .onGet(this.getBatteryLevel.bind(this));
        this.batteryService
          .getCharacteristic(Characteristic.StatusLowBattery)
          .onGet(this.getBatteryLevelStatus.bind(this));
      }

      this.accessory.addService(this.batteryService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      // only fire the setPowerOn method when we want to turn off the fan or the fan is off
      // the rotaion speed slider fires this method many times even when the fan is already on so i need to limit that
      if (isPowerOn === false || this.miotFanDevice.isPowerOn() === false) {
        this.miotFanDevice.setPowerOn(isPowerOn);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLockPhysicalControls() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControls(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.miotFanDevice.setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected() && this.miotFanDevice.isPowerOn()) {
      if (this.miotFanDevice.isIdle()) {
        return Characteristic.CurrentFanState.IDLE;
      } else {
        return Characteristic.CurrentFanState.BLOWING_AI;
      }
    }
    return Characteristic.CurrentFanState.INACTIVE;;
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getRotationSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the rotation slider
      if (this.rotationSpeedTimeout) clearTimeout(this.rotationSpeedTimeout);
      this.rotationSpeedTimeout = setTimeout(() => this.miotFanDevice.setRotationSpeed(value), 500);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHorizontalSwingMode() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isHorizontalSwingEnabled() ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED
    }
    return Characteristic.SwingMode.SWING_DISABLED;
  }

  setHorizontalSwingMode(state) {
    if (this.isMiotDeviceConnected()) {
      let isSwingModeActive = state === Characteristic.SwingMode.SWING_ENABLED;
      this.miotFanDevice.setHorizontalSwingEnabled(isSwingModeActive);
      this.updateAngleButtonsAndHorizontalSwingMode(null, isSwingModeActive); // update the angel buttons if enabled
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationDirection() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isHorizontalSwingEnabled() ? Characteristic.RotationDirection.CLOCKWISE : Characteristic.RotationDirection.COUNTER_CLOCKWISE;
    }
    return Characteristic.RotationDirection.COUNTER_CLOCKWISE;
  }

  setRotationDirection(state) {
    if (this.isMiotDeviceConnected()) {
      let isSwingModeActive = state === Characteristic.RotationDirection.CLOCKWISE;
      this.miotFanDevice.setHorizontalSwingEnabled(isSwingModeActive);
      this.updateAngleButtonsAndHorizontalSwingMode(null, isSwingModeActive); // update the angel buttons if enabled
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getMoveFanSwitch() {
    return false;
  }

  setMoveFanSwitch(state, direction) {
    if (this.isMiotDeviceConnected()) {
      if (direction === 'left') {
        this.miotFanDevice.moveLeft();
      } else if (direction === 'right') {
        this.miotFanDevice.moveRight();
      } else if (direction === 'up') {
        this.miotFanDevice.moveUp();
      } else if (direction === 'down') {
        this.miotFanDevice.moveDown();
      }
      setTimeout(() => {
        if (this.moveLeftService) this.moveLeftService.getCharacteristic(Characteristic.On).updateValue(false);
        if (this.moveRightService) this.moveRightService.getCharacteristic(Characteristic.On).updateValue(false);
        if (this.moveUpService) this.moveUpService.getCharacteristic(Characteristic.On).updateValue(false);
        if (this.moveDownService) this.moveDownService.getCharacteristic(Characteristic.On).updateValue(false);
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getBuzzerState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isBuzzerEnabled();
    }
    return false;
  }

  setBuzzerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setBuzzerEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isLedEnabled();
    }
    return false;
  }

  setLedState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.miotFanDevice.isLedEnabled() === false) {
        this.miotFanDevice.setLedEnabled(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getLedValue();
    }
    return 0;
  }

  setLedBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setLedValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimerEnabled() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isShutdownTimerEnabled();
    }
    return false;
  }

  setShutdownTimerEnabled(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false) { // only if disabling, enabling will automatically set it to 100%
        this.miotFanDevice.setShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getShutdownTimer() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getShutdownTimer();
    }
    return 0;
  }

  setShutdownTimer(level) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setShutdownTimer(level);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHorizontalSwingSwitch() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isHorizontalSwingEnabled();
    }
    return false;
  }

  setHorizontalSwingSwitch(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setHorizontalSwingEnabled(state);
      this.updateAngleButtonsAndHorizontalSwingMode(null, state); // update the angel buttons if enabled
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getVerticalSwingSwitch() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isVerticalSwingEnabled();
    }
    return false;
  }

  setVerticalSwingSwitch(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setVerticalSwingEnabled(state);
      //  this.updateAngleButtonsAndHorizontalSwingMode(null, state); // update the angel buttons if enabled
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHorizontalAngleButtonState(angle) {
    if (this.isMiotDeviceConnected()) {
      if (this.miotFanDevice.isPowerOn() && this.miotFanDevice.isSwingModeEnabled() === true) {
        return this.miotFanDevice.getHorizontalSwingAngle() === angle;
      }
    }
    return false;
  }

  setHorizontalAngleButtonState(state, angle) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        // if swing mode disabled then turn it on
        if (this.miotFanDevice.isHorizontalSwingEnabled() === false) {
          this.miotFanDevice.setHorizontalSwingEnabled(true);
        }
        this.miotFanDevice.setHorizontalSwingAngle(angle);
      } else {
        this.miotFanDevice.setHorizontalSwingEnabled(false);
      }
      this.updateAngleButtonsAndHorizontalSwingMode(angle, state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getFanLevelSwitchState(level) {
    if (this.isMiotDeviceConnected() && this.miotFanDevice.isPowerOn()) {
      return this.miotFanDevice.getFanLevel() === level;
    }
    return false;
  }

  setFanLevelSwitchState(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.miotFanDevice.turnOnIfNecessary();
        this.miotFanDevice.setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getModeSwitchState(mode) {
    if (this.isMiotDeviceConnected() && this.miotFanDevice.isPowerOn()) {
      return this.miotFanDevice.getMode() === mode;
    }
    return false;
  }

  setModeSwitchState(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.miotFanDevice.turnOnIfNecessary();
        this.miotFanDevice.setMode(mode);
      }
      setTimeout(() => {
        this.updateModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getIoniserState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isIoniserEnabled();
    }
    return false;
  }

  setIoniserState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotFanDevice.setIoniserEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getTemperature();
    }
    return 0;
  }

  getCurrentRelativeHumidity() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getRelativeHumidity();
    }
    return 0;
  }

  getBatteryChargingState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.isOnBatteryPower() ? Characteristic.ChargingState.NOT_CHARGING : Characteristic.ChargingState.CHARGING;
    }
    return Characteristic.ChargingState.NOT_CHARGING;
  }

  getBatteryLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getBatteryLevel();
    }
    return 0;
  }

  getBatteryLevelStatus() {
    if (this.isMiotDeviceConnected()) {
      return this.miotFanDevice.getBatteryLevel() <= Constants.BATTERY_LOW_THRESHOLD ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }
    return Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotFanDevice) {
      if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getPowerState());
      if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
      if (this.fanService && this.miotFanDevice.supportsSteplessFanSpeed()) this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
      if (this.fanService && this.childLockControl && this.miotFanDevice.supportsChildLock()) this.fanService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControls());
      if (this.buzzerService) this.buzzerService.getCharacteristic(Characteristic.On).updateValue(this.getBuzzerState());
      if (this.ledService) this.ledService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.getLedState());
      if (this.ledBrightnessService) this.ledBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLedBrightness());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.getShutdownTimerEnabled());
      if (this.shutdownTimerService) this.shutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getShutdownTimer());
      if (this.ioniserControlService) this.ioniserControlService.getCharacteristic(Characteristic.On).updateValue(this.getIoniserState());
      if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.relativeHumidityService) this.relativeHumidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
      if (this.batteryService && this.miotFanDevice.supportsBatteryPowerReporting()) this.batteryService.getCharacteristic(Characteristic.ChargingState).updateValue(this.getBatteryChargingState());
      if (this.batteryService && this.miotFanDevice.supportsBatteryLevelReporting()) this.batteryService.getCharacteristic(Characteristic.BatteryLevel).updateValue(this.getBatteryLevel());
      if (this.batteryService && this.miotFanDevice.supportsBatteryLevelReporting()) this.batteryService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getBatteryLevelStatus());
      if (this.verticalSwingControlService) this.verticalSwingControlService.getCharacteristic(Characteristic.On).updateValue(this.getVerticalSwingSwitch());
      this.updateAngleButtonsAndHorizontalSwingMode(null, this.miotFanDevice.isSwingModeEnabled());
      this.updateFanLevelSwitches();
    }
  }

  getAccessory() {
    return this.accessory;
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateAngleButtonsAndHorizontalSwingMode(activeAngle, enabled) {
    if (this.fanService && this.miotFanDevice.supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.SwingMode).updateValue(enabled ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED);
    if (this.fanService && this.miotFanDevice.supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.RotationDirection).updateValue(enabled ? Characteristic.RotationDirection.CLOCKWISE : Characteristic.RotationDirection.COUNTER_CLOCKWISE);
    if (this.horizontalSwingControlService) this.horizontalSwingControlService.getCharacteristic(Characteristic.On).updateValue(enabled);
    if (this.horizontalAngleButtonsService) {
      // if swing mode disabled then just disable all the angle switches
      if (enabled === false || this.miotFanDevice.isPowerOn() === false) {
        activeAngle = "disabled"; // use fake value for angle
      }

      // if angle not specified then automatically update the status
      if (activeAngle === undefined || activeAngle === null) {
        activeAngle = this.miotFanDevice.getHorizontalSwingAngle();
      }

      this.horizontalAngleButtonsService.forEach((tmpHorizontalAngleButton, i) => {
        if (activeAngle === this.horizontalAngleButtons[i]) {
          tmpHorizontalAngleButton.getCharacteristic(Characteristic.On).updateValue(true);
        } else {
          tmpHorizontalAngleButton.getCharacteristic(Characteristic.On).updateValue(false);
        }
      });
    }
  }

  updateFanLevelSwitches() {
    if (this.fanLevelControlServices) {
      let currentLevel = this.miotFanDevice.getFanLevel();
      this.fanLevelControlServices.forEach((tmpFanLevelSwitch, i) => {
        let fanLevel = this.miotFanDevice.fanLevels()[i];
        let fanLevelValue = fanLevel.value;
        let isSwitchOn = (currentLevel === fanLevelValue) && this.miotFanDevice.isPowerOn();
        tmpFanLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  updateModeSwitches() {
    if (this.modeControlServices) {
      let currentMode = this.miotFanDevice.getMode();
      this.modeControlServices.forEach((tmpFanModeSwitch, i) => {
        let mode = this.miotFanDevice.modes()[i];
        let modeValue = mode.value;
        let isSwitchOn = (currentMode === modeValue) && this.miotFanDevice.isPowerOn();
        tmpFanModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  checkAngleButtonValue(angleValue) {
    if (this.miotFanDevice.supportsHorizontalSwingAngle()) {
      // if specified angle not within range then show a a warning and stop processing this value
      if (this.miotFanDevice.checkHorizontalSwingAngleWithinRange(angleValue) === false) {
        this.logger.warn(`Specified angle ${angleValue} is not within the supported range ${JSON.stringify(this.miotFanDevice.horizontalSwingAngleRange())}. Not adding angle button!`);
        return false;
      }
    } else if (this.miotFanDevice.supportsHorizontalSwingLevels()) {
      // if the fan uses predefined osiscllation levels then check if the specified angle is on the list
      if (this.miotFanDevice.checkHorizontalSwingLevelSupported(angleValue) === false) {
        this.logger.warn(`Specified angle ${angleValue} is not within the supported angle levels of your fan. Allowed values: ${JSON.stringify(this.miotFanDevice.horizontalSwingLevels())}. Not adding angle button!`);
        return false;
      }
    }

    return true;
  }


  /*----------========== HELPERS ==========----------*/

  getPropValue(prop, defaultValue) {
    if (prop == undefined) {
      return defaultValue;
    }
    return prop;
  }

  isMiotDeviceConnected() {
    return this.miotFanDevice && this.miotFanDevice.isConnected();
  }


}


module.exports = FanAccessory;

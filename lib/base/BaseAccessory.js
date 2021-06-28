let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const Constants = require('../constants/Constants.js');
const DevTypes = require('../constants/DevTypes.js');
const Properties = require('../constants/Properties.js');
const PropValueListService = require('../services/PropValueListService.js');


class BaseAccessory {
  constructor(name, miotDevice, uuid, config, api, logger) {
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
    this.customServices = [];

    // init
    this.accessory = this.initAccessory();
    if (this.accessory) {
      this.setupMainAccessoryService();
      this.setupAdditionalAccessoryServices();
    } else {
      this.logger.warn(`Something went wrong! Could initialize the accessory!`);
    }
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
      if (this.getDevice().supportsLedControlList()) {
        this.ledLevelControlServices = new Array();
        this.getDevice().ledControlList().forEach((level, i) => {
          let levelVal = level.value;
          let levelDesc = level.description;
          let tmpLedLevelSwitch = this.createStatefulSwitch('LED - ' + levelDesc, 'ledLevelControlService' + levelVal, () => {
            return this.isLedLevelSwitchOn(levelVal);
          }, (value) => {
            this.setLedLevelSwitchOn(value, levelVal);
          });
          this.addAccessoryService(tmpLedLevelSwitch);
          this.ledLevelControlServices.push(tmpLedLevelSwitch);
        });
      } else if (this.getDevice().supportsLedControlRange()) {
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
      } else {
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
      this.addPropValueListService('Mode', Properties.MODE, Properties.POWER);
    }
  }

  prepareFanLevelControlServices() {
    if (this.getDevice().supportsFanLevels()) {
      this.addPropValueListService('Fan Level', Properties.FAN_LEVEL, Properties.POWER);
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

  prepareBatteryService() {
    if (this.getDevice().supportsBatteryLevelReporting() || this.getDevice().supportsBatteryPowerReporting() || this.getDevice().supportsChargingStateReporting()) {
      this.batteryService = new Service.BatteryService('Battery', 'batteryService');
      this.batteryService
        .getCharacteristic(Characteristic.StatusLowBattery)
        .onGet(this.getStatusLowBatteryState.bind(this));

      this.batteryService
        .getCharacteristic(Characteristic.ChargingState)
        .onGet(this.getBatteryChargingState.bind(this));

      if (this.getDevice().supportsBatteryLevelReporting()) {
        this.batteryService
          .getCharacteristic(Characteristic.BatteryLevel)
          .onGet(this.getBatteryLevel.bind(this));
      }

      this.addAccessoryService(this.batteryService);
    }
  }

  prepareAirQualityService(pm25Breakpoints) {
    if (this.getDevice().supportsPm25DensityReporting()) {
      // setup the breakpoints
      this.preparePm25Breakpoints(pm25Breakpoints);

      this.airQualityService = new Service.AirQualitySensor('Air Quality', 'airQualityService');
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

      this.addAccessoryService(this.airQualityService);
    }
  }

  prepareCarbonDioxideService(co2AbnormalThreshold) {
    if (this.getDevice().supportsCo2DensityReporting()) {
      // setup the threshold
      this.prepareCo2AbnormalThreshold(co2AbnormalThreshold);

      this.carbonDioxideService = new Service.CarbonDioxideSensor('Carbon Dioxide', 'carbonDioxideService');
      this.carbonDioxideService
        .setCharacteristic(Characteristic.StatusFault, Characteristic.StatusFault.NO_FAULT)
        .setCharacteristic(Characteristic.StatusTampered, Characteristic.StatusTampered.NOT_TAMPERED)
        .setCharacteristic(Characteristic.StatusLowBattery, Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
      this.carbonDioxideService
        .getCharacteristic(Characteristic.StatusActive)
        .onGet(this.getCarbonDioxideStatusActive.bind(this));
      this.carbonDioxideService
        .getCharacteristic(Characteristic.CarbonDioxideDetected)
        .onGet(this.getCarbonDioxideDetected.bind(this));
      this.carbonDioxideService
        .getCharacteristic(Characteristic.CarbonDioxideLevel)
        .onGet(this.getCarbonDioxideLevel.bind(this));

      this.addAccessoryService(this.carbonDioxideService);
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
        .onSet(this.setColorTemperature.bind(this))
        .setProps({
          minValue: this.getDevice().getMinColorTempValue(),
          maxValue: this.getDevice().getMaxColorTempValue()
        });
    }
  }

  // ----- actions

  prepareActionButtonServices(actionButtonsUserConfig) {
    if (this.getDevice().hasActions()) {
      this.actionSwitchServices = [];
      let actionNames = Object.keys(this.getDevice().getAllActions());

      // if user specified an array (object or strings) then filter them to those which actaully exist on the device
      if (actionButtonsUserConfig && Array.isArray(actionButtonsUserConfig) && actionButtonsUserConfig.length > 0) {
        let userActionKeys = actionButtonsUserConfig;
        actionNames = userActionKeys.filter(tmpActionName => actionNames.includes(tmpActionName.action || tmpActionName)); // get only the action keys which actaully exist!
      }

      // create the action buttons
      actionNames.forEach((item, i) => {
        let actionName = item.action || item; // get the action name, if array of objects then get "action" else use the item
        let actionDisplayName = item.name || this.getDevice().getActionFriendlyName(actionName); // get name from "name" else get friendly name
        let actionId = actionName + 'ActionService' + i; // generate action id
        let paramValues = item.params || []; // get params from "params" or leave empty
        let tmpActionSwitch = this.createStatlessSwitch(actionDisplayName, actionId, (value) => {
          this.setActionSwitchOn(value, actionName, paramValues);
        });
        this.actionSwitchServices[i] = tmpActionSwitch;
        this.addAccessoryService(tmpActionSwitch);
      });
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
  isLedLevelSwitchOn(level) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getLedValue() === level;
    }
    return false;
  }

  setLedLevelSwitchOn(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().setLedValue(level);
      }
      setTimeout(() => {
        this.updateLedLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isLedOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLedEnabled();
    }
    return false;
  }

  setLedOn(value) {
    if (this.isMiotDeviceConnected()) {
      if (!value || this.getDevice().isLedEnabled() === false) {
        this.getDevice().setLedEnabled(value);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLedBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getLedPercentage();
    }
    return 0;
  }

  setLedBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the slider
      if (this.ledBrightnessTimeout) clearTimeout(this.ledBrightnessTimeout);
      this.ledBrightnessTimeout = setTimeout(() => this.getDevice().setLedPercentage(value), 500);
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
      if (!value || this.getDevice().isScreenEnabled() === false) {
        this.getDevice().setScreenEnabled(value);
      }
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
      // use debounce to limit the number of calls when the user slides the slider
      if (this.screenBrightnessTimeout) clearTimeout(this.screenBrightnessTimeout);
      this.screenBrightnessTimeout = setTimeout(() => this.getDevice().setScreenBrightnessPercentage(value), 500);
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

  // battery
  getStatusLowBatteryState() {
    if (this.getDevice().supportsBatteryLevelReporting()) {
      if (this.isMiotDeviceConnected()) {
        return this.getDevice().getBatteryLevel() > Constants.BATTERY_LOW_THRESHOLD ? Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL : Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
      }
    }
    return Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
  }

  getBatteryChargingState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().supportsChargingStateReporting()) {
        return this.getDevice().isCharging() ? Characteristic.ChargingState.CHARGING : Characteristic.ChargingState.NOT_CHARGING;
      } else if (this.getDevice().supportsBatteryPowerReporting()) {
        return this.getDevice().isOnBatteryPower() ? Characteristic.ChargingState.NOT_CHARGING : Characteristic.ChargingState.CHARGING;
      }
    }
    return Characteristic.ChargingState.NOT_CHARGEABLE;
  }

  getBatteryLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getBatteryLevel();
    }
    return 0;
  }

  // air quality
  getAirQualityStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getAirQuality() {
    if (this.isMiotDeviceConnected()) {
      let pm25Density = this.getDevice().getPm25Density();
      if (pm25Density <= this.excellentBreakpoint) {
        return Characteristic.AirQuality.EXCELLENT;
      } else if (pm25Density > this.excellentBreakpoint && pm25Density <= this.goodBreakpoint) {
        return Characteristic.AirQuality.GOOD;
      } else if (pm25Density > this.goodBreakpoint && pm25Density <= this.fairBreakpoint) {
        return Characteristic.AirQuality.FAIR;
      } else if (pm25Density > this.fairBreakpoint && pm25Density <= this.inferiorBreakpoint) {
        return Characteristic.AirQuality.INFERIOR;
      } else if (pm25Density > this.inferiorBreakpoint) {
        return Characteristic.AirQuality.POOR;
      }
    }
    return Characteristic.AirQuality.UNKNOWN;
  }

  getPM25Density() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getPm25Density();
    }
    return 0;
  }

  // carbon dioxide
  getCarbonDioxideStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true
    }
    return false;
  }

  getCarbonDioxideDetected() {
    if (this.isMiotDeviceConnected()) {
      let co2Density = this.getDevice().getCo2Density();
      if (co2Density > this.co2AbnormalThreshold) {
        return Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL;
      } else {
        return Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
      }
    }
    return Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL;
  }

  getCarbonDioxideLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getCo2Density();
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
      return this.getDevice().getFanSpeedPercentage();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the rotation slider
      if (this.rotationSpeedTimeout) clearTimeout(this.rotationSpeedTimeout);
      this.rotationSpeedTimeout = setTimeout(() => this.getDevice().setFanSpeedPercentage(value), 500);
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
    return this.getDevice().getMinColorTempValue();
  }

  setColorTemperature(colorTemp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setColorTemp(colorTemp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // ----- actions

  setActionSwitchOn(state, actionName, paramValues = []) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().fireAction(actionName, paramValues);
      this.resetActionSwitches();
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
    if (this.batteryService) this.batteryService.getCharacteristic(Characteristic.StatusLowBattery).updateValue(this.getStatusLowBatteryState());
    if (this.batteryService) this.batteryService.getCharacteristic(Characteristic.ChargingState).updateValue(this.getBatteryChargingState());
    if (this.batteryService && this.getDevice().supportsBatteryLevelReporting()) this.batteryService.getCharacteristic(Characteristic.BatteryLevel).updateValue(this.getBatteryLevel());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getAirQualityStatusActive());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.AirQuality).updateValue(this.getAirQuality());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.PM2_5Density).updateValue(this.getPM25Density());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getCarbonDioxideStatusActive());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideDetected).updateValue(this.getCarbonDioxideDetected());
    if (this.carbonDioxideService) this.carbonDioxideService.getCharacteristic(Characteristic.CarbonDioxideLevel).updateValue(this.getCarbonDioxideLevel());
    this.updateLedLevelSwitches();
    this.updateScreenLevelSwitches();

    if (this.childLockCharacteristic) this.childLockCharacteristic.updateValue(this.getLockPhysicalControlsState());
    if (this.rotationSpeedCharacteristic) this.rotationSpeedCharacteristic.updateValue(this.getRotationSpeed());
    if (this.brightnessCharacteristic) this.brightnessCharacteristic.updateValue(this.getBrightness());
    if (this.colorTemperatureCharacteristic) this.colorTemperatureCharacteristic.updateValue(this.getColorTemperature());

    this.updateCustomServices();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateLedLevelSwitches() {
    if (this.ledLevelControlServices) {
      let currentLevel = this.getDevice().getLedValue();
      this.ledLevelControlServices.forEach((tmpLedLevelSwitch, i) => {
        let level = this.getDevice().ledControlList()[i];
        let levelVal = level.value;
        let isSwitchOn = (currentLevel === levelVal) && this.getDevice().isPowerOn();
        tmpLedLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

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

  resetActionSwitches() {
    if (this.actionSwitchServices && this.actionSwitchServices.length > 0) {
      setTimeout(() => {
        this.actionSwitchServices.forEach((tmpActionSwitch, i) => {
          tmpActionSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        });
      }, Constants.BUTTON_RESET_TIMEOUT);
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


  /*----------========== INFORMATION SERVICE ==========----------*/

  updateInformationService(name, manufacturer, model, deviceId, pluginVer) {
    if (this.getAccessory()) {
      // remove the preconstructed information service, since i will be adding my own
      this.getAccessory().removeService(this.getAccessory().getService(Service.AccessoryInformation));

      this.informationService = new Service.AccessoryInformation();
      this.informationService
        .setCharacteristic(Characteristic.Name, name)
        .setCharacteristic(Characteristic.Manufacturer, manufacturer)
        .setCharacteristic(Characteristic.Model, model)
        .setCharacteristic(Characteristic.SerialNumber, deviceId)
        .setCharacteristic(Characteristic.FirmwareRevision, pluginVer);

      this.addAccessoryService(this.informationService);
    }
  }


  /*----------========== CUSTOM SERVICES ==========----------*/

  addCustomService(serviceClass, serviceName, propName, linkedPropName, configuration) {
    if (serviceClass) {
      let prop = this.getDevice().getProperty(propName);
      let linkedProp = this.getDevice().hasProperty(linkedPropName) ? this.getDevice().getProperty(linkedPropName) : null;
      if (prop) {
        let newCustService = new serviceClass(serviceName, this, prop, linkedProp, configuration, this.api, this.logger);
        if (newCustService && newCustService.isServiceValid()) {
          this.logger.debug(`Adding custom service ${serviceName} of type ${newCustService.getServiceType()} for property ${prop.getName()}!`);
          this.customServices.push(newCustService);
        } else {
          this.logger.debug(`Cannot add ${serviceName} custom service! Invalid property!`);
        }
      } else {
        this.logger.debug(`Cannot add ${serviceName} custom service! Property not found on the device!`);
      }
    } else {
      this.logger.debug(`Cannot add ${serviceName} custom service! Wrong or missing service class!`);
    }
  }

  addPropValueListService(serviceName, propName, linkedPropName) {
    this.addCustomService(PropValueListService, serviceName, propName, linkedPropName, null);
  }

  updateCustomServices() {
    this.customServices.forEach((custService, i) => {
      custService.updateServiceStatus();
    });
  }


  /*----------========== PROPERTY HELPERS ==========----------*/

  preparePm25Breakpoints(pm25Breakpoints) {
    // make sure that the provided array is valid
    if (pm25Breakpoints) {
      if (!Array.isArray(pm25Breakpoints) || pm25Breakpoints.length != 4 ||
        pm25Breakpoints[0] >= pm25Breakpoints[1] || pm25Breakpoints[1] >= pm25Breakpoints[2] || pm25Breakpoints[2] >= pm25Breakpoints[3]) {
        this.getLogger().warn(`The value specified for the 'pm25Breakpoints' property is invalid! Reverting to default!`);
        pm25Breakpoints = [7, 15, 30, 55];
      }
    } else {
      pm25Breakpoints = [7, 15, 30, 55];
    }
    this.excellentBreakpoint = parseInt(pm25Breakpoints[0]);
    this.goodBreakpoint = parseInt(pm25Breakpoints[1]);
    this.fairBreakpoint = parseInt(pm25Breakpoints[2]);
    this.inferiorBreakpoint = parseInt(pm25Breakpoints[3]);
  }

  prepareCo2AbnormalThreshold(co2AbnormalThreshold) {
    // make sure that the value is valid
    if (!Number.isFinite(co2AbnormalThreshold)) {
      this.getLogger().warn(`The value specified for the 'co2AbnormalThreshold' property is invalid! Reverting to default!`);
      co2AbnormalThreshold = 1000;
    }
    this.co2AbnormalThreshold = co2AbnormalThreshold;
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

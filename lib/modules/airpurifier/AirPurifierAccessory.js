let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    super(name, miotDevice, uuid, log, config, api, logger);
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
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], false);
    this.modeControl = this.getPropValue(config['modeControl'], false);
    this.pm25Breakpoints = this.getPropValue(config['pm25Breakpoints'], null);

    // setup the breakpoints
    this.preparePm25Breakpoints();
  }

  getAccessoryType() {
    return DevTypes.AIR_PURIFIER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_PURIFIER);
  }

  setupMainAccessoryService() {
    this.airPurifierService = new Service.AirPurifier(this.getName(), 'airPurifierService');

    this.airPurifierService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getAirPurifierActiveState.bind(this))
      .onSet(this.setAirPurifierActiveState.bind(this));

    this.airPurifierService
      .getCharacteristic(Characteristic.CurrentAirPurifierState)
      .onGet(this.getCurrentAirPurifierState.bind(this));

    this.airPurifierService
      .getCharacteristic(Characteristic.TargetAirPurifierState)
      .onGet(this.getTargetAirPurifierState.bind(this))
      .onSet(this.setTargetAirPurifierState.bind(this));

    if (this.childLockControl) this.addChildLockCharacteristic(this.airPurifierService);

    if (this.miotDevice.supportsFavoriteSpeed()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    if (this.miotDevice.supportsFilterLifeLevelReporting()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.FilterChangeIndication)
        .onGet(this.getFilterChangeIndicationState.bind(this));
      this.airPurifierService
        .getCharacteristic(Characteristic.FilterLifeLevel)
        .onGet(this.getFilterLifeLevel.bind(this));
    }

    this.addAccessoryService(this.airPurifierService);
  }

  setupAdditionalAccessoryServices() {
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.preparePm25DensityService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  preparePm25DensityService() {
    if (this.miotDevice.supportsPm25DensityReporting()) {
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


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getAirPurifierActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setAirPurifierActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn === false || this.getDevice().isPowerOn() === false) {
        this.getDevice().setPowerOn(isPowerOn);
        this.airPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState).updateValue(Characteristic.CurrentAirPurifierState.IDLE);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentAirPurifierState() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      if (this.getDevice().isIdle()) {
        return Characteristic.CurrentAirPurifierState.IDLE;
      } else {
        return Characteristic.CurrentAirPurifierState.PURIFYING_AIR;
      }
    }
    return Characteristic.CurrentAirPurifierState.INACTIVE;
  }

  getTargetAirPurifierState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isAutoModeEnabled() ? Characteristic.TargetAirPurifierState.AUTO : Characteristic.TargetAirPurifierState.MANUAL;
    }
    return Characteristic.TargetAirPurifierState.MANUAL;
  }

  setTargetAirPurifierState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetAirPurifierState.AUTO) {
        this.getDevice().enableAutoMode();
      } else {
        this.getDevice().enableFavoriteMode();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFavoriteSpeed();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isFavoriteModeEnabled() === false) {
        this.getDevice().enableFavoriteMode(); // enable the favorite mode if it was disabled
      }
      this.getDevice().setFavoriteSpeed(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

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

  getFilterChangeIndicationState() {
    if (this.isMiotDeviceConnected()) {
      let lifeLevel = this.getDevice().getFilterLifeLevel();
      if (lifeLevel <= 5) {
        return Characteristic.FilterChangeIndication.CHANGE_FILTER;
      }
    }
    return Characteristic.FilterChangeIndication.FILTER_OK;
  }

  getFilterLifeLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFilterLifeLevel();
    }
    return 0;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.Active).updateValue(this.getAirPurifierActiveState());
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState).updateValue(this.getCurrentAirPurifierState());
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.TargetAirPurifierState).updateValue(this.getTargetAirPurifierState());
    if (this.airPurifierService && this.getDevice().supportsFavoriteSpeed()) this.airPurifierService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
    if (this.airPurifierService && this.getDevice().supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndicationState());
    if (this.airPurifierService && this.getDevice().supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevel());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getAirQualityStatusActive());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.AirQuality).updateValue(this.getAirQuality());
    if (this.airQualityService) this.airQualityService.getCharacteristic(Characteristic.PM2_5Density).updateValue(this.getPM25Density());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/

  preparePm25Breakpoints() {
    // make sure that the provided array is valid
    if (!this.pm25Breakpoints || !Array.isArray(this.pm25Breakpoints) || this.pm25Breakpoints.length != 4 ||
      this.pm25Breakpoints[0] >= this.pm25Breakpoints[1] || this.pm25Breakpoints[1] >= this.pm25Breakpoints[2] || this.pm25Breakpoints[2] >= this.pm25Breakpoints[3]) {
      this.pm25Breakpoints = [7, 15, 30, 55];
    }
    this.excellentBreakpoint = parseInt(this.pm25Breakpoints[0]);
    this.goodBreakpoint = parseInt(this.pm25Breakpoints[1]);
    this.fairBreakpoint = parseInt(this.pm25Breakpoints[2]);
    this.inferiorBreakpoint = parseInt(this.pm25Breakpoints[3]);
  }


}


module.exports = AirPurifierAccessory;

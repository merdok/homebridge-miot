let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, config, api, logger) {
    super(name, miotDevice, uuid, config, api, logger);
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
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.screenControl = this.getPropValue(config['screenControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], false);
    this.modeControl = this.getPropValue(config['modeControl'], false);
    this.pm25Breakpoints = this.getPropValue(config['pm25Breakpoints'], [7, 15, 30, 55]);
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

    this.addChildLockCharacteristic(this.airPurifierService);

    if (this.getDevice().supportsFavoriteSpeedControl()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    if (this.getDevice().supportsFilterLifeLevelReporting()) {
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
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.screenControl) this.prepareScreenControlService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.prepareAirQualityService(this.pm25Breakpoints);
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


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
    if (this.isMiotDeviceConnected() && this.getDevice().isFavoriteModeEnabled()) {
      return this.getDevice().getFavoriteSpeedPercentage();
    }
    return 0;
  }

  setRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isFavoriteModeEnabled() === false) {
        this.getDevice().enableFavoriteMode(); // enable the favorite mode if it was disabled
      }
      this.getDevice().setFavoriteSpeedPercentage(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

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
    if (this.airPurifierService && this.getDevice().supportsFavoriteSpeedControl()) this.airPurifierService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());
    if (this.airPurifierService && this.getDevice().supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndicationState());
    if (this.airPurifierService && this.getDevice().supportsFilterLifeLevelReporting()) this.airPurifierService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevel());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirPurifierAccessory;

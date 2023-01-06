let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirPurifierAccessory extends BaseAccessory {
  constructor(name, device, uuid, config, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(name, device, uuid, config, api, logger);
  }


  /*----------========== INIT ==========----------*/

  initAccessoryObject() {
    this.fanLevelControl = this.getConfigValue('fanLevelControl', false);
    this.screenControl = this.getConfigValue('screenControl', true);
    this.ioniserControl = this.getConfigValue('ioniserControl', false);
    this.pm25Breakpoints = this.getConfigValue('pm25Breakpoints', [7, 15, 30, 55]);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.AIR_PURIFIER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_PURIFIER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

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

    this.addLockPhysicalControlsCharacteristic(this.airPurifierService);

    if (this.getDevice().supportsFavoriteSpeedControl()) {
      this.airPurifierService
        .getCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getRotationSpeed.bind(this))
        .onSet(this.setRotationSpeed.bind(this));
    }

    this.addFilterLifeLevelCharacteristic(this.airPurifierService);

    this.addAccessoryService(this.airPurifierService);
  }

  setupAdditionalAccessoryServices() {
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.screenControl) this.prepareScreenControlService();
    if (this.ioniserControl) this.prepareIoniserControlService();

    this.prepareAirQualityService(this.pm25Breakpoints);

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareFanLevelControlServices() {
    if (this.getDevice().supportsFanLevel()) {
      this.addPropWrapper('Fan Level', this.getDevice().fanLevelProp(), this.getDevice().modeProp(), null, this.getDevice().favoriteModeValue(), null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getAirPurifierActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setAirPurifierActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      if (value === false || this.getDevice().isOn() === false) {
        this.getDevice().setOn(value);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentAirPurifierState() {
    if (this.isMiotDeviceConnected() && this.getDevice().isOn()) {
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
      return (this.getDevice().isAutoModeEnabled() || this.getDevice().isSleepModeEnabled()) ? Characteristic.TargetAirPurifierState.AUTO : Characteristic.TargetAirPurifierState.MANUAL;
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
      this.getDevice().turnOnFavoriteModeIfNecessary();
      this.getDevice().setFavoriteSpeedPercentage(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.Active).updateValue(this.getAirPurifierActiveState());
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.CurrentAirPurifierState).updateValue(this.getCurrentAirPurifierState());
    if (this.airPurifierService) this.airPurifierService.getCharacteristic(Characteristic.TargetAirPurifierState).updateValue(this.getTargetAirPurifierState());
    if (this.airPurifierService && this.getDevice().supportsFavoriteSpeedControl()) this.airPurifierService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getRotationSpeed());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirPurifierAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const GenericAccessory = require('../generic/GenericAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CeilingFanAccessory extends GenericAccessory {
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
    this.offDelayControl = this.getConfigValue('offDelayControl', false);

    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.CEILING_FAN;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.LIGHTBULB)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.lightService = new Service.Lightbulb(this.getName(), 'lightService');
    this.lightService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isLightOn.bind(this))
      .onSet(this.setLightOn.bind(this));

    this.addBrightnessCharacteristic(this.lightService);
    this.addColorTemperatureCharacteristic(this.lightService);
    this.addColorCharacteristic(this.lightService);

    this.addAccessoryService(this.lightService);
  }

  setupAdditionalAccessoryServices() {
    if (this.offDelayControl) this.prepareOffDelayService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    
    this.prepareFanService();
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareFanService() {
    if (this.getDevice().supportsFanOn()) {
      this.fanService = new Service.Fanv2(this.getName() + ' Fan', 'fanService');
      this.fanService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getFanActiveState.bind(this))
        .onSet(this.setFanActiveState.bind(this));
      this.fanService
        .addCharacteristic(Characteristic.CurrentFanState)
        .onGet(this.getCurrentFanState.bind(this));

      this.addRotationSpeedCharacteristic(this.fanService);

      this.addAccessoryService(this.fanService);
    }
  }

  prepareModeControlServices() {
    super.prepareModeControlServices();

    if (this.getDevice().supportsFanModes()) {
      this.addPropWrapper('Fan Mode', this.getDevice().fanModeProp(), this.getDevice().fanOnProp(), null, null);
    }
  }

  prepareOffDelayService() {
    super.prepareOffDelayService();

    if (this.getDevice().supportsFanOffDelay()) {
      this.addOffDelayWrapper('Fan off delay', this.getDevice().fanOffDelayProp(), this.getDevice().fanOnProp());
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn();
    }
    return false;
  }

  setLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

  getFanActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isFanOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setFanActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setFanOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isFanOn()) {
        return Characteristic.CurrentFanState.IDLE;
      } else {
        return Characteristic.CurrentFanState.BLOWING_AIR;
      }
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.isLightOn());

    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = CeilingFanAccessory;

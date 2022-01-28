let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const GenericAccessory = require('../generic/GenericAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirerAccessory extends GenericAccessory {
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
    this.motorControl = this.getConfigValue('motorControl', true);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.AIRER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SWITCH)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.switchService = this.createStatefulSwitch(this.getName(), 'switchService', this.isSwitchOn, this.setSwitchOn);
    this.addAccessoryService(this.switchService);
  }

  setupAdditionalAccessoryServices() {
    this.prepareLightService();

    if (this.motorControl) this.prepareMotorControlServices();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLightService() {
    if (this.getDevice().supportsLightOn()) {
      this.lightbulbService = new Service.Lightbulb(this.getName(), 'lightbulbService');
      this.lightbulbService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isAirerLightOn.bind(this))
        .onSet(this.setAirerLightOn.bind(this));

      this.addAccessoryService(this.lightbulbService);
    }
  }


  prepareMotorControlServices() {
    if (this.getDevice().supportsMotorControl()) {
      this.addPropWrapper('Motor Control', this.getDevice().motorControlProp(), null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isAirerOn();
    }
    return false;
  }

  setSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setAirerOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

  isAirerLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightOn();
    }
    return false;
  }

  setAirerLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.switchService) this.switchService.getCharacteristic(Characteristic.On).updateValue(this.isSwitchOn());
    if (this.lightbulbService) this.lightbulbService.getCharacteristic(Characteristic.On).updateValue(this.isAirerLightOn());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirerAccessory;

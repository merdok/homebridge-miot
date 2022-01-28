let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const GenericAccessory = require('../generic/GenericAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');

//NOT: Color and Color Temp on a accessory are problematic for the color wheel in the home app, it always reads the color value when available so the selected color in the wheel will not match when color temeprature is set!

class LightAccessory extends GenericAccessory {
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
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.LIGHT;
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
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


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


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.isLightOn());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = LightAccessory;

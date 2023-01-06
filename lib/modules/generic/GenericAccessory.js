let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class GenericAccessory extends BaseAccessory {
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
    return DevTypes.GENERIC;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SWITCH)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.addPropWrapper(this.getName(), this.getDevice().onProp(), null, null, null);
    //TODO: need to somehow get the service from the wrapper and apply some basic stuff like child lock -> this.addLockPhysicalControlsCharacteristic(<HERE_SERVICE>);
  }

  setupAdditionalAccessoryServices() {
    this.prepareLightService();
    this.prepareMotorControlServices();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLightService() {
    if (this.getDevice().hasLightService()) {
      this.addLightService('lightService', this.getName() + ' Light', this.getDevice().getLightService());
    }
  }

  prepareMotorControlServices() {
    if (this.getDevice().supportsMotorControl()) {
      this.addPropWrapper('Motor Control', this.getDevice().motorControlProp(), null, null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/


  /*----------========== SERVICES STATUS ==========----------*/

  updateAccessoryStatus() {
    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = GenericAccessory;

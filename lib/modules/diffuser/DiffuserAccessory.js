let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class DiffuserAccessory extends BaseAccessory {
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
    return DevTypes.DIFFUSER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Categories.SWITCH)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.diffuserSwitchService = this.createStatefulSwitch(this.getName(), 'diffuserSwitchService', this.isDiffuserOn, this.setDiffuserOn);
    this.addAccessoryService(this.diffuserSwitchService);
  }

  setupAdditionalAccessoryServices() {
    if (this.getDevice().supportsFragranceOutTime()) {
      this.addPropWrapper('Diffusing Duration', this.getDevice().fragranceOutTimeProp(), null, null, null, null);
    }

    if (this.getDevice().supportsFragranceOutTime4()) {
      this.addPropWrapper('Diffusing Interval', this.getDevice().fragranceOutTime4Prop(), null, null, null, null);
    }

    if (this.getDevice().supportsAutoFragrance()) {
      this.addPropWrapper('Auto Fragrance', this.getDevice().autoFragranceProp(), null, null, null, null);
    }

    if (this.getDevice().supportsAutoLight()) {
      this.addPropWrapper('Auto Light', this.getDevice().autoLightProp(), null, null, null, null);
    }

    if (this.getDevice().supportsLightAutoOff()) {
      this.addPropWrapper('Light Auto Off', this.getDevice().lightAutoOffProp(), null, null, null, null);
    }

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  //overrides


  //accessory specific


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isDiffuserOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn();
    }
    return false;
  }

  setDiffuserOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.diffuserSwitchService) this.diffuserSwitchService.getCharacteristic(Characteristic.On).updateValue(this.isDiffuserOn());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = DiffuserAccessory;

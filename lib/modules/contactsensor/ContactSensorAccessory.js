let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class ContactSensorAccessory extends BaseAccessory {
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
    return DevTypes.CONTACT_SENSOR;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SENSOR)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.contactSensorService = new Service.ContactSensor(this.getName(), 'contactSensorService');
    this.contactSensorService
      .getCharacteristic(Characteristic.ContactSensorState)
      .onGet(this.getContactSensorState.bind(this));
    this.contactSensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getContactSensorStatusActive.bind(this));

    this.addAccessoryService(this.contactSensorService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getContactSensorState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isContactStateOn() ? Characteristic.ContactSensorState.CONTACT_DETECTED : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;
    }
    return Characteristic.ContactSensorState.CONTACT_DETECTED;
  }

  getContactSensorStatusActive() {
    return this.isMiotDeviceConnected();
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.contactSensorService) {
      this.contactSensorService.getCharacteristic(Characteristic.ContactSensorState).updateValue(this.getContactSensorState());
      this.contactSensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getContactSensorStatusActive());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = ContactSensorAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class MotionSensorAccessory extends BaseAccessory {
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
    return DevTypes.MOTION_SENSOR;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SENSOR)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.motionSensorService = new Service.MotionSensor(this.getName(), 'motionSensorService');
    this.motionSensorService
      .getCharacteristic(Characteristic.MotionDetected)
      .onGet(this.isMotionDetected.bind(this));
    this.motionSensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getMotionSensorStatusActive.bind(this));

    this.addAccessoryService(this.motionSensorService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isMotionDetected() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isMotionStateOn();
    }
    return false;
  }

  getMotionSensorStatusActive() {
    return this.isMiotDeviceConnected();
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.motionSensorService) {
      this.motionSensorService.getCharacteristic(Characteristic.MotionDetected).updateValue(this.isMotionDetected());
      this.motionSensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getMotionSensorStatusActive());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = MotionSensorAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class SubmersionSensorAccessory extends BaseAccessory {
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
    return DevTypes.SUBMERSION_SENSOR;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SENSOR)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.leakSensorService = new Service.LeakSensor(this.getName(), 'leakSensorService');
    this.leakSensorService
      .getCharacteristic(Characteristic.LeakDetected)
      .onGet(this.getLeakDetectedState.bind(this));
    this.leakSensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getLeakSensorStatusActive.bind(this));

    this.addAccessoryService(this.leakSensorService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getLeakDetectedState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isSubmersionStateOn() ? Characteristic.LeakDetected.LEAK_DETECTED : Characteristic.LeakDetected.LEAK_NOT_DETECTED;
    }
    return Characteristic.LeakDetected.LEAK_NOT_DETECTED;
  }

  getLeakSensorStatusActive() {
    return this.isMiotDeviceConnected();
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.leakSensorService) {
      this.leakSensorService.getCharacteristic(Characteristic.LeakDetected).updateValue(this.getLeakDetectedState());
      this.leakSensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getLeakSensorStatusActive());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = SubmersionSensorAccessory;

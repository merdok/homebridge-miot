let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class OccupancySensorAccessory extends BaseAccessory {
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
    return DevTypes.OCCUPANCY_SENSOR;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Categories.SENSOR)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.occupancySensorService = new Service.OccupancySensor(this.getName(), 'occupancySensorService');
    this.occupancySensorService
      .getCharacteristic(Characteristic.OccupancyDetected)
      .onGet(this.isOccupancyDetected.bind(this));
    this.occupancySensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getOccupancySensorStatusActive.bind(this));

    this.addAccessoryService(this.occupancySensorService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isOccupancyDetected() {
    if (this.isMiotDeviceConnected() && this.getDevice().isOccupied()) {
      return Characteristic.OccupancyDetected.OCCUPANCY_DETECTED;
    }
    return Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
  }

  getOccupancySensorStatusActive() {
    return this.isMiotDeviceConnected();
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.occupancySensorService) {
      this.occupancySensorService.getCharacteristic(Characteristic.OccupancyDetected).updateValue(this.isOccupancyDetected());
      this.occupancySensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getOccupancySensorStatusActive());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OccupancySensorAccessory;

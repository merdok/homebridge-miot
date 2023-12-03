let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const ValueOperator = require('../../constants/ValueOperator.js');


class RobotCleanerAccessory extends BaseAccessory {
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
    return DevTypes.ROBOT_CLEANER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SWITCH)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.switchService = this.createStatefulSwitch(this.getName(), 'switchService', this.isVacuumOn, this.setVacuumOn);
    this.addAccessoryService(this.switchService);
  }

  setupAdditionalAccessoryServices() {
    this.prepareDockOccupancyService();
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareDockOccupancyService() {
    if (this.getDevice().supportsStatusReporting()) {
      this.addPropMonitorWrapper('Dock', this.getDevice().statusProp(), null, this.getDevice().getDockStatusValues(), null, ValueOperator.CONTAINS);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isVacuumOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isVacuumWorking();
    }
    return false;
  }

  setVacuumOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setSweepActive(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.switchService) this.switchService.getCharacteristic(Characteristic.On).updateValue(this.isVacuumOn());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = RobotCleanerAccessory;

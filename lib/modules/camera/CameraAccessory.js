let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class CameraAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, config, api, logger) {
    super(name, miotDevice, uuid, config, api, logger);
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initHapConstants() {
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;
  }

  initConfigProperties(config) {
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
  }

  getAccessoryType() {
    return DevTypes.CAMERA;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.CAMERA);
  }

  setupMainAccessoryService() {
    this.cameraService = this.createStatefulSwitch(this.getName(), 'cameraService', this.isPowerOn, this.setPowerOn);
    this.addAccessoryService(this.cameraService);
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/



  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isPowerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setPowerOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.cameraService) this.cameraService.getCharacteristic(Characteristic.On).updateValue(this.isPowerOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = CameraAccessory;

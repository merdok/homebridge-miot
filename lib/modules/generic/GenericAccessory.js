let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class GenericAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    super(name, miotDevice, uuid, log, config, api, logger);
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
    //none for generic
  }

  getAccessoryType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.SWITCH);
  }

  setupMainAccessoryService() {
    this.powerSwitchService = this.createStatefulSwitch(this.getName(), 'powerSwitchService', this.getPowerState, this.setPowerState);
    this.addAccessoryService(this.powerSwitchService);
  }

  setupAdditionalAccessoryServices() {
    //none for generic
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getPowerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setPowerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICES STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.powerSwitchService) this.powerSwitchService.getCharacteristic(Characteristic.On).updateValue(this.getPowerState());
    super.updateDeviceStatus();
  }


}


module.exports = GenericAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class OutletAccessory extends BaseAccessory {
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
    //none for outlets
  }

  getAccessoryType() {
    return DevTypes.OUTLET;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    this.accessory = new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.OUTLET);
  }

  setupMainAccessoryService() {
    this.outletService = new Service.Outlet(this.getName(), 'outletService');
    this.outletService
      .getCharacteristic(Characteristic.On)
      .onGet(this.getOutletOnValue.bind(this))
      .onSet(this.setOutletOnValue.bind(this));
    this.outletService
      .addCharacteristic(Characteristic.OutletInUse)
      .onGet(this.getOutletInUseValue.bind(this));

    this.addAccessoryService(this.outletService);
  }

  setupAdditionalAccessoryServices() {
    // none for outlets
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getOutletOnValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setOutletOnValue(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.getDevice().isPowerOn() === false) {
        this.getDevice().setPowerOn(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getOutletInUseValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.On).updateValue(this.getOutletOnValue());
    if (this.outletService) this.outletService.getCharacteristic(Characteristic.OutletInUse).updateValue(this.getOutletInUseValue());
    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OutletAccessory;

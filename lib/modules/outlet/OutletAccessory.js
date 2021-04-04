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

  setupAccessoryServices() {
    this.prepareMainService();
  }

  prepareMainService() {
    this.outletService = new Service.Outlet(this.name, 'outletService');
    this.outletService
      .getCharacteristic(Characteristic.On)
      .onGet(this.getOnState.bind(this))
      .onSet(this.setOnState.bind(this));
    this.outletService
      .addCharacteristic(Characteristic.OutletInUse)
      .onGet(this.getOutletInUseState.bind(this));

    this.addAccessoryService(this.outletService);
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getOnState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setOnState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === false || this.getDevice().isPowerOn() === false) {
        this.getDevice().setPowerOn(state);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getOutletInUseState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.miotCeilingFanDevice) {
      if (this.outletService) this.outletService.getCharacteristic(Characteristic.On).updateValue(this.getOnState());
      if (this.outletService) this.outletService.getCharacteristic(Characteristic.OutletInUse).updateValue(this.getOutletInUseState());
    }
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OutletAccessory;

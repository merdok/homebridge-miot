let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class OvenAccessory extends BaseAccessory {
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
    return DevTypes.OVEN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HEATER);
  }

  setupMainAccessoryService() {
    this.ovenSwitchService = this.createStatefulSwitch(this.getName(), 'ovenSwitchService', this.isOvenOn, this.setOvenOn);
    this.addAccessoryService(this.ovenSwitchService);
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    this.prepareLeftTimeService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLeftTimeService() {
    if (this.getDevice().supportsLeftTimeReporting()) {
      this.leftTimeService = new Service.LightSensor('Left Time', 'leftTimeService');
      this.leftTimeService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .onGet(this.getLeftTimeCurrentAmbientLightLevel.bind(this))
        .setProps({
          minValue: 0
        });
      this.leftTimeService
        .addCharacteristic(Characteristic.StatusActive)
        .onGet(this.getLeftTimeStatusActive.bind(this));
      this.addAccessoryService(this.leftTimeService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isOvenOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isStatusBusy();
    }
    return false;
  }

  setOvenOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setCookingActive(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

  getLeftTimeCurrentAmbientLightLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getLeftTime();
    }
    return 0;
  }

  getLeftTimeStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isStatusBusy();
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.ovenSwitchService) this.ovenSwitchService.getCharacteristic(Characteristic.On).updateValue(this.isOvenOn());
    if (this.leftTimeService) this.leftTimeService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).updateValue(this.getLeftTimeCurrentAmbientLightLevel());
    if (this.leftTimeService) this.leftTimeService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getLeftTimeStatusActive());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OvenAccessory;

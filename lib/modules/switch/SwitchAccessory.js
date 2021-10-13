let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class SwitchAccessory extends BaseAccessory {
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
    this.modeControl = this.getPropValue(config['modeControl'], true);
  }

  getAccessoryType() {
    return DevTypes.SWITCH;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.SWITCH);
  }

  setupMainAccessoryService() {
    this.switchService = this.createStatefulSwitch(this.getName(), 'switchService', this.isSwitchOn, this.setSwitchOn);
    this.addAccessoryService(this.switchService);
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.modeControl) this.prepareModeControlServices();
    this.prepareSwitch2Service();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareSwitch2Service() {
    if (this.getDevice().supportsSwitchPower2Control()) {
      this.switch2Service = this.createStatefulSwitch("Switch 2", 'switch2Service', this.isSwitch2On, this.setSwitch2On);
      this.addAccessoryService(this.switch2Service);
    }
  }

  prepareModeControlServices() {
    super.prepareModeControlServices();
    if (this.getDevice().supportsSwitchMode2Control()) {
      this.addPropValueListWrapper('Switch 2 Mode', Properties.SWITCH_MODE2, Properties.SWITCH_POWER2);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isSwitch2On() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isSwitchPower2On();
    }
    return false;
  }

  setSwitch2On(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setSwitchPower2On(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.switchService) this.switchService.getCharacteristic(Characteristic.On).updateValue(this.isSwitchOn());
    if (this.switch2Service) this.switch2Service.getCharacteristic(Characteristic.On).updateValue(this.isSwitch2On());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = SwitchAccessory;

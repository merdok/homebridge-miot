let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class AirerAccessory extends BaseAccessory {
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
    this.motorControl = this.getPropValue(config['motorControl'], true);
  }

  getAccessoryType() {
    return DevTypes.AIRER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.LIGHTBULB);
  }

  setupMainAccessoryService() {
    this.airerService = new Service.Lightbulb(this.getName(), 'airerService');
    this.airerService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isAirerLightOn.bind(this))
      .onSet(this.setAirerLightOn.bind(this));

    this.addAccessoryService(this.airerService);
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.motorControl) this.prepareMotorControlServices();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  prepareMotorControlServices() {
    if (this.getDevice().supportsMotorControls()) {
      this.addPropValueListWrapper('Motor Control', Properties.MOTOR_CONTROL, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isAirerLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightOn();
    }
    return false;
  }

  setAirerLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.On).updateValue(this.isAirerLightOn());
    if (this.powerControlService) this.powerControlService.getCharacteristic(Characteristic.On).updateValue(this.isPowerSwitchOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirerAccessory;

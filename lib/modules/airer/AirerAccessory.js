let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


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
      //TODO: this is write only so adjust prop value list custom service so that it can handle that?
      this.motorControlServices = new Array();
      this.getDevice().motorControls().forEach((motorControl, i) => {
        let motorControlVal = motorControl.value;
        let motorControlDesc = motorControl.description;
        let tmpMotorControlSwitch = this.createStatlessSwitch('Motor Control - ' + motorControlDesc, 'motorControlService' + motorControlVal, (value) => {
          this.setMotorControlSwitchOn(value, motorControlVal);
        });
        this.addAccessoryService(tmpMotorControlSwitch);
        this.motorControlServices.push(tmpMotorControlSwitch);
      });
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

  setMotorControlSwitchOn(value, motorControlValue) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setMotorControl(motorControlValue);
      this.resetMotorControlSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.On).updateValue(this.isAirerLightOn());
    if (this.powerControlService) this.powerControlService.getCharacteristic(Characteristic.On).updateValue(this.isPowerSwitchOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  resetMotorControlSwitches() {
    if (this.motorControlServices) {
      setTimeout(() => {
        this.motorControlServices.forEach((tmpMotorControlSwitch, i) => {
          tmpMotorControlSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        });
      }, Constants.BUTTON_RESET_TIMEOUT);
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirerAccessory;

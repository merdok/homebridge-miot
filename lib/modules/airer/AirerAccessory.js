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
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.WINDOW_COVERING);
  }

  setupMainAccessoryService() {
    this.airerService = new Service.WindowCovering(this.getName(), 'airerService');
    this.airerService
      .getCharacteristic(Characteristic.CurrentPosition)
      .onGet(this.getCurrentPosition.bind(this))
      .setProps({
        minValue: this.getDevice().currentPositionRange()[0],
        maxValue: this.getDevice().currentPositionRange()[1],
        minStep: this.getDevice().currentPositionRange()[2]
      });
    this.airerService
      .getCharacteristic(Characteristic.PositionState)
      .onGet(this.getPositionState.bind(this));
    this.airerService
      .getCharacteristic(Characteristic.TargetPosition)
      .onGet(this.getTargetPosition.bind(this))
      .onSet(this.setTargetPosition.bind(this));
    this.airerService
      .addCharacteristic(Characteristic.ObstructionDetected)
      .onGet(this.getObstructionDetected.bind(this));

    this.addAccessoryService(this.airerService);
  }

  setupAdditionalAccessoryServices() {
    this.preparePowerControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.motorControl) this.prepareMotorControlServices();
    this.prepareLightService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  preparePowerControlService() {
    if (this.getDevice().supportsPowerControl()) {
      this.powerControlService = this.createStatefulSwitch('Power', 'powerControlService', this.isPowerSwitchOn, this.setPowerSwitchOn);
      this.addAccessoryService(this.powerControlService);
    }
  }

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

  prepareLightService() {
    if (this.getDevice().hasBuiltInLight()) {
      this.lightService = new Service.Lightbulb('Light', 'lightService');
      this.lightService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isLightOn.bind(this))
        .onSet(this.setLightOn.bind(this));
    }
  }

  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentPosition() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getCurrentPosition();
    }
    return this.getDevice().currentPositionRange()[0]; // return min value
  }

  getPositionState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isStatusDown()) {
        return Characteristic.PositionState.DECREASING;
      } else if (this.getDevice().isStatusUp()) {
        return Characteristic.PositionState.INCREASING;
      } else if (this.getDevice().isStatusStopped()) {
        return Characteristic.PositionState.STOPPED;
      }
    }
    return Characteristic.PositionState.STOPPED;
  }

  getTargetPosition() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getAbsoluteTargetPosition();
    }
    return 0;
  }

  setTargetPosition(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setAbsoluteTargetPosition(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getObstructionDetected() {
    return this.getDevice().isObstructionDetected();
  }


  // ----- additional services

  isPowerSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setPowerSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setMotorControlSwitchOn(value, motorControlValue) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setMotorControl(motorControlValue);
      this.resetMotorControlSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightOn();
    }
    return false;
  }

  setLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.CurrentPosition).updateValue(this.getCurrentPosition());
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.PositionState).updateValue(this.getPositionState());
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.TargetPosition).updateValue(this.getTargetPosition());
    if (this.airerService) this.airerService.getCharacteristic(Characteristic.ObstructionDetected).updateValue(this.getObstructionDetected());
    if (this.powerControlService) this.powerControlService.getCharacteristic(Characteristic.On).updateValue(this.isPowerSwitchOn());

    if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.isLightOn());

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

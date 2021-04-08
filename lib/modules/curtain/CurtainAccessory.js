let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CurtainAccessory extends BaseAccessory {
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
    this.motorControl = this.getPropValue(config['motorControl'], true);
    this.motorReverseControl = this.getPropValue(config['motorReverseControl'], true);
  }

  getAccessoryType() {
    return DevTypes.CURTAIN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.WINDOW_COVERING);
  }

  setupMainAccessoryService() {
    this.windowCoveringService = new Service.WindowCovering(this.getName(), 'windowCoveringService');
    this.windowCoveringService
      .getCharacteristic(Characteristic.CurrentPosition)
      .onGet(this.getCurrentPosition.bind(this));
    this.windowCoveringService
      .getCharacteristic(Characteristic.PositionState)
      .onGet(this.getPositionState.bind(this));
    this.windowCoveringService
      .getCharacteristic(Characteristic.TargetPosition)
      .onGet(this.getTargetPosition.bind(this))
      .onSet(this.setTargetPosition.bind(this));
    this.windowCoveringService
      .addCharacteristic(Characteristic.ObstructionDetected)
      .onGet(this.getObstructionDetected.bind(this));

    this.addAccessoryService(this.windowCoveringService);
  }

  setupAdditionalAccessoryServices() {
    if (this.motorControl) this.prepareMotorControlServices();
    if (this.motorReverseControl) this.prepareMotorReverseControlService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareMotorControlServices() {
    if (this.getDevice().supportsMotorControls()) {
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

  prepareMotorReverseControlService() {
    if (this.getDevice().supportsMotorReverse()) {
      this.motorReverseService = this.createStatefulSwitch('Motor Reverse', 'motorReverseService', this.isMotorReverseOn, this.setMotorReverseOn);
      this.addAccessoryService(this.motorReverseService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentPosition() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getCurrentPosition();
    }
    return 0;
  }

  getPositionState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isStatusClosing()) {
        return Characteristic.PositionState.DECREASING;
      } else if (this.getDevice().isStatusOpening()) {
        return Characteristic.PositionState.INCREASING;
      } else if (this.getDevice().isStatusStop()) {
        return Characteristic.PositionState.STOPPED;
      }
    }
    return Characteristic.PositionState.STOPPED;
  }

  getTargetPosition() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetPosition();
    }
    return 0;
  }

  setTargetPosition(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetPosition(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getObstructionDetected() {
    return false;
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

  isMotorReverseOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isMotorReverseEnabled();
    }
    return false;
  }

  setMotorReverseOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setMotorReverseEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition).updateValue(this.getCurrentPosition());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.PositionState).updateValue(this.getPositionState());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.TargetPosition).updateValue(this.getTargetPosition());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.ObstructionDetected).updateValue(this.getObstructionDetected());
    if (this.motorReverseService) this.motorReverseService.getCharacteristic(Characteristic.On).updateValue(this.isMotorReverseOn());
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


module.exports = CurtainAccessory;

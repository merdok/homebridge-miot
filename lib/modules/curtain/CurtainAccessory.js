let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CurtainAccessory extends BaseAccessory {
  constructor(name, device, uuid, config, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(name, device, uuid, config, api, logger);
  }


  /*----------========== INIT ==========----------*/

  initAccessoryObject() {
    this.motorControl = this.getConfigValue('motorControl', true);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.CURTAIN;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.WINDOW_COVERING)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

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
    this.preparePowerControlService();

    if (this.motorControl) this.prepareMotorControlServices();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  preparePowerControlService() {
    if (this.getDevice().supportsOn()) {
      this.addPropWrapper('Power', this.getDevice().onProp(), null, null, null, null);
    }
  }

  prepareMotorControlServices() {
    if (this.getDevice().supportsMotorControl()) {
      this.addPropWrapper('Motor Control', this.getDevice().motorControlProp(), null, null, null, null);
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


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.CurrentPosition).updateValue(this.getCurrentPosition());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.PositionState).updateValue(this.getPositionState());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.TargetPosition).updateValue(this.getTargetPosition());
    if (this.windowCoveringService) this.windowCoveringService.getCharacteristic(Characteristic.ObstructionDetected).updateValue(this.getObstructionDetected());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = CurtainAccessory;

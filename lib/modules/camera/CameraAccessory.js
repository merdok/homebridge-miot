let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class CameraAccessory extends BaseAccessory {
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
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.nightShotControl = this.getPropValue(config['nightShotControl'], false);
    this.recordingModeControl = this.getPropValue(config['recordingModeControl'], false);
    this.motionDetectionControl = this.getPropValue(config['motionDetectionControl'], false);
  }

  getAccessoryType() {
    return DevTypes.CAMERA;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.CAMERA);
  }

  setupMainAccessoryService() {
    this.cameraService = this.createStatefulSwitch(this.getName(), 'cameraService', this.isPowerOn, this.setPowerOn);
    this.addAccessoryService(this.cameraService);
  }

  setupAdditionalAccessoryServices() {
    if (this.ledControl) this.prepareLedControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.nightShotControl) this.prepareNightShotControlService();
    if (this.recordingModeControl) this.prepareRecordingModeControlService();
    if (this.motionDetectionControl) this.prepareMotionDetectionControlService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareNightShotControlService() {
    if (this.getDevice().supportsNightShot()) {
      this.addPropValueListService('Night Shot', Properties.NIGHT_SHOT, Properties.POWER);
    }
  }

  prepareRecordingModeControlService() {
    if (this.getDevice().supportsRecordingMode()) {
      this.addPropValueListService('Recording Mode', Properties.RECORDING_MODE, Properties.POWER);
    }
  }

  prepareMotionDetectionControlService() {
    if (this.getDevice().supportsMotionDetection()) {
      this.motionDetectionControlService = this.createStatefulSwitch('Motion Detection', 'motionDetectionControlService', this.isMotionDetectionSwitchOn, this.setMotionDetectionSwitchOn);
      this.addAccessoryService(this.motionDetectionControlService);
    }
  }



  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isPowerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn();
    }
    return false;
  }

  setPowerOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setPowerOn(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

  isMotionDetectionSwitchOn() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isMotionDetectionEnabled();
    }
    return false;
  }

  setMotionDetectionSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setMotionDetectionEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.cameraService) this.cameraService.getCharacteristic(Characteristic.On).updateValue(this.isPowerOn());
    if (this.motionDetectionControlService) this.motionDetectionControlService.getCharacteristic(Characteristic.On).updateValue(this.isMotionDetectionSwitchOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = CameraAccessory;

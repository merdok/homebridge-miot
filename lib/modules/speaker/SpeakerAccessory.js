let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const GenericAccessory = require('../generic/GenericAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class SpeakerAccessory extends GenericAccessory {
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
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.SPEAKER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SMART_SPEAKER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.speakerService = new Service.SmartSpeaker(this.getName(), 'speakerService');
    
    this.speakerService
      .getCharacteristic(Characteristic.CurrentMediaState)
      .onGet(this.getCurrentMediaState.bind(this));

    this.speakerService
      .getCharacteristic(Characteristic.TargetMediaState)
      .onGet(this.getTargetMediaState.bind(this))
      .onSet(this.setTargetMediaState.bind(this));

    this.speakerService
      .getCharacteristic(Characteristic.Mute)
      .onGet(this.getMute.bind(this))
      .onSet(this.setMute.bind(this));

    this.speakerService
      .getCharacteristic(Characteristic.Volume)
      .onGet(this.getVolume.bind(this))
      .onSet(this.setVolume.bind(this))
      .setProps({
        minValue: this.getDevice().volumeRange()[0],
        maxValue: this.getDevice().volumeRange()[1],
        minStep: this.getDevice().volumeRange()[2]
      });

    this.addAccessoryService(this.speakerService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  //overrides


  //accessory specific


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentMediaState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        if (this.getDevice().isMediaPlaying()) {
          return Characteristic.CurrentMediaState.PLAY;
        } else if (this.getDevice().isMediaPaused()) {
          return Characteristic.CurrentMediaState.PAUSE;
        } else if (this.getDevice().isMediaStopped()) {
          return Characteristic.CurrentMediaState.STOP;
        }
      }
    }
    return Characteristic.CurrentMediaState.STOP;
  }

  getTargetMediaState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        if (this.getDevice().isMediaPlaying()) {
          return Characteristic.TargetMediaState.PLAY;
        } else if (this.getDevice().isMediaPaused()) {
          return Characteristic.TargetMediaState.PAUSE;
        } else if (this.getDevice().isMediaStopped()) {
          return Characteristic.TargetMediaState.STOP;
        }
      }
    }
    return Characteristic.TargetMediaState.STOP;
  }

  setTargetMediaState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetMediaState.PLAY) {
        this.getDevice().playMedia();
      } else if (state === Characteristic.TargetHeatingCoolingState.PAUSE) {
        this.getDevice().pauseMedia();
      } else if (state === Characteristic.TargetHeatingCoolingState.STOP) {
        this.getDevice().stopMedia();
      } else {
        throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
    }
  }

  getMute() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        return this.getDevice().isMuted();
      }
    }
    return false;
  }

  setMute(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setMuteValue(value);
    }
  }

  getVolume() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        return this.getDevice().getVolumeValue();
      }
    }
    return this.getDevice().volumeRange()[0];
  }

  setVolume(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setVolumeValue(value);
    }
  }

  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.speakerService) this.speakerService.getCharacteristic(Characteristic.CurrentMediaState).updateValue(this.getCurrentMediaState());
    if (this.speakerService) this.speakerService.getCharacteristic(Characteristic.TargetMediaState).updateValue(this.getTargetMediaState());
    if (this.speakerService) this.speakerService.getCharacteristic(Characteristic.Mute).updateValue(this.getMute());
    if (this.speakerService) this.speakerService.getCharacteristic(Characteristic.Volume).updateValue(this.getVolume());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = SpeakerAccessory;

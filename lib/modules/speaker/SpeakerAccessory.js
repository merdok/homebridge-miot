let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class SpeakerAccessory extends BaseAccessory {
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
    this.volumeService = new Service.Lightbulb(this.getName() + ' Volume', 'volumeService');

    this.volumeService
      .getCharacteristic(Characteristic.On)
      .onGet(this.getVolumeOn.bind(this))
      .onSet(this.setVolumeOn.bind(this));

    this.volumeService
      .getCharacteristic(Characteristic.Brightness)
      .onGet(this.getVolume.bind(this))
      .onSet(this.setVolume.bind(this))
      .setProps({
        minValue: this.getDevice().volumeRange()[0],
        maxValue: this.getDevice().volumeRange()[1],
        minStep: this.getDevice().volumeRange()[2]
      });

    this.addAccessoryService(this.volumeService);


    this.playService = this.createStatlessSwitch(this.getName() + ` Play`, 'playService', this.setPlay);
    this.addAccessoryService(this.playService);

    this.pauseService = this.createStatlessSwitch(this.getName() + ` Pause`, 'pauseService', this.setPause);
    this.addAccessoryService(this.pauseService);

    this.nextService = this.createStatlessSwitch(this.getName() + ` Next`, 'nextService', this.setNext);
    this.addAccessoryService(this.nextService);

    this.previousService = this.createStatlessSwitch(this.getName() + ` Previous`, 'previousService', this.setPrevious);
    this.addAccessoryService(this.previousService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  //overrides


  //accessory specific


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getVolumeOn() {
    return this.isMiotDeviceConnected();
  }

  setVolumeOn(value) {
    if (this.isMiotDeviceConnected()) {
      // if the device is connected keep the switch on all the time
      setTimeout(() => {
        if (this.volumeService) this.volumeService.getCharacteristic(Characteristic.On).updateValue(true);
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getVolume() {
    if (this.isMiotDeviceConnected()) {
      let value = this.getDevice().getVolumeValue();
      value = Math.max(value, this.getDevice().volumeRange()[0]);
      return value;
    }
    return this.getDevice().volumeRange()[0];
  }

  setVolume(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setVolumeValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setPlay(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().playMedia();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setPause(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().pauseMedia();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setNext(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().nextMedia();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setPrevious(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().previousMedia();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.volumeService) this.volumeService.getCharacteristic(Characteristic.On).updateValue(this.getVolumeOn());
    if (this.volumeService) this.volumeService.getCharacteristic(Characteristic.Brightness).updateValue(this.getVolume());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = SpeakerAccessory;

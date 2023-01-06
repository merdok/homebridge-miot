let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierAccessory extends BaseAccessory {
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
    this.fanLevelControl = this.getConfigValue('fanLevelControl', false);
    this.screenControl = this.getConfigValue('screenControl', true);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.HUMIDIFIER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_HUMIDIFIER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.humidifierService = new Service.HumidifierDehumidifier(this.getName(), 'humidifierService');

    this.humidifierService.getCharacteristic(Characteristic.Active)
      .onGet(this.getHumidifierActiveState.bind(this))
      .onSet(this.setHumidifierActiveState.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState)
      .onGet(this.getCurrentHumidifierDehumidifierState.bind(this))
      .setProps({
        maxValue: Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
        validValues: [
          Characteristic.CurrentHumidifierDehumidifierState.INACTIVE,
          Characteristic.CurrentHumidifierDehumidifierState.IDLE,
          Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
        ],
      });

    this.humidifierService
      .getCharacteristic(Characteristic.TargetHumidifierDehumidifierState)
      .onGet(this.getTargetHumidifierDehumidifierState.bind(this))
      .onSet(this.setTargetHumidifierDehumidifierState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER,
        validValues: [
          Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER
        ],
      });

    this.addCurrentRelativeHumidityCharacteristic(this.humidifierService);

    if (this.getDevice().supportsTargetHumidity()) {
      this.humidifierService
        .getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold)
        .onGet(this.getRelativeHumidityHumidifierThreshold.bind(this))
        .onSet(this.setRelativeHumidityHumidifierThreshold.bind(this));
    }

    this.addRotationSpeedCharacteristic(this.humidifierService);

    if (this.getDevice().supportsWaterStatusReporting()) {
      this.humidifierService
        .getCharacteristic(Characteristic.WaterLevel)
        .onGet(this.getWaterLevel.bind(this));
    }

    this.addLockPhysicalControlsCharacteristic(this.humidifierService);

    this.addAccessoryService(this.humidifierService);
  }

  setupAdditionalAccessoryServices() {
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.screenControl) this.prepareScreenControlService();
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHumidifierActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHumidifierActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHumidifierDehumidifierState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHumidifying() ? Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING : Characteristic.CurrentHumidifierDehumidifierState.IDLE;
    }
    return Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
  }


  getTargetHumidifierDehumidifierState() {
    return Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER;
  }

  setTargetHumidifierDehumidifierState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().turnOnIfNecessary(); // start humidifying
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRelativeHumidityHumidifierThreshold() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetHumiditySafe();
    }
    return this.getDevice().targetHumidityMinVal(); // return minimum value
  }

  setRelativeHumidityHumidifierThreshold(hum) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetHumiditySafe(hum);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getWaterLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getWaterLevelPercentage();
    }
    return 0;
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.Active).updateValue(this.getHumidifierActiveState());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState).updateValue(this.getCurrentHumidifierDehumidifierState());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.TargetHumidifierDehumidifierState).updateValue(this.getTargetHumidifierDehumidifierState());
    if (this.humidifierService && this.getDevice().supportsTargetHumidity()) this.humidifierService.getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold).updateValue(this.getRelativeHumidityHumidifierThreshold());
    if (this.humidifierService && this.getDevice().supportsWaterStatusReporting()) this.humidifierService.getCharacteristic(Characteristic.WaterLevel).updateValue(this.getWaterLevel());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = HumidifierAccessory;

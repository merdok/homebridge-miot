let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class DehumidifierAccessory extends BaseAccessory {
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

    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.DEHUMIDIFIER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Categories.AIR_DEHUMIDIFIER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.dehumidifierService = new Service.HumidifierDehumidifier(this.getName(), 'dehumidifierService');

    this.dehumidifierService.getCharacteristic(Characteristic.Active)
      .onGet(this.getDehumidifierActiveState.bind(this))
      .onSet(this.setDehumidifierActiveState.bind(this));

    this.dehumidifierService
      .getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState)
      .onGet(this.getCurrentHumidifierDehumidifierState.bind(this))
      .setProps({
        validValues: [
          Characteristic.CurrentHumidifierDehumidifierState.INACTIVE,
          Characteristic.CurrentHumidifierDehumidifierState.IDLE,
          Characteristic.CurrentHumidifierDehumidifierState.DEHUMIDIFYING,
        ],
      });

    this.dehumidifierService
      .getCharacteristic(Characteristic.TargetHumidifierDehumidifierState)
      .onGet(this.getTargetHumidifierDehumidifierState.bind(this))
      .onSet(this.setTargetHumidifierDehumidifierState.bind(this))
      .setProps({
        validValues: [
          Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER
        ],
      });

    this.dehumidifierService
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .onGet(this.getCurrentRelativeHumidity.bind(this));

    this.dehumidifierService
      .getCharacteristic(Characteristic.RelativeHumidityDehumidifierThreshold)
      .updateValue(this.getDevice().targetHumidityMinVal())
      .onGet(this.getRelativeHumidityHumidifierThreshold.bind(this))
      .onSet(this.setRelativeHumidityHumidifierThreshold.bind(this))
      .setProps({
        minValue: this.getDevice().targetHumidityMinVal(),
        maxValue: this.getDevice().targetHumidityMaxVal(),
        minStep: this.getDevice().targetHumidityStepVal()
      });

    this.addLockPhysicalControlsCharacteristic(this.dehumidifierService);

    this.addAccessoryService(this.dehumidifierService);
  }

  setupAdditionalAccessoryServices() {
    if (this.fanLevelControl) this.prepareFanLevelControlServices();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getDehumidifierActiveState() {
    if (this.hasSyncedDehumidifierState()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
  }

  setDehumidifierActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHumidifierDehumidifierState() {
    if (!this.hasSyncedDehumidifierState()) {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }

    if (!this.getDevice().isOn()) {
      return Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
    }

    const reportedState = this.getDevice().getReportedDehumidifyingState();
    if (reportedState === null) {
      return Characteristic.CurrentHumidifierDehumidifierState.IDLE;
    }

    return reportedState ? Characteristic.CurrentHumidifierDehumidifierState.DEHUMIDIFYING : Characteristic.CurrentHumidifierDehumidifierState.IDLE;
  }


  getTargetHumidifierDehumidifierState() {
    return Characteristic.TargetHumidifierDehumidifierState.DEHUMIDIFIER;
  }

  setTargetHumidifierDehumidifierState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().turnOnIfNecessary(); // start dehumidifying
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRelativeHumidityHumidifierThreshold() {
    if (this.hasSyncedDehumidifierState()) {
      return this.getDevice().getTargetHumiditySafe();
    }
    throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
  }

  setRelativeHumidityHumidifierThreshold(hum) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetHumidity(hum);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentRelativeHumidity() {
    if (this.hasSyncedDehumidifierState()) {
      return this.getDevice().getRelativeHumidity();
    }
    throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
  }

  hasSyncedDehumidifierState() {
    return this.isMiotDeviceConnected() && this.getDevice().hasSyncedDehumidifierState();
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (!this.hasSyncedDehumidifierState()) {
      return;
    }

    if (this.dehumidifierService) this.dehumidifierService.getCharacteristic(Characteristic.Active).updateValue(this.getDehumidifierActiveState());
    const reportedState = this.getDevice().getReportedDehumidifyingState();
    if (this.dehumidifierService && reportedState !== null) this.dehumidifierService.getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState).updateValue(this.getCurrentHumidifierDehumidifierState());
    if (this.dehumidifierService) this.dehumidifierService.getCharacteristic(Characteristic.TargetHumidifierDehumidifierState).updateValue(this.getTargetHumidifierDehumidifierState());
    if (this.dehumidifierService) this.dehumidifierService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
    if (this.dehumidifierService) this.dehumidifierService.getCharacteristic(Characteristic.RelativeHumidityDehumidifierThreshold).updateValue(this.getRelativeHumidityHumidifierThreshold());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = DehumidifierAccessory;

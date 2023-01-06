let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FreshAirSystemAccessory extends BaseAccessory {
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
    this.heaterControl = this.getConfigValue('heaterControl', true);
    this.heatLevelControl = this.getConfigValue('heatLevelControl', false);
    this.pm25Breakpoints = this.getConfigValue('pm25Breakpoints', [7, 15, 30, 55]);
    this.co2AbnormalThreshold = this.getConfigValue('co2AbnormalThreshold', 1000);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.FRESH_AIR_SYSTEM;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.FAN)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.fanService = new Service.Fanv2(this.getName(), 'fanService');
    this.fanService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getFanActiveState.bind(this))
      .onSet(this.setFanActiveState.bind(this));
    this.fanService
      .addCharacteristic(Characteristic.CurrentFanState)
      .onGet(this.getCurrentFanState.bind(this));

    this.addRotationSpeedCharacteristic(this.fanService);

    this.addLockPhysicalControlsCharacteristic(this.fanService);

    this.addAccessoryService(this.fanService);
  }

  setupAdditionalAccessoryServices() {
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.heaterControl) this.prepareHeaterControlService();
    if (this.heatLevelControl) this.prepareHeatLevelControlServices();

    this.prepareAirQualityService(this.pm25Breakpoints);
    this.prepareCarbonDioxideService(this.co2AbnormalThreshold);

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareHeaterControlService() {
    if (this.getDevice().supportsHeater()) {
      this.addPropWrapper('Heater', this.getDevice().heaterProp(), this.getDevice().onProp(), null, null, null);
    }
  }

  prepareHeatLevelControlServices() {
    if (this.getDevice().supportsHeatLevels()) {
      this.addPropWrapper('Heat Level', this.getDevice().heatLevelProp(), this.getDevice().onProp(), null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getFanActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setFanActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected() && this.getDevice().isOn()) {
      if (this.getDevice().isIdle()) {
        return Characteristic.CurrentFanState.IDLE;
      } else {
        return Characteristic.CurrentFanState.BLOWING_AIR;
      }
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = FreshAirSystemAccessory;

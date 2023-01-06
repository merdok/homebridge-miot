let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class GatewayAccessory extends BaseAccessory {
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
    return DevTypes.GATEWAY;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.BRIDGE)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.securitySystemService = new Service.SecuritySystem(this.getName(), 'securitySystemService');
    this.securitySystemService
      .getCharacteristic(Characteristic.SecuritySystemCurrentState)
      .onGet(this.getSecuritySystemCurrentState.bind(this));
    this.securitySystemService
      .getCharacteristic(Characteristic.SecuritySystemTargetState)
      .onGet(this.getSecuritySystemTargetState.bind(this))
      .onSet(this.setSecuritySystemTargetState.bind(this));

    this.addAccessoryService(this.securitySystemService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getSecuritySystemCurrentState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isBasicArming()) {
        return Characteristic.SecuritySystemCurrentState.DISARMED;
      } else if (this.getDevice().isHomeArming()) {
        return Characteristic.SecuritySystemCurrentState.STAY_ARM;
      } else if (this.getDevice().isAwayArming()) {
        return Characteristic.SecuritySystemCurrentState.AWAY_ARM;
      } else if (this.getDevice().isSleepArming()) {
        return Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
      }
    }
    return Characteristic.SecuritySystemCurrentState.DISARMED;
  }

  getSecuritySystemTargetState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isBasicArming()) {
        return Characteristic.SecuritySystemTargetState.DISARM;
      } else if (this.getDevice().isHomeArming()) {
        return Characteristic.SecuritySystemTargetState.STAY_ARM;
      } else if (this.getDevice().isAwayArming()) {
        return Characteristic.SecuritySystemTargetState.AWAY_ARM;
      } else if (this.getDevice().isSleepArming()) {
        return Characteristic.SecuritySystemTargetState.NIGHT_ARM;
      }
    }
    return Characteristic.SecuritySystemTargetState.DISARM;
  }

  setSecuritySystemTargetState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state == Characteristic.SecuritySystemTargetState.DISARM) {
        this.getDevice().setBasicArming();
      } else if (state == Characteristic.SecuritySystemTargetState.STAY_ARM) {
        this.getDevice().setHomeArming();
      } else if (state == Characteristic.SecuritySystemTargetState.AWAY_ARM) {
        this.getDevice().setAwayArming();
      } else if (state == Characteristic.SecuritySystemTargetState.NIGHT_ARM) {
        this.getDevice().setSleepArming();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.securitySystemService) {
      this.securitySystemService.getCharacteristic(Characteristic.SecuritySystemCurrentState).updateValue(this.getSecuritySystemCurrentState());
      this.securitySystemService.getCharacteristic(Characteristic.SecuritySystemTargetState).updateValue(this.getSecuritySystemTargetState());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = GatewayAccessory;

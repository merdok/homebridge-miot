let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class RobotCleanerAccessory extends BaseAccessory {
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
    this.modeControl = this.getPropValue(config['modeControl'], false);
    this.dndControl = this.getPropValue(config['dndControl'], false);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
  }

  getAccessoryType() {
    return DevTypes.ROBOT_CLEANER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.FAN);
  }

  setupMainAccessoryService() {
    this.fanService = new Service.Fanv2(this.getName(), 'fanService');
    this.fanService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getSweepActiveState.bind(this))
      .onSet(this.setSweepActiveState.bind(this));
    this.fanService
      .addCharacteristic(Characteristic.CurrentFanState)
      .onGet(this.getCurrentFanState.bind(this));

    //this.addRotationSpeedCharacteristic(this.fanService);

    this.addAccessoryService(this.fanService);
  }

  setupAdditionalAccessoryServices() {
    if (this.modeControl) this.prepareModeControlServices();
    if (this.dndControl) this.prepareDndControlService();
    if (this.actionButtons) this.prepareActionButtonsService();
    this.prepareBatteryService();
    this.prepareFilterMaintenanceService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareFilterMaintenanceService() {
    if (this.getDevice().supportsFilterLifeLevelReporting()) {
      this.filterMaintenanceService = new Service.FilterMaintenance('Filter Maintenance', 'filterMaintenanceService');
      this.filterMaintenanceService
        .getCharacteristic(Characteristic.FilterChangeIndication)
        .onGet(this.getFilterChangeIndicationState.bind(this));
      this.filterMaintenanceService
        .addCharacteristic(Characteristic.FilterLifeLevel)
        .onGet(this.getFilterLifeLevel.bind(this));
      this.addAccessoryService(this.filterMaintenanceService);
    }
  }

  prepareDndControlService() {
    if (this.getDevice().supportsDoNotDisturb()) {
      this.dndService = this.createStatefulSwitch('Do Not Disturb', 'dndService', this.isDndOn, this.setDndOn);
      this.addAccessoryService(this.dndService);
    }
  }

  prepareActionButtonsService() {
    this.startChargeService = this.createStatlessSwitch('Start charge', 'startChargeService', (value) => {
      this.setActionSwitchOn(value, 'startcharge');
    });
    this.addAccessoryService(this.startChargeService);

    this.playSoundService = this.createStatlessSwitch('Play sound', 'playSoundService', (value) => {
      this.setActionSwitchOn(value, 'playsound');
    });
    this.addAccessoryService(this.playSoundService);
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getSweepActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isStatusSweeping() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setSweepActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isStartSweep = state === Characteristic.Active.ACTIVE;
      this.getDevice().setSweepActive(isStartSweep);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isStatusSweeping()) {
        return Characteristic.CurrentFanState.BLOWING_AIR;
      } else {
        return Characteristic.CurrentFanState.IDLE;
      }
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }


  // ----- additional services

  getFilterChangeIndicationState() {
    if (this.isMiotDeviceConnected()) {
      let lifeLevel = this.getDevice().getFilterLifeLevel();
      if (lifeLevel <= 5) {
        return Characteristic.FilterChangeIndication.CHANGE_FILTER;
      }
    }
    return Characteristic.FilterChangeIndication.FILTER_OK;
  }

  getFilterLifeLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFilterLifeLevel();
    }
    return 0;
  }

  isDndOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isDoNotDisturbEnabled();
    }
    return false;
  }

  setDndOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setDoNotDisturbEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  setActionSwitchOn(state, action) {
    if (this.isMiotDeviceConnected()) {
      if (action === 'startcharge') {
        this.getDevice().fireStartCharge();
      } else if (action === 'playsound') {
        this.getDevice().firePlaySound();
      }
      this.resetActionSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getSweepActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndicationState());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevel());
    if (this.dndControl) this.dndControl.getCharacteristic(Characteristic.On).updateValue(this.isDndOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  resetActionSwitches() {
    setTimeout(() => {
      if (this.startChargeService) this.startChargeService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.playSoundService) this.playSoundService.getCharacteristic(Characteristic.On).updateValue(false);
    }, Constants.BUTTON_RESET_TIMEOUT);
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = RobotCleanerAccessory;

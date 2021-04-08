let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FreshAirSystemAccessory extends BaseAccessory {
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
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.heaterControl = this.getPropValue(config['heaterControl'], true);
  }

  getAccessoryType() {
    return DevTypes.FRESH_AIR_SYSTEM;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.FAN);
  }

  setupMainAccessoryService() {
    this.fanService = new Service.Fanv2(this.getName(), 'fanService');
    this.fanService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getFanActiveState.bind(this))
      .onSet(this.setFanActiveState.bind(this));
    this.fanService
      .addCharacteristic(Characteristic.CurrentFanState)
      .onGet(this.getCurrentFanState.bind(this));

    if (this.childLockControl && this.getDevice().supportsChildLock()) {
      this.fanService
        .addCharacteristic(Characteristic.LockPhysicalControls)
        .onGet(this.getLockPhysicalControlsState.bind(this))
        .onSet(this.setLockPhysicalControlsState.bind(this));
    }

    this.addAccessoryService(this.fanService);
  }

  setupAdditionalAccessoryServices() {
    this.prepareFilterMaintenanceService();
    this.prepareTemperatureService();
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.heaterControl) this.prepareHeaterControlService();
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
        .onGet(this.getFilterLifeLevelValue.bind(this));
      this.addAccessoryService(this.filterMaintenanceService);
    }
  }

  prepareFanLevelControlServices() {
    if (this.getDevice().supportsFanLevels()) {
      this.fanLevelControlServices = new Array();
      this.getDevice().fanLevels().forEach((fanLevel, i) => {
        let fanLevelVal = fanLevel.value;
        let fanLevelDesc = fanLevel.description;
        let tmpFanLevelSwitch = this.createStatefulSwitch('Fan Level - ' + fanLevelDesc, 'fanLevelControlService' + fanLevelVal, () => {
          return this.getFanLevelSwitchValue(fanLevelVal);
        }, (value) => {
          this.setFanLevelSwitchValue(value, fanLevelVal);
        });
        this.addAccessoryService(tmpFanLevelSwitch);
        this.fanLevelControlServices.push(tmpFanLevelSwitch);
      });
    }
  }

  prepareHeaterControlService() {
    if (this.getDevice().supportsHeater()) {
      this.heaterService = this.createStatefulSwitch('Heater', 'heaterService', this.getHeaterValue, this.setHeaterValue);
      this.addAccessoryService(this.heaterService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getFanActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setFanActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.getDevice().setPowerOn(isPowerOn);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentFanState() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      if (this.getDevice().isIdle()) {
        return Characteristic.CurrentFanState.IDLE;
      } else {
        return Characteristic.CurrentFanState.BLOWING_AIR;
      }
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }

  getLockPhysicalControlsState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isChildLockActive() ? Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED : Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
    }
    return Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED;
  }

  setLockPhysicalControlsState(state) {
    if (this.isMiotDeviceConnected()) {
      let isChildLockActive = state === Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      this.getDevice().setChildLock(isChildLockActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
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

  getFilterLifeLevelValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getFilterLifeLevel();
    }
    return 0;
  }

  getFanLevelSwitchValue(level) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getFanLevel() === level;
    }
    return false;
  }

  setFanLevelSwitchValue(value, level) {
    if (this.isMiotDeviceConnected()) {
      if (value) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().setFanLevel(level);
      }
      setTimeout(() => {
        this.updateFanLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHeaterValue() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeaterEnabled();
    }
    return false;
  }

  setHeaterValue(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setHeaterEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
    if (this.fanService && this.childLockControl && this.getDevice().supportsChildLock()) this.fanService.getCharacteristic(Characteristic.LockPhysicalControls).updateValue(this.getLockPhysicalControlsState());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(this.getFilterChangeIndicationState());
    if (this.filterMaintenanceService && this.getDevice().supportsFilterLifeLevelReporting()) this.filterMaintenanceService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(this.getFilterLifeLevelValue());
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.On).updateValue(this.getHeaterValue());
    this.updateFanLevelSwitches();
    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateFanLevelSwitches() {
    if (this.fanLevelControlServices) {
      let currentLevel = this.getDevice().getFanLevel();
      this.fanLevelControlServices.forEach((tmpFanLevelSwitch, i) => {
        let fanLevel = this.getDevice().fanLevels()[i];
        let fanLevelVal = fanLevel.value;
        let isSwitchOn = (currentLevel === fanLevelVal) && this.getDevice().isPowerOn();
        tmpFanLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = FreshAirSystemAccessory;

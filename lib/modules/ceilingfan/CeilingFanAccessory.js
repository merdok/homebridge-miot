let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CeilingFanAccessory extends BaseAccessory {
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
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], false);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.lightModeControl = this.getPropValue(config['lightModeControl'], false);
    this.lightShutdownTimer = this.getPropValue(config['lightShutdownTimer'], false);
  }

  getAccessoryType() {
    return DevTypes.CEILING_FAN;
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

    this.addRotationSpeedCharacteristic(this.fanService);

    this.addAccessoryService(this.fanService);
  }

  setupAdditionalAccessoryServices() {
    if (this.shutdownTimer) this.prepareShutdownTimerService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();

    this.prepareLightService();
    if (this.lightModeControl) this.prepareLightModeControlServices();
    if (this.lightShutdownTimer) this.prepareLightShutdownTimerService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLightService() {
    if (this.getDevice().hasBuiltInLight()) {
      this.lightService = new Service.Lightbulb('Light', 'lightService');
      this.lightService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isLightOn.bind(this))
        .onSet(this.setLightOn.bind(this));

      this.addBrightnessCharacteristic(this.lightService);

      this.addColorTemperatureCharacteristic(this.lightService);

      this.addAccessoryService(this.lightService);
    }
  }

  prepareLightModeControlServices() {
    if (this.getDevice().supportsLightModes()) {
      this.lightModeControlServices = new Array();
      this.getDevice().lightModes().forEach((mode, i) => {
        let modeVal = mode.value;
        let modeDesc = mode.description;
        let tmpLightModeSwitch = this.createStatefulSwitch('Light Mode - ' + modeDesc, 'lightModeControlService' + modeVal, () => {
          return this.isLightModeSwitchOn(modeVal);
        }, (value) => {
          this.setLightModeSwitchOn(value, modeVal);
        });
        this.addAccessoryService(tmpLightModeSwitch);
        this.lightModeControlServices.push(tmpLightModeSwitch);
      });
    }
  }

  prepareLightShutdownTimerService() {
    if (this.getDevice().supportsLightPowerOffTimer()) {
      this.lightShutdownTimerService = new Service.Lightbulb('Light Shutdown timer', 'lightShutdownTimerService');
      this.lightShutdownTimerService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isLightShutdownTimerOn.bind(this))
        .onSet(this.setLightShutdownTimerOn.bind(this));
      this.lightShutdownTimerService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getLightShutdownTimerBrightness.bind(this))
        .onSet(this.setLightShutdownTimerBrightness.bind(this));

      this.addAccessoryService(this.lightShutdownTimerService);
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
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.CurrentFanState.BLOWING_AIR : Characteristic.CurrentFanState.IDLE;
    }
    return Characteristic.CurrentFanState.INACTIVE;
  }


  // ----- additional services

  isLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightOn();
    }
    return false;
  }

  setLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isLightModeSwitchOn(mode) {
    if (this.isMiotDeviceConnected() && this.getDevice().isLightOn()) {
      return this.getDevice().getLightMode() === mode;
    }
    return false;
  }

  setLightModeSwitchOn(state, mode) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().turnLightOnIfNecessary();
        this.getDevice().setLightMode(mode);
      }
      setTimeout(() => {
        this.updateLightModeSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isLightShutdownTimerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightShutdownTimerEnabled();
    }
    return false;
  }

  setLightShutdownTimerOn(value) {
    if (this.isMiotDeviceConnected()) {
      if (value === false) { // only if disabling, enabling will automatically set it to 100%
        this.getDevice().setLightShutdownTimer(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getLightShutdownTimerBrightness() {
    if (this.isMiotDeviceConnected()) {
      return Math.min(this.getDevice().getLightShutdownTimer(), 100);
    }
    return 0;
  }

  setLightShutdownTimerBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightShutdownTimer(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());

    if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.isLightOn());
    if (this.lightShutdownTimerService) this.lightShutdownTimerService.getCharacteristic(Characteristic.On).updateValue(this.isLightShutdownTimerOn());
    if (this.lightShutdownTimerService) this.lightShutdownTimerService.getCharacteristic(Characteristic.Brightness).updateValue(this.getLightShutdownTimerBrightness());
    this.updateLightModeSwitches();

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateLightModeSwitches() {
    if (this.lightModeControlServices) {
      let currentMode = this.getDevice().getLightMode();
      this.lightModeControlServices.forEach((tmpLightModeSwitch, i) => {
        let mode = this.getDevice().lightModes()[i];
        let modeVal = mode.value;
        let isSwitchOn = (currentMode === modeVal) && this.getDevice().isLightOn();
        tmpLightModeSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = CeilingFanAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');
const AngleButtonsService = require('../../services/AngleButtonsService.js');


class FanAccessory extends BaseAccessory {
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
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], true);
    this.swingControl = this.getPropValue(config['swingControl'], false);
    this.moveControl = this.getPropValue(config['moveControl'], false);
    this.horizontalAngleButtons = this.getPropValue(config['horizontalAngleButtons'], false);
    this.verticalAngleButtons = this.getPropValue(config['verticalAngleButtons'], false);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.ioniserControl = this.getPropValue(config['ioniserControl'], false);
  }

  getAccessoryType() {
    return DevTypes.FAN;
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

    this.addChildLockCharacteristic(this.fanService);

    this.addRotationSpeedCharacteristic(this.fanService);

    if (this.getDevice().supportsHorizontalSwing()) {
      this.fanService
        .addCharacteristic(Characteristic.SwingMode)
        .onGet(this.getSwingModeState.bind(this))
        .onSet(this.setSwingModeState.bind(this));

      // additonaly use the rotation direction switch as convinience to turn on or off horizontal swing
      this.fanService
        .addCharacteristic(Characteristic.RotationDirection)
        .onGet(this.getRotationDirectionState.bind(this))
        .onSet(this.setRotationDirectionState.bind(this));
    }

    this.addAccessoryService(this.fanService);
  }

  setupAdditionalAccessoryServices() {
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.shutdownTimer) this.prepareShutdownTimerService();
    if (this.moveControl) this.prepareMoveControlService();
    if (this.swingControl) this.prepareSwingControlService();
    if (this.horizontalAngleButtons) this.prepareHorizontalAngleButtonsService();
    if (this.verticalAngleButtons) this.prepareVerticalAngleButtonsService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();
    if (this.ioniserControl) this.prepareIoniserControlService();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
    this.prepareBatteryService();
  }

  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareMoveControlService() {
    if (this.getDevice().supportsHorizontalMove()) {
      this.moveLeftService = this.createStatlessSwitch('Move left', 'moveLeftService', (value) => {
        this.setMoveFanSwitchOn(value, 'left');
      });
      this.addAccessoryService(this.moveLeftService);

      this.moveRightService = this.createStatlessSwitch('Move right', 'moveRightService', (value) => {
        this.setMoveFanSwitchOn(value, 'right');
      });
      this.addAccessoryService(this.moveRightService);
    }

    if (this.getDevice().supportsVerticalMove()) {
      this.moveUpService = this.createStatlessSwitch('Move up', 'moveUpService', (value) => {
        this.setMoveFanSwitchOn(value, 'up');
      });
      this.addAccessoryService(this.moveUpService);

      this.moveDownService = this.createStatlessSwitch('Move down', 'moveDownService', (value) => {
        this.setMoveFanSwitchOn(value, 'down');
      });
      this.addAccessoryService(this.moveDownService);
    }
  }

  prepareSwingControlService() {
    if (this.getDevice().supportsHorizontalSwing()) {
      this.horizontalSwingControlService = this.createStatefulSwitch('Horizontal Swing', 'horizontalSwingControlService', this.isHorizontalSwingSwitchOn, this.setHorizontalSwingSwitchOn);
      this.addAccessoryService(this.horizontalSwingControlService);
    }

    if (this.getDevice().supportsVerticalSwing()) {
      this.verticalSwingControlService = this.createStatefulSwitch('Vertical Swing', 'verticalSwingControlService', this.isVerticalSwingSwitchOn, this.setVerticalSwingSwitchOn);
      this.addAccessoryService(this.verticalSwingControlService);
    }
  }

  prepareHorizontalAngleButtonsService() {
    if (this.getDevice().supportsHorizontalSwingAngle()) {
      this.addAngleButtonsService('Horizontal Angle', Properties.HORIZONTAL_SWING_ANGLE, Properties.HORIZONTAL_SWING, this.horizontalAngleButtons);
    }
  }

  prepareVerticalAngleButtonsService() {
    if (this.getDevice().supportsVerticalSwingAngle()) {
      this.addAngleButtonsService('Vertical Angle', Properties.VERTICAL_SWING_ANGLE, Properties.VERTICAL_SWING, this.verticalAngleButtons);
    }
  }

  prepareIoniserControlService() {
    if (this.getDevice().supportsIoniser()) {
      this.ioniserControlService = this.createStatefulSwitch('Ioniser', 'ioniserControlService', this.isIoniserSwitchOn, this.setIoniserSwitchOn);
      this.addAccessoryService(this.ioniserControlService);
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

  getSwingModeState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHorizontalSwingEnabled() ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED
    }
    return Characteristic.SwingMode.SWING_DISABLED;
  }

  setSwingModeState(state) {
    if (this.isMiotDeviceConnected()) {
      let isSwingModeActive = state === Characteristic.SwingMode.SWING_ENABLED;
      this.getDevice().setHorizontalSwingEnabled(isSwingModeActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRotationDirectionState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHorizontalSwingEnabled() ? Characteristic.RotationDirection.CLOCKWISE : Characteristic.RotationDirection.COUNTER_CLOCKWISE;
    }
    return Characteristic.RotationDirection.COUNTER_CLOCKWISE;
  }

  setRotationDirectionState(state) {
    if (this.isMiotDeviceConnected()) {
      let isSwingModeActive = state === Characteristic.RotationDirection.CLOCKWISE;
      this.getDevice().setHorizontalSwingEnabled(isSwingModeActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // ----- additional services

  setMoveFanSwitchOn(state, direction) {
    if (this.isMiotDeviceConnected()) {
      if (direction === 'left') {
        this.getDevice().moveLeft();
      } else if (direction === 'right') {
        this.getDevice().moveRight();
      } else if (direction === 'up') {
        this.getDevice().moveUp();
      } else if (direction === 'down') {
        this.getDevice().moveDown();
      }
      this.resetMoveControlSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isHorizontalSwingSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHorizontalSwingEnabled();
    }
    return false;
  }

  setHorizontalSwingSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setHorizontalSwingEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isVerticalSwingSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isVerticalSwingEnabled();
    }
    return false;
  }

  setVerticalSwingSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setVerticalSwingEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isIoniserSwitchOn() {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().isIoniserEnabled();
    }
    return false;
  }

  setIoniserSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setIoniserEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.RotationDirection).updateValue(this.getRotationDirectionState());
    if (this.horizontalSwingControlService) this.horizontalSwingControlService.getCharacteristic(Characteristic.On).updateValue(this.isHorizontalSwingSwitchOn());
    if (this.verticalSwingControlService) this.verticalSwingControlService.getCharacteristic(Characteristic.On).updateValue(this.isVerticalSwingSwitchOn());
    if (this.ioniserControlService) this.ioniserControlService.getCharacteristic(Characteristic.On).updateValue(this.isIoniserSwitchOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  resetMoveControlSwitches() {
    setTimeout(() => {
      if (this.moveLeftService) this.moveLeftService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveRightService) this.moveRightService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveUpService) this.moveUpService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveDownService) this.moveDownService.getCharacteristic(Characteristic.On).updateValue(false);
    }, Constants.BUTTON_RESET_TIMEOUT);
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== CUSTOM SERVICES ==========----------*/

  addAngleButtonsService(serviceName, propName, linkedPropName, angleButtonsConfig) {
    this.addCustomService(AngleButtonsService, serviceName, propName, linkedPropName, angleButtonsConfig);
  }


  /*----------========== HELPERS ==========----------*/


}


module.exports = FanAccessory;

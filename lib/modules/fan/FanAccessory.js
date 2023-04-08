let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const AngleButtonsWrapper = require('../../wrappers/AngleButtonsWrapper.js');


class FanAccessory extends BaseAccessory {
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
    this.offDelayControl = this.getConfigValue('offDelayControl', false);
    this.swingControl = this.getConfigValue('swingControl', false);
    this.moveControl = this.getConfigValue('moveControl', false);
    this.horizontalAngleButtons = this.getConfigValue('horizontalAngleButtons', false);
    this.verticalAngleButtons = this.getConfigValue('verticalAngleButtons', false);
    this.ioniserControl = this.getConfigValue('ioniserControl', false);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.FAN;
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

    this.addLockPhysicalControlsCharacteristic(this.fanService);

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
    if (this.offDelayControl) this.prepareOffDelayService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.moveControl) this.prepareMoveControlService();
    if (this.swingControl) this.prepareSwingControlService();
    if (this.horizontalAngleButtons) this.prepareHorizontalAngleButtonsWrapper();
    if (this.verticalAngleButtons) this.prepareVerticalAngleButtonsWrapper();
    if (this.ioniserControl) this.prepareIoniserControlService();
    super.setupAdditionalAccessoryServices(); // make sure we call super
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
      this.addPropWrapper('Horizontal Swing', this.getDevice().horizontalSwingProp(), null, null, null, null);
    }

    if (this.getDevice().supportsVerticalSwing()) {
      this.addPropWrapper('Vertical Swing', this.getDevice().verticalSwingProp(), null, null, null, null);
    }
  }

  prepareHorizontalAngleButtonsWrapper() {
    if (this.getDevice().supportsHorizontalSwingAngle()) {
      this.addAngleButtonsWrapper('Horizontal Angle', this.getDevice().horizontalAngleProp(), this.getDevice().horizontalSwingProp(), this.horizontalAngleButtons);
    }
  }

  prepareVerticalAngleButtonsWrapper() {
    if (this.getDevice().supportsVerticalSwingAngle()) {
      this.addAngleButtonsWrapper('Vertical Angle', this.getDevice().verticalAngleProp(), this.getDevice().verticalSwingProp(), this.verticalAngleButtons);
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
    if (this.isMiotDeviceConnected()) {
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
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.Active).updateValue(this.getFanActiveState());
    if (this.fanService) this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(this.getCurrentFanState());
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.RotationDirection).updateValue(this.getRotationDirectionState());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/

  addAngleButtonsWrapper(wrapperName, prop, linkedProp, angleButtonsConfig) {
    const newAngleButtonsWrapper = this.createWrapper(AngleButtonsWrapper, wrapperName, prop);
    if (newAngleButtonsWrapper) {
      newAngleButtonsWrapper.setLinkedProp(linkedProp);
      newAngleButtonsWrapper.setConfiguration(angleButtonsConfig);
      return this.initAndAddWrapper(newAngleButtonsWrapper);
    }
    return null;
  }


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = FanAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


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
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], true);
    this.swingControl = this.getPropValue(config['swingControl'], false);
    this.moveControl = this.getPropValue(config['moveControl'], false);
    this.horizontalAngleButtons = this.getPropValue(config['horizontalAngleButtons'], false);
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

    if (this.childLockControl) this.addChildLockCharacteristic(this.fanService);

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
    if (this.shutdownTimer) this.prepareShutdownTimerService();
    if (this.moveControl) this.prepareMoveControlService();
    if (this.swingControl) this.prepareSwingControlService();
    if (this.horizontalAngleButtons) this.prepareHorizontalAngleButtonsService();
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
      this.horizontalSwingAnglesList = this.generateHorizontalAngleList(this.horizontalAngleButtons);
      // generate the switches
      if (this.horizontalSwingAnglesList && this.horizontalSwingAnglesList.length > 0) {
        this.horizontalAngleControlServices = new Array();
        this.horizontalSwingAnglesList.forEach((swingAngle, i) => {
          let swingAngleVal = swingAngle.value;
          let swingAngleDesc = swingAngle.description;
          let tmpSwingAngleSwitch = this.createStatefulSwitch('Horizontal Angle - ' + swingAngleDesc, 'horizontalAngleControlService' + swingAngleVal, () => {
            return this.isSwingAngleSwitchOn(swingAngleVal);
          }, (value) => {
            this.setSwingAngleSwitchOn(value, swingAngleVal);
          });
          this.addAccessoryService(tmpSwingAngleSwitch);
          this.horizontalAngleControlServices.push(tmpSwingAngleSwitch);
        });
      }
    }
  }

  prepareIoniserControlService() {
    if (this.getDevice().supportsIoniser()) {
      this.ioniserControlService = this.createStatefulSwitch('Ioniser', 'ioniserControlService', this.isIoniserSswitchOn, this.setIoniserSswitchOn);
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
      this.updateSwingAngleSwitches();
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
      this.updateSwingAngleSwitches();
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
      this.updateSwingAngleSwitches();
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
      //  this.updateSwingAngleSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isSwingAngleSwitchOn(angle) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      if (this.getDevice().isHorizontalSwingEnabled()) {
        return this.getDevice().getHorizontalSwingAngle() === angle;
      }
    }
    return false;
  }

  setSwingAngleSwitchOn(state, angle) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().turnOnHorizontalSwingIfNecessary();
        this.getDevice().setHorizontalSwingAngle(angle);
      } else {
        this.getDevice().setHorizontalSwingEnabled(false);
      }
      setTimeout(() => {
        this.updateSwingAngleSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isIoniserSswitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isIoniserEnabled();
    }
    return false;
  }

  setIoniserSswitchOn(state) {
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
    if (this.ioniserControlService) this.ioniserControlService.getCharacteristic(Characteristic.On).updateValue(this.isIoniserSswitchOn());
    this.updateSwingAngleSwitches();

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateSwingAngleSwitches() {
    if (this.horizontalAngleControlServices && this.horizontalSwingAnglesList && this.horizontalSwingAnglesList.length > 0) {
      let currentAngle = this.getDevice().getHorizontalSwingAngle();
      this.horizontalAngleControlServices.forEach((tmpSwingAngleSwitch, i) => {
        let swingAngle = this.horizontalSwingAnglesList[i];
        let swingAngleVal = swingAngle.value;
        let isSwitchOn = (currentAngle === swingAngleVal) && this.getDevice().isPowerOn();
        tmpSwingAngleSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  resetMoveControlSwitches() {
    setTimeout(() => {
      if (this.moveLeftService) this.moveLeftService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveRightService) this.moveRightService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveUpService) this.moveUpService.getCharacteristic(Characteristic.On).updateValue(false);
      if (this.moveDownService) this.moveDownService.getCharacteristic(Characteristic.On).updateValue(false);
    }, Constants.BUTTON_RESET_TIMEOUT);
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/

  generateHorizontalAngleList(horizontalAngles) {
    if (this.getDevice().supportsHorizontalSwingLevels() && horizontalAngles) {
      // simply get the swing angles list if supported
      return this.getDevice().horizontalSwingLevels();
    } else if (this.getDevice().supportsHorizontalSwingRange() && Array.isArray(horizontalAngles)) {
      // if a range supported then generate the angles list specified by the user input
      let tmpAnglesList = new Array();
      horizontalAngles.forEach((value, i) => {
        let parsedAngle = parseInt(value);
        if (parsedAngle === undefined || isNaN(parsedAngle)) {
          this.getLogger().warn(`Failed to parse angle ${parsedAngle}. Skipping angle button!`);
          return;
        }
        if (this.getDevice().validateHorizontalSwingAngle(parsedAngle) === false) {
          this.getLogger().warn(`Specified angle ${parsedAngle} is not within the supported range ${JSON.stringify(this.getDevice().horizontalSwingAngleRange())}. Skipping angle button!`);
          return;
        }
        let tmpAngleObj = {};
        tmpAngleObj.value = parsedAngle;
        tmpAngleObj.description = parsedAngle.toString();
        tmpAnglesList.push(tmpAngleObj);
      });
      return tmpAnglesList;
    }

    return null;
  }


}


module.exports = FanAccessory;

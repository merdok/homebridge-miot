let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FanAccessory extends BaseAccessory {
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
    this.horizontalSwingControl = this.getPropValue(config['horizontalSwingControl'], false);
    this.verticalSwingControl = this.getPropValue(config['verticalSwingControl'], false);
    this.moveControl = this.getPropValue(config['moveControl'], false);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], true);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.ioniserControl = this.getPropValue(config['ioniserControl'], false);
    this.horizontalAngleButtons = this.getPropValue(config['horizontalAngleButtons']);
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
    if (this.verticalSwingControl) this.prepareVerticalSwingControlService();
    this.prepareHorizontalAngleButtonsService();
    if (this.horizontalSwingControl) this.prepareHorizontalSwingControlService();
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

  prepareHorizontalSwingControlService() {
    if (this.getDevice().supportsHorizontalSwing()) {
      this.horizontalSwingControlService = this.createStatefulSwitch('H_Swing', 'horizontalSwingControlService', this.isHorizontalSwingSwitchOn, this.setHorizontalSwingSwitchOn);
      this.addAccessoryService(this.horizontalSwingControlService);
    }
  }

  prepareVerticalSwingControlService() {
    if (this.getDevice().supportsVerticalSwing()) {
      this.verticalSwingControlService = this.createStatefulSwitch('V_Swing', 'verticalSwingControlService', this.isVerticalSwingSwitchOn, this.setVerticalSwingSwitchOn);
      this.addAccessoryService(this.verticalSwingControlService);
    }
  }

  prepareHorizontalAngleButtonsService() {
    if (this.getDevice().supportsHorizontalSwingAngle() === false && this.getDevice().supportsHorizontalSwingLevels() === false) {
      return;
    }

    if (this.horizontalAngleButtons === false) {
      return;
    }

    if (this.horizontalAngleButtons === undefined || this.horizontalAngleButtons === null) {
      if (this.getDevice().supportsHorizontalSwingLevels()) {
        // if the fan supports osicllation levels, and user did not specify the property then show all oscillation levels
        this.horizontalAngleButtons = this.getDevice().horizontalSwingLevels();
      } else {
        return;
      }
    }

    if (Array.isArray(this.horizontalAngleButtons) === false) {
      this.logger.warn('The horizontal angle buttons service needs to be defined as an array! Please correct your config.json if you want to use the Service.');
      return;
    }

    this.horizontalAngleButtonsService = new Array();
    this.horizontalAngleButtons.forEach((value, i) => {
      let parsedValue = parseInt(value);

      if (this.checkAngleButtonValue(parsedValue) === false) {
        return;
      }

      this.horizontalAngleButtons[i] = parsedValue;

      let tmpHorizontalAngleButton = new Service.Switch(this.name + ' H_Angle - ' + parsedValue, 'angleButtonService' + i);
      tmpHorizontalAngleButton
        .getCharacteristic(Characteristic.On)
        .onGet(() => {
          return this.getHorizontalAngleButtonState(parsedValue);
        })
        .onSet((state) => {
          this.setHorizontalAngleButtonState(state, parsedValue);
        });
      this.addAccessoryService(tmpHorizontalAngleButton);
      this.horizontalAngleButtonsService.push(tmpHorizontalAngleButton);
    });
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
      this.updateAngleButtonsAndHorizontalSwingMode(null, isSwingModeActive); // update the angel buttons if enabled
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
      this.updateAngleButtonsAndHorizontalSwingMode(null, isSwingModeActive); // update the angel buttons if enabled
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
      this.updateAngleButtonsAndHorizontalSwingMode(null, state); // update the angel buttons if enabled
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
      //  this.updateAngleButtonsAndHorizontalSwingMode(null, state); // update the angel buttons if enabled
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHorizontalAngleButtonState(angle) {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isPowerOn() && this.getDevice().isSwingModeEnabled() === true) {
        return this.getDevice().getHorizontalSwingAngle() === angle;
      }
    }
    return false;
  }

  setHorizontalAngleButtonState(state, angle) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        // if swing mode disabled then turn it on
        if (this.getDevice().isHorizontalSwingEnabled() === false) {
          this.getDevice().setHorizontalSwingEnabled(true);
        }
        this.getDevice().setHorizontalSwingAngle(angle);
      } else {
        this.getDevice().setHorizontalSwingEnabled(false);
      }
      this.updateAngleButtonsAndHorizontalSwingMode(angle, state);
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
    if (this.ioniserControlService) this.ioniserControlService.getCharacteristic(Characteristic.On).updateValue(this.isIoniserSswitchOn());
    if (this.verticalSwingControlService) this.verticalSwingControlService.getCharacteristic(Characteristic.On).updateValue(this.isVerticalSwingSwitchOn());
    this.updateAngleButtonsAndHorizontalSwingMode(null, this.getDevice().isSwingModeEnabled());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateAngleButtonsAndHorizontalSwingMode(activeAngle, enabled) {
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.SwingMode).updateValue(enabled ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED);
    if (this.fanService && this.getDevice().supportsHorizontalSwing()) this.fanService.getCharacteristic(Characteristic.RotationDirection).updateValue(enabled ? Characteristic.RotationDirection.CLOCKWISE : Characteristic.RotationDirection.COUNTER_CLOCKWISE);
    if (this.horizontalSwingControlService) this.horizontalSwingControlService.getCharacteristic(Characteristic.On).updateValue(enabled);
    if (this.horizontalAngleButtonsService) {
      // if swing mode disabled then just disable all the angle switches
      if (enabled === false || this.getDevice().isPowerOn() === false) {
        activeAngle = "disabled"; // use fake value for angle
      }

      // if angle not specified then automatically update the status
      if (activeAngle === undefined || activeAngle === null) {
        activeAngle = this.getDevice().getHorizontalSwingAngle();
      }

      this.horizontalAngleButtonsService.forEach((tmpHorizontalAngleButton, i) => {
        if (activeAngle === this.horizontalAngleButtons[i]) {
          tmpHorizontalAngleButton.getCharacteristic(Characteristic.On).updateValue(true);
        } else {
          tmpHorizontalAngleButton.getCharacteristic(Characteristic.On).updateValue(false);
        }
      });
    }
  }

  checkAngleButtonValue(angleValue) {
    if (this.getDevice().supportsHorizontalSwingAngle()) {
      // if specified angle not within range then show a a warning and stop processing this value
      if (this.getDevice().checkHorizontalSwingAngleWithinRange(angleValue) === false) {
        this.logger.warn(`Specified angle ${angleValue} is not within the supported range ${JSON.stringify(this.miotFanDevice.horizontalSwingAngleRange())}. Not adding angle button!`);
        return false;
      }
    } else if (this.getDevice().supportsHorizontalSwingLevels()) {
      // if the fan uses predefined osiscllation levels then check if the specified angle is on the list
      if (this.getDevice().checkHorizontalSwingLevelSupported(angleValue) === false) {
        this.logger.warn(`Specified angle ${angleValue} is not within the supported angle levels of your fan. Allowed values: ${JSON.stringify(this.miotFanDevice.horizontalSwingLevels())}. Not adding angle button!`);
        return false;
      }
    }

    return true;
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


}


module.exports = FanAccessory;

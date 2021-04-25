const BaseDevice = require('../../base/BaseDevice.js');
const FanProperties = require('./FanProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FanDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.FAN;
  }


  /*----------========== VALUES ==========----------*/

  straightWindModeValue() {
    return -1;
  }

  naturalModeValue() {
    return -1;
  }

  sleepModeValue() {
    return -1;
  }

  moveLeftValue() {
    return 'left';
  }

  moveRightValue() {
    return 'right';
  }

  moveUpValue() {
    return 'up';
  }

  moveDownValue() {
    return 'down';
  }


  /*----------========== FEATURES ==========----------*/

  // horizontal swing
  supportsHorizontalSwing() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING);
  }

  supportsHorizontalSwingAngle() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingRange() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingAngleRange().length > 0;
  }

  horizontalSwingAngleRange() {
    return this.getPropertyValueRange(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingLevels() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingLevels().length > 0;
  }

  horizontalSwingLevels() {
    return this.getPropertyValueList(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  // vertical swing
  supportsVerticalSwing() {
    return this.hasProperty(FanProperties.VERTICAL_SWING);
  }

  supportsVerticalSwingAngle() {
    return this.hasProperty(FanProperties.VERTICAL_SWING_ANGLE);
  }

  verticalSwingAngleRange() {
    return this.getPropertyValueRange(FanProperties.VERTICAL_SWING_ANGLE);
  }

  // manual fan move
  supportsHorizontalMove() {
    return this.hasProperty(FanProperties.HORIZONTAL_MOVE);
  }

  supportsVerticalMove() {
    return this.hasProperty(FanProperties.VERTICAL_MOVE);
  }

  // modes
  supportsStraightWindMode() {
    return this.supportsModes() && this.straightWindModeValue() !== -1;
  }

  supportsNaturalMode() {
    return this.supportsModes() && this.naturalModeValue() !== -1;
  }

  supportsSleepMode() {
    return this.supportsModes() && this.sleepModeValue() !== -1;
  }

  // ioniser
  supportsIoniser() {
    return this.hasProperty(FanProperties.ANION);
  }


  /*----------========== GETTERS ==========----------*/

  isHorizontalSwingEnabled() {
    return this.getPropertyValue(FanProperties.HORIZONTAL_SWING);
  }

  getHorizontalSwingAngle() {
    return this.getPropertyValue(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  isVerticalSwingEnabled() {
    return this.getPropertyValue(FanProperties.VERTICAL_SWING);
  }

  getVerticalSwingAngle() {
    return this.getPropertyValue(FanProperties.VERTICAL_SWING_ANGLE);
  }

  isStraightWindModeEnabled() {
    if (this.supportsStraightWindMode()) {
      return this.getMode() === this.straightWindModeValue();
    }
    return false;
  }

  isNaturalModeEnabled() {
    if (this.supportsNaturalMode()) {
      return this.getMode() === this.naturalModeValue();
    }
    return false;
  }

  isSleepModeEnabled() {
    if (this.supportsSleepMode()) {
      return this.getMode() === this.sleepModeValue();
    }
    return false;
  }

  isIoniserEnabled() {
    return this.getPropertyValue(FanProperties.ANION);
  }

  isIdle() {
    if (this.supportsFanSpeedRpmReporting() && this.getFanSpeedRpm() === 0) {
      return true;
    }
    return false;
  }


  /*----------========== SETTERS ==========----------*/

  async setHorizontalSwingEnabled(enabled) {
    this.setPropertyValue(FanProperties.HORIZONTAL_SWING, enabled);
  }

  async setHorizontalSwingAngle(angle) {
    this.setPropertyValue(FanProperties.HORIZONTAL_SWING_ANGLE, angle);
  }

  async setVerticalSwingEnabled(enabled) {
    this.setPropertyValue(FanProperties.VERTICAL_SWING, enabled);
  }

  async setVerticalSwingAngle(angle) {
    this.setPropertyValue(FanProperties.VERTICAL_SWING_ANGLE, angle);
  }

  async enableStraightWindMode() {
    if (this.supportsStraightWindMode()) {
      this.setMode(this.straightWindModeValue());
    }
  }

  async enableNaturalMode() {
    if (this.supportsNaturalMode()) {
      this.setMode(this.naturalModeValue());
    }
  }

  async enableSleepMode() {
    if (this.supportsSleepMode()) {
      this.setMode(this.sleepModeValue());
    }
  }

  async moveLeft() {
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, this.moveLeftValue());
  }

  async moveRight() {
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, this.moveRightValue());
  }

  async moveUp() {
    this.setPropertyValue(FanProperties.VERTICAL_MOVE, this.moveUpValue());
  }

  async moveDown() {
    this.setPropertyValue(FanProperties.VERTICAL_MOVE, this.moveDownValue());
  }

  async setIoniserEnabled(enabled) {
    this.setPropertyValue(FanProperties.ANION, enabled);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  turnOnHorizontalSwingIfNecessary() {
    // if the horizontal swing is disabled then turn it on
    if (this.isHorizontalSwingEnabled() === false) {
      this.setHorizontalSwingEnabled(true);
    }
  }


  /*----------========== HELPERS ==========----------*/

  validateHorizontalSwingAngle(angle) {
    let prop = this.getProperty(FanProperties.HORIZONTAL_SWING_ANGLE);
    if (prop) {
      return prop.isValueWithinRange(angle);
    }
    return false;
  }

  checkHorizontalSwingLevelSupported(angle) {
    if (this.horizontalSwingLevels().includes(angle)) {
      return true;
    }
    return false;
  }


}

module.exports = FanDevice;

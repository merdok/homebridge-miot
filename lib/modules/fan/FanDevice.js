const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class FanDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.FAN;
  }


  /*----------========== CONFIG ==========----------*/

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
    return this.hasProperty(Properties.HORIZONTAL_SWING);
  }

  supportsHorizontalSwingAngle() {
    return this.hasProperty(Properties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingRange() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingAngleRange().length > 0;
  }

  horizontalSwingAngleRange() {
    return this.getPropertyValueRange(Properties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingLevels() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingLevels().length > 0;
  }

  horizontalSwingLevels() {
    return this.getPropertyValueList(Properties.HORIZONTAL_SWING_ANGLE);
  }

  // vertical swing
  supportsVerticalSwing() {
    return this.hasProperty(Properties.VERTICAL_SWING);
  }

  supportsVerticalSwingAngle() {
    return this.hasProperty(Properties.VERTICAL_SWING_ANGLE);
  }

  verticalSwingAngleRange() {
    return this.getPropertyValueRange(Properties.VERTICAL_SWING_ANGLE);
  }

  // manual fan move
  supportsHorizontalMove() {
    return this.hasProperty(Properties.HORIZONTAL_MOVE);
  }

  supportsVerticalMove() {
    return this.hasProperty(Properties.VERTICAL_MOVE);
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
    return this.hasProperty(Properties.ANION);
  }


  /*----------========== GETTERS ==========----------*/

  isHorizontalSwingEnabled() {
    return this.getPropertyValue(Properties.HORIZONTAL_SWING);
  }

  getHorizontalSwingAngle() {
    return this.getPropertyValue(Properties.HORIZONTAL_SWING_ANGLE);
  }

  isVerticalSwingEnabled() {
    return this.getPropertyValue(Properties.VERTICAL_SWING);
  }

  getVerticalSwingAngle() {
    return this.getPropertyValue(Properties.VERTICAL_SWING_ANGLE);
  }

  isIoniserEnabled() {
    return this.getPropertyValue(Properties.ANION);
  }


  /*----------========== SETTERS ==========----------*/

  async setHorizontalSwingEnabled(enabled) {
    this.setPropertyValue(Properties.HORIZONTAL_SWING, enabled);
  }

  async setHorizontalSwingAngle(angle) {
    this.setPropertyValue(Properties.HORIZONTAL_SWING_ANGLE, angle);
  }

  async setVerticalSwingEnabled(enabled) {
    this.setPropertyValue(Properties.VERTICAL_SWING, enabled);
  }

  async setVerticalSwingAngle(angle) {
    this.setPropertyValue(Properties.VERTICAL_SWING_ANGLE, angle);
  }

  async moveLeft() {
    this.setPropertyValue(Properties.HORIZONTAL_MOVE, this.moveLeftValue());
  }

  async moveRight() {
    this.setPropertyValue(Properties.HORIZONTAL_MOVE, this.moveRightValue());
  }

  async moveUp() {
    this.setPropertyValue(Properties.VERTICAL_MOVE, this.moveUpValue());
  }

  async moveDown() {
    this.setPropertyValue(Properties.VERTICAL_MOVE, this.moveDownValue());
  }

  async setIoniserEnabled(enabled) {
    this.setPropertyValue(Properties.ANION, enabled);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

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

  isIdle() {
    if (this.supportsFanSpeedRpmReporting() && this.getFanSpeedRpm() === 0) {
      return true;
    }
    return false;
  }

  turnOnHorizontalSwingIfNecessary() {
    // if the horizontal swing is disabled then turn it on
    if (this.isHorizontalSwingEnabled() === false) {
      this.setHorizontalSwingEnabled(true);
    }
  }


  /*----------========== HELPERS ==========----------*/

  validateHorizontalSwingAngle(angle) {
    let prop = this.getProperty(Properties.HORIZONTAL_SWING_ANGLE);
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

const BaseDevice = require('../../base/BaseDevice.js');
const FanCapabilities = require('./FanCapabilities.js');
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


  /*----------========== CAPABILITIES ==========----------*/

  // horizontal swing
  supportsHorizontalSwing() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING);
  }

  supportsHorizontalSwingAngle() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  horizontalSwingAngleRange() {
    return this.getPropertyValueRange(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingLevels() {
    return this.horizontalSwingLevels().length > 0;
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
  straightWindModeValue() {
    return this.capabilities[FanCapabilities.STRAIGHT_WIND_MODE_VALUE];
  }

  supportsStraightWindMode() {
    return this.supportsModes() && this.straightWindModeValue() !== undefined;
  }

  naturalModeValue() {
    return this.capabilities[FanCapabilities.NATURAL_MODE_VALUE];
  }

  supportsNaturalMode() {
    return this.supportsModes() && this.naturalModeValue() !== undefined;
  }

  sleepModeValue() {
    return this.capabilities[FanCapabilities.SLEEP_MODE_VALUE];
  }

  supportsSleepMode() {
    return this.supportsModes() && this.sleepModeValue() !== undefined;
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
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, 'left');
  }

  async moveRight() {
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, 'right');
  }

  async moveUp() {
    this.setPropertyValue(FanProperties.VERTICAL_MOVE, 'up');
  }

  async moveDown() {
    this.setPropertyValue(FanProperties.VERTICAL_MOVE, 'down');
  }

  async setIoniserEnabled(enabled) {
    this.setPropertyValue(FanProperties.ANION, enabled);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/

  checkHorizontalSwingAngleWithinRange(angle) {
    if (this.supportsHorizontalSwingAngle() && this.horizontalSwingAngleRange().length > 1) {
      let low = this.horizontalSwingAngleRange()[0];
      let high = this.horizontalSwingAngleRange()[1];
      if (angle >= low && angle <= high) {
        return true;
      }
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

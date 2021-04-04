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

  // speed
  supportsSteplessFanSpeed() {
    return this.hasProperty(FanProperties.FAN_SPEED) || this.supportsFakeSteplessFanSpeed();
  }

  supportsFanSpeedRpmReporting() {
    return this.hasProperty(FanProperties.FAN_SPEED_RPM); // whether the fan reports the rpm speed value
  }

  // fan levels
  fanLevels() {
    return this.getPropertyValueList(FanProperties.FAN_LEVEL);
  }

  supportsFanLevels() {
    return this.fanLevels().length > 0;
  }

  // fake speed control
  supportsFakeSteplessFanSpeed() {
    return (this.capabilities[FanCapabilities.FAKE_STEPLESS_FAN_CONTROL] !== undefined) && this.supportsFanLevels();
  }

  // horizontal swing
  supportsHorizontalSwing() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING); // fan moves left to right on/off
  }

  supportsHorizontalSwingAngle() {
    return this.hasProperty(FanProperties.HORIZONTAL_SWING_ANGLE); // if a custom angle can be set for horizontal swing usually 0 to 120 degree
  }

  horizontalSwingAngleRange() {
    return this.getPropertyValueRange(FanProperties.HORIZONTAL_SWING_ANGLE);
  }

  supportsHorizontalSwingLevels() {
    return this.capabilities[FanCapabilities.HORIZONTAL_SWING_LEVELS] !== undefined ? true : false; // preconfigured levels for oscillation
  }

  horizontalSwingLevels() {
    return this.capabilities[FanCapabilities.HORIZONTAL_SWING_LEVELS] || []; // array of levels (in degree) for oscillation
  }

  // vertical swing
  supportsVerticalSwing() {
    return this.hasProperty(FanProperties.VERTICAL_SWING); // fan moves top to down on/off
  }

  supportsVerticalSwingAngle() {
    return this.hasProperty(FanProperties.VERTICAL_SWING_ANGLE); // if a custom angle can be set for vertical swing usually 0 to 120 degree
  }

  verticalSwingAngleRange() {
    return this.getPropertyValueRange(FanProperties.VERTICAL_SWING_ANGLE);
  }

  // manual fan move
  supportsHorizontalMove() {
    return this.hasProperty(FanProperties.HORIZONTAL_MOVE); // whether the fan can be rotated left or right by 5 degree
  }

  supportsVerticalMove() {
    return this.hasProperty(FanProperties.VERTICAL_MOVE); // whether the fan can be rotated up or down by 5 degree
  }

  // modes
  modes() {
    return this.getPropertyValueList(FanProperties.MODE);
  }

  supportsModes() {
    return this.modes().length > 0;
  }

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
    return this.hasProperty(FanProperties.ANION); // whether the fan has a built in ioniser which can be controled on/off
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/

  /*--== horizontal swing angle ==--*/
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

  /*--== horizontal swing levels ==--*/
  checkHorizontalSwingLevelSupported(angle) {
    if (this.horizontalSwingLevels().includes(angle)) {
      return true;
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  getRotationSpeed() {
    if (this.supportsFakeSteplessFanSpeed()) {
      let numberOfFanLevels = this.fanLevels().length;
      let speedPerLevel = Math.floor(100 / numberOfFanLevels);
      return speedPerLevel * this.getFanLevel();
    }
    return this.getPropertyValue(FanProperties.FAN_SPEED);
  }

  getSpeed() {
    return this.getPropertyValue(FanProperties.FAN_SPEED_RPM);
  }

  getFanLevel() {
    return this.getPropertyValue(FanProperties.FAN_LEVEL);
  }

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

  getMode() {
    return this.getPropertyValue(FanProperties.MODE);
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
    if (this.supportsFanSpeedRpmReporting() && this.getSpeed() === 0) {
      return true;
    }
    return false;
  }


  /*----------========== COMMANDS ==========----------*/

  async setRotationSpeed(speed) {
    if (this.supportsFakeSteplessFanSpeed()) {
      let numberOfFanLevels = this.fanLevels().length;
      let speedPerLevel = Math.floor(100 / numberOfFanLevels);
      let levelToSet = Math.floor(speed / speedPerLevel);
      this.setFanLevel(levelToSet);
      return;
    }
    this.setPropertyValue(FanProperties.FAN_SPEED, speed);
  }

  async setFanLevel(level) {
    this.setPropertyValue(FanProperties.FAN_LEVEL, level);
  }

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

  async setMode(mode) {
    this.setPropertyValue(FanProperties.MODE, mode);
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


  /*----------========== HELPERS ==========----------*/


}

module.exports = FanDevice;

const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class FanDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.FAN;
  }

  getDeviceName() {
    return 'Unknown fan device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['fan:on', 'fan:fan-level', 'fan:status', 'fan:fault',
      'fan:horizontal-swing', 'fan:horizontal-angle', 'fan:vertical-swing', 'fan:vertical-angle',
      'fan:mode', 'fan:off-delay', 'fan:anion', 'physical-controls-locked:physical-controls-locked',
      'indicator-light:on', 'indicator-light:brightness', 'alarm:alarm', 'environment:relative-humidity',
      'environment:temperature', 'custom-service:battery-state', 'custom-service:speed-now', 'custom-service:ac-state',
      'custom-service:motor-status', 'custom-service:speed-level', 'temperature-humidity-sensor:temperature', 'temperature-humidity-sensor:relative-humidity'
    ];
  }


  /*----------========== VALUES ==========----------*/

  straightWindModeValue() {
    return this.getValueForMode('Straight Wind');
  }

  naturalModeValue() {
    return this.getValueForMode('Natural Wind');
  }

  sleepModeValue() {
    return this.getValueForMode('Sleep');
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


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('fan:on');
  }

  statusProp() {
    return this.getProperty('fan:status');
  }

  faultProp() {
    return this.getProperty('fan:fault');
  }

  modeProp() {
    return this.getProperty('fan:mode');
  }

  offDelayProp() {
    return this.getProperty('fan:off-delay');
  }

  speedLevelProp() {
    return this.getProperty('custom-service:speed-level');
  }

  fanLevelProp() {
    return this.getProperty('fan:fan-level');
  }

  batteryStateProp() {
    return this.getProperty('custom-service:battery-state');
  }

  acStateProp() {
    return this.getProperty('custom-service:ac-state');
  }

  speedNowProp() {
    return this.getProperty('custom-service:speed-now');
  }

  anionProp() {
    return this.getProperty('fan:anion');
  }

  //device specific
  horizontalSwingProp() {
    return this.getProperty('fan:horizontal-swing');
  }

  horizontalAngleProp() {
    return this.getProperty('fan:horizontal-angle');
  }

  verticalSwingProp() {
    return this.getProperty('fan:vertical-swing');
  }

  verticalAngleProp() {
    return this.getProperty('fan:vertical-angle');
  }

  swingStepMoveProp() {
    return this.getProperty('custom-service:swing-step-move');
  }

  verticalSwingStepMoveProp() {
    return this.getProperty('custom-service:v-swing-step-move');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // horizontal swing
  supportsHorizontalSwing() {
    return !!this.horizontalSwingProp();
  }

  supportsHorizontalSwingAngle() {
    return !!this.horizontalAngleProp();
  }

  supportsHorizontalSwingRange() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingAngleRange().length > 0;
  }

  horizontalSwingAngleRange() {
    return this.getPropertyValueRange(this.horizontalAngleProp());
  }

  supportsHorizontalSwingLevels() {
    return this.supportsHorizontalSwingAngle() && this.horizontalSwingLevels().length > 0;
  }

  horizontalSwingLevels() {
    return this.getPropertyValueList(this.horizontalAngleProp());
  }

  // vertical swing
  supportsVerticalSwing() {
    return !!this.verticalSwingProp();
  }

  supportsVerticalSwingAngle() {
    return !!this.verticalAngleProp();
  }

  verticalSwingAngleRange() {
    return this.getPropertyValueRange(this.verticalSwingProp());
  }

  // manual fan move
  supportsHorizontalMove() {
    return !!this.swingStepMoveProp();
  }

  supportsVerticalMove() {
    return !!this.verticalSwingStepMoveProp();
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


  /*----------========== GETTERS ==========----------*/

  isHorizontalSwingEnabled() {
    return this.getPropertyValue(this.horizontalSwingProp());
  }

  getHorizontalSwingAngle() {
    return this.getPropertyValue(this.horizontalAngleProp());
  }

  isVerticalSwingEnabled() {
    return this.getPropertyValue(this.verticalSwingProp());
  }

  getVerticalSwingAngle() {
    return this.getPropertyValue(this.verticalAngleProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setHorizontalSwingEnabled(enabled) {
    return this.setPropertyValue(this.horizontalSwingProp(), enabled);
  }

  async setHorizontalSwingAngle(angle) {
    return this.setPropertyValue(this.horizontalAngleProp(), angle);
  }

  async setVerticalSwingEnabled(enabled) {
    return this.setPropertyValue(this.verticalSwingProp(), enabled);
  }

  async setVerticalSwingAngle(angle) {
    return this.setPropertyValue(this.verticalAngleProp(), angle);
  }

  async setSwingStepMove(value) {
    return this.setPropertyValue(this.swingStepMoveProp(), value);
  }

  async setVerticalSwingStepMove(value) {
    return this.setPropertyValue(this.verticalSwingStepMoveProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  async enableStraightWindMode() {
    if (this.supportsStraightWindMode()) {
      return this.setMode(this.straightWindModeValue());
    }
  }

  async enableNaturalMode() {
    if (this.supportsNaturalMode()) {
      return this.setMode(this.naturalModeValue());
    }
  }

  async enableSleepMode() {
    if (this.supportsSleepMode()) {
      return this.setMode(this.sleepModeValue());
    }
  }

  async moveLeft() {
    return this.setSwingStepMove(this.moveLeftValue());
  }

  async moveRight() {
    return this.setSwingStepMove(this.moveRightValue());
  }

  async moveUp() {
    return this.setVerticalSwingStepMove(this.moveUpValue());
  }

  async moveDown() {
    return this.setVerticalSwingStepMove(this.moveDownValue());
  }

  isIdle() {
    if (this.isStatusIdle() || (this.supportsSpeedNowReporting() && this.getSpeedNow() === 0)) {
      return true;
    }
    return !this.isDeviceOn();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStraightWindModeEnabled() {
    return this.getMode() === this.straightWindModeValue();
  }

  isNaturalModeEnabled() {
    return this.getMode() === this.naturalModeValue();
  }

  isSleepModeEnabled() {
    return this.getMode() === this.sleepModeValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = FanDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const AirerProperties = require('./AirerProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirerDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.AIRER;
  }


  /*----------========== CONFIG ==========----------*/

  statusStoppedValue() {
    return -1;
  }

  statusUpValue() {
    return -1;
  }

  statusDownValue() {
    return -1;
  }

  statusPauseValue() {
    return -1;
  }

  deviceFaultObstructionValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // motor control
  motorControls() {
    return this.getPropertyValueList(AirerProperties.MOTOR_CONTROL);
  }

  supportsMotorControls() {
    return this.motorControls().length > 0;
  }

  // currenr position range
  currentPositionRange() {
    let range = this.getPropertyValueRange(AirerProperties.CURRENT_POSITION);
    return (range.length > 2) ? range : [0, 100, 1];
  }

  // light
  hasBuiltInLight() {
    return this.hasProperty(AirerProperties.LIGHT_POWER);
  }


  /*----------========== GETTERS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(AirerProperties.CURRENT_POSITION);
  }

  getTargetPosition() {
    return this.getPropertyValue(AirerProperties.TARGET_POSITION);
  }

  getTargetPosition2() {
    return this.getPropertyValue(AirerProperties.TARGET_POSITION_2);
  }

  isLightOn() {
    if (this.hasBuiltInLight()) {
      return this.getPropertyValue(AirerProperties.LIGHT_POWER);
    }
    return false;
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetPosition(position) {
    this.setPropertyValue(AirerProperties.TARGET_POSITION, position);
  }

  async setTargetPosition2(position) {
    this.setPropertyValue(AirerProperties.TARGET_POSITION_2, position);
  }

  async setMotorControl(value) {
    this.setPropertyValue(AirerProperties.MOTOR_CONTROL, value);
  }

  async setLightOn(value) {
    this.setPropertyValue(AirerProperties.LIGHT_POWER, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  getAbsoluteTargetPosition() {
    return this.getTargetPosition() || this.getTargetPosition2();
  }

  async setAbsoluteTargetPosition(position) {
    if (position === 50) position = 51; // position 50 is missing so use 51 in that case
    if (position < 50) {
      this.setTargetPosition(position);
    } else if (position > 50) {
      this.setTargetPosition2(position);
    }
  }

  isStatusStopped() {
    return this.getStatus() === this.statusStoppedValue();
  }

  isStatusUp() {
    return this.getStatus() === this.statusUpValue();
  }

  isStatusDown() {
    return this.getStatus() === this.statusDownValue();
  }

  isStatusPause() {
    return this.getStatus() === this.statusPauseValue();
  }

  isObstructionDetected() {
    if (this.supportsDeviceFaultReporting()) {
      return this.getDeviceFault() === this.deviceFaultObstructionValue();
    }
    return false;
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirerDevice;

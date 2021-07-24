const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../Properties.js');
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
    return this.getPropertyValueList(Properties.MOTOR_CONTROL);
  }

  supportsMotorControls() {
    return this.motorControls().length > 0;
  }

  // currenr position range
  currentPositionRange() {
    let range = this.getPropertyValueRange(Properties.CURRENT_POSITION);
    return (range.length > 2) ? range : [0, 100, 1];
  }

  // light
  hasBuiltInLight() {
    return this.hasProperty(Properties.LIGHT_POWER);
  }


  /*----------========== GETTERS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(Properties.CURRENT_POSITION);
  }

  getCurrentPositionPercentage() {
    return this.convertPropValueToPercentage(Properties.CURRENT_POSITION);
  }

  getTargetPosition() {
    return this.getPropertyValue(Properties.TARGET_POSITION);
  }

  isLightOn() {
    if (this.hasBuiltInLight()) {
      return this.getPropertyValue(Properties.LIGHT_POWER);
    }
    return false;
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetPosition(position) {
    this.setPropertyValue(Properties.TARGET_POSITION, position);
  }

  async setMotorControl(value) {
    this.setPropertyValue(Properties.MOTOR_CONTROL, value);
  }

  async setLightOn(value) {
    this.setPropertyValue(Properties.LIGHT_POWER, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

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

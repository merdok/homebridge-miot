const BaseDevice = require('../../base/BaseDevice.js');
const CurtainProperties = require('./CurtainProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CurtainDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.CURTAIN;
  }


  /*----------========== CONFIG ==========----------*/

  statusClosingValue() {
    return -1;
  }

  statusStopValue() {
    return -1;
  }

  statusOpeningValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // motor control
  motorControls() {
    return this.getPropertyValueList(CurtainProperties.MOTOR_CONTROL);
  }

  supportsMotorControls() {
    return this.motorControls().length > 0;
  }

  // motor reverse
  supportsMotorReverse() {
    return this.hasProperty(CurtainProperties.MOTOR_REVERSE);
  }


  /*----------========== GETTERS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(CurtainProperties.CURRENT_POSITION);
  }

  getStatus() {
    return this.getPropertyValue(CurtainProperties.STATUS);
  }

  getTargetPosition() {
    return this.getPropertyValue(CurtainProperties.TARGET_POSITION);
  }

  isMotorReverseEnabled() {
    return this.getPropertyValue(CurtainProperties.MOTOR_REVERSE);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetPosition(position) {
    this.setPropertyValue(CurtainProperties.TARGET_POSITION, position);
  }

  async setMotorReverseEnabled(enabled) {
    this.setPropertyValue(CurtainProperties.MOTOR_REVERSE, enabled);
  }

  async setMotorControl(value) {
    this.setPropertyValue(CurtainProperties.MOTOR_CONTROL, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isStatusClosing() {
    return this.getStatus() === this.statusClosingValue();
  }

  isStatusStop() {
    return this.getStatus() === this.statusStopValue();
  }

  isStatusOpening() {
    return this.getStatus() === this.statusOpeningValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CurtainDevice;

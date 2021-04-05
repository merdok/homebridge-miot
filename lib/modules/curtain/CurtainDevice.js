const BaseDevice = require('../../base/BaseDevice.js');
const CurtainCapabilities = require('./CurtainCapabilities.js');
const CurtainProperties = require('./CurtainProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CurtainDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.CURTAIN;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // heat levels
  motorControls() {
    return this.getPropertyValueList(CurtainProperties.MOTOR_CONTROL);
  }

  supportsMotorControls() {
    return this.motorControls().length > 0;
  }

  // status
  statusClosingValue() {
    return this.capabilities[CurtainCapabilities.STATUS_CLOSING_VALUE];
  }

  statusStopValue() {
    return this.capabilities[CurtainCapabilities.STATUS_STOP_VALUE];
  }

  statusOpeningValue() {
    return this.capabilities[CurtainCapabilities.STATUS_OPENING_VALUE];
  }


  /*----------========== CAPABILITY HELPERS ==========----------*/


  /*----------========== STATUS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(CurtainProperties.CURRENT_POSITION);
  }

  getStatus() {
    return this.getPropertyValue(CurtainProperties.STATUS);
  }

  isStatusClosing() {
    return this.getPositionState() === this.statusClosingValue();
  }

  isStatusStop() {
    return this.getPositionState() === this.statusStopValue();
  }

  isStatusOpening() {
    return this.getPositionState() === this.statusOpeningValue();
  }

  getTargetPosition() {
    return this.getPropertyValue(CurtainProperties.TARGET_POSITION);
  }

  isMotorReverse() {
    return this.getPropertyValue(CurtainProperties.MOTOR_REVERSE);
  }


  /*----------========== COMMANDS ==========----------*/

  async setTargetPosition(position) {
    this.setPropertyValue(CurtainProperties.TARGET_POSITION, position);
  }

  async setMotorReverse(reverse) {
    this.setPropertyValue(CurtainProperties.MOTOR_REVERSE, reverse);
  }

  async setMotorControl(value) {
    this.setPropertyValue(CurtainProperties.MOTOR_CONTROL, value);
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CurtainDevice;

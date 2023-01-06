const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class CurtainDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.CURTAIN;
  }

  getDeviceName() {
    return 'Unknown curtain device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['curtain:status', 'curtain:fault', 'curtain:current-position', 'curtain:target-position',
      'curtain:on'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusClosingValue() {
    return this.getValueForStatus('Closing');
  }

  statusStopValue() {
    return this.getValueForStatus('Stop');
  }

  statusOpeningValue() {
    return this.getValueForStatus('Opening');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('curtain:on');
  }

  statusProp() {
    return this.getProperty('curtain:status');
  }

  faultProp() {
    return this.getProperty('curtain:fault');
  }

  //device specific
  currentPositionProp() {
    return this.getProperty('curtain:current-position');
  }

  targetPositionProp() {
    return this.getProperty('curtain:target-position');
  }

  motorControlProp() {
    return this.getProperty('curtain:motor-control');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // current position
  supportsCurrentPosition() {
    return !!this.currentPositionProp();
  }

  currentPositionRange() {
    let range = this.getPropertyValueRange(this.currentPositionProp());
    return (range.length > 2) ? range : [0, 100, 1];
  }

  // target position
  supportsTargetPosition() {
    return !!this.targetPositionProp();
  }

  // motor control
  supportsMotorControl() {
    return !!this.motorControlProp();
  }

  motorControls() {
    return this.getPropertyValueList(this.motorControlProp());
  }


  /*----------========== GETTERS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(this.currentPositionProp());
  }

  getTargetPosition() {
    return this.getPropertyValue(this.targetPositionProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetPosition(value) {
    return this.setPropertyValue(this.targetPositionProp(), value);
  }

  async setMotorControl(value) {
    return this.setPropertyValue(this.motorControls(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusClosing() {
    if (this.supportsStatusReporting()) {
      return this.getStatus() === this.statusClosingValue();
    }
    return this.getTargetPosition() < this.getCurrentPosition();
  }

  isStatusStop() {
    if (this.supportsStatusReporting()) {
      return this.getStatus() === this.statusStopValue();
    }
    return this.getTargetPosition() == this.getCurrentPosition();
  }

  isStatusOpening() {
    if (this.supportsStatusReporting()) {
      return this.getStatus() === this.statusOpeningValue();
    }
    return this.getTargetPosition() > this.getCurrentPosition();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CurtainDevice;

const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class AirerDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.AIRER;
  }

  getDeviceName() {
    return 'Unknown airer device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['airer:on', 'airer:status', 'airer:fault', 'airer:current-position',
      'airer:target-position', 'airer:target-position2', 'airer:motor-control', 'light:on'
    ];
  }


  /*----------========== VALUES ==========----------*/

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


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('airer:on');
  }

  statusProp() {
    return this.getProperty('airer:status');
  }

  faultProp() {
    return this.getProperty('airer:fault');
  }


  //device specific
  currentPositionProp() {
    return this.getProperty('airer:current-position');
  }

  targetPositionProp() {
    return this.getProperty('airer:target-position');
  }

  targetPosition2Prop() {
    return this.getProperty('airer:target-position2');
  }

  motorControlProp() {
    return this.getProperty('airer:motor-control');
  }

  lightOnProp() {
    return this.getProperty('light:on');
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

  supportsTargetPosition2() {
    return !!this.targetPosition2Prop();
  }

  // motor control
  supportsMotorControl() {
    return !!this.motorControlProp();
  }

  motorControls() {
    return this.getPropertyValueList(this.motorControlProp());
  }

  // light
  supportsLightOn() {
    return !!this.lightOnProp();
  }


  /*----------========== GETTERS ==========----------*/

  getCurrentPosition() {
    return this.getPropertyValue(this.currentPositionProp());
  }

  getTargetPosition() {
    return this.getPropertyValue(this.targetPositionProp());
  }

  getTargetPosition2() {
    return this.getPropertyValue(this.targetPosition2Prop());
  }

  isLightOn() {
    return this.getPropertyValue(this.lightOnProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetPosition(value) {
    return this.setPropertyValue(this.targetPositionProp(), value);
  }

  async setTargetPosition2(value) {
    return this.setPropertyValue(this.targetPosition2Prop(), value);
  }

  async setMotorControl(value) {
    return this.setPropertyValue(this.motorControls(), value);
  }

  async setLightOn(value) {
    return this.setPropertyValue(this.lightOnProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  isAirerOn() {
    if (this.supportsOn()) {
      return this.isOn();
    }
    return this.isConnected();
  }

  async setAirerOn(enabled) {
    if (this.supportsOn()) {
      return this.setOn(enabled);
    }
  }

  isObstructionDetected() {
    if (this.supportsDeviceFaultReporting()) {
      return this.getDeviceFault() === this.deviceFaultObstructionValue();
    }
    return false;
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

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


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirerDevice;

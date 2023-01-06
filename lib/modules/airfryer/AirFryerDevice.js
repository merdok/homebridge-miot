const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class AirFryerDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.AIR_FRYER;
  }

  getDeviceName() {
    return 'Unknown air fryer device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['air-fryer:target-time', 'air-fryer:status', 'air-fryer:fault', 'air-fryer:target-temperature',
      'air-fryer:left-time'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusCookingValue() {
    return this.getValueForStatus(['Cooking']);
  }

  statusDelayValue() {
    return this.getValueForStatus('Appointment');
  }

  statusFaultValue() {
    return this.getValueForStatus('Fault');
  }

  statusPausedValue() {
    return this.getValueForStatus('Pause');
  }

  statusCompletedValue() {
    return this.getValueForStatus('Cooked');
  }

  statusSleepValue() {
    return this.getValueForStatus('Standby');
  }

  statusPreheatValue() {
    return this.getValueForStatus('Preheat');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('air-fryer:status');
  }

  faultProp() {
    return this.getProperty('air-fryer:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('air-fryer:target-temperature');
  }

  //device specific
  targetTimeProp() {
    return this.getProperty('air-fryer:target-time');
  }

  leftTimeProp() {
    return this.getProperty('air-fryer:left-time');
  }

  temperatureProp() {
    return this.getProperty('air-fryer:temperature');
  }


  /*----------========== ACTIONS ==========----------*/

  startCookAction() {
    return this.getAction('air-fryer:start-cook');
  }

  cancelCookAction() {
    return this.getAction('air-fryer:cancel-cooking');
  }

  pauseCookAction() {
    return this.getAction('air-fryer:pause');
  }

  resumeCookAction() {
    return this.getAction('custom:resume-cooking');
  }


  /*----------========== FEATURES ==========----------*/

  // target time
  supportsTargetTime() {
    return !!this.targetTimeProp();
  }

  targetTimeRange() {
    let range = this.getPropertyValueRange(this.targetTimeProp());
    return (range.length > 2) ? range : [1, 1440, 1];
  }

  // left time
  supportsLeftTimeReporting() {
    return !!this.leftTimeProp();
  }

  //cooking complete
  supportsCookingCompleteStatus() {
    return this.supportsStatusReporting() && this.statusCompletedValue() !== -1;
  }


  /*----------========== GETTERS ==========----------*/

  getTargetTime() {
    return this.getPropertyValue(this.targetTimeProp());
  }

  getLeftTime() {
    return this.getPropertyValue(this.leftTimeProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetTime(value) {
    return this.setPropertyValue(this.targetTimeProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  async setCookingActive(active) {
    if (active) {
      return this.fireAction(this.startCookAction());
    } else {
      return this.fireAction(this.cancelCookAction());
    }
  }

  isHeating() {
    return this.isStatusCooking() || this.isStatusPreheat();
  }

  async startHeatIfNecessary() {
    if (this.isHeating() === false) {
      return this.setCookingActive(true);
    }
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusCooking() {
    return this.getStatus() === this.statusCookingValue();
  }

  isStatusDelay() {
    return this.getStatus() === this.statusDelayValue();
  }

  isStatusFault() {
    return this.getStatus() === this.statusFaultValue();
  }

  isStatusPaused() {
    return this.getStatus() === this.statusPausedValue();
  }

  isStatusCompleted() {
    return this.getStatus() === this.statusCompletedValue();
  }

  isStatusSleep() {
    return this.getStatus() === this.statusSleepValue();
  }

  isStatusPreheat() {
    return this.getStatus() === this.statusPreheatValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirFryerDevice;

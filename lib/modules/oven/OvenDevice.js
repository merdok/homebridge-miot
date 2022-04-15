const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class OvenDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.OVEN;
  }

  getDeviceName() {
    return 'Unknown oven device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['oven:status', 'oven:fault', 'oven:target-temperature', 'air-fryer:target-time',
      'oven:left-time', 'oven:temperature', 'air-fryer:status', 'air-fryer:fault',
      'air-fryer:target-temperature', 'air-fryer:left-time', 'microwave-oven:left-time', 'microwave-oven:status',
      'microwave-oven:heat-level'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusBusyValue() {
    return this.getValueForStatus(['Busy', 'Cooking']);
  }

  statusDelayValue() {
    return this.getValueForStatus('Delay');
  }

  statusFaultValue() {
    return this.getValueForStatus('Fault');
  }

  statusPausedValue() {
    return this.getValueForStatus('Paused');
  }

  statusCompletedValue() {
    return this.getValueForStatus('Completed');
  }

  statusSleepValue() {
    return this.getValueForStatus('Sleep');
  }

  statusPreheatValue() {
    return this.getValueForStatus('Preheat');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('oven:status');
  }

  faultProp() {
    return this.getProperty('oven:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('oven:target-temperature');
  }

  //device specific
  targetTimeProp() {
    return this.getProperty('air-fryer:target-time');
  }

  leftTimeProp() {
    return this.getProperty('oven:left-time');
  }

  temperatureProp() {
    return this.getProperty('oven:temperature');
  }


  /*----------========== ACTIONS ==========----------*/

  startCookAction() {
    return this.getAction('oven:start-cook');
  }

  cancelCookAction() {
    return this.getAction('oven:cancel-cooking');
  }

  pauseCookAction() {
    return this.getAction('oven:pause');
  }

  resumeCookAction() {
    return this.getAction('custom:proceed-cooking');
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
    return this.isStatusBusy() || this.isStatusPreheat();
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

  isStatusBusy() {
    return this.getStatus() === this.statusBusyValue();
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

module.exports = OvenDevice;

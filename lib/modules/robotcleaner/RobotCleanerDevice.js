const BaseDevice = require('../../foundation/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class RobotCleanerDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // log the the main brush left time when supported
    if (this.supportsMainBrushLeftTimeReporting()) {
      this.logger.info(`Main brush left time: ${this.getMainBrushLeftTime()} hours.`);
    }
    // log the the main brush life level when supported
    if (this.supportsMainBrushLifeLevelReporting()) {
      this.logger.info(`Main brush life level: ${this.getMainBrushLifeLevel()}%.`);
    }
    // log the the side brush left time when supported
    if (this.supportsSideBrushLeftTimeReporting()) {
      this.logger.info(`Side brush left time: ${this.getSideBrushLeftTime()} hours.`);
    }
    // log the the side brush life level when supported
    if (this.supportsSideBrushLifeLevelReporting()) {
      this.logger.info(`Side brush life level: ${this.getSideBrushLifeLevel()}%.`);
    }
    // log the the filter life level when supported
    if (this.supportsFilterLifeLevelReporting()) {
      this.logger.info(`Filter life level: ${this.getFilterLifeLevel()}%.`);
    }
    // log the the filter used time when supported
    if (this.supportsFilterUsedTimeReporting()) {
      this.logger.info(`Filter used time: ${this.getFilterUsedTime()} hours.`);
    }
    // log the the total clean time when supported
    if (this.supportsTotalCleanTimeReporting()) {
      this.logger.info(`Total clean time: ${this.getTotalCleanTime()} hours.`);
    }
    // log the the total clean times when supported
    if (this.supportsTotalCleanTimesReporting()) {
      this.logger.info(`Total cleaned: ${this.getTotalCleanTimes()} times.`);
    }
    // log the the total clean area when supported
    if (this.supportsTotalCleanAreaReporting()) {
      this.logger.info(`Total clean area: ${this.getTotalCleanArea()} m2.`);
    }
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.ROBOT_CLEANER;
  }

  getDeviceName() {
    return 'Unknown robot cleaner device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['vacuum:status', 'vacuum:mode', 'vacuum:fault', 'battery:battery-level',
      'battery:charging-state', 'brush-cleaner:brush-left-time', 'brush-cleaner:brush-life-level', 'filter:filter-life-level',
      'filter:filter-left-time', 'vacuum-extend:cleaning-time', 'vacuum-extend:cleaning-area', 'clean-logs:total-clean-time',
      'clean-logs:total-clean-times', 'clean-logs:total-clean-area', 'sweep:side-brush-hours', 'sweep:side-brush-life'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusSweepingValue() {
    return this.getValueForStatus('Sweeping');
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusPausedValue() {
    return this.getValueForStatus('Paused');
  }

  statusErrorValue() {
    return this.getValueForStatus('Error');
  }

  statusGoChargingValue() {
    return this.getValueForStatus('Go Charging');
  }

  statusChargingValue() {
    return this.getValueForStatus('Charging');
  }

  statusMoppingValue() {
    return this.getValueForStatus('Mopping');
  }

  statusUpdatingValue() {
    return this.getValueForStatus('Updating');
  }

  statusSleepValue() {
    return this.getValueForStatus('Sleep');
  }

  statusSweepingAndMoppingValue() {
    return this.getValueForStatus('Sweeping and Mopping');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('vacuum:status');
  }

  modeProp() {
    return this.getProperty('vacuum:mode');
  }

  faultProp() {
    return this.getProperty('vacuum:fault');
  }

  speedLevelProp() {
    return this.getProperty('vacuum:speed-level');
  }

  batteryLevelProp() {
    return this.getProperty('battery:battery-level');
  }

  batteryStateProp() {
    return this.getProperty('battery:charging-state');
  }

  //device specific
  mainBrushLeftTimeProp() {
    return this.getProperty('brush-cleaner:brush-left-time');
  }

  mainBrushLifeLevelProp() {
    return this.getProperty('brush-cleaner:brush-life-level');
  }

  sideBrushLeftTimeProp() {
    return this.getProperty('sweep:side-brush-hours');
  }

  sideBrushLifeLevelProp() {
    return this.getProperty('sweep:side-brush-life');
  }

  cleanTimeProp() {
    return this.getProperty('vacuum-extend:cleaning-time');
  }

  cleanAreaProp() {
    return this.getProperty('vacuum-extend:cleaning-area');
  }

  totalCleanTimeProp() {
    return this.getProperty('clean-logs:total-clean-time');
  }

  totalCleanTimesProp() {
    return this.getProperty('clean-logs:total-clean-times');
  }

  totalCleanAreaProp() {
    return this.getProperty('clean-logs:total-clean-area');
  }


  /*----------========== ACTIONS ==========----------*/

  startSweepAction() {
    return this.getAction('vacuum:start-sweep');
  }

  stopSweepAction() {
    return this.getAction('vacuum:stop-sweeping');
  }

  startRoomSweepAction() {
    return this.getAction('vacuum:start-room-sweep');
  }

  startChargeAction() {
    return this.getAction('battery:start-charge') || this.getAction('vacuum:start-charge');
  }


  /*----------========== FEATURES ==========----------*/

  // main brush
  supportsMainBrushLeftTimeReporting() {
    return !!this.mainBrushLeftTimeProp();
  }

  supportsMainBrushLifeLevelReporting() {
    return !!this.mainBrushLifeLevelProp();
  }

  // side brush
  supportsSideBrushLeftTimeReporting() {
    return !!this.sideBrushLeftTimeProp();
  }

  supportsSideBrushLifeLevelReporting() {
    return !!this.sideBrushLifeLevelProp();
  }

  //last clean
  supportsLastCleanTime() {
    return !!this.cleanTimeProp();
  }

  supportsLastCleanArea() {
    return !!this.cleanAreaProp();
  }


  // totals
  supportsTotalCleanTimeReporting() {
    return !!this.totalCleanTimeProp();
  }

  supportsTotalCleanTimesReporting() {
    return !!this.totalCleanTimesProp();
  }

  supportsTotalCleanAreaReporting() {
    return !!this.totalCleanAreaProp();
  }


  /*----------========== GETTERS ==========----------*/

  getMainBrushLeftTime() {
    return this.getPropertyValue(this.mainBrushLeftTimeProp());
  }

  getMainBrushLifeLevel() {
    return this.getPropertyValue(this.mainBrushLifeLevelProp());
  }

  getSideBrushLeftTime() {
    return this.getPropertyValue(this.sideBrushLeftTimeProp());
  }

  getSideBrushLifeLevel() {
    return this.getPropertyValue(this.sideBrushLifeLevelProp());
  }

  getLastCleanTime() {
    return this.getPropertyValue(this.cleanTimeProp());
  }

  getLastCleanArea() {
    return this.getPropertyValue(this.cleanAreaProp());
  }

  getTotalCleanTime() {
    return this.getPropertyValue(this.totalCleanTimeProp());
  }

  getTotalCleanTimes() {
    return this.getPropertyValue(this.totalCleanTimesProp());
  }

  getTotalCleanArea() {
    return this.getPropertyValue(this.totalCleanAreaProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  async setSweepActive(active) {
    if (active) {
      return this.fireAction(this.startSweepAction());
    } else {
      //  this.fireAction(this.stopSweepAction()); // this just pauses the robot
      return this.fireAction(this.startChargeAction()); // this forces the robot to go back to the dock even during cleaning
    }
  }

  isVacuumWorking() {
    return this.isStatusSweeping() || this.isStatusSweepingAndMopping() || this.isStatusMopping();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusSweeping() {
    return this.getStatus() === this.statusSweepingValue();
  }

  isStatusSweepingAndMopping() {
    return this.getStatus() === this.statusSweepingAndMoppingValue();
  }

  isStatusMopping() {
    return this.getStatus() === this.statusMoppingValue();
  }

  isStatusPause() {
    return this.getStatus() === this.statusPausedValue();
  }

  isStatusError() {
    return this.getStatus() === this.statusErrorValue();
  }

  isStatusGoCharging() {
    return this.getStatus() === this.statusGoChargingValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = RobotCleanerDevice;

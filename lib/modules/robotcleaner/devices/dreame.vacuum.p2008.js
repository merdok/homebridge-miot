const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerCapabilities = require('../RobotCleanerCapabilities.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const RobotCleanerActions = require('../RobotCleanerActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-p2008:1


class DreameVacuumP2008 extends RobotCleanerDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 4, 4, PropFormat.INT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Silent"
      },
      {
        "value": 1,
        "description": "Standard"
      },
      {
        "value": 2,
        "description": "Medium"
      },
      {
        "value": 3,
        "description": "Turbo"
      }
    ]);
    this.addProperty(RobotCleanerProperties.MOP_MODE, 4, 5, PropFormat.INT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Low water"
      },
      {
        "value": 2,
        "description": "Medium water"
      },
      {
        "value": 3,
        "description": "High water"
      }
    ]);
    this.addProperty(RobotCleanerProperties.DO_NOT_DISTURB, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(RobotCleanerProperties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Sweeping"
      },
      {
        "value": 2,
        "description": "Idle"
      },
      {
        "value": 3,
        "description": "Paused"
      },
      {
        "value": 4,
        "description": "Error"
      },
      {
        "value": 5,
        "description": "Go Charging"
      },
      {
        "value": 6,
        "description": "Charging"
      }
    ]);
    this.addProperty(RobotCleanerProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No Faults"
    }]);
    this.addProperty(RobotCleanerProperties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.CHARGING_STATE, 3, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Charging"
      },
      {
        "value": 2,
        "description": "Not Charging"
      },
      {
        "value": 5,
        "description": "Go Charging"
      }
    ]);
    this.addProperty(RobotCleanerProperties.BRUSH_LEFT_TIME, 9, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 300, 1]);
    this.addProperty(RobotCleanerProperties.BRUSH_LIFE_LEVEL, 9, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LEFT_TIME, 10, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 200, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LIFE_LEVEL, 10, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LIFE_LEVEL, 11, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LEFT_TIME, 11, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 150, 1]);
    this.addProperty(RobotCleanerProperties.WORK_MODE, 4, 1, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 50, 1]);
    this.addProperty(RobotCleanerProperties.CLEANING_TIME, 4, 2, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 32767, 1]);
    this.addProperty(RobotCleanerProperties.CLEANING_AREA, 4, 2, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 32767, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIME, 12, 2, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 4294967295, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIMES, 12, 3, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_AREA, 12, 4, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
  }

  initDeviceActions() {
    this.addAction(RobotCleanerActions.START_SWEEP, 2, 1, []);
    this.addAction(RobotCleanerActions.STOP_SWEEP, 2, 2, []);
    this.addAction(RobotCleanerActions.START_CHARGE, 3, 1, []);
    this.addAction(RobotCleanerActions.RESET_BRUSH_LIFE, 9, 1, []);
    this.addAction(RobotCleanerActions.RESET_SIDE_BRUSH_LIFE, 10, 1, []);
    this.addAction(RobotCleanerActions.RESET_FILTER_LIFE, 11, 1, []);
    this.addAction(RobotCleanerActions.START_CLEAN, 4, 1, [10]);
    this.addAction(RobotCleanerActions.STOP_CLEAN, 4, 2, []);
    this.addAction(RobotCleanerActions.LOCATE_ROBOT, 7, 1, []);
    this.addAction(RobotCleanerActions.PLAY_SOUND, 7, 2, []);
  }

  initDeviceCapabilities() {
    //none
  }

  /*----------========== VALUES ==========----------*/

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 1;
  }

  statusIdleValue() {
    return 2;
  }

  statusPausedValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 6;
  }

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 2;
  }

  chargingStateGoChargingValue() {
    return 3;
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = DreameVacuumP2008;

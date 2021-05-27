const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const RobotCleanerActions = require('../RobotCleanerActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-m1s:2


class RoborockVacuumM1S extends RobotCleanerDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 2, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Silent"
      },
      {
        "value": 2,
        "description": "Basic"
      },
      {
        "value": 3,
        "description": "Strong"
      },
      {
        "value": 4,
        "description": "Full Speed"
      }
    ]);

    // READ ONLY
    this.addProperty(RobotCleanerProperties.STATUS, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 2,
        "description": "Sleep"
      },
      {
        "value": 3,
        "description": "Idle"
      },
      {
        "value": 5,
        "description": "Sweeping"
      },
      {
        "value": 6,
        "description": "Go Charging"
      },
      {
        "value": 7,
        "description": "Remote Control"
      },
      {
        "value": 8,
        "description": "Charging"
      },
      {
        "value": 9,
        "description": "Charging Error"
      },
      {
        "value": 10,
        "description": "Paused"
      },
      {
        "value": 11,
        "description": "Part Sweeping"
      },
      {
        "value": 12,
        "description": "Error"
      },
      {
        "value": 14,
        "description": "Update"
      },
      {
        "value": 15,
        "description": "Rub Back"
      },
      {
        "value": 16,
        "description": "Go Where"
      },
      {
        "value": 17,
        "description": "Zone Sweeping"
      },
      {
        "value": 18,
        "description": "Select Sweeping"
      }
    ]);
    this.addProperty(RobotCleanerProperties.BATTERY_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(RobotCleanerActions.START_SWEEP, 2, 1, []);
    this.addAction(RobotCleanerActions.STOP_SWEEP, 2, 2, []);
    this.addAction(RobotCleanerActions.START_ROOM_SWEEP, 2, 3, [2]);
    this.addAction(RobotCleanerActions.LOCATE_ROBOT, 3, 1, []);
    this.addAction(RobotCleanerActions.START_CHARGE, 4, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 5;
  }

  statusIdleValue() {
    return 3;
  }

  statusPausedValue() {
    return 10;
  }

  statusErrorValue() {
    return 12;
  }

  statusGoChargingValue() {
    return 6;
  }

  statusChargingValue() {
    return 8;
  }


}

module.exports = RoborockVacuumM1S;

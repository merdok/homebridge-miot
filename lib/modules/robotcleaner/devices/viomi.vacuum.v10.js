const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const RobotCleanerActions = require('../RobotCleanerActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v10:1


class ViomiVacuumV10 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Silent"
      },
      {
        "value": 1,
        "description": "Medium"
      },
      {
        "value": 2,
        "description": "Basic"
      },
      {
        "value": 3,
        "description": "Strong"
      }
    ]);

    // READ ONLY
    this.addProperty(RobotCleanerProperties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Sleep"
      },
      {
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Paused"
      },
      {
        "value": 3,
        "description": "Sweeping"
      },
      {
        "value": 4,
        "description": "Go Charging"
      },
      {
        "value": 5,
        "description": "Charging"
      },
      {
        "value": 6,
        "description": "Sweeping and Mopping"
      },
      {
        "value": 7,
        "description": "Mopping"
      },
      {
        "value": 8,
        "description": "Updating"
      }
    ]);
    this.addProperty(RobotCleanerProperties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(RobotCleanerActions.START_SWEEP, 2, 1, []);
    this.addAction(RobotCleanerActions.STOP_SWEEP, 2, 2, []);
    this.addAction(RobotCleanerActions.START_SWEEP_MOP, 2, 3, []);
    this.addAction(RobotCleanerActions.START_MOP, 2, 4, []);
    this.addAction(RobotCleanerActions.PAUSE_SWEEP, 2, 5, []);
    this.addAction(RobotCleanerActions.START_CHARGE, 3, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 3;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 2;
  }

  statusGoChargingValue() {
    return 4;
  }

  statusChargingValue() {
    return 5;
  }

  statusMopppingValue() {
    return 7;
  }

  statusUpdatingValue() {
    return 8;
  }

  statusSleepValue() {
    return 0;
  }

  statusSweepingAndMoppingValue() {
    return 6;
  }


}

module.exports = ViomiVacuumV10;

const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const RobotCleanerActions = require('../RobotCleanerActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoborockVacuumA15 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "roborock.vacuum.a15";
  }

  getDeviceName() {
    return "Roborock Vacuum S7";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-a15v3:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 101,
        "description": "Silent"
      },
      {
        "value": 102,
        "description": "Basic"
      },
      {
        "value": 103,
        "description": "Strong"
      },
      {
        "value": 104,
        "description": "Full Speed"
      },
      {
        "value": 105,
        "description": "Silent"
      },
      {
        "value": 106,
        "description": "Custom"
      }
    ]);

    // READ ONLY
    this.addProperty(RobotCleanerProperties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Idle"
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
        "description": "Sweeping"
      },
      {
        "value": 8,
        "description": "Charging"
      },
      {
        "value": 10,
        "description": "Paused"
      },
      {
        "value": 11,
        "description": "Sweeping"
      },
      {
        "value": 12,
        "description": "Error"
      },
      {
        "value": 14,
        "description": "Updating"
      },
      {
        "value": 15,
        "description": "Go Charging"
      },
      {
        "value": 16,
        "description": "Sweeping"
      },
      {
        "value": 17,
        "description": "Sweeping"
      },
      {
        "value": 18,
        "description": "Sweeping"
      }
    ]);
    this.addProperty(RobotCleanerProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 255, 1]);
    this.addProperty(RobotCleanerProperties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.BRUSH_LIFE_LEVEL, 9, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LIFE_LEVEL, 10, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LIFE_LEVEL, 11, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(RobotCleanerActions.START_SWEEP, 2, 1, []);
    this.addAction(RobotCleanerActions.STOP_SWEEP, 2, 2, []);
    this.addAction(RobotCleanerActions.START_MOP, 2, 4, []);
    this.addAction(RobotCleanerActions.START_SWEEP_MOP, 2, 5, []);
    this.addAction(RobotCleanerActions.START_ROOM_SWEEP, 2, 6, [9]);
    this.addAction(RobotCleanerActions.START_CHARGE, 3, 1, []);
    this.addAction(RobotCleanerActions.LOCATE_ROBOT, 6, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 5;
  }

  statusIdleValue() {
    return 1;
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

module.exports = RoborockVacuumA15;

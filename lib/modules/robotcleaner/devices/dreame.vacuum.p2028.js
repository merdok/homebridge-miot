const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DreameVacuumP2028 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dreame.vacuum.p2028";
  }

  getDeviceName() {
    return "Dreame Bot Z10 Pro Vacuum";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:dreame-p2028:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Silent"
      },
      {
        "value": 1,
        "description": "Basic"
      },
      {
        "value": 2,
        "description": "Strong"
      },
      {
        "value": 3,
        "description": "Full Speed"
      }
    ]);
    this.addProperty(RobotCleanerProperties.MOP_MODE, 4, 5, PropFormat.INT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Low"
      },
      {
        "value": 2,
        "description": "Middle"
      },
      {
        "value": 3,
        "description": "High"
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
      },
      {
        "value": 7,
        "description": "Mopping"
      }
    ]);
    this.addProperty(RobotCleanerProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 100, 1]);
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
    this.addProperty(RobotCleanerProperties.BRUSH_LEFT_TIME, 9, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 300, 1]);
    this.addProperty(RobotCleanerProperties.BRUSH_LIFE_LEVEL, 9, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LEFT_TIME, 10, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 200, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LIFE_LEVEL, 10, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LIFE_LEVEL, 11, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LEFT_TIME, 11, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 150, 1]);
    this.addProperty(RobotCleanerProperties.WORK_MODE, 4, 1, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 50, 1]);
    this.addProperty(RobotCleanerProperties.CLEANING_TIME, 4, 2, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 32767, 1]);
    this.addProperty(RobotCleanerProperties.CLEANING_AREA, 4, 3, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 32767, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIME, 12, 2, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 4294967295, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIMES, 12, 3, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_AREA, 12, 4, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.START_ROOM_SWEEP, 2, 3, [4]);
    this.addAction(Actions.START_CHARGE, 3, 1, []);
    this.addAction(Actions.RESET_BRUSH_LIFE, 9, 1, []);
    this.addAction(Actions.RESET_SIDE_BRUSH_LIFE, 10, 1, []);
    this.addAction(Actions.RESET_FILTER_LIFE, 11, 1, []);
    this.addAction(Actions.START_CLEAN, 4, 1, [1, 10]); // 1 parameter is not in the spec, from where comes the parameters?
    this.addAction(Actions.STOP_CLEAN, 4, 2, []);
    this.addAction(Actions.LOCATE_ROBOT, 7, 1, []);
    this.addAction(Actions.PLAY_SOUND, 7, 2, []);
    this.addAction(Actions.START_DUST_COLLECT, 15, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

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

  statusMopppingValue() {
    return 7;
  }


}

module.exports = DreameVacuumP2028;

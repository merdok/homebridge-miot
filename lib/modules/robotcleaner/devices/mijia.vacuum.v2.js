const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const RobotCleanerProperties = require('../RobotCleanerProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class MijiaVacuumV2 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "mijia.vacuum.v2";
  }

  getDeviceName() {
    return "Xiaomi Mi Robot Vacuum Mop G1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:mijia-v2:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(RobotCleanerProperties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Auto-clean"
      },
      {
        "value": 2,
        "description": "Spot-clean"
      },
      {
        "value": 3,
        "description": "Wallflow-clean"
      }
    ]);
    this.addProperty(RobotCleanerProperties.TARGET_WATER_LEVEL, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      },
      {
        "value": 3,
        "description": "Level3"
      }
    ]);
    this.addProperty(RobotCleanerProperties.FAN_LEVEL, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Silence"
      },
      {
        "value": 1,
        "description": "Stanrd"
      },
      {
        "value": 2,
        "description": "Middle"
      },
      {
        "value": 3,
        "description": "Enchance"
      }
    ]);
    this.addProperty(RobotCleanerProperties.ALARM, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(RobotCleanerProperties.ALARM_VOLUME, 4, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.DO_NOT_DISTURB, 12, 2, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);

    // READ ONLY
    this.addProperty(RobotCleanerProperties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Sweeping"
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
        "description": "Charging"
      },
      {
        "value": 6,
        "description": "Go Charging"
      }
    ]);
    this.addProperty(RobotCleanerProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 1,
        "description": "Left-wheel-error"
      },
      {
        "value": 2,
        "description": "Right-whelel-error"
      },
      {
        "value": 3,
        "description": "Cliff-error"
      },
      {
        "value": 4,
        "description": "Low-battery-error"
      },
      {
        "value": 5,
        "description": "Bump-error"
      },
      {
        "value": 6,
        "description": "Main-brush-error"
      },
      {
        "value": 7,
        "description": "Side-brush-error"
      },
      {
        "value": 8,
        "description": "Fan-motor-error"
      },
      {
        "value": 9,
        "description": "Dustbin-error"
      },
      {
        "value": 10,
        "description": "Charging-error"
      },
      {
        "value": 11,
        "description": "No-wate-error"
      },
      {
        "value": 12,
        "description": "Pick-up-error"
      }
    ]);
    this.addProperty(RobotCleanerProperties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.CHARGING_STATE, 3, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Not-charging"
      },
      {
        "value": 1,
        "description": "Charging"
      },
      {
        "value": 2,
        "description": "Charging-competely"
      }
    ]);
    this.addProperty(RobotCleanerProperties.BRUSH_LEFT_TIME, 14, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.DAYS, [0, 18000, 1]);
    this.addProperty(RobotCleanerProperties.BRUSH_LIFE_LEVEL, 14, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LEFT_TIME, 15, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 9000, 1]);
    this.addProperty(RobotCleanerProperties.SIDE_BRUSH_LIFE_LEVEL, 15, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LIFE_LEVEL, 11, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(RobotCleanerProperties.FILTER_LEFT_TIME, 11, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 18000, 1]);
    this.addProperty(RobotCleanerProperties.WORK_MODE, 18, 1, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 17, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIME, 9, 4, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 4294967295, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_TIMES, 9, 5, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 65535, 1]);
    this.addProperty(RobotCleanerProperties.TOTAL_CLEAN_AREA, 9, 3, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.START_CHARGE, 2, 3, []);
    this.addAction(Actions.RESET_BRUSH_LIFE, 14, 1, []);
    this.addAction(Actions.RESET_SIDE_BRUSH_LIFE, 15, 1, []);
    this.addAction(Actions.RESET_FILTER_LIFE, 11, 1, []);
    this.addAction(Actions.LOCATE_ROBOT, 6, 1, []);
    this.addAction(Actions.GO_CHARGE, 13, 1, []);
    this.addAction(Actions.STOP_CHARGE, 13, 2, []);
  }


  /*----------========== CONFIG ==========----------*/

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 2;
  }

  statusIdleValue() {
    return 1;
  }

  statusPausedValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusGoChargingValue() {
    return 6;
  }

  statusChargingValue() {
    return 5;
  }

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 0;
  }


}

module.exports = MijiaVacuumV2;

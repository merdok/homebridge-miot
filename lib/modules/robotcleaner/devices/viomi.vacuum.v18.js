const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiVacuumV18 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "viomi.vacuum.v18";
  }

  getDeviceName() {
    return "Viomi Robot Vacuum S9";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v18:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.MODE, 2, 19, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Silent"
      },
      {
        "value": 1,
        "description": "Basic"
      },
      {
        "value": 2,
        "description": "Medium"
      },
      {
        "value": 3,
        "description": "Strong"
      }
    ]);
    this.addProperty(Properties.WIDE_DYNAMIC_RANGE_MODE, 2, 11, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "0"
      },
      {
        "value": 1,
        "description": "1"
      },
      {
        "value": 2,
        "description": "2"
      }
    ]);
    this.addProperty(Properties.SWEEP_TYPE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Total"
      },
      {
        "value": 2,
        "description": "Wall"
      },
      {
        "value": 3,
        "description": "Zone"
      },
      {
        "value": 4,
        "description": "Point"
      },
      {
        "value": 5,
        "description": "Control"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
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
        "description": "Go Charging"
      },
      {
        "value": 4,
        "description": "Charging"
      },
      {
        "value": 5,
        "description": "Sweeping"
      },
      {
        "value": 6,
        "description": "Sweeping and Mopping"
      },
      {
        "value": 7,
        "description": "Mopping"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Error"
      },
      {
        "value": 1,
        "description": "Low Battery Find Charge"
      },
      {
        "value": 2,
        "description": "Low Bat Need Poweroff"
      },
      {
        "value": 3,
        "description": "Wheel Trap"
      },
      {
        "value": 4,
        "description": "Collision Error"
      },
      {
        "value": 5,
        "description": "Tile Do Task"
      },
      {
        "value": 6,
        "description": "Lidar Point Err"
      },
      {
        "value": 7,
        "description": "Front Wall Err"
      },
      {
        "value": 8,
        "description": "Along Wall Err"
      },
      {
        "value": 9,
        "description": "Mid Brush Err"
      },
      {
        "value": 10,
        "description": "Side Brush Err"
      },
      {
        "value": 11,
        "description": "Fan Err"
      },
      {
        "value": 12,
        "description": "Lidar Cover"
      },
      {
        "value": 13,
        "description": "Garbage Full"
      },
      {
        "value": 14,
        "description": "Garbage Out"
      },
      {
        "value": 15,
        "description": "Garbage Full Out"
      },
      {
        "value": 16,
        "description": "Trapped"
      },
      {
        "value": 17,
        "description": "Pick Up"
      },
      {
        "value": 20,
        "description": "Cannot Arrive"
      },
      {
        "value": 21,
        "description": "Start From Forbid"
      },
      {
        "value": 22,
        "description": "Drop"
      },
      {
        "value": 23,
        "description": "Kit Water Pump"
      },
      {
        "value": 24,
        "description": "Find Charge Failed"
      },
      {
        "value": 18,
        "description": "Garbage Out"
      },
      {
        "value": 25,
        "description": "No Mop Clean"
      },
      {
        "value": 26,
        "description": "Low Battery Cant Clean"
      }
    ]);
    this.addProperty(Properties.DOOR_STATE, 2, 12, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "0"
      },
      {
        "value": 1,
        "description": "1"
      },
      {
        "value": 2,
        "description": "2"
      },
      {
        "value": 3,
        "description": "3"
      }
    ]);
    this.addProperty(Properties.CONTACT_STATE, 2, 13, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "0"
      },
      {
        "value": 1,
        "description": "1"
      }
    ]);
    this.addProperty(Properties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.BRUSH_LEFT_TIME, 4, 10, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 360, 1]);
    this.addProperty(Properties.BRUSH_LIFE_LEVEL, 4, 10, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LEFT_TIME, 4, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 180, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LIFE_LEVEL, 4, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_LIFE_LEVEL, 11, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_LEFT_TIME, 11, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 150, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.PAUSE, 2, 3, []);
    this.addAction(Actions.START_CHARGE, 2, 4, []);
    this.addAction(Actions.STOP_MASSAGE, 2, 5, []);
    this.addAction(Actions.START_MOP, 2, 6, []);
    this.addAction(Actions.START_ONLY_SWEEP, 2, 7, []);
    this.addAction(Actions.START_SWEEP_MOP, 2, 8, []);
    this.addAction(Actions.START_CHARGE, 3, 1, []);
    this.addAction(Actions.LOCATE_ROBOT, 8, 2, []);
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
    return 2;
  }

  statusGoChargingValue() {
    return 3;
  }

  statusChargingValue() {
    return 4;
  }

  statusMopppingValue() {
    return 7;
  }

  statusSleepValue() {
    return 0;
  }

  statusSweepingAndMoppingValue() {
    return 6;
  }


}

module.exports = ViomiVacuumV18;

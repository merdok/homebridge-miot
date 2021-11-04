const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoidmiVacuumV60 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "roidmi.vacuum.v60";
  }

  getDeviceName() {
    return "Roidmi Eve Plus";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roidmi-v60:3";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
      },
      {
        "value": 0,
        "description": "Sweep"
      }
    ]);
    this.addProperty(Properties.SWEEP_TYPE, 2, 8, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Sweep"
      },
      {
        "value": 1,
        "description": "Mop"
      },
      {
        "value": 2,
        "description": "Mop And Sweep"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Dormant"
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
        "description": "Sweeping"
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
        "description": "Error"
      },
      {
        "value": 8,
        "description": "Rfctrl"
      },
      {
        "value": 9,
        "description": "Fullcharge"
      },
      {
        "value": 10,
        "description": "Shutdown"
      },
      {
        "value": 11,
        "description": "Findchargerpause"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 1,
        "description": "Low Battery Find Charger"
      },
      {
        "value": 2,
        "description": "Low Battery And Poweroff"
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
        "description": "Lidar Point Error"
      },
      {
        "value": 7,
        "description": "Front Wall Error"
      },
      {
        "value": 8,
        "description": "Psd Dirty"
      },
      {
        "value": 9,
        "description": "Middle Brush Fatal"
      },
      {
        "value": 10,
        "description": "Sid Brush"
      },
      {
        "value": 11,
        "description": "Fan Speed Error"
      },
      {
        "value": 12,
        "description": "Lidar Cover"
      },
      {
        "value": 13,
        "description": "Garbage Box Full"
      },
      {
        "value": 14,
        "description": "Garbage Box Out"
      },
      {
        "value": 15,
        "description": "Garbage Box Full Out"
      },
      {
        "value": 16,
        "description": "Physical Trapped"
      },
      {
        "value": 17,
        "description": "Pick Up Do Task"
      },
      {
        "value": 18,
        "description": "No Water Box Do Task"
      },
      {
        "value": 19,
        "description": "Water Box Empty"
      },
      {
        "value": 20,
        "description": "Clean Cannot Arrive"
      },
      {
        "value": 21,
        "description": "Start Form Forbid"
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
        "description": "Find Charger Failed"
      },
      {
        "value": 25,
        "description": "Low Power Clean"
      }
    ]);
    this.addProperty(Properties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.CHARGING_STATE, 3, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Charging"
      },
      {
        "value": 2,
        "description": "Not charging"
      },
      {
        "value": 3,
        "description": "Not chargeable"
      }
    ]);
    this.addProperty(Properties.BRUSH_LEFT_TIME, 11, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 65535, 1]);
    this.addProperty(Properties.BRUSH_LIFE_LEVEL, 11, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LEFT_TIME, 12, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 10000, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LIFE_LEVEL, 12, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_LIFE_LEVEL, 10, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_LEFT_TIME, 10, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 10000, 1]);

  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.START_ROOM_SWEEP, 2, 3, [9]);
    this.addAction(Actions.RESET_FILTER_LIFE, 10, 1, []);
    this.addAction(Actions.RESET_BRUSH_LIFE, 11, 1, []);
    this.addAction(Actions.RESET_SIDE_BRUSH_LIFE, 12, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  hasBuiltInBattery() {
    return true;
  }

  statusSweepingValue() {
    return 4;
  }

  statusIdleValue() {
    return 2;
  }

  statusPausedValue() {
    return 3;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 6;
  }


}

module.exports = RoidmiVacuumV60;

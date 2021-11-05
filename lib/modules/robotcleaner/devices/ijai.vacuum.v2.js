const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IjaiVacuumV2 extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "ijai.vacuum.v2";
  }

  getDeviceName() {
    return "Mi Robot Vacuum-Mop 2";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:ijai-v2:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Sweep"
      },
      {
        "value": 1,
        "description": "Sweep And Mop"
      },
      {
        "value": 2,
        "description": "Mop"
      }
    ]);
    this.addProperty(Properties.SWEEP_TYPE, 2, 8, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Global"
      },
      {
        "value": 1,
        "description": "Mop"
      },
      {
        "value": 2,
        "description": "Edge"
      },
      {
        "value": 3,
        "description": "Area"
      },
      {
        "value": 4,
        "description": "Point"
      },
      {
        "value": 5,
        "description": "Remote"
      },
      {
        "value": 6,
        "description": "Explore"
      },
      {
        "value": 7,
        "description": "Room"
      },
      {
        "value": 8,
        "description": "Floor"
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
      },
      {
        "value": 8,
        "description": "Upgrading"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 3000, 1]);
    this.addProperty(Properties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.BRUSH_LEFT_TIME, 7, 11, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 360, 1]);
    this.addProperty(Properties.BRUSH_LIFE_LEVEL, 7, 10, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LEFT_TIME, 7, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 180, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LIFE_LEVEL, 7, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.START_ONLY_SWEEP, 2, 3, []);
    this.addAction(Actions.START_SWEEP_MOP, 2, 5, []);
    this.addAction(Actions.START_MOP, 2, 6, []);
    this.addAction(Actions.START_ROOM_SWEEP, 2, 7, [10]);
    this.addAction(Actions.START_CHARGE, 3, 1, []);
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

module.exports = IjaiVacuumV2;

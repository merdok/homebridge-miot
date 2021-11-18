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
    return "viomi.vacuum.v19";
  }

  getDeviceName() {
    return "Viomi Robot Vacuum SE";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:viomi-v19:2";
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
        "description": "Sweeping And Mopping"
      },
      {
        "value": 7,
        "description": "Mopping"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 3000, 1]);
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
    this.addProperty(Properties.BRUSH_LEFT_TIME, 4, 11, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 360, 1]);
    this.addProperty(Properties.BRUSH_LIFE_LEVEL, 4, 10, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LEFT_TIME, 4, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 180, 1]);
    this.addProperty(Properties.SIDE_BRUSH_LIFE_LEVEL, 4, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.HYPA_LIFE_LEVEL, 4, 12, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.HYPA_LEFT_TIME, 4, 13, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 180, 1]);
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

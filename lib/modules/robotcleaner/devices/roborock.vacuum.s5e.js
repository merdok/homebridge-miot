const RobotCleanerDevice = require('../RobotCleanerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class RoborockVacuumS5e extends RobotCleanerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "roborock.vacuum.s5e";
  }

  getDeviceName() {
    return "Roborock S5 MAX";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:vacuum:0000A006:roborock-s5e:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 2,
        "description": "Off"
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
        "description": "Partial Sweeping"
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
        "description": "Back Sweeping"
      },
      {
        "value": 16,
        "description": "Target Sweeping"
      },
      {
        "value": 17,
        "description": "Area Sweeping"
      },
      {
        "value": 18,
        "description": "Selected Sweeping"
      }
    ]);
    this.addProperty(Properties.BATTERY_LEVEL, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_SWEEP, 2, 1, []);
    this.addAction(Actions.STOP_SWEEP, 2, 2, []);
    this.addAction(Actions.START_CHARGE, 3, 1, []);
    this.addAction(Actions.LOCATE_ROBOT, 4, 1, []);
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
    return 4;
  }

  statusErrorValue() {
    return 7;
  }

  statusGoChargingValue() {
    return 5;
  }

  statusChargingValue() {
    return 3;
  }


}

module.exports = RoborockVacuumS5e;

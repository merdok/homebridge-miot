const OvenDevice = require('../OvenDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CareliFryerMaf02 extends OvenDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "careli.fryer.maf02";
  }

  getDeviceName() {
    return "Mi Smart Air Fryer";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fryer:0000A0A4:careli-maf02:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.TARGET_TIME, 2, 3, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [1, 1440, 1]);
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [40, 200, 1]);
    this.addProperty(Properties.FOOD_QUANTITY, 3, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Null"
      },
      {
        "value": 1,
        "description": "Single"
      },
      {
        "value": 2,
        "description": "Double"
      },
      {
        "value": 3,
        "description": "Half"
      },
      {
        "value": 4,
        "description": "Full"
      }
    ]);
    this.addProperty(Properties.PREHEAT_SWITCH, 3, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Null"
      },
      {
        "value": 1,
        "description": "Off"
      },
      {
        "value": 2,
        "description": "On"
      }
    ]);
    this.addProperty(Properties.PREHEAT_SWITCH, 3, 10, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Switch Off"
      },
      {
        "value": 0,
        "description": "Not Turn Pot"
      },
      {
        "value": 2,
        "description": "Turn Pot"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Shutdown"
      },
      {
        "value": 1,
        "description": "Standby"
      },
      {
        "value": 2,
        "description": "Pause"
      },
      {
        "value": 3,
        "description": "Appointment"
      },
      {
        "value": 4,
        "description": "Cooking"
      },
      {
        "value": 5,
        "description": "Preheat "
      },
      {
        "value": 6,
        "description": "Cooked"
      },
      {
        "value": 7,
        "description": "Preheat Finish"
      },
      {
        "value": 8,
        "description": "Preheat Pause"
      },
      {
        "value": 9,
        "description": "Pause2"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 1,
        "description": "E1"
      },
      {
        "value": 2,
        "description": "E2"
      }
    ]);

    this.addProperty(Properties.LEFT_TIME, 2, 5, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 1440, 1]);

  }

  initDeviceActions() {
    this.addAction(Actions.START_COOK, 2, 1, []);
    this.addAction(Actions.CANCEL_COOKING, 2, 2, []);
    this.addAction(Actions.PAUSE, 2, 3, []);
    this.addAction(Actions.RESUME_COOK, 3, 2, []);
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 4;
  }

  statusPausedValue() {
    return 2;
  }

  statusCompletedValue() {
    return 6;
  }

  statusSleepValue() {
    return 0;
  }

  statusPreheatValue() {
    return 5;
  }


}

module.exports = CareliFryerMaf02;

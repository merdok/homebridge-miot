const OvenDevice = require('../OvenDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiOvenX02 extends OvenDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "chunmi.oven.x02";
  }

  getDeviceName() {
    return "Xiaomi Mijia Smart Steam Oven Toaster 12L";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:oven:0000A04E:chunmi-x02:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [0, 255, 1]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Busy"
      },
      {
        "value": 3,
        "description": "Paused"
      },
      {
        "value": 5,
        "description": "Sleep"
      },
      {
        "value": 11,
        "description": "Fault"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 6,
        "description": "HighTemperature"
      },
      {
        "value": 9,
        "description": "NTCBreak"
      },
      {
        "value": 11,
        "description": "CommunicateError"
      }
    ]);
    this.addProperty(Properties.LEFT_TIME, 2, 5, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 1440, 1]);
    this.addProperty(Properties.TEMPERATURE, 2, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 255, 1]);

    // no access
    this.addProperty(Properties.COOK_MODE, 2, 4, PropFormat.UINT8, PropAccess.NONE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Cheese"
      },
      {
        "value": 1,
        "description": "Tart"
      },
      {
        "value": 2,
        "description": "Wing"
      },
      {
        "value": 3,
        "description": "Seafood"
      }
    ]);
    this.addProperty(Properties.COOK_TIME, 2, 11, PropFormat.UINT32, PropAccess.NONE, PropUnit.SECONDS, [0, 4294967295, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.START_COOK, 2, 1, [4]);
    this.addAction(Actions.CANCEL_COOKING, 2, 2, []);
    this.addAction(Actions.PAUSE, 2, 3, []);
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 2;
  }

  statusFaultValue() {
    return 11;
  }

  statusPausedValue() {
    return 3;
  }

  statusSleepValue() {
    return 5;
  }


}

module.exports = ChunmiOvenX02;

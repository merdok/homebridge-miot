const CurtainDevice = require('../CurtainDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiCurtainHagl08 extends CurtainDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "lumi.curtain.hagl08";
  }

  getDeviceName() {
    return "Aqara Curtain Controller A1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:lumi-hagl08:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.TARGET_POSITION, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);

    // WRITE ONLY
    this.addProperty(Properties.MOTOR_CONTROL, 2, 2, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Pause"
      },
      {
        "value": 1,
        "description": "Open"
      },
      {
        "value": 2,
        "description": "Close"
      },
      {
        "value": 3,
        "description": "Toggle"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No Faults"
    }]);
    this.addProperty(Properties.CURRENT_POSITION, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.STATUS, 2, 6, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Stopped"
      },
      {
        "value": 1,
        "description": "Opening"
      },
      {
        "value": 2,
        "description": "Closing"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.IDENTIFY, 6, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  statusClosingValue() {
    return 2;
  }

  statusStopValue() {
    return 0;
  }

  statusOpeningValue() {
    return 1;
  }


}

module.exports = LumiCurtainHagl08;

const CurtainDevice = require('../CurtainDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshiCurtainV0001 extends CurtainDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "leshi.curtain.v0001";
  }

  getDeviceName() {
    return "Scene Curtain WIFI X";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:leshi-v0001:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.TARGET_POSITION, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.MOTOR_REVERSE, 2, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // WRITE ONLY
    this.addProperty(Properties.MOTOR_CONTROL, 2, 2, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Close"
      },
      {
        "value": 1,
        "description": "Pause"
      },
      {
        "value": 2,
        "description": "Open"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "Fault-free"
    }]);
    this.addProperty(Properties.CURRENT_POSITION, 2, 5, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = LeshiCurtainV0001;

const FanDevice = require('../FanDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFan1C extends FanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dmaker.fan.1c";
  }

  getDeviceName() {
    return "Mi Smart Standing Fan 1C";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-1c:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(Properties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MODE, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Straight Wind"
      },
      {
        "value": 1,
        "description": "Sleep"
      }
    ]);
    this.addProperty(Properties.POWER_OFF_TIME, 2, 10, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 480, 1]);
    this.addProperty(Properties.ALARM, 2, 11, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 2, 12, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.CHILD_LOCK, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  straightWindModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 1;
  }

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = DmakerFan1C;

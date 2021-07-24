const FanDevice = require('../FanDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP11 extends FanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dmaker.fan.p11";
  }

  getDeviceName() {
    return "Mi Smart Standing Fan Pro";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p11:1";
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
      },
      {
        "value": 4,
        "description": "Level4"
      }
    ]);
    this.addProperty(Properties.HORIZONTAL_SWING, 2, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.HORIZONTAL_SWING_ANGLE, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 30,
        "description": "30"
      },
      {
        "value": 60,
        "description": "60"
      },
      {
        "value": 90,
        "description": "90"
      },
      {
        "value": 120,
        "description": "120"
      },
      {
        "value": 140,
        "description": "140"
      }
    ]);
    this.addProperty(Properties.MODE, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Straight Wind"
      },
      {
        "value": 1,
        "description": "Natural Wind"
      }
    ]);
    this.addProperty(Properties.POWER_OFF_TIME, 3, 1, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 480, 1]);
    this.addProperty(Properties.CHILD_LOCK, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.ALARM, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAN_SPEED, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]); // this has actaully only read and notify in the spec, but writes works anyway, why?

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 6, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No Faults"
    }]);

    //WRITE ONLY
    this.addProperty(Properties.HORIZONTAL_MOVE, 6, 1, PropFormat.UINT8, PropUnit.NONE, [], PropAccess.WRITE, [{
        "value": 0,
        "description": "NONE"
      },
      {
        "value": 1,
        "description": "LEFT"
      },
      {
        "value": 2,
        "description": "RIGHT"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 3, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = DmakerFanP11;

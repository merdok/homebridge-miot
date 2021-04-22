const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p9:1


class DmakerFanP9 extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(FanProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 5, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 6, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
        "value": 150,
        "description": "150"
      }
    ]);
    this.addProperty(FanProperties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Straight Wind"
      },
      {
        "value": 1,
        "description": "Natural Wind"
      },
      {
        "value": 2,
        "description": "Sleep"
      }
    ]);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 8, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 480, 1]);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.LED, 2, 9, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.ALARM, 2, 7, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.FAN_SPEED, 2, 11, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);

    // WRITE ONLY
    this.addProperty(FanProperties.HORIZONTAL_MOVE, 2, 10, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "None"
      },
      {
        "value": 1,
        "description": "Left"
      },
      {
        "value": 2,
        "description": "Right"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.STRAIGHT_WIND_MODE_VALUE, 0);
    this.addCapability(FanCapabilities.NATURAL_MODE_VALUE, 1);
    this.addCapability(FanCapabilities.SLEEP_MODE_VALUE, 2);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/

  async moveLeft() {
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, 1);
  }

  async moveRight() {
    this.setPropertyValue(FanProperties.HORIZONTAL_MOVE, 2);
  }


}

module.exports = DmakerFanP9;

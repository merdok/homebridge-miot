const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-fa1:2


class ZhimiFanFa1 extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(FanProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
      },
      {
        "value": 4,
        "description": "4"
      },
      {
        "value": 5,
        "description": "5"
      }
    ]);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 120, 1]);
    this.addProperty(FanProperties.VERTICAL_SWING, 2, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.VERTICAL_SWING_ANGLE, 2, 6, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 90, 1]);
    this.addProperty(FanProperties.MODE, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Natural Wind"
      },
      {
        "value": 1,
        "description": "Straight Wind"
      }
    ]);
    this.addProperty(FanProperties.POWER_OFF_TIME, 5, 2, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.HOURS, [0, 8, 1]);
    this.addProperty(FanProperties.CHILD_LOCK, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.LED, 2, 10, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 1, 1]);
    this.addProperty(FanProperties.ALARM, 2, 11, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.FAN_SPEED, 5, 10, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);

    // WRITE ONLY
    this.addProperty(FanProperties.HORIZONTAL_MOVE, 5, 6, PropFormat.STRING, PropAccess.WRITE, PropUnit.NONE);
    this.addProperty(FanProperties.VERTICAL_MOVE, 5, 7, PropFormat.STRING, PropAccess.WRITE, PropUnit.NONE);

    // READ ONLY
    this.addProperty(FanProperties.STATUS, 2, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Busy"
      }
    ]);
    this.addProperty(FanProperties.DEVICE_FAULT, 2, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Nofaults"
      },
      {
        "value": 1,
        "description": "Stuck"
      },
      {
        "value": 2,
        "description": "2"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE_POWER, 7, 1, [1]);
    this.addAction(Actions.TOGGLE_MODE, 7, 2, [1]);
    this.addAction(Actions.TOGGLE_LEVEL, 7, 2, [1]);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.STRAIGHT_WIND_MODE_VALUE, 1);
    this.addCapability(FanCapabilities.NATURAL_MODE_VALUE, 0);
    this.addCapability(FanCapabilities.BUILT_IN_BATTERY, true);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiFanFa1;

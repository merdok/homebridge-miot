const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-1c:1


class DmakerFan1C extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
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
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.MODE, 2, 7, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 0,
        "description": "Straight Wind"
      },
      {
        "value": 1,
        "description": "Sleep"
      }
    ]);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 10, PropFormat.UINT16, ['read', 'write', 'notify'], Constants.PROP_UNIT_MINUTES, [0, 480, 1]);
    this.addProperty(FanProperties.ALARM, 2, 11, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.LED, 2, 12, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.FAN_LEVELS, 3);
    this.addCapability(FanCapabilities.SLEEP_MODE, true);
    this.addCapability(FanCapabilities.FAKE_STEPLESS_FAN_CONTROL, true);
  }


  /*----------========== STATUS ==========----------*/

  isSleepModeEnabled() {
    return this.getPropertyValue(FanProperties.MODE) === 1;
  }


  /*----------========== COMMANDS ==========----------*/

  async setSleepModeEnabled(enabled) {
    let value = enabled ? 1 : 0;
    this.setPropertyValue(FanProperties.MODE, value);
  }


}

module.exports = DmakerFan1C;

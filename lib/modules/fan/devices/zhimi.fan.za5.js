const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za5:2


class ZhimiFanZa5 extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
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
      }
    ]);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, Constants.PROP_FORMAT_UINT16, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [30, 120, 1]);
    this.addProperty(FanProperties.MODE, 2, 7, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 0,
        "description": "Natural Wind"
      },
      {
        "value": 1,
        "description": "Straight Wind"
      }
    ]);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 10, Constants.PROP_FORMAT_UINT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 36000, 1]);
    this.addProperty(FanProperties.ANION, 2, 11, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.LED, 4, 3, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(FanProperties.ALARM, 5, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_SPEED, 6, 8, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [1, 100, 1]);
    this.addProperty(FanProperties.COUNTRY_CODE, 6, 9, Constants.PROP_FORMAT_STRING, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(FanProperties.RELATIVE_HUMIDITY, 7, 1, Constants.PROP_FORMAT_UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(FanProperties.TEMPERATURE, 7, 7, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-30, 100, 0.1]);
    this.addProperty(FanProperties.BATTERY_POWER, 6, 2, Constants.PROP_FORMAT_BOOL, ['read', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_SPEED_RPM, 6, 4, Constants.PROP_FORMAT_UINT32, ['read', 'notify'], Constants.PROP_UNIT_RPM, [0, 3000, 1]);
    this.addProperty(FanProperties.AC_POWER, 6, 5, Constants.PROP_FORMAT_BOOL, ['read', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(FanProperties.HORIZONTAL_MOVE, 6, 3, Constants.PROP_FORMAT_STRING, ['write'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.LP_ENTER_SECOND, 6, 7, Constants.PROP_FORMAT_UINT32, ['write'], Constants.PROP_UNIT_NONE, null);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.FAN_LEVELS, 4);
    this.addCapability(FanCapabilities.NATURAL_MODE, true);
    this.addCapability(FanCapabilities.BUILT_IN_BATTERY, true);
  }


  /*----------========== STATUS ==========----------*/

  isNaturalModeEnabled() {
    return this.getPropertyValue(FanProperties.MODE) === 0;
  }

  getLedBrightness() {
    return this.getPropertyValue(FanProperties.LED);
  }


  /*----------========== COMMANDS ==========----------*/

  async setNaturalModeEnabled(enabled) {
    let value = enabled ? 0 : 1;
    this.setPropertyValue(FanProperties.MODE, value);
  }

  async setLedBrightness(brightness) {
    this.setPropertyValue(FanProperties.LED, brightness);
  }


}

module.exports = ZhimiFanZa5;

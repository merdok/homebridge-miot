const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-fa1:2


class ZhimiFanFa1 extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, Constants.PROP_FORMAT_UINT16, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 120, 1]);
    this.addProperty(FanProperties.VERTICAL_SWING, 2, 4, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.VERTICAL_SWING_ANGLE, 2, 6, Constants.PROP_FORMAT_UINT16, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 90, 1]);
    this.addProperty(FanProperties.MODE, 2, 7, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.POWER_OFF_TIME, 5, 2, Constants.PROP_FORMAT_UINT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_HOURS, [0, 8, 1]);
    this.addProperty(FanProperties.CHILD_LOCK, 6, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.LED, 2, 10, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 1, 1]);
    this.addProperty(FanProperties.ALARM, 2, 11, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_SPEED, 5, 10, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [1, 100, 1]);

    this.addProperty(FanProperties.HORIZONTAL_MOVE, 5, 6, Constants.PROP_FORMAT_STRING, ['write'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.VERTICAL_MOVE, 5, 7, Constants.PROP_FORMAT_STRING, ['write'], Constants.PROP_UNIT_NONE, null);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.FAN_LEVELS, 5);
    this.addCapability(FanCapabilities.NATURAL_MODE, true);
    this.addCapability(FanCapabilities.BUILT_IN_BATTERY, true);
  }


  /*----------========== STATUS ==========----------*/

  isNaturalModeEnabled() {
    return this.getPropertyValue(FanProperties.MODE) === 0;
  }


  /*----------========== COMMANDS ==========----------*/

  async setNaturalModeEnabled(enabled) {
    let value = enabled ? 0 : 1;
    this.setPropertyValue(FanProperties.MODE, value);
  }


}

module.exports = ZhimiFanFa1;

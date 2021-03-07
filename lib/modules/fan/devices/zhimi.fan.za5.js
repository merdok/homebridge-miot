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
    this.addProperty(FanProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, 'uint16', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.MODE, 2, 7, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 10, 'uint32', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.ANION, 2, 11, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.LED, 4, 3, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.ALARM, 5, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.FAN_SPEED, 6, 8, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.COUNTRY_CODE, 6, 9, 'string', ['read', 'write', 'notify']);

    this.addProperty(FanProperties.RELATIVE_HUMIDITY, 7, 1, 'uint8', ['read', 'notify']);
    this.addProperty(FanProperties.TEMPERATURE, 7, 7, 'float', ['read', 'notify']);
    this.addProperty(FanProperties.BATTERY_POWER, 6, 2, 'bool', ['read', 'notify']);
    this.addProperty(FanProperties.FAN_SPEED_RPM, 6, 4, 'uint32', ['read', 'notify']);
    this.addProperty(FanProperties.AC_POWER, 6, 5, 'bool', ['read', 'notify']);

    this.addProperty(FanProperties.HORIZONTAL_MOVE, 6, 3, 'string', ['write']);
    this.addProperty(FanProperties.LP_ENTER_SECOND, 6, 7, 'uint32', ['write']);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.FAN_LEVELS, 4);
    this.addCapability(FanCapabilities.HORIZONTAL_SWING_ANGLE_RANGE, [30, 120, 1]);
    this.addCapability(FanCapabilities.NATURAL_MODE, true);
    this.addCapability(FanCapabilities.POWER_OFF_TIMER_UNIT, Constants.TIME_UNIT_SECONDS);
    this.addCapability(FanCapabilities.POWER_OFF_TIMER_RANGE, [0, 36000, 1]);
    this.addCapability(FanCapabilities.LED_CONTROL_RANGE, [0, 100, 1]);
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

const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-1c:1


class DmakerFan1C extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.MODE, 2, 7, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 10, 'uint16', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.ALARM, 2, 11, 'bool', ['read', 'write', 'notify']);
    this.addProperty(FanProperties.LIGHT, 2, 12, 'bool', ['read', 'write', 'notify'], );
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, 'bool', ['read', 'write', 'notify']);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.FAN_LEVELS, 3);
    this.addCapability(FanCapabilities.SLEEP_MODE, true);
    this.addCapability(FanCapabilities.POWER_OFF_TIMER_UNIT, 'minutes');
    this.addCapability(FanCapabilities.POWER_OFF_TIMER_RANGE, [0, 480, 1]);
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

const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-mc2:1


class ZhimiHeaterMc2 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, 'float', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, 'uint32', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.LED, 7, 3, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.ALARM, 6, 1, 'bool', ['read', 'write', 'notify']);

    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, 'float', ['read', 'notify']);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, 'uint32', ['read', 'notify']);
    this.addProperty(HeaterProperties.COUNTRY_CODE, 8, 10, 'int32', ['read', 'notify']);
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.TARGET_TEMPERATURE_RANGE, [18, 28, 1]);
    this.addCapability(HeaterCapabilities.POWER_OFF_TIMER_UNIT, Constants.TIME_UNIT_HOURS);
    this.addCapability(HeaterCapabilities.POWER_OFF_TIMER_RANGE, [0, 12, 1]);
    this.addCapability(HeaterCapabilities.USE_TIME_UNIT, Constants.TIME_UNIT_SECONDS);
  }


  /*----------========== STATUS ==========----------*/

  isLedEnabled() {
    return this.getPropertyValue(Properties.LED) !== 1;
  }


  /*----------========== COMMANDS ==========----------*/

  async setLedEnabled(enabled) {
    let level = enabled ? 0 : 1;
    this.setPropertyValue(Properties.LED, level);
  }


}

module.exports = ZhimiHeaterMc2;

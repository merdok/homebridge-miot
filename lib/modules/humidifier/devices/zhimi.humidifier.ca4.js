const HumidifierDevice = require('../HumidifierDevice.js');
const HumidifierCapabilities = require('../HumidifierCapabilities.js');
const HumidifierProperties = require('../HumidifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:zhimi-ca4:1

class ZhimiHumidifierCa4 extends HumidifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HumidifierProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.FAN_LEVEL, 2, 5, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_LEVEL, null);
    this.addProperty(HumidifierProperties.TARGET_HUMIDITY, 2, 6, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [30, 80, 1]);
    this.addProperty(HumidifierProperties.DRY_MODE, 2, 8, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.CHILD_LOCK, 6, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.SCREEN, 5, 2, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1]);
    this.addProperty(HumidifierProperties.ALARM, 4, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.FAN_SPEED, 2, 11, 'int32', ['read', 'write', 'notify'], Constants.PROP_UNIT_RPM, [200, 2000, 10]);

    this.addProperty(HumidifierProperties.WATER_LEVEL, 2, 7, 'uint8', ['read', 'notify'], Constants.PROP_UNIT_NONE, [0, 128, 1]);
    this.addProperty(HumidifierProperties.RELATIVE_HUMIDITY, 3, 9, 'uint8', ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(HumidifierProperties.TEMPERATURE, 3, 7, 'float', ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-40, 125, 0.1]);
    this.addProperty(HumidifierProperties.TEMPERATURE_FAHRENHEIT, 3, 8, 'float', ['read', 'notify'], Constants.PROP_UNIT_FAHRENHEIT, [-40, 257, 0.1]);
    this.addProperty(HumidifierProperties.ACTUAL_SPEED, 7, 1, 'uint32', ['read', 'notify'], Constants.PROP_UNIT_RPM, [0, 2000, 1]);
    this.addProperty(HumidifierProperties.USE_TIME, 2, 9, 'uint32', ['read', 'write', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 2147483600, 1]);
    this.addProperty(HumidifierProperties.POWER_TIME, 7, 3, 'uint32', ['read', 'write', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 4294967295, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HumidifierCapabilities.FAN_LEVELS, 4);
    this.addCapability(HumidifierCapabilities.TARGET_HUMIDITY_RANGE, [30, 80, 1]);
    this.addCapability(HumidifierCapabilities.WATER_LEVEL_RANGE, [0, 128, 1]);
    this.addCapability(HumidifierCapabilities.USE_TIME_UNIT, Constants.PROP_UNIT_SECONDS);
  }


  /*----------========== STATUS ==========----------*/

  getPowerTime() {
    let powerTime = this.getPropertyValue(HumidifierProperties.POWER_TIME); // convert seconds to minutes
    powerTime = powerTime / 60;
    return powerTime;
  }


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHumidifierCa4;

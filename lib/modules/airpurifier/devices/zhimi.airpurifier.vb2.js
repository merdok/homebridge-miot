const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-vb2:1


class ZhimiAirPurifierVb2 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 2, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.FAN_LEVEL, 2, 4, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 7, 'int32', ['read', 'write'], Constants.PROP_UNIT_RPM, [300, 2300, 10]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.LED, 6, 1, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1]);
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, 'float', ['read', 'notify'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, 'uint8', ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, 'float', ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-40, 125, 0.1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, 'uint8', ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, 'uint16', ['read', 'notify'], Constants.PROP_UNIT_HOURS, [0, 18000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 8, 'int32', ['read'], Constants.PROP_UNIT_RPM, [0, 10000, 1]);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, 'int32', ['read'], Constants.PROP_UNIT_SECONDS, [0, 2147483647, 1]);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 8, 'int32', ['read'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.AQI_VALUE, 13, 2, 'int32', ['read'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.FAN_LEVELS, 3);
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.NONE_MODE_VALUE, 3);
    this.addCapability(AirPurifierCapabilities.FAVORITE_SPEED_RANGE, [300, 2300, 10]);
    this.addCapability(AirPurifierCapabilities.LED_CONTROL_RANGE, [0, 2, 1]);
    this.addCapability(AirPurifierCapabilities.USE_TIME_UNIT, Constants.PROP_UNIT_SECONDS);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierVb2;

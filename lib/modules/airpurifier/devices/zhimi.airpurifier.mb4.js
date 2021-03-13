const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb4:2


class ZhimiAirPurifierMb4 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.MODE, 2, 4, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 9, 3, Constants.PROP_FORMAT_UINT16, ['read', 'write', 'notify'], Constants.PROP_UNIT_RPM, [300, 2200, 1]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 8, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.LED, 7, 1, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 8, 1]);
    this.addProperty(AirPurifierProperties.ALARM, 6, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 4, Constants.PROP_FORMAT_UINT16, ['read', 'notify'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 1, Constants.PROP_FORMAT_UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 3, Constants.PROP_FORMAT_UINT16, ['read', 'notify'], Constants.PROP_UNIT_HOURS, [0, 65000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 9, 1, Constants.PROP_FORMAT_UINT32, ['read', 'notify'], Constants.PROP_UNIT_RPM, [0, 65535, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.FAVORITE_SPEED_RANGE, [300, 2200, 1]);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierMb4;

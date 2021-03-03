const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-za1:1


class ZhimiAirPurifierZa1 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 10, 'int32', ['read', 'write']); // this is favorite speed level, seperate property for that?
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.LIGHT, 6, 1, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.COUNTRY_CODE, 15, 12, 'uint8', ['read', 'write', 'notify']);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, 'uint16', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, 'uint8', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, 'float', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, 'uint8', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, 'uint16', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 11, 'uint16', ['read']);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, 'uint32', ['read']);
    this.addProperty(AirPurifierProperties.AQI_VALUE, 13, 3, 'uint16', ['read']); // what is the difference here? this is marked as average
  //  this.addProperty(AirPurifierProperties.AQI_VALUE, 3, 1, 'uint16', ['read']);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.FAVORITE_SPEED_RANGE, [0, 14, 1]); // this is favorite speed level, seperate capability for that?
    this.addCapability(AirPurifierCapabilities.LIGHT_BRIGHTNESS_RANGE, [0, 2, 1]);
    this.addCapability(AirPurifierCapabilities.USE_TIME_UNIT, Constants.TIME_UNIT_SECONDS);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierZa1;

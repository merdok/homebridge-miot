const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-vb2:1


class ZhimiAirPurifierVb2 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 2, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.FAN_LEVEL, 2, 4, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 7, 'int32', ['read', 'write']);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.LIGHT, 6, 1, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, 'bool', ['read', 'write', 'notify']);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, 'float', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, 'uint8', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, 'float', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, 'uint8', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, 'uint16', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 8, 'int32', ['read']);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, 'int32', ['read']);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 8, 'int32', ['read']);
    this.addProperty(AirPurifierProperties.AQI_VALUE, 13, 2, 'int32', ['read']);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.FAN_LEVELS, 3);
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.NONE_MODE_VALUE, 3);
    this.addCapability(AirPurifierCapabilities.FAVORITE_SPEED_RANGE, [300, 2300, 10]);
    this.addCapability(AirPurifierCapabilities.LIGHT_BRIGHTNESS_RANGE, [0, 2, 1]);
  }


  /*----------========== STATUS ==========----------*/

  getUseTime() {
    let useTime = this.getPropertyValue(FanProperties.USE_TIME); // convert seconds to minutes
    useTime = useTime / 60;
    return useTime;
  }



  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierVb2;

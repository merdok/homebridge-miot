const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb4:2


class ZhimiAirPurifierMb4 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.MODE, 2, 4, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 9, 3, 'uint16', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 8, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.LIGHT, 7, 1, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(AirPurifierProperties.ALARM, 6, 1, 'bool', ['read', 'write', 'notify']);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 4, 'uint16', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 1, 'uint8', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 3, 'uint16', ['read', 'notify']);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 9, 1, 'uint32', ['read', 'notify']);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.FAVORITE_SPEED_RANGE, [300, 2200, 1]);
    this.addCapability(AirPurifierCapabilities.LIGHT_BRIGHTNESS_RANGE, [0, 8, 1]);
  }


  /*----------========== STATUS ==========----------*/

  getUseTime() {
    let useTime = this.getPropertyValue(FanProperties.USE_TIME); // convert seconds to minutes
    useTime = useTime / 60;
    return useTime;
  }



  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierMb4;

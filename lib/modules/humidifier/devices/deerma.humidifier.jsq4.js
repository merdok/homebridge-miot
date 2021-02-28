const HumidifierDevice = require('../HumidifierDevice.js');
const HumidifierCapabilities = require('../HumidifierCapabilities.js');
const HumidifierProperties = require('../HumidifierProperties.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq4:1

class DeermaHumidifierJsq4 extends HumidifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HumidifierProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HumidifierProperties.FAN_LEVEL, 2, 5, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(HumidifierProperties.TARGET_HUMIDITY, 2, 6, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(HumidifierProperties.LIGHT, 3, 6, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HumidifierProperties.ALARM, 3, 5, 'bool', ['read', 'write', 'notify']);

    this.addProperty(HumidifierProperties.RELATIVE_HUMIDITY, 3, 1, 'uint8', ['read', 'notify']);
    this.addProperty(HumidifierProperties.TEMPERATURE, 3, 7, 'float', ['read', 'notify']);
  }

  initDeviceCapabilities() {
    this.addCapability(HumidifierCapabilities.FAN_LEVELS, 3);
    this.addCapability(HumidifierCapabilities.TARGET_HUMIDITY_RANGE, [40, 80, 1]);
  }


  /*----------========== STATUS ==========----------*/

  getUseTime() {
    let useTime = this.getPropertyValue(HumidifierProperties.USE_TIME); // convert seconds to minutes
    useTime = useTime / 60;
    return useTime;
  }

  getPowertime() {
    let powerTime = this.getPropertyValue(HumidifierProperties.POWER_TIME); // convert seconds to minutes
    powerTime = powerTime / 60;
    return powerTime;
  }


  /*----------========== COMMANDS ==========----------*/


}

module.exports = DeermaHumidifierJsq4;

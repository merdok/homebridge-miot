const HumidifierDevice = require('../HumidifierDevice.js');
const HumidifierCapabilities = require('../HumidifierCapabilities.js');
const HumidifierProperties = require('../HumidifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq4:1

class DeermaHumidifierJsq4 extends HumidifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HumidifierProperties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.FAN_LEVEL, 2, 5, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      },
      {
        "value": 3,
        "description": "Humidity"
      }
    ]);
    this.addProperty(HumidifierProperties.TARGET_HUMIDITY, 2, 6, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [40, 80, 1]);
    this.addProperty(HumidifierProperties.LED, 3, 6, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HumidifierProperties.ALARM, 3, 5, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(HumidifierProperties.RELATIVE_HUMIDITY, 3, 1, Constants.PROP_FORMAT_UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(HumidifierProperties.TEMPERATURE, 3, 7, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-30, 100, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HumidifierCapabilities.FAN_LEVELS, 3);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = DeermaHumidifierJsq4;

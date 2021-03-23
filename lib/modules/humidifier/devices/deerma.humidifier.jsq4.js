const HumidifierDevice = require('../HumidifierDevice.js');
const HumidifierCapabilities = require('../HumidifierCapabilities.js');
const HumidifierProperties = require('../HumidifierProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq4:1

class DeermaHumidifierJsq4 extends HumidifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HumidifierProperties.POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(HumidifierProperties.FAN_LEVEL, 2, 5, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
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
    this.addProperty(HumidifierProperties.TARGET_HUMIDITY, 2, 6, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.PERCENTAGE, [40, 80, 1]);
    this.addProperty(HumidifierProperties.LED, 3, 6, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(HumidifierProperties.ALARM, 3, 5, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);

    this.addProperty(HumidifierProperties.RELATIVE_HUMIDITY, 3, 1, PropFormat.UINT8, ['read', 'notify'], PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(HumidifierProperties.TEMPERATURE, 3, 7, PropFormat.FLOAT, ['read', 'notify'], PropUnit.CELSIUS, [-30, 100, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HumidifierCapabilities.FAN_LEVELS, 3);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = DeermaHumidifierJsq4;

const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanCapabilities = require('../CeilingFanCapabilities.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl1:1


class YeelinkLightFancl1 extends CeilingFanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 2, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Day Light"
      },
      {
        "value": 1,
        "description": "Night Light"
      }
    ]);
    this.addProperty(CeilingFanProperties.BRIGHTNESS, 2, 3, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(CeilingFanProperties.COLOR_TEMP, 2, 5, PropFormat.UINT16, ['read', 'write', 'notify'], PropUnit.KELVIN, [2700, 6500, 1]);
    this.addProperty(CeilingFanProperties.LIGHT_POWER_OFF_TIME, 2, 7, PropFormat.UINT32, ['read', 'write', 'notify'], PropUnit.MINUTES, [0, 180, 1]);

    this.addProperty(CeilingFanProperties.POWER, 3, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(CeilingFanProperties.FAN_LEVEL, 3, 2, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Level0"
      },
      {
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      }
    ]);
    this.addProperty(CeilingFanProperties.MODE, 3, 7, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
      "value": 0,
      "description": "Auto"
    }]);
    this.addProperty(CeilingFanProperties.POWER_OFF_TIME, 3, 10, PropFormat.UINT32, ['read', 'write', 'notify'], PropUnit.MINUTES, [0, 480, 1]);

    // READ ONLY
    this.addProperty(CeilingFanProperties.STATUS, 3, 8, PropFormat.UINT8, ['read', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Idle"
      },
      {
        "value": 1,
        "description": "Busy"
      }
    ]);
  }

  initDeviceCapabilities() {
    this.addCapability(CeilingFanCapabilities.FAN_LEVELS, 3);
    this.addCapability(CeilingFanCapabilities.AUTO_MODE_VALUE, 0);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = YeelinkLightFancl1;

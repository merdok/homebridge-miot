const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanCapabilities = require('../CeilingFanCapabilities.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl2:1


class YeelinkLightFancl2 extends CeilingFanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 2, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Day"
      },
      {
        "value": 1,
        "description": "Night"
      }
    ]);
    this.addProperty(CeilingFanProperties.BRIGHTNESS, 2, 3, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(CeilingFanProperties.COLOR_TEMP, 2, 5, PropFormat.UINT16, ['read', 'write', 'notify'], PropUnit.KELVIN, [2700, 6500, 1]);
    this.addProperty(CeilingFanProperties.LIGHT_POWER_OFF_TIME, 2, 7, PropFormat.UINT32, ['read', 'write', 'notify'], PropUnit.MINUTES, [0, 180, 1]);

    this.addProperty(CeilingFanProperties.POWER, 3, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(CeilingFanProperties.FAN_LEVEL, 3, 2, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Level1"
      },
      {
        "value": 1,
        "description": "Level2"
      },
      {
        "value": 2,
        "description": "Level3"
      },
      {
        "value": 3,
        "description": "Level4"
      }
    ]);
    this.addProperty(CeilingFanProperties.MODE, 3, 7, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Normal-wind"
      },
      {
        "value": 1,
        "description": "Natural-wind"
      },
      {
        "value": 2,
        "description": "Reverse-wind"
      },
      {
        "value": 3,
        "description": "Strong-wind"
      },
      {
        "value": 4,
        "description": "Small-wind"
      },
      {
        "value": 5,
        "description": "Sleep-wind"
      }
    ]);
    this.addProperty(CeilingFanProperties.POWER_OFF_TIME, 3, 11, PropFormat.UINT32, ['read', 'write', 'notify'], PropUnit.MINUTES, [0, 720, 1]);

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
    this.addCapability(CeilingFanCapabilities.FAN_LEVELS, 4);
    this.addCapability(CeilingFanCapabilities.AUTO_MODE_VALUE, 0);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = YeelinkLightFancl2;

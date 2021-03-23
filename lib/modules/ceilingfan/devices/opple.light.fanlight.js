const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanCapabilities = require('../CeilingFanCapabilities.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:opple-fanlight:2


class OppleLightFanlight extends CeilingFanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, ['read', 'write'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 2, PropFormat.UINT8, ['read', 'write'], Constants.PROP_UNIT_NONE, null, [{
        "value": 1,
        "description": "Hospitality"
      },
      {
        "value": 2,
        "description": "Tv"
      },
      {
        "value": 3,
        "description": "Entertainment"
      },
      {
        "value": 4,
        "description": "Night"
      }
    ]);
    this.addProperty(CeilingFanProperties.BRIGHTNESS, 2, 3, PropFormat.UINT8, ['read', 'write'], Constants.PROP_UNIT_PERCENTAGE, [7, 100, 1]);
    this.addProperty(CeilingFanProperties.COLOR_TEMP, 2, 4, PropFormat.UINT32, ['read', 'write'], Constants.PROP_UNIT_KELVIN, [3000, 5700, 1]);

    this.addProperty(CeilingFanProperties.POWER, 3, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(CeilingFanProperties.FAN_LEVEL, 3, 2, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [10, 64, 1]);
    this.addProperty(CeilingFanProperties.MODE, 3, 3, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 1,
        "description": "NONE"
      },
      {
        "value": 2,
        "description": "LOW"
      },
      {
        "value": 3,
        "description": "MID"
      },
      {
        "value": 4,
        "description": "HIGH"
      }
    ]);
  }

  initDeviceCapabilities() {
    //this.addCapability(CeilingFanCapabilities.FAN_LEVELS, 54); // the fan has actaully a range instead of a value list so find a better way to do that
    this.addCapability(CeilingFanCapabilities.FAN_LEVELS, 5);
  }


  /*----------========== STATUS ==========----------*/

  getFanLevel() {
    let fanLevel = this.getPropertyValue(CeilingFanProperties.FAN_LEVEL);
    fanLevel = Math.floor(fanLevel / 10); // round down
    return fanLevel;
  }


  /*----------========== COMMANDS ==========----------*/

  async setFanLevel(level) {
    let actualFanLevel = 10 * level;
    this.setPropertyValue(CeilingFanProperties.FAN_LEVEL, actualFanLevel);
  }


}

module.exports = OppleLightFanlight;

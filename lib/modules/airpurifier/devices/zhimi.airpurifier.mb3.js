const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb3:2


class ZhimiAirPurifierMb3 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 2, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.FAN_LEVEL, 2, 4, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      },
      {
        "value": 3,
        "description": "Level3"
      }
    ]);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Sleep"
      },
      {
        "value": 2,
        "description": "Favorite"
      },
      {
        "value": 3,
        "description": "None"
      }
    ]);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 7, PropFormat.INT32, ['read', 'write'], Constants.PROP_UNIT_RPM, [300, 2300, 1]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.LED, 6, 1, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1], [{
        "value": 0,
        "description": "Brightest"
      },
      {
        "value": 1,
        "description": "Glimmer"
      },
      {
        "value": 2,
        "description": "Led Closed"
      }
    ]); // also fake led range! FIX!
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, PropFormat.FLOAT, ['read', 'notify'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, PropFormat.UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, PropFormat.FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-40, 125, 0.1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, PropFormat.UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, PropFormat.UINT16, ['read', 'notify'], Constants.PROP_UNIT_HOURS, [0, 10000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 8, PropFormat.INT32, ['read'], Constants.PROP_UNIT_RPM, [0, 3000, 1]);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, PropFormat.INT32, ['read'], Constants.PROP_UNIT_SECONDS, [0, 2147483600, 1]);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 8, PropFormat.INT32, ['read'], Constants.PROP_UNIT_NONE, null, [{
        "value": 0,
        "description": "best"
      },
      {
        "value": 1,
        "description": "good"
      },
      {
        "value": 2,
        "description": "normal"
      },
      {
        "value": 3,
        "description": "bad"
      },
      {
        "value": 4,
        "description": "worse"
      },
      {
        "value": 5,
        "description": "unhealthy"
      }
    ]);
    this.addProperty(AirPurifierProperties.AQI_VALUE, 13, 2, PropFormat.INT32, ['read'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.FAN_LEVELS, 3);
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
    this.addCapability(AirPurifierCapabilities.NONE_MODE_VALUE, 3);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierMb3;

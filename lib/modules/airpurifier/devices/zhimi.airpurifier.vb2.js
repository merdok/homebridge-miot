const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-vb2:1


class ZhimiAirPurifierVb2 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 2, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.FAN_LEVEL, 2, 4, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
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
      },
      {
        "value": 0,
        "description": "Sleep"
      }
    ]);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null, [{
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
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 7, Constants.PROP_FORMAT_INT32, ['read', 'write'], Constants.PROP_UNIT_RPM, [300, 2300, 10]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(AirPurifierProperties.LED, 6, 1, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1], [{
        "value": 0,
        "description": "brightest"
      },
      {
        "value": 1,
        "description": "glimmer"
      },
      {
        "value": 2,
        "description": "not bright"
      }
    ]); // fake led value range, FIX
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, Constants.PROP_FORMAT_UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-40, 125, 0.1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, Constants.PROP_FORMAT_UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, Constants.PROP_FORMAT_UINT16, ['read', 'notify'], Constants.PROP_UNIT_HOURS, [0, 18000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 8, Constants.PROP_FORMAT_INT32, ['read'], Constants.PROP_UNIT_RPM, [0, 10000, 1]);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, Constants.PROP_FORMAT_INT32, ['read'], Constants.PROP_UNIT_SECONDS, [0, 2147483647, 1]);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 8, Constants.PROP_FORMAT_INT32, ['read'], Constants.PROP_UNIT_NONE, null, [{
        "value": 0,
        "description": "AQI_GOOD_L"
      },
      {
        "value": 1,
        "description": "AQI_GOOD_H"
      },
      {
        "value": 2,
        "description": "AQI_MID_L"
      },
      {
        "value": 3,
        "description": "AQI_MID_H"
      },
      {
        "value": 4,
        "description": "AQI_BAD_L"
      },
      {
        "value": 5,
        "description": "AQI_BAD_H"
      }
    ]);
    this.addProperty(AirPurifierProperties.AQI_VALUE, 13, 2, Constants.PROP_FORMAT_INT32, ['read'], Constants.PROP_UNIT_NONE, [0, 600, 1]);
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

module.exports = ZhimiAirPurifierVb2;

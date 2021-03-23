const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-za1:1


class ZhimiAirPurifierZa1 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
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
      }
    ]);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 10, PropFormat.INT32, ['read', 'write'], PropUnit.NONE, [0, 14, 1]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(AirPurifierProperties.LED, 6, 1, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, [0, 2, 1], [{
        "value": 0,
        "description": "Bright"
      },
      {
        "value": 1,
        "description": "Light"
      },
      {
        "value": 2,
        "description": "Off"
      }
    ]); // also fake led value range, fix that!
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(AirPurifierProperties.COUNTRY_CODE, 15, 12, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null);

    this.addProperty(AirPurifierProperties.AQI_VALUE, 3, 1, PropFormat.UINT16, ['read', 'notify'], PropUnit.NONE, [0, 500, 1]);
    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, PropFormat.UINT16, ['read', 'notify'], PropUnit.NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, PropFormat.UINT8, ['read', 'notify'], PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, PropFormat.FLOAT, ['read', 'notify'], PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, PropFormat.UINT8, ['read', 'notify'], PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, PropFormat.UINT16, ['read', 'notify'], PropUnit.HOURS, [0, 15000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 11, PropFormat.UINT16, ['read'], PropUnit.RPM, [0, 3000, 1]);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, PropFormat.UINT32, ['read'], PropUnit.SECONDS, [0, 2147483600, 1]);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 4, PropFormat.STRING, ['read'], PropUnit.NONE, null); // marked as aqi zone, so is this the state in text form?
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierZa1;

const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-za1:1


class ZhimiAirPurifierZa1 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(AirPurifierProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirPurifierProperties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 10, 10, PropFormat.INT32, PropAccess.READ_WRITE, PropUnit.NONE, [0, 14, 1]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirPurifierProperties.LED, 6, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    ]);
    this.addProperty(AirPurifierProperties.ALARM, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirPurifierProperties.COUNTRY_CODE, 15, 12, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(AirPurifierProperties.AQI_VALUE, 3, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 500, 1]);
    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 6, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.RELATIVE_HUMIDITY, 3, 7, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.TEMPERATURE, 3, 8, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 5, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 15000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 10, 11, PropFormat.UINT16, PropAccess.READ, PropUnit.RPM, [0, 3000, 1]);
    this.addProperty(AirPurifierProperties.USE_TIME, 12, 1, PropFormat.UINT32, PropAccess.READ, PropUnit.SECONDS, [0, 2147483600, 1]);
    this.addProperty(AirPurifierProperties.AQI_STATE, 13, 4, PropFormat.STRING, PropAccess.READ, PropUnit.NONE); // marked as aqi zone, so is this the state in text form?
  }

  initDeviceActions() {
    //none
  }


  /*----------========== VALUES ==========----------*/

  autoModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 1;
  }

  favoriteModeValue() {
    return 2;
  }


}

module.exports = ZhimiAirPurifierZa1;

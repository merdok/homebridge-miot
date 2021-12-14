const AirPurifierDevice = require('../AirPurifierDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirPurifierM1 extends AirPurifierDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.airpurifier.m1";
  }

  getDeviceName() {
    return "Xiaomi Mi Air Purifier M1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-m1:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(Properties.CHILD_LOCK, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE)
    this.addProperty(Properties.FAVORITE_LEVEL, 8, 1, PropFormat.INT32, PropAccess.READ_WRITE, PropUnit.NONE, [0, 16, 1]);
    this.addProperty(Properties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    this.addProperty(Properties.LED, 5, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    ]);
    // READ ONLY
    this.addProperty(Properties.PM25_DENSITY, 3, 2, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 600, 1]);
    this.addProperty(Properties.RELATIVE_HUMIDITY, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.TEMPERATURE, 3, 3, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-40, 125, 0.1]);
    this.addProperty(Properties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_USED_TIME, 4, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 10000, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

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

module.exports = ZhimiAirPurifierM1;

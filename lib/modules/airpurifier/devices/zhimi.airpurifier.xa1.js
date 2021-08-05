const AirPurifierDevice = require('../AirPurifierDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirPurifierXa1 extends AirPurifierDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.airpurifier.xa1";
  }

  getDeviceName() {
    return "Mi Air Purifier X";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-xa1:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAN_LEVEL, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(Properties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(Properties.ANION, 2, 5, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    this.addProperty(Properties.FAVORITE_SPEED, 10, 10, PropFormat.INT32, PropAccess.READ_WRITE, PropUnit.NONE, [0, 14, 1]);
    this.addProperty(Properties.CHILD_LOCK, 14, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 6, 2, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED_STATUS, 6, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Close"
      },
      {
        "value": 1,
        "description": "Auto"
      },
      {
        "value": 2,
        "description": "Brightest"
      },
      {
        "value": 3,
        "description": "Bright"
      }
    ]);
    this.addProperty(Properties.ALARM, 15, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAVORITE_LEVEL, 10, 10, PropFormat.INT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 9, 1]);

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 2,
        "description": " Motor Stuck"
      },
      {
        "value": 3,
        "description": "No Sensor"
      },
      {
        "value": 4,
        "description": "Error Hum"
      },
      {
        "value": 5,
        "description": "Error Temp"
      },
      {
        "value": 6,
        "description": "Error TVOC"
      }
    ]);
    this.addProperty(Properties.TVOC_DENSITY, 3, 8, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.UGM3, [0, 500, 1]);
    this.addProperty(Properties.PM25_DENSITY, 3, 4, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.UGM3, [0, 1000, 1]);
    this.addProperty(Properties.RELATIVE_HUMIDITY, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.TEMPERATURE, 3, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(Properties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_USED_TIME, 4, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 10000, 1]);
    this.addProperty(Properties.FAN_SPEED_RPM, 10, 8, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.RPM, [0, 1000, 1]);
    this.addProperty(Properties.AQI_STATE, 13, 7, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
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
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 8, 1, []);
    this.addAction(Actions.TOGGLE_MODE, 8, 2, []);
    this.addAction(Actions.TOGGLE_LEVEL, 8, 3, []);
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

module.exports = ZhimiAirPurifierXa1;

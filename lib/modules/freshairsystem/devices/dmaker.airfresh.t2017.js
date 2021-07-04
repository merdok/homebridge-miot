const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const FreshAirSystemProperties = require('../FreshAirSystemProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerAirfreshT2017 extends FreshAirSystemDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dmaker.airfresh.t2017";
  }

  getDeviceName() {
    return "Xiaomi Air Purifier MJXFJ-300-G1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:dmaker-t2017:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(FreshAirSystemProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "None"
      },
      {
        "value": 2,
        "description": "Sleep"
      }
    ]);
    this.addProperty(FreshAirSystemProperties.HEATER, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.HEAT_LEVEL, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(FreshAirSystemProperties.CHILD_LOCK, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(FreshAirSystemProperties.PM25_DENSITY, 3, 1, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 999, 1]);
    this.addProperty(FreshAirSystemProperties.CO2_DENSITY, 3, 3, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.PPM, [400, 9999, 1]);
    this.addProperty(FreshAirSystemProperties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FreshAirSystemProperties.FILTER_LEFT_TIME, 4, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.DAYS, [0, 365, 1]);
    this.addProperty(FreshAirSystemProperties.HIGH_EFF_FILTER_LIFE_LEVEL, 5, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FreshAirSystemProperties.HIGH_EFF_FILTER_LEFT_TIME, 5, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.DAYS, [0, 365, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.RESET_FILTER_LIFE, 4, 1, []);
    this.addAction(Actions.RESET_HIGH_EFF_FILTER_LIFE, 5, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = DmakerAirfreshT2017;

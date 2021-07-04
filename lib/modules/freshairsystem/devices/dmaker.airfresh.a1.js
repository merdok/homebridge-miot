const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const FreshAirSystemProperties = require('../FreshAirSystemProperties.js');
const FreshAirSystemActions = require('../FreshAirSystemActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerAirfreshA1 extends FreshAirSystemDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dmaker.airfresh.a1";
  }

  getDeviceName() {
    return "Xiaomi Mi Air Purifier A1 MJXFJ-150-A1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:dmaker-a1:1";
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
    this.addProperty(FreshAirSystemProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(FreshAirSystemProperties.PM25_DENSITY, 3, 1, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 999, 1]);
    this.addProperty(FreshAirSystemProperties.CO2_DENSITY, 3, 2, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.PPM, [400, 9999, 1]);
    this.addProperty(FreshAirSystemProperties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FreshAirSystemProperties.FILTER_LEFT_TIME, 4, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.DAYS, [0, 365, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = DmakerAirfreshA1;

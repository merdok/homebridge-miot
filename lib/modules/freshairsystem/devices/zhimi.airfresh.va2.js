const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirfreshVa2 extends FreshAirSystemDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.airfresh.va2";
  }

  getDeviceName() {
    return "Smartmi Fresh Air System XFXT01ZM";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:zhimi-va2:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Sleep"
      },
      {
        "value": 2,
        "description": "Interval"
      },
      {
        "value": 3,
        "description": "Level1"
      },
      {
        "value": 4,
        "description": "Level2"
      },
      {
        "value": 5,
        "description": "Level3"
      }
    ]);
    this.addProperty(Properties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 7, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [], [{
        "value": 0,
        "description": "High"
      },
      {
        "value": 1,
        "description": "Low"
      },
      {
        "value": 2,
        "description": "Idle"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.RELATIVE_HUMIDITY, 3, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.PM25_DENSITY, 3, 2, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 600, 1]);
    this.addProperty(Properties.TEMPERATURE, 3, 3, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-40, 125, 0.1]);
    this.addProperty(Properties.CO2_DENSITY, 3, 4, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.PPM, [0, 5000, 1]);
    this.addProperty(Properties.FILTER_USED_TIME, 4, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 10000, 1]);
  }

  initDeviceActions() {
    // none
  }


  /*----------========== CONFIG ==========----------*/

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = ZhimiAirfreshVa2;

const HeaterDevice = require('../HeaterDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterMa3 extends HeaterDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.heater.ma3";
  }

  getDeviceName() {
    return "Xiaomi Mi Smart Baseboard Heater E";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma3:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [16, 28, 1]);
    this.addProperty(Properties.MODE, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "LL Mode"
      },
      {
        "value": 2,
        "description": "HH Mode"
      }
    ]);
    this.addProperty(Properties.POWER_OFF_TIME, 3, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 43200, 1]);
    this.addProperty(Properties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 7, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Bright"
      },
      {
        "value": 1,
        "description": "Dark"
      },
      {
        "value": 2,
        "description": "Extinguished"
      }
    ]);
    this.addProperty(Properties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 4, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(Properties.USE_TIME, 8, 9, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 2147483647, 1]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Error"
      },
      {
        "value": 1,
        "description": "NTC  Connect Error"
      },
      {
        "value": 2,
        "description": "High Temperature Alarm"
      },
      {
        "value": 3,
        "description": "EEPROM Error"
      },
      {
        "value": 4,
        "description": "Multi Errors"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE_POWER, 8, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ZhimiHeaterMa3;

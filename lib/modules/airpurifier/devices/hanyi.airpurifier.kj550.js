const AirPurifierDevice = require('../AirPurifierDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class HanyiAirpurifierKj550 extends AirPurifierDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "hanyi.airpurifier.kj550";
  }

  getDeviceName() {
    return "MiWhole Air Purifier Mix";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:hanyi-kj550:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MODE, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Sleep"
      },
      {
        "value": 2,
        "description": "Manual"
      }
    ]);

    this.addProperty(Properties.FAN_LEVEL, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 100, 1]);
    this.addProperty(Properties.ANION, 2, 6, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.CHILD_LOCK, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 5, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Close"
      },
      {
        "value": 1,
        "description": "Bright"
      },
      {
        "value": 2,
        "description": "Dark"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "Nofaults"
    }]);
    this.addProperty(Properties.PM25_DENSITY, 3, 4, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.UGM3, [0, 1000, 1]);
    this.addProperty(Properties.TEMPERATURE, 3, 5, PropFormat.INT16, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-50, 50, 1]);
    this.addProperty(Properties.RELATIVE_HUMIDITY, 3, 6, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.FILTER_LEFT_TIME, 4, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 3000, 1]);
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

  manualModeValue() {
    return 2;
  }


}

module.exports = HanyiAirpurifierKj550;

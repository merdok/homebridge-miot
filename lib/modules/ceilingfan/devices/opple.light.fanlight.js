const CeilingFanDevice = require('../CeilingFanDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class OppleLightFanlight extends CeilingFanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "opple.light.fanlight";
  }

  getDeviceName() {
    return "Opple Ceiling Fan Light";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:opple-fanlight:2";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.LIGHT_POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);
    this.addProperty(Properties.LIGHT_MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Hospitality"
      },
      {
        "value": 2,
        "description": "Tv"
      },
      {
        "value": 3,
        "description": "Entertainment"
      },
      {
        "value": 4,
        "description": "Night"
      }
    ]);
    this.addProperty(Properties.BRIGHTNESS, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE, PropUnit.PERCENTAGE, [7, 100, 1]);
    this.addProperty(Properties.COLOR_TEMP, 2, 4, PropFormat.UINT32, PropAccess.READ_WRITE, PropUnit.KELVIN, [3000, 5700, 1]);

    this.addProperty(Properties.POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.FAN_LEVEL, 3, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [10, 64, 1]);
    this.addProperty(Properties.MODE, 3, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "NONE"
      },
      {
        "value": 2,
        "description": "LOW"
      },
      {
        "value": 3,
        "description": "MID"
      },
      {
        "value": 4,
        "description": "HIGH"
      }
    ]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = OppleLightFanlight;

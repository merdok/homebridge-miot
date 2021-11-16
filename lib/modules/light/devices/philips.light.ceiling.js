const LightDevice = require('../LightDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class PhilipsLightCeiling extends LightDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "philips.light.ceiling";
  }

  getDeviceName() {
    return "Xiaomi Philips LED Ceiling Light";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:philips-ceiling:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.BRIGHTNESS, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(Properties.MODE, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Day"
      },
      {
        "value": 2,
        "description": "Night"
      },
      {
        "value": 3,
        "description": "Tv"
      },
      {
        "value": 4,
        "description": "Warmth"
      },
      {
        "value": 5,
        "description": "Unknown"
      }
    ]);
    this.addProperty(Properties.COLOR_TEMP, 2, 4, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [3000, 5700, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = PhilipsLightCeiling;

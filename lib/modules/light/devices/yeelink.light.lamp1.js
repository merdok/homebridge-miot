const LightDevice = require('../LightDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightLamp1 extends LightDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yeelink.light.lamp1";
  }

  getDeviceName() {
    return "Xiaomi Mi Desk Lamp";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelight-lamp1:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.BRIGHTNESS, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(Properties.COLOR_TEMP, 2, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [2700, 6500, 1]);

    // WRITE ONLY
    this.addProperty(Properties.MODE, 2, 4, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Reading"
      },
      {
        "value": 1,
        "description": "Computer"
      },
      {
        "value": 2,
        "description": "Night Reading"
      },
      {
        "value": 3,
        "description": "Anti-blue"
      },
      {
        "value": 4,
        "description": "Effective Work"
      },
      {
        "value": 5,
        "description": "Candle"
      },
      {
        "value": 6,
        "description": "Twinkle"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = YeelinkLightLamp1;

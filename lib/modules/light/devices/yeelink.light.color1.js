const LightDevice = require('../LightDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightColor1 extends LightDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yeelink.light.color1";
  }

  getDeviceName() {
    return "Yeelight Smart LED Bulb 1";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-color1:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.BRIGHTNESS, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(Properties.COLOR_TEMP, 2, 4, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [1700, 6500, 1]);
    this.addProperty(Properties.COLOR, 2, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.RGB, [1, 16777215, 1]);
    this.addProperty(Properties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Color"
      },
      {
        "value": 2,
        "description": "Day"
      }
    ]);

    // WRITE ONLY
    this.addProperty(Properties.ADJUST_BRIGHTNESS, 3, 1, PropFormat.INT8, PropAccess.WRITE, PropUnit.PERCENTAGE, [-100, 100, 1]);
    this.addProperty(Properties.ADJUST_COLOR_TEMP, 3, 2, PropFormat.INT8, PropAccess.WRITE, PropUnit.PERCENTAGE, [-100, 100, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = YeelinkLightColor1;

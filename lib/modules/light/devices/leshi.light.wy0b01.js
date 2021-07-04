const LightDevice = require('../LightDevice.js');
const LightProperties = require('../LightProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshiLightWy0b01 extends LightDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "leshi.light.wy0b01";
  }

  getDeviceName() {
    return "Scenario WIFI Dual Color Light";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:leshi-wy0b01:1:0000C802";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(LightProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(LightProperties.BRIGHTNESS, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(LightProperties.COLOR_TEMP, 2, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [3000, 6400, 1]);
    this.addProperty(LightProperties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "WYmode"
      },
      {
        "value": 4,
        "description": "Day"
      },
      {
        "value": 5,
        "description": "Night"
      },
      {
        "value": 7,
        "description": "Warmth"
      },
      {
        "value": 8,
        "description": "Tv"
      },
      {
        "value": 9,
        "description": "Reading"
      },
      {
        "value": 10,
        "description": "Computer"
      },
      {
        "value": 11,
        "description": "Hospitality"
      },
      {
        "value": 12,
        "description": "Entertainment"
      },
      {
        "value": 13,
        "description": "Wakeup"
      },
      {
        "value": 14,
        "description": "Dusk"
      },
      {
        "value": 15,
        "description": "Sleeping"
      }
    ]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = LeshiLightWy0b01;

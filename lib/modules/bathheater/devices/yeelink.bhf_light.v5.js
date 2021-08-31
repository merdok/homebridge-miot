const BathHeaterDevice = require('../BathHeaterDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkBhfLightV5 extends BathHeaterDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yeelink.bhf_light.v5";
  }

  getDeviceName() {
    return "Mi Smart Bathroom Heater Pro";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:bath-heater:0000A028:yeelink-v5:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.LIGHT_POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.BRIGHTNESS, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(Properties.MODE, 3, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Dry"
      },
      {
        "value": 2,
        "description": "Defog"
      },
      {
        "value": 3,
        "description": "Quick Defog"
      },
      {
        "value": 4,
        "description": "Quick Heat"
      },
      {
        "value": 5,
        "description": "Idle"
      },
      {
        "value": 6,
        "description": "None"
      }
    ]);
    this.addProperty(Properties.HEATING, 3, 2, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.BLOW, 3, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.VENTILATION, 3, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.TARGET_TEMPERATURE, 3, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [25, 45, 1]);

    // WRITE ONLY
    this.addProperty(Properties.LIGHT_MODE, 2, 2, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Lighting"
      },
      {
        "value": 2,
        "description": "Night Light"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 3, 6, PropFormat.UINT8, PropAccess.READ, PropUnit.CELSIUS, [0, 50, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.STOP_WORKING, 3, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  modeIdleValue() {
    return 5;
  }


}

module.exports = YeelinkBhfLightV5;

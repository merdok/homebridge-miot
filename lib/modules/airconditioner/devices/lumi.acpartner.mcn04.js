const AirConditionerDevice = require('../AirConditionerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAcpartnerMcn04 extends AirConditionerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "lumi.acpartner.mcn04";
  }

  getDeviceName() {
    return "Mi Smart Air Conditioner Controller Pro";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-condition-outlet:0000A045:lumi-mcn04:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);
    this.addProperty(Properties.MODE, 3, 2, PropFormat.UINT8, PropAccess.READ_WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Cool"
      },
      {
        "value": 1,
        "description": "Heat"
      },
      {
        "value": 2,
        "description": "Auto"
      },
      {
        "value": 3,
        "description": "Fan"
      },
      {
        "value": 4,
        "description": "Dry"
      }
    ]);
    this.addProperty(Properties.TARGET_TEMPERATURE, 3, 4, PropFormat.FLOAT, PropAccess.READ_WRITE, PropUnit.CELSIUS, [16, 30, 1]);
    this.addProperty(Properties.FAN_LEVEL, 4, 2, PropFormat.UINT8, PropAccess.READ_WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Low"
      },
      {
        "value": 2,
        "description": "Medium"
      },
      {
        "value": 3,
        "description": "High"
      }
    ]);
    this.addProperty(Properties.VERTICAL_SWING, 4, 4, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 3, 1, []);
  }


  /*----------========== CONFIG ==========----------*/

  autoModeValue() {
    return 0;
  }

  heatModeValue() {
    return 3;
  }

  coolModeValue() {
    return 1;
  }

  dryModeValue() {
    return 2;
  }

  fanModeValue() {
    return 4;
  }


}

module.exports = LumiAcpartnerMcn04;

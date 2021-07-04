const AirConditionerDevice = require('../AirConditionerDevice.js');
const AirConditionerProperties = require('../AirConditionerProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAirconditionAcn05 extends AirConditionerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "lumi.aircondition.acn05";
  }

  getDeviceName() {
    return "Aqara Air Conditioning Companion P3";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:lumi-acn05:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(AirConditionerProperties.ALARM, 5, 1, PropFormat.STRING, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirConditionerProperties.ALARM_VOLUME, 5, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirConditionerProperties.LED, 6, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Off"
      },
      {
        "value": 1,
        "description": "On"
      }
    ]);
    this.addProperty(AirConditionerProperties.POWER, 10, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirConditionerProperties.MODE, 10, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Heat"
      },
      {
        "value": 2,
        "description": "Cool"
      },
      {
        "value": 3,
        "description": "Dry"
      },
      {
        "value": 4,
        "description": "Fan"
      }
    ]);
    this.addProperty(AirConditionerProperties.TARGET_TEMPERATURE, 10, 4, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [16, 31, 1]);
    this.addProperty(AirConditionerProperties.SWITCH_STATUS_2, 14, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(AirConditionerProperties.FAN_LEVEL, 18, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(AirConditionerProperties.VERTICAL_SWING, 18, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(AirConditionerProperties.ILLUMINATION, 8, 1, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.LUX, [0, 10000, 1]);
    this.addProperty(AirConditionerProperties.DEVICE_FAULT, 10, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No faults"
    }]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/

  autoModeValue() {
    return 0;
  }

  heatModeValue() {
    return 1;
  }

  coolModeValue() {
    return 2;
  }

  dryModeValue() {
    return 3;
  }

  fanModeValue() {
    return 4;
  }


}

module.exports = LumiAirconditionAcn05;

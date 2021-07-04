const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl2 extends CeilingFanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yeelink.light.fancl2";
  }

  getDeviceName() {
    return "Yeelight Smart Ceiling Fan S2001";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl2:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Day"
      },
      {
        "value": 1,
        "description": "Night"
      }
    ]);
    this.addProperty(CeilingFanProperties.BRIGHTNESS, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(CeilingFanProperties.COLOR_TEMP, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [2700, 6500, 1]);
    this.addProperty(CeilingFanProperties.FLOW, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "Auto"
    }]);
    this.addProperty(CeilingFanProperties.LIGHT_POWER_OFF_TIME, 2, 7, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 180, 1]);
    this.addProperty(CeilingFanProperties.POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(CeilingFanProperties.FAN_LEVEL, 3, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Level1"
      },
      {
        "value": 1,
        "description": "Level2"
      },
      {
        "value": 2,
        "description": "Level3"
      },
      {
        "value": 3,
        "description": "Level4"
      }
    ]);
    this.addProperty(CeilingFanProperties.MODE, 3, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Normal-wind"
      },
      {
        "value": 1,
        "description": "Natural-wind"
      },
      {
        "value": 2,
        "description": "Reverse-wind"
      },
      {
        "value": 3,
        "description": "Strong-wind"
      },
      {
        "value": 4,
        "description": "Small-wind"
      },
      {
        "value": 5,
        "description": "Sleep-wind"
      }
    ]);
    this.addProperty(CeilingFanProperties.POWER_OFF_TIME, 3, 11, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 720, 1]);
    this.addProperty(CeilingFanProperties.FAN_SPEED, 5, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);

    // READ ONLY
    this.addProperty(CeilingFanProperties.STATUS, 3, 8, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Idle"
      },
      {
        "value": 1,
        "description": "Busy"
      }
    ]);
    this.addProperty(CeilingFanProperties.DEVICE_FAULT, 3, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No Faults"
    }]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 3, 1, []);
    this.addAction(Actions.BRIGHTNESS_UP, 4, 5, []);
    this.addAction(Actions.BRIGHTNESS_DOWN, 4, 6, []);
    this.addAction(Actions.BRIGHTNESS_CYCLE, 4, 2, []);
    this.addAction(Actions.COLOR_TEMP_CYCLE, 4, 3, []);
    this.addAction(Actions.COLOR_TEMP_INCREASE, 4, 7, []);
    this.addAction(Actions.COLOR_TEMP_DECREASE, 4, 8, []);
    this.addAction(Actions.ON_OR_BRIGHT_CYCLE, 4, 9, []);
    this.addAction(Actions.ON_OR_COLOR_TEMP_CYCLE, 4, 10, []);
    this.addAction(Actions.FAN_GEAR_CYCLE, 4, 4, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = YeelinkLightFancl2;

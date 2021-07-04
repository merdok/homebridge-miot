const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const CeilingFanActions = require('../CeilingFanActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightFancl1 extends CeilingFanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yeelink.light.fancl1";
  }

  getDeviceName() {
    return "Yeelight Smart Ceiling Fan";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl1:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Day Light"
      },
      {
        "value": 1,
        "description": "Night Light"
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
        "description": "Level0"
      },
      {
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      }
    ]);
    this.addProperty(CeilingFanProperties.MODE, 3, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "Auto"
    }]);
    this.addProperty(CeilingFanProperties.POWER_OFF_TIME, 3, 10, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 480, 1]);

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
    this.addAction(CeilingFanActions.TOGGLE, 3, 1, []);
    this.addAction(CeilingFanActions.SET_SCENE, 4, 1, [3]);
    this.addAction(CeilingFanActions.BRIGHTNESS_CYCLE, 4, 2, []);
    this.addAction(CeilingFanActions.COLOR_TEMP_CYCLE, 4, 3, []);
    this.addAction(CeilingFanActions.FAN_GEAR_CYCLE, 4, 4, []);
  }


  /*----------========== CONFIG ==========----------*/

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = YeelinkLightFancl1;

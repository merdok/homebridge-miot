const CeilingFanDevice = require('../CeilingFanDevice.js');
const CeilingFanProperties = require('../CeilingFanProperties.js');
const CeilingFanActions = require('../CeilingFanActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-fancl5:2


class YeelinkLightFancl5 extends CeilingFanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(CeilingFanProperties.LIGHT_POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(CeilingFanProperties.LIGHT_MODE, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Day"
      },
      {
        "value": 1,
        "description": "Night"
      }
    ]);
    this.addProperty(CeilingFanProperties.BRIGHTNESS, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(CeilingFanProperties.COLOR_TEMP, 2, 5, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.KELVIN, [2700, 6500, 1]);
    this.addProperty(CeilingFanProperties.LIGHT_POWER_OFF_TIME, 4, 4, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 180, 1]);
    this.addProperty(CeilingFanProperties.POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(CeilingFanProperties.FAN_LEVEL, 3, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Level1"
      },
      {
        "value": 2,
        "description": "Level2"
      },
      {
        "value": 3,
        "description": "Level3"
      }
    ]);
    this.addProperty(CeilingFanProperties.MODE, 3, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Auto"
      }
    ]);
    this.addProperty(CeilingFanProperties.POWER_OFF_TIME, 3, 10, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 720, 1]);
    this.addProperty(CeilingFanProperties.FAN_SPEED, 5, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);

    // READ ONLY
    this.addProperty(CeilingFanProperties.STATUS, 3, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Busy"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(CeilingFanActions.TOGGLE, 4, 1, []);
    this.addAction(CeilingFanActions.BRIGHTNESS_UP, 4, 2, []);
    this.addAction(CeilingFanActions.BRIGHTNESS_DOWN, 4, 3, []);
    this.addAction(CeilingFanActions.BRIGHTNESS_CYCLE, 4, 4, []);
    this.addAction(CeilingFanActions.COLOR_TEMP_CYCLE, 4, 5, []);
    this.addAction(CeilingFanActions.COLOR_TEMP_INCREASE, 4, 7, []);
    this.addAction(CeilingFanActions.COLOR_TEMP_DECREASE, 4, 8, []);
    this.addAction(CeilingFanActions.ON_OR_BRIGHT_CYCLE, 4, 9, []);
    this.addAction(CeilingFanActions.ON_OR_COLOR_TEMP_CYCLE, 4, 10, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = YeelinkLightFancl5;

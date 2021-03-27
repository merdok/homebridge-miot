const FanDevice = require('../FanDevice.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za5:2


class ZhimiFanZa5 extends FanDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null, [{
        "value": 1,
        "description": "1"
      },
      {
        "value": 2,
        "description": "2"
      },
      {
        "value": 3,
        "description": "3"
      },
      {
        "value": 4,
        "description": "4"
      }
    ]);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [30, 120, 1]);
    this.addProperty(FanProperties.MODE, 2, 7, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null, [{
        "value": 0,
        "description": "Natural Wind"
      },
      {
        "value": 1,
        "description": "Straight Wind"
      }
    ]);
    this.addProperty(FanProperties.POWER_OFF_TIME, 2, 10, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 36000, 1]);
    this.addProperty(FanProperties.ANION, 2, 11, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.LED, 4, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FanProperties.ALARM, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.FAN_SPEED, 6, 8, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [1, 100, 1]);
    this.addProperty(FanProperties.COUNTRY_CODE, 6, 9, PropFormat.STRING, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);

    this.addProperty(FanProperties.RELATIVE_HUMIDITY, 7, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FanProperties.TEMPERATURE, 7, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(FanProperties.BATTERY_POWER, 6, 2, PropFormat.BOOL, PropAccess.READ_NOTIFY, PropUnit.NONE, null);
    this.addProperty(FanProperties.FAN_SPEED_RPM, 6, 4, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.RPM, [0, 3000, 1]);
    this.addProperty(FanProperties.AC_POWER, 6, 5, PropFormat.BOOL, PropAccess.READ_NOTIFY, PropUnit.NONE, null);

    this.addProperty(FanProperties.HORIZONTAL_MOVE, 6, 3, PropFormat.STRING, PropAccess.WRITE, PropUnit.NONE, null);
    this.addProperty(FanProperties.LP_ENTER_SECOND, 6, 7, PropFormat.UINT32, PropAccess.WRITE, PropUnit.NONE, null);
  }

  initDeviceCapabilities() {
    this.addCapability(FanCapabilities.NATURAL_MODE, true);
    this.addCapability(FanCapabilities.BUILT_IN_BATTERY, true);
  }


  /*----------========== STATUS ==========----------*/

  isNaturalModeEnabled() {
    return this.getPropertyValue(FanProperties.MODE) === 0;
  }

  getLedBrightness() {
    return this.getPropertyValue(FanProperties.LED);
  }


  /*----------========== COMMANDS ==========----------*/

  async setNaturalModeEnabled(enabled) {
    let value = enabled ? 0 : 1;
    this.setPropertyValue(FanProperties.MODE, value);
  }

  async setLedBrightness(brightness) {
    this.setPropertyValue(FanProperties.LED, brightness);
  }


}

module.exports = ZhimiFanZa5;

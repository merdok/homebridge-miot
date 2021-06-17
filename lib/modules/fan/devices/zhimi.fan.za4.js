const FanDevice = require('../FanDevice.js');
const FanProperties = require('../FanProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:zhimi-za4:1


class ZhimiFanZa4 extends FanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(FanProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [1, 4, 1]);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 120, 1]);
    this.addProperty(FanProperties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Straight Wind"
      },
      {
        "value": 1,
        "description": "Natural Wind"
      }
    ]);
    this.addProperty(FanProperties.ALARM, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.LED, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FanProperties.CHILD_LOCK, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  straightWindModeValue() {
    return 0;
  }

  naturalModeValue() {
    return 1;
  }

  hasBuiltInBattery() {
    return true;
  }

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = ZhimiFanZa4;

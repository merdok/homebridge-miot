const FreshAirSystemDevice = require('../FreshAirSystemDevice.js');
const FreshAirSystemCapabilities = require('../FreshAirSystemCapabilities.js');
const FreshAirSystemProperties = require('../FreshAirSystemProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fresh:0000A012:zhimi-ua1:1


class ZhimiAirfreshUa1 extends FreshAirSystemDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(FreshAirSystemProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.FAN_LEVEL, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(FreshAirSystemProperties.HEATER, 2, 6, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(FreshAirSystemProperties.LED, 7, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);

    // READ ONLY
    this.addProperty(FreshAirSystemProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No Faults"
    }]);
    this.addProperty(FreshAirSystemProperties.FILTER_USED_TIME, 4, 1, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 9999999, 1]);
    this.addProperty(FreshAirSystemProperties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(FreshAirSystemProperties.MOTOR_A_SPEED_RPM, 8, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.RPM, [0, 65535, 1]);
    this.addProperty(FreshAirSystemProperties.MOTOR_B_SPEED_RPM, 8, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.RPM, [0, 65535, 1]);
    this.addProperty(FreshAirSystemProperties.TEMPERATURE, 8, 5, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-40, 125, 0.01]);
  }

  initDeviceActions() {
    this.addAction(Actions.RESET_FILTER_LIFE, 4, 1, []);
  }

  initDeviceCapabilities() {
    this.addCapability(FreshAirSystemCapabilities.EMULATE_STEPLESS_FAN_CONTROL, true);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirfreshUa1;

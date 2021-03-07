const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-nb1:1


class ZhimiHeaterZa2 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/
  HEAT_LEVEL
  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 2, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.HEAT_LEVEL, 2, 3, 'uint8', ['read', 'write', 'notify']);  // high and low? add buttons for that like fan buttons?
    this.addProperty(HeaterProperties.MODE, 2, 4, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, 'float', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 4, 1, 'uint32', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.CHILD_LOCK, 7, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.LED, 6, 1, 'uint8', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.ALARM, 3, 1, 'bool', ['read', 'write', 'notify']);
    this.addProperty(HeaterProperties.COUNTRY_CODE, 8, 4, 'int32', ['read', 'write', 'notify']);

    this.addProperty(HeaterProperties.TEMPERATURE, 9, 7, 'float', ['read', 'notify']);
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.FAN_SWING_MODE_VALUE, 1);
    this.addCapability(HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE, 0);
    this.addCapability(HeaterCapabilities.TARGET_TEMPERATURE_RANGE, [16, 30, 1]);
    this.addCapability(HeaterCapabilities.POWER_OFF_TIMER_UNIT, Constants.TIME_UNIT_HOURS);
    this.addCapability(HeaterCapabilities.POWER_OFF_TIMER_RANGE, [0, 12, 1]);
    this.addCapability(HeaterCapabilities.USE_TIME_UNIT, Constants.TIME_UNIT_SECONDS);
    this.addCapability(HeaterCapabilities.LED_CONTROL_RANGE, [0, 2, 1]);
    this.addCapability(HeaterCapabilities.HEAT_LEVELS, [{
        "value": 1,
        "description": "High"
      },
      {
        "value": 2,
        "description": "Low"
      }
    ]);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterZa2;

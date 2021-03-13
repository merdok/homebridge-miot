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
  
  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 2, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.HEAT_LEVEL, 2, 3, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null); // high and low? add buttons for that like fan buttons?
    this.addProperty(HeaterProperties.MODE, 2, 4, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, Constants.PROP_FORMAT_FLOAT, ['read', 'write', 'notify'], Constants.PROP_UNIT_CELSIUS, [16, 30, 1]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 4, 1, Constants.PROP_FORMAT_UINT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_HOURS, [0, 12, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 7, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.LED, 6, 1, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1]);
    this.addProperty(HeaterProperties.ALARM, 3, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.COUNTRY_CODE, 8, 4, Constants.PROP_FORMAT_INT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(HeaterProperties.TEMPERATURE, 9, 7, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-30, 100, 0.1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.FAN_SWING_MODE_VALUE, 1);
    this.addCapability(HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE, 0);
    this.addCapability(HeaterCapabilities.TARGET_TEMPERATURE_RANGE, [16, 30, 1]);
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

const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma3:1


class ZhimiHeaterMa3 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, Constants.PROP_FORMAT_FLOAT, ['read', 'write', 'notify'], Constants.PROP_UNIT_CELSIUS, [16, 28, 1]);
    this.addProperty(HeaterProperties.MODE, 2, 6, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, Constants.PROP_FORMAT_UINT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 43200, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.LED, 7, 3, Constants.PROP_FORMAT_UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1]);
    this.addProperty(HeaterProperties.ALARM, 6, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, Constants.PROP_FORMAT_FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, Constants.PROP_FORMAT_UINT32, ['read', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 2147483647, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.TARGET_TEMPERATURE_RANGE, [16, 28, 1]);
    this.addCapability(HeaterCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(HeaterCapabilities.HEAT_MODE_VALUE, 2);
    this.addCapability(HeaterCapabilities.COOL_MODE_VALUE, 1);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterMa3;

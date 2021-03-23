const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-za2:1


class ZhimiHeaterZa2 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 2, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 6, PropFormat.FLOAT, ['read', 'write', 'notify'], Constants.PROP_UNIT_CELSIUS, [16, 28, 1]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 4, 1, PropFormat.UINT32, ['read', 'write', 'notify'], Constants.PROP_UNIT_HOURS, [0, 8, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 7, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(HeaterProperties.LED, 6, 1, PropFormat.UINT8, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, [0, 2, 1]);
    this.addProperty(HeaterProperties.ALARM, 3, 1, PropFormat.BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);

    this.addProperty(HeaterProperties.RELATIVE_HUMIDITY, 5, 7, PropFormat.UINT8, ['read', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [0, 100, 1]);
    this.addProperty(HeaterProperties.TEMPERATURE, 5, 8, PropFormat.FLOAT, ['read', 'notify'], Constants.PROP_UNIT_CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 7, PropFormat.UINT32, ['read', 'notify'], Constants.PROP_UNIT_SECONDS, [0, 4294967295, 1]);
  }

  initDeviceCapabilities() {
    // nothing special
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterZa2;

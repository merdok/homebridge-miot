const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma3:1


class ZhimiHeaterMa3 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, ['read', 'write', 'notify'], PropUnit.CELSIUS, [16, 28, 1]);
    this.addProperty(HeaterProperties.MODE, 2, 6, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, null, [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "LL Mode"
      },
      {
        "value": 2,
        "description": "HH Mode"
      }
    ]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, PropFormat.UINT32, ['read', 'write', 'notify'], PropUnit.SECONDS, [0, 43200, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);
    this.addProperty(HeaterProperties.LED, 7, 3, PropFormat.UINT8, ['read', 'write', 'notify'], PropUnit.NONE, [0, 2, 1], [{ // same here to remove the value range since it does not have any!!!
        "value": 0,
        "description": "Bright"
      },
      {
        "value": 1,
        "description": "Dark"
      },
      {
        "value": 2,
        "description": "Extinguished"
      }
    ]);
    this.addProperty(HeaterProperties.ALARM, 6, 1, PropFormat.BOOL, ['read', 'write', 'notify'], PropUnit.NONE, null);

    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, PropFormat.FLOAT, ['read', 'notify'], PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, PropFormat.UINT32, ['read', 'notify'], PropUnit.SECONDS, [0, 2147483647, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(HeaterCapabilities.HEAT_MODE_VALUE, 2);
    this.addCapability(HeaterCapabilities.COOL_MODE_VALUE, 1);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterMa3;

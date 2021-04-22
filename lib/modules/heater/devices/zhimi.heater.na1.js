const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-na1:1


class ZhimiHeaterNa1 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(HeaterProperties.POWER, 2, 2, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.HEAT_LEVEL, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "High"
      },
      {
        "value": 2,
        "description": "Low"
      }
    ]);
    this.addProperty(HeaterProperties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Fan not swing"
      },
      {
        "value": 1,
        "description": "Fan swing"
      }
    ]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 4, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.HOURS, [0, 12, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.LED, 6, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 2, 1]);
    this.addProperty(HeaterProperties.ALARM, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(HeaterProperties.DEVICE_FAULT, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
      "value": 0,
      "description": "No faults"
    }]);
  }

  initDeviceActions() {
    // nothing special
  }

  initDeviceCapabilities() {
    this.addCapability(HeaterCapabilities.FAN_SWING_MODE_VALUE, 1);
    this.addCapability(HeaterCapabilities.FAN_NOT_SWING_MODE_VALUE, 0);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterNa1;

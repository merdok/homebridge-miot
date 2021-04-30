const HeaterDevice = require('../HeaterDevice.js');
const HeaterProperties = require('../HeaterProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma3:1


class ZhimiHeaterMa3 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(HeaterProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [16, 28, 1]);
    this.addProperty(HeaterProperties.MODE, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 43200, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.LED, 7, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(HeaterProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 2147483647, 1]);
    this.addProperty(HeaterProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Error"
      },
      {
        "value": 1,
        "description": "NTC  Connect Error"
      },
      {
        "value": 2,
        "description": "High Temperature Alarm"
      },
      {
        "value": 3,
        "description": "EEPROM Error"
      },
      {
        "value": 4,
        "description": "Multi Errors"
      }
    ]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE_POWER, 8, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ZhimiHeaterMa3;

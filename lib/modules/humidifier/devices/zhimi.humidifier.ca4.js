const HumidifierDevice = require('../HumidifierDevice.js');
const HumidifierCapabilities = require('../HumidifierCapabilities.js');
const HumidifierProperties = require('../HumidifierProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:zhimi-ca4:1

class ZhimiHumidifierCa4 extends HumidifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HumidifierProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HumidifierProperties.FAN_LEVEL, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Auto"
      },
      {
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
    this.addProperty(HumidifierProperties.TARGET_HUMIDITY, 2, 6, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [30, 80, 1]);
    this.addProperty(HumidifierProperties.DRY_MODE, 2, 8, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HumidifierProperties.CHILD_LOCK, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HumidifierProperties.SCREEN, 5, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Dark"
      },
      {
        "value": 1,
        "description": "Glimmer"
      },
      {
        "value": 2,
        "description": "Brightest"
      }
    ]);
    this.addProperty(HumidifierProperties.ALARM, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HumidifierProperties.FAN_SPEED, 2, 11, PropFormat.INT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.RPM, [200, 2000, 10]);

    this.addProperty(HumidifierProperties.WATER_LEVEL, 2, 7, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 128, 1]);
    this.addProperty(HumidifierProperties.RELATIVE_HUMIDITY, 3, 9, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(HumidifierProperties.TEMPERATURE, 3, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-40, 125, 0.1]);
    this.addProperty(HumidifierProperties.TEMPERATURE_FAHRENHEIT, 3, 8, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.FAHRENHEIT, [-40, 257, 0.1]);
    this.addProperty(HumidifierProperties.ACTUAL_SPEED, 7, 1, PropFormat.UINT32, PropAccess.READ, PropUnit.RPM, [0, 2000, 1]);
    this.addProperty(HumidifierProperties.USE_TIME, 2, 9, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 2147483600, 1]);
    this.addProperty(HumidifierProperties.POWER_TIME, 7, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 4294967295, 1]);
  }

  initDeviceCapabilities() {
    //none
  }


  /*----------========== STATUS ==========----------*/

  getPowerTime() {
    let powerTime = this.getPropertyValue(HumidifierProperties.POWER_TIME); // convert seconds to minutes
    powerTime = powerTime / 60;
    return powerTime;
  }


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHumidifierCa4;

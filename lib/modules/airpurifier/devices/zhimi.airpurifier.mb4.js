const AirPurifierDevice = require('../AirPurifierDevice.js');
const AirPurifierCapabilities = require('../AirPurifierCapabilities.js');
const AirPurifierProperties = require('../AirPurifierProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-mb4:2


class ZhimiAirPurifierMb4 extends AirPurifierDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(AirPurifierProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(AirPurifierProperties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null, [{
        "value": 0,
        "description": "Auto"
      },
      {
        "value": 1,
        "description": "Sleep"
      },
      {
        "value": 2,
        "description": "Favorite"
      }
    ]);
    this.addProperty(AirPurifierProperties.FAVORITE_SPEED, 9, 3, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.RPM, [300, 2200, 1]);
    this.addProperty(AirPurifierProperties.CHILD_LOCK, 8, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(AirPurifierProperties.LED, 7, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 8, 1]);
    this.addProperty(AirPurifierProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);

    this.addProperty(AirPurifierProperties.PM25_DENSITY, 3, 4, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 600, 1]);
    this.addProperty(AirPurifierProperties.FILTER_LIFE_LEVEL, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(AirPurifierProperties.FILTER_USED_TIME, 4, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.HOURS, [0, 65000, 1]);
    this.addProperty(AirPurifierProperties.FAN_SPEED_RPM, 9, 1, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.RPM, [0, 65535, 1]);
  }

  initDeviceCapabilities() {
    this.addCapability(AirPurifierCapabilities.AUTO_MODE_VALUE, 0);
    this.addCapability(AirPurifierCapabilities.SLEEP_MODE_VALUE, 1);
    this.addCapability(AirPurifierCapabilities.FAVORITE_MODE_VALUE, 2);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiAirPurifierMb4;

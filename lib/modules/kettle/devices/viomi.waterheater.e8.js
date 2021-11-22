const KettleDevice = require('../KettleDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ViomiWaterheaterE8 extends KettleDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "viomi.waterheater.e8";
  }

  getDeviceName() {
    return "Viomi Water Heater";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:water-heater:0000A02A:viomi-e8:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 1, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [30, 75, 1]);
    this.addProperty(Properties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Normal"
      },
      {
        "value": 1,
        "description": "Heat"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 2, 3, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 255, 1]);
    this.addProperty(Properties.POWER, 2, 6, PropFormat.BOOL, PropAccess.READ_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.STATUS, 2, 7, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Closed"
      },
      {
        "value": 1,
        "description": "Heat"
      },
      {
        "value": 2,
        "description": "Keep"
      }
    ]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/

  statusHeatingValue() {
    return 1;
  }

  statusClosedValue() {
    return 0;
  }

  statusKeepValue() {
    return 2;
  }


}

module.exports = ViomiWaterheaterE8;

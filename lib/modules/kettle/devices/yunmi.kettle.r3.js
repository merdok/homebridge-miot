const KettleDevice = require('../KettleDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YunmiKettleR3 extends KettleDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "yunmi.kettle.r3";
  }

  getDeviceName() {
    return "Yunmi Kettle";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:kettle:0000A009:yunmi-r3:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 2, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [40, 90, 1]);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 2, 1, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 100, 1]);
    this.addProperty(Properties.MODE, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Common"
      },
      {
        "value": 1,
        "description": "Warm Water"
      },
      {
        "value": 2,
        "description": "Boiled Water"
      },
      {
        "value": 3,
        "description": "None"
      }
    ]);
    this.addProperty(Properties.TDS_SENSOR, 3, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.PPM, [0, 1000, 1]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = YunmiKettleR3;

const OutletDevice = require('../OutletDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp1m extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "cuco.plug.cp1m";
  }

  getDeviceName() {
    return "Gosund Smart Plug CP1-AM";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp1m:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.CHILD_LOCK, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.OFF_MEMORY, 7, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "On"
      },
      {
        "value": 1,
        "description": "Off"
      },
      {
        "value": 2,
        "description": "Memory"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.POWER_CONSUMPTION, 2, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
    this.addProperty(Properties.VOLTAGE, 2, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.VOLT, [0, 3000, 1]);
    this.addProperty(Properties.ELECTRIC_CURRENT, 2, 4, PropFormat.UINT16, PropAccess.READ, PropUnit.AMPERE, [0, 65535, 1]);
    this.addProperty(Properties.USE_TIME, 3, 3, PropFormat.UINT16, PropAccess.READ, PropUnit.READ_NOTIFY, [0, 100, 1]);
    this.addProperty(Properties.ELECTRIC_POWER, 4, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = CucoPlugCp1m;

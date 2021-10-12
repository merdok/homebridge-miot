const OutletDevice = require('../OutletDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp2a extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "cuco.plug.cp2a";
  }

  getDeviceName() {
    return "Gosund CP2-AM ";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp2a:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.CHILD_LOCK, 2, 6, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.OUTLET_POWER1, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.OUTLET_POWER2, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.OFF_MEMORY, 7, 2, PropFormat.INT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
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
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = CucoPlugCp2a;

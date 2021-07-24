const OutletDevice = require('../OutletDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp2 extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "cuco.plug.cp2";
  }

  getDeviceName() {
    return "Gosund Socket";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp2:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.POWER_OFF_TIME, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 1440, 1]);
    this.addProperty(Properties.LED, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(Properties.POWER_CONSUMPTION, 2, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
    this.addProperty(Properties.VOLTAGE, 2, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.VOLT, [0, 3000, 1]);
    this.addProperty(Properties.ELECTRIC_CURRENT, 2, 4, PropFormat.UINT16, PropAccess.READ, PropUnit.AMPERE, [0, 65535, 1]);
    this.addProperty(Properties.ELECTRIC_POWER, 3, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
    this.addProperty(Properties.OVERHEAT_ALARM, 3, 4, PropFormat.BOOL, PropAccess.READ_NOTIFY, PropUnit.NONE);

    // WRITE ONLY
    this.addProperty(Properties.REVERSE_LED, 3, 3, PropFormat.BOOL, PropAccess.WRITE, PropUnit.NONE);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE_POWER, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = CucoPlugCp2;

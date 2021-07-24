const OutletDevice = require('../OutletDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChuangmiPlug212a01 extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "chuangmi.plug.212a01";
  }

  getDeviceName() {
    return "Mi Smart Power Plug 2";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:chuangmi-212a01:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.POWER_OFF_TIME, 4, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 86500, 1]);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 2, 6, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 255, 1]);
    this.addProperty(Properties.WORKING_TIME, 2, 7, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 300, 1]);
    this.addProperty(Properties.POWER_CONSUMPTION, 5, 1, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535000, 1]);
    this.addProperty(Properties.ELECTRIC_CURRENT, 5, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.AMPERE, [0, 65535, 1]);
    this.addProperty(Properties.VOLTAGE, 5, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.VOLT, [0, 65535, 1]);
    this.addProperty(Properties.ELECTRIC_POWER, 5, 6, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 6553500, 1]);
    this.addProperty(Properties.SURGE_POWER, 5, 7, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65525, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ChuangmiPlug212a01;

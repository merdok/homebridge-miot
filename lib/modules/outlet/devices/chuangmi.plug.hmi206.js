const OutletDevice = require('../OutletDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChuangmiPlugHmi206 extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "chuangmi.plug.hmi206";
  }

  getDeviceName() {
    return "Xiaomi Smart Plug 3680w";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:chuangmi-hmi206:1";
  }

  requiresMiCloud() {
    return true;
  }

  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(Properties.TEMPERATURE, 2, 2, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 100, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ChuangmiPlugHmi206;

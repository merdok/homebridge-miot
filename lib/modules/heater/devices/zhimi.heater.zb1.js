const HeaterDevice = require('../HeaterDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterZb1 extends HeaterDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.heater.zb1";
  }

  getDeviceName() {
    return "Smartmi Smart Convector Heater 1S";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-zb1:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 2, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 6, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [16, 28, 1]);
    this.addProperty(Properties.POWER_OFF_TIME, 4, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.HOURS, [0, 8, 1]);
    this.addProperty(Properties.CHILD_LOCK, 7, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.LED, 6, 1, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 2, 1]);
    this.addProperty(Properties.ALARM, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.COUNTRY_CODE, 8, 8, PropFormat.INT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(Properties.RELATIVE_HUMIDITY, 5, 7, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.PERCENTAGE, [0, 100, 1]);
    this.addProperty(Properties.TEMPERATURE, 5, 8, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(Properties.USE_TIME, 8, 7, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 4294967295, 1]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 4294967295, 1]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ZhimiHeaterZb1;

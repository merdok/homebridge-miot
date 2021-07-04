const HeaterDevice = require('../HeaterDevice.js');
const HeaterProperties = require('../HeaterProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHeaterMc2 extends HeaterDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.heater.mc2";
  }

  getDeviceName() {
    return "Xiaomi Mi Smart Space Heater S CN";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-mc2:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(HeaterProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [18, 28, 1]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.HOURS, [0, 12, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.LED, 7, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 1, 1]);
    this.addProperty(HeaterProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 2147483647, 1]);
    this.addProperty(HeaterProperties.COUNTRY_CODE, 8, 10, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.NONE);
    this.addProperty(HeaterProperties.DEVICE_FAULT, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 255, 1]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ZhimiHeaterMc2;

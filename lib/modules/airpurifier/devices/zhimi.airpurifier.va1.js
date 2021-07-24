const ZhimiAirPurifierVb2 = require('./zhimi.airpurifier.vb2.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiAirPurifierVa1 extends ZhimiAirPurifierVb2 {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "zhimi.airpurifier.va1";
  }

  getDeviceName() {
    return "Xiaomi Mi Air Purifier Pro H CN";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:zhimi-va1:2";
  }


  /*----------========== INIT ==========----------*/


  /*----------========== CONFIG ==========----------*/


}

module.exports = ZhimiAirPurifierVa1;

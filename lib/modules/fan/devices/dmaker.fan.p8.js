const DmakerFan1C = require('./dmaker.fan.1c.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFanP8 extends DmakerFan1C {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "dmaker.fan.p8";
  }

  getDeviceName() {
    return "Mi Smart Standing Fan 1C CN";
  }

  getDeviceMiotSpec() {
    return "http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p8:1";
  }


  /*----------========== INIT ==========----------*/


  /*----------========== CONFIG ==========----------*/


}

module.exports = DmakerFanP8;

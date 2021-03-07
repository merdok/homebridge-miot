const DmakerFanP10 = require('./dmaker.fan.p10.js');
const FanCapabilities = require('../FanCapabilities.js');
const FanProperties = require('../FanProperties.js');
const Constants = require('../../../constants/Constants.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-p11:1


class DmakerFanP11 extends DmakerFanP10 {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(FanProperties.POWER, 2, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_LEVEL, 2, 2, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING, 2, 4, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.HORIZONTAL_SWING_ANGLE, 2, 5, 'uint16', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.MODE, 2, 3, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.POWER_OFF_TIME, 3, 1, 'uint16', ['read', 'write', 'notify'], Constants.PROP_UNIT_MINUTES, [0, 480, 1]);
    this.addProperty(FanProperties.CHILD_LOCK, 7, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.LED, 4, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.ALARM, 5, 1, 'bool', ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
    this.addProperty(FanProperties.FAN_SPEED, 2, 6, 'uint8', ['read', 'write', 'notify'], Constants.PROP_UNIT_PERCENTAGE, [1, 100, 1]); // this has actaully only read and notify in the spec, but writes works anyway, why?

    this.addProperty(FanProperties.HORIZONTAL_MOVE, 6, 1, 'uint8', ['write']);
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = DmakerFanP11;

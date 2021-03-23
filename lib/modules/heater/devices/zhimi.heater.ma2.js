const HeaterDevice = require('../HeaterDevice.js');
const HeaterCapabilities = require('../HeaterCapabilities.js');
const HeaterProperties = require('../HeaterProperties.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// http://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:heater:0000A01A:zhimi-ma2:1


class ZhimiHeaterMa2 extends HeaterDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    this.addProperty(HeaterProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(HeaterProperties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [18, 28, 1]);
    this.addProperty(HeaterProperties.POWER_OFF_TIME, 3, 1, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.HOURS, [0, 12, 1]);
    this.addProperty(HeaterProperties.CHILD_LOCK, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);
    this.addProperty(HeaterProperties.LED, 7, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [0, 1, 1]);
    this.addProperty(HeaterProperties.ALARM, 6, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, null);

    this.addProperty(HeaterProperties.TEMPERATURE, 4, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 0.1]);
    this.addProperty(HeaterProperties.USE_TIME, 8, 9, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 2147483647, 1]);
  }

  initDeviceCapabilities() {
    // nothing special
  }


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


}

module.exports = ZhimiHeaterMa2;

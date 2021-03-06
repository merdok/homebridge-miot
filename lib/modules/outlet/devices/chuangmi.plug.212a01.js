const OutletDevice = require('../OutletDevice.js');
const OutletProperties = require('../OutletProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:chuangmi-212a01:2


class ChuangmiPlug212a01 extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(OutletProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(OutletProperties.LED, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(OutletProperties.POWER_OFF_TIME, 4, 3, PropFormat.UINT32, PropAccess.READ_WRITE_NOTIFY, PropUnit.SECONDS, [0, 86500, 1]);

    // READ ONLY
    this.addProperty(OutletProperties.TEMPERATURE, 2, 6, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 255, 1]);
    this.addProperty(OutletProperties.WORKING_TIME, 2, 7, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.MINUTES, [0, 300, 1]);
    this.addProperty(OutletProperties.POWER_CONSUMPTION, 5, 1, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535000, 1]);
    this.addProperty(OutletProperties.ELECTRIC_CURRENT, 5, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.AMPERE, [0, 65535, 1]);
    this.addProperty(OutletProperties.VOLTAGE, 5, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.VOLT, [0, 65535, 1]);
    this.addProperty(OutletProperties.ELECTRIC_POWER, 5, 6, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 6553500, 1]);
    this.addProperty(OutletProperties.SURGE_POWER, 5, 7, PropFormat.UINT32, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65525, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = ChuangmiPlug212a01;

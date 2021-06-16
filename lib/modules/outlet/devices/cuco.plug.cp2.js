const OutletDevice = require('../OutletDevice.js');
const OutletProperties = require('../OutletProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp2:2


class CucoPlugCp2 extends OutletDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(OutletProperties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(OutletProperties.POWER_OFF_TIME, 2, 5, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [0, 1440, 1]);
    this.addProperty(OutletProperties.LED, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // READ ONLY
    this.addProperty(OutletProperties.POWER_CONSUMPTION, 2, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
    this.addProperty(OutletProperties.VOLTAGE, 2, 3, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.VOLT, [0, 3000, 1]);
    this.addProperty(OutletProperties.ELECTRIC_CURRENT, 2, 4, PropFormat.UINT16, PropAccess.READ, PropUnit.AMPERE, [0, 65535, 1]);
    this.addProperty(OutletProperties.ELECTRIC_POWER, 3, 2, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.WATT, [0, 65535, 1]);
    this.addProperty(OutletProperties.OVERHEAT_ALARM, 3, 4, PropFormat.BOOL, PropAccess.READ_NOTIFY, PropUnit.NONE);

    // WRITE ONLY
    this.addProperty(OutletProperties.REVERSE_LED, 3, 3, PropFormat.BOOL, PropAccess.WRITE, PropUnit.NONE);
  }

  initDeviceActions() {
    this.addAction(Actions.TOGGLE_POWER, 2, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = CucoPlugCp2;

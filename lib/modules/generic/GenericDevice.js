const BaseDevice = require('../../base/BaseDevice.js');
const Capabilities = require('../../constants/Capabilities.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all

class GenericDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // most devices have the power control on 2,1 so use that for base devices
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
  }

  initDeviceCapabilities() {
    // nothing special yet
  }

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== CAPABILITIES ==========----------*/


  /*----------========== STATUS ==========----------*/


  /*----------========== COMMANDS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = GenericDevice;

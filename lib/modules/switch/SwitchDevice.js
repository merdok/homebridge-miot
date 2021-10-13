const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class SwitchDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.SWITCH;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // switch power 2
  supportsSwitchPower2Control() {
    return this.hasProperty(Properties.SWITCH_POWER2);
  }

  // switch mode 2
  supportsSwitchMode2Control() {
    return this.hasProperty(Properties.SWITCH_MODE2);
  }


  /*----------========== GETTERS ==========----------*/

  isSwitchPower2On() {
    return this.getPropertyValue(Properties.SWITCH_POWER2);
  }

  getSwitchMode2() {
    return this.getPropertyValue(Properties.SWITCH_MODE2);
  }

  /*----------========== SETTERS ==========----------*/

  async setSwitchPower2On(power) {
    this.setPropertyValue(Properties.SWITCH_POWER2, power);
  }

  async setSwitchMode2(mode) {
    this.setPropertyValue(Properties.SWITCH_MODE2, mode);
  }



  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = SwitchDevice;

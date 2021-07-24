const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class DehumidifierDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.DEHUMIDIFIER;
  }


  /*----------========== CONFIG ==========----------*/

  targetHumidityMinVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[0];
    }
    return 0;
  }

  targetHumidityMaxVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[1];
    }
    return 100;
  }

  targetHumidityStepVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[2];
    }
    return 1;
  }


  /*----------========== FEATURES ==========----------*/

  // target humidity
  supportsTargetHumidity() {
    return this.hasProperty(Properties.TARGET_HUMIDITY);
  }

  targetHumidityRange() {
    return this.getPropertyValueRange(Properties.TARGET_HUMIDITY);
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getSafePropertyValue(Properties.TARGET_HUMIDITY);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(targetHumidity) {
    this.setPropertyValue(Properties.TARGET_HUMIDITY, targetHumidity);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isDehumidifying() {
    return this.isPowerOn();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = DehumidifierDevice;

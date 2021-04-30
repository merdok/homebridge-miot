const BaseDevice = require('../../base/BaseDevice.js');
const DehumidifierProperties = require('./DehumidifierProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class DehumidifierDevice extends BaseDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
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
    return this.hasProperty(DehumidifierProperties.TARGET_HUMIDITY);
  }

  targetHumidityRange() {
    return this.getPropertyValueRange(DehumidifierProperties.TARGET_HUMIDITY);
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getSafePropertyValue(DehumidifierProperties.TARGET_HUMIDITY);
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(targetHumidity) {
    this.setPropertyValue(DehumidifierProperties.TARGET_HUMIDITY, targetHumidity);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isDehumidifying() {
    return this.isPowerOn();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = DehumidifierDevice;

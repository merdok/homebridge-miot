const BaseDevice = require('../../base/BaseDevice.js');
const OvenProperties = require('./OvenProperties.js');
const Actions = require('../../constants/Actions.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class OvenDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.OVEN;
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return -1;
  }

  statusBusyValue() {
    return -1;
  }

  statusDelayValue() {
    return -1;
  }

  statusFaultValue() {
    return -1;
  }

  statusPausedValue() {
    return -1;
  }

  statusCompletedValue() {
    return -1;
  }


  /*----------========== FEATURES ==========----------*/

  // heat level reporting
  supportsHeatLevelsReporting() {
    return this.hasProperty(OvenProperties.HEAT_LEVEL);
  }

  // left time
  supportsLeftTimeReporting() {
    return this.hasProperty(OvenProperties.LEFT_TIME);
  }


  /*----------========== GETTERS ==========----------*/

  getHeatLevel() {
    return this.getPropertyValue(OvenProperties.HEAT_LEVEL);
  }

  getLeftTime() {
    return this.getPropertyValue(OvenProperties.LEFT_TIME);
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusBusy() {
    return this.getStatus() === this.statusBusyValue();
  }

  isStatusDelay() {
    return this.getStatus() === this.statusDelayValue();
  }

  isStatusFault() {
    return this.getStatus() === this.statusFaultValue();
  }

  isStatusPaused() {
    return this.getStatus() === this.statusPausedValue();
  }

  isStatusCompleted() {
    return this.getStatus() === this.statusCompletedValue();
  }

  async setCookingActive(active) {
    if (active) {
      this.fireAction(Actions.START_COOK);
    } else {
      this.fireAction(Actions.CANCEL_COOKING);
    }
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = OvenDevice;

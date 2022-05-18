const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class CookerDevice extends GenericDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.COOKER;
  }

  getDeviceName() {
    return 'Unknown cooker device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['cooker:status', 'cooker:cook-mode'];
  }


  /*----------========== VALUES ==========----------*/

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusRunningValue() {
    return this.getValueForStatus('Running');
  }

  statusKeepWarmValue() {
    return this.getValueForStatus('Keep Warm');
  }

  statusCookReservationValue() {
    return this.getValueForStatus('Cook Reservation');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('cooker:status');
  }

  modeProp() {
    return this.getProperty('cooker:cook-mode');
  }


  /*----------========== ACTIONS ==========----------*/

  startCookAction() {
    return this.getAction('cooker:start-cook');
  }

  cancelCookingAction() {
    return this.getAction('cooker:cancel-cooking');
  }


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  async setCookActive(active) {
    if (active) {
      return this.fireAction(this.startCookAction());
    } else {
      return this.fireAction(this.cancelCookingAction());
    }
  }

  isCooking() {
    return this.isStatusRunning();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusRunning() {
    return this.getStatus() === this.statusRunningValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = CookerDevice;

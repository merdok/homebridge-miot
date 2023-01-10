const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class VideoDoorbellDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.VIDEO_DOORBELL;
  }

  getDeviceName() {
    return 'Unknown video doorbell device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['video-doorbell:status', 'madv-doorbell:motion-detection'];
  }


  /*----------========== VALUES ==========----------*/

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusBusyValue() {
    return this.getValueForStatus('Busy');
  }

  /*----------========== PROPERTIES ==========----------*/

  //overrides
  statusProp() {
    return this.getProperty('video-doorbell:status');
  }

  //device specific
  motionDetectionProp() {
    return this.getProperty('madv-doorbell:motion-detection');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // current position
  supportsMotionDetection() {
    return !!this.motionDetectionProp();
  }


  /*----------========== GETTERS ==========----------*/

  isMotionDetection() {
    return this.getPropertyValue(this.motionDetectionProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusBusy() {
    return this.getStatus() === this.statusBusyValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = VideoDoorbellDevice;

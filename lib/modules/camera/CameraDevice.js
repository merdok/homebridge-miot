const BaseDevice = require('../../base/BaseDevice.js');
const Properties = require('../../constants/Properties.js');
const Actions = require('../../constants/Actions.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class CameraDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // log the storage total space when supported
    if (this.supportsStorageTotalSpaceReporting()) {
      this.logger.info(`Storage total space: ${this.getStorageTotalSpace()}MB.`);
    }
    // log the storage free space when supported
    if (this.supportsStorageFreeSpaceReporting()) {
      this.logger.info(`Storage free space: ${this.getStorageFreeSpace()}MB.`);
    }
    // log the storage used space when supported
    if (this.supportsStorageUsedSpaceReporting()) {
      this.logger.info(`Storage used space: ${this.getStorageUsedSpace()}MB.`);
    }
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.CAMERA;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // night shot
  supportsNightShot() {
    return this.hasProperty(Properties.NIGHT_SHOT);
  }

  // time watermark
  supportsTimeWatermark() {
    return this.hasProperty(Properties.TIME_WATERMARK);
  }

  // recording mode
  supportsRecordingMode() {
    return this.hasProperty(Properties.RECORDING_MODE);
  }

  // motion detection
  supportsMotionDetection() {
    return this.hasProperty(Properties.MOTION_DETECTION);
  }

  // motion detection alarm interval
  supportsMotionDetectionAlarmInterval() {
    return this.hasProperty(Properties.MOTION_DETECTION_ALARM_INTERVAL);
  }

  // motion detection sensivity
  supportsMotionDetectionSensivity() {
    return this.hasProperty(Properties.MOTION_DETECTION_SENSIVITY);
  }

  // sd card
  supportsStorageTotalSpaceReporting() {
    return this.hasProperty(Properties.STORAGE_TOTAL_SPACE);
  }

  supportsStorageFreeSpaceReporting() {
    return this.hasProperty(Properties.STORAGE_FREE_SPACE);
  }

  supportsStorageUsedSpaceReporting() {
    return this.hasProperty(Properties.STORAGE_USED_SPACE);
  }


  /*----------========== GETTERS ==========----------*/

  getNightShot() {
    return this.getPropertyValue(Properties.NIGHT_SHOT);
  }

  isTimeWatermarkEnabled() {
    return this.getPropertyValue(Properties.TIME_WATERMARK);
  }

  getRecordingMode() {
    return this.getPropertyValue(Properties.RECORDING_MODE);
  }

  isMotionDetectionEnabled() {
    return this.getPropertyValue(Properties.MOTION_DETECTION);
  }

  getMotionDetectionAlarmInterval() {
    return this.getPropertyValue(Properties.MOTION_DETECTION_ALARM_INTERVAL);
  }

  getMotionDetectionSensivity() {
    return this.getPropertyValue(Properties.MOTION_DETECTION_SENSIVITY);
  }

  getStorageTotalSpace() {
    return this.getPropertyValue(Properties.STORAGE_TOTAL_SPACE);
  }

  getStorageFreeSpace() {
    return this.getPropertyValue(Properties.STORAGE_FREE_SPACE);
  }

  getStorageUsedSpace() {
    return this.getPropertyValue(Properties.STORAGE_USED_SPACE);
  }


  /*----------========== SETTERS ==========----------*/

  async setNightShot(nightShot) {
    this.setPropertyValue(Properties.NIGHT_SHOT, nightShot);
  }

  async setTimeWatermarkEnabled(enabled) {
    this.setPropertyValue(Properties.TIME_WATERMARK, enabled);
  }

  async setRecordingMode(recordingMode) {
    this.setPropertyValue(Properties.RECORDING_MODE, recordingMode);
  }

  async setMotionDetectionEnabled(enabled) {
    this.setPropertyValue(Properties.MOTION_DETECTION, enabled);
  }

  async setMotionDetectionAlarmInterval(alarmInterval) {
    this.setPropertyValue(Properties.MOTION_DETECTION_ALARM_INTERVAL, alarmInterval);
  }

  async setMotionDetectionSensivity(sensivity) {
    this.setPropertyValue(Properties.MOTION_DETECTION_SENSIVITY, sensivity);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = CameraDevice;

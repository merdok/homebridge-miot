const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class CameraDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

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


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.CAMERA;
  }

  getDeviceName() {
    return 'Unknown camera device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['camera-control:on', 'indicator-light:on', 'memory-card-management:storage-total-space', 'memory-card-management:storage-free-space',
      'memory-card-management:storage-used-space'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('camera-control:on');
  }

  //device specific
  memoryCardStorageTotalSpaceProp() {
    return this.getProperty('memory-card-management:storage-total-space');
  }

  memoryCardStorageFreeSpaceProp() {
    return this.getProperty('memory-card-management:storage-free-space');
  }

  memoryCardStorageUsedSpaceProp() {
    return this.getProperty('memory-card-management:storage-used-space');
  }

  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // sd card
  supportsStorageTotalSpaceReporting() {
    return !!this.memoryCardStorageTotalSpaceProp();
  }

  supportsStorageFreeSpaceReporting() {
    return !!this.memoryCardStorageFreeSpaceProp();
  }

  supportsStorageUsedSpaceReporting() {
    return !!this.memoryCardStorageUsedSpaceProp();
  }


  /*----------========== GETTERS ==========----------*/

  getStorageTotalSpace() {
    return this.getPropertyValue(this.memoryCardStorageTotalSpaceProp());
  }

  getStorageFreeSpace() {
    return this.getPropertyValue(this.memoryCardStorageFreeSpaceProp());
  }

  getStorageUsedSpace() {
    return this.getPropertyValue(this.memoryCardStorageUsedSpaceProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = CameraDevice;

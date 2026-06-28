const fs = require('fs').promises;
const path = require('path');
const MiotDevice = require('./lib/protocol/MiotDevice.js');
const DeviceFactory = require('./lib/factories/DeviceFactory.js');
const DevTypes = require('./lib/constants/DevTypes.js');
const Constants = require('./lib/constants/Constants.js');
const Logger = require('./lib/utils/Logger.js');
const Events = require('./lib/constants/Events.js');

let Service, Characteristic, Homebridge, Accessory;

const PLUGIN_NAME = 'homebridge-miot';
const PLATFORM_NAME = 'miot';
const PLUGIN_VERSION = '1.8.7';
const MATTER_MODE_AUTO = 'auto';
const MATTER_MODE_HAP = 'hap';
const MATTER_MODE_MATTER = 'matter';
const MATTER_MODE_BOTH = 'both';
const MATTER_MODES = [MATTER_MODE_AUTO, MATTER_MODE_HAP, MATTER_MODE_MATTER, MATTER_MODE_BOTH];

function getMatterMode(config = {}, logger = null) {
  const mode = config.matterMode || MATTER_MODE_AUTO;
  if (MATTER_MODES.includes(mode)) {
    return mode;
  }
  if (logger && logger.warn) {
    logger.warn(`Unknown matterMode "${mode}". Falling back to "auto".`);
  }
  return MATTER_MODE_AUTO;
}

function looksLikeRobotCleaner(value = '') {
  value = String(value).toLowerCase();
  return value.includes('vacuum') || value.includes('robot cleaner');
}

function isMiCloudForcedForConfig(deviceConfig = {}, globalMiCloudConfig = {}) {
  const miCloudConfig = deviceConfig.micloud || {};
  return Object.hasOwn(miCloudConfig, 'forceMiCloud') ? !!miCloudConfig.forceMiCloud : !!(globalMiCloudConfig && globalMiCloudConfig.forceMiCloud);
}

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  Homebridge = homebridge;
  Accessory = homebridge.platformAccessory;
  homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, miotPlatform, true);
};


class miotDeviceController {
  constructor(log, config, globalmicloudconfig, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    this.logger = new Logger(log, config.name);

    // check if we have mandatory device info
    try {
      if (!config.ip) throw new Error(`'ip' is required but not defined for ${config.name}!`);
      if (!config.token) throw new Error(`'token' is required but not defined for ${config.name}!`);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`Failed to create platform device, missing mandatory information!`, CLASS_LOG_PREFIX);
      this.logger.error(`Please check your device config!`);
      return;
    }

    // configuration
    this.name = config.name;
    this.ip = config.ip;
    this.token = config.token;
    this.deviceId = config.deviceId;
    this.model = config.model;
    this.miCloudConfig = {};
    this.miCloudConfig.global = globalmicloudconfig;
    this.miCloudConfig.device = config.micloud;
    this.pollingInterval = config.pollingInterval || Constants.DEFAULT_POLLING_INTERVAL;
    if (this.pollingInterval < 500) {
      this.pollingInterval = this.pollingInterval * 1000; // if less then 500 then probably those are seconds so multiply by 1000 to convert to miliseconds
    }
    this.propertyChunkSize = config.propertyChunkSize;
    this.prefsDir = config.prefsDir || api.user.storagePath() + '/.xiaomiMiot/';
    this.isCustomAccessory = config.customAccessory;
    if (this.isCustomAccessory === undefined) {
      this.isCustomAccessory = false;
    }
    this.deepDebugLog = config.deepDebugLog;
    if (this.deepDebugLog === undefined) {
      this.deepDebugLog = false;
    }
    this.silentLog = config.silentLog;
    if (this.silentLog === undefined) {
      this.silentLog = false;
    }
    this.deviceEnabled = config.deviceEnabled;
    if (this.deviceEnabled === undefined) {
      this.deviceEnabled = true;
    }

    this.logger.info(`Got device configuration, initializing device with name: ${this.name}`);

    // set deep debug log
    this.logger.setDeepDebugLogEnabled(this.deepDebugLog);
    this.logger.setSilentLogEnabled(this.silentLog);

    // check if prefs directory ends with a /, if not then add it
    if (this.prefsDir.endsWith('/') === false) {
      this.prefsDir = this.prefsDir + '/';
    }

    // spec dir to store device specs
    this.specDir = this.prefsDir + 'spec/';

    // create device model info file name
    this.deviceInfoFile = this.prefsDir + 'info_' + this.ip.split('.').join('') + '_' + this.token;

    // create cached micloud session file name
    this.cachedMiCloudSessionFile = api.user.storagePath() + Constants.MICLOUD_SESSION_CACHE_LOCATION;
    this.miCloudConfig.cachedSessionFile = this.cachedMiCloudSessionFile;

    // generate uuid
    const uuidSeed = this.token + this.ip + (this.deviceId || '') + PLATFORM_NAME;
    this.UUID = Homebridge.hap.uuid.generate(uuidSeed);
    this.MatterUUID = Homebridge.hap.uuid.generate(uuidSeed + ':matter');

    // prepare variables
    this.miotDevice = undefined;
    this.device = undefined;
    this.cachedDeviceInfo = {};

    // restored cached accessory
    this.restoredCachedAccessory = null;
    this.restoredCachedMatterAccessory = null;
    this.matterModeWarningShown = false;
    this.robotCleanerMiCloudPolicyLogged = false;
  }


  /*----------========== SETUP ==========----------*/

  async setupController() {
    // check if the preferences directory exists, if not then create it
    await this._createDirIfNeeded(this.prefsDir);

    // check if the spec directory exists, if not then create it recursively
    await this._createDirIfNeeded(this.specDir);

    // first try to load cached device info
    await this._loadDeviceInfo();

    // afterwards try to load a cached micloud session
    await this._loadCachedMiCloudSession();

    //init the device and start the device discovery
    this._initMiotDevice();
  }

  async _initMiotDevice() {
    // if the user specified a model then use that, else try to get cached model
    let deviceId = this.deviceId || this.cachedDeviceInfo.deviceId;
    let model = this.model || this.cachedDeviceInfo.model;

    this.miotDevice = new MiotDevice(this.ip, this.token, deviceId, model, this.name, this.logger);
    this.miotDevice.setPollingInterval(this.pollingInterval);
    this.miotDevice.setMiCloudConfig(this.miCloudConfig);

    this.miotDevice.on(Events.MIOT_DEVICE_IDENTIFIED, async (miotDevice) => {
      // init the actual device
      this._initDevice(miotDevice).catch((err) => {
        this.logger.error(`Failed to initialize device ${this.name}: ${err.message}`);
      });
    });

    this.miotDevice.on(Events.MIOT_DEVICE_SPEC_FETCHED, (miotDevice) => {
      // save miot spec
      this._saveMiotSpec(miotDevice);
    });

    this.miotDevice.on(Events.MIOT_DEVICE_CONNECTED, (miotDevice) => {
      // save device information
      this._saveDeviceInfo(miotDevice);
    });

    this.miotDevice.identify();
  }

  async _initDevice(miotDevice) {
    if (!this.device) {
      this.logger.info('Initializing device!');
      this.device = await DeviceFactory.createDevice(miotDevice, this.specDir, this.name, this.isCustomAccessory, this.logger);
      if (this.device) {
        await this.device.initDevice(this.propertyChunkSize);
        if (this.device.getType() === DevTypes.UNKNOWN) {
          this.logger.warn(`Device not supported! Using a generic device with limited properties! Consider requesting device support!`);
        } else if (this.device.getType() === DevTypes.CUSTOM) {
          this.logger.info(`Successfully created a custom accessory device! It is a ${this.device.getDeviceName()}. Make sure to configure the properties and actions!`);
        } else {
          this.logger.info(`Successfully created a ${this.device.getType()} device! It is a ${this.device.getDeviceName()}.`);
        }
        this._applyRobotCleanerMatterConnectionPolicy();
        this._logRobotCleanerMiCloudPolicy();
        await this.prepareAccessoryAndStartPolling();
      } else {
        this.logger.warn(`Something went wrong during device creation! Initialization failed, cannot create device!`);
      }
    }
  }


  /*----------========== SETUP SERVICES ==========----------*/

  async prepareAccessoryAndStartPolling() {
    const exposure = this._getAccessoryExposure();
    let hasRegisteredAccessory = false;

    // first unregister a cached HAP accessory if present and HAP is enabled for this device.
    if (this.restoredCachedAccessory && exposure.hap) {
      this.logger.debug('Found cached accessory for this device! Unregistering it first!');
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.restoredCachedAccessory]);
      this.restoredCachedAccessory = null;
    }

    if (this.restoredCachedAccessory && !exposure.hap) {
      this.logger.info('Removing stale HAP accessory because this robot is configured for Matter.');
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.restoredCachedAccessory]);
      this.restoredCachedAccessory = null;
    }

    if (exposure.hap) {
      this.device.initDeviceAccessory(this.getAccessoryUuid(), this.config, this.api, this.cachedDeviceInfo);
    }

    if (exposure.hap && this.device.getAccessoryWrapper() && this.device.getAccessories().length > 0) {
      this.logger.info(`Registering ${this.device.getAccessories().length} accessories!`);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.device.getAccessories());
      hasRegisteredAccessory = true;
    }

    if (exposure.matter) {
      await this.device.initDeviceMatterAccessory(this.getMatterAccessoryUuid(), this.config, this.api, this.cachedDeviceInfo, this.restoredCachedMatterAccessory, {
        roomCacheFile: this._getMatterRoomCacheFile()
      });
      const matterWrapper = this.device.getMatterAccessoryWrapper();
      const matterAccessory = matterWrapper ? matterWrapper.getMatterAccessory() : null;
      if (matterAccessory) {
        if (this.restoredCachedMatterAccessory) {
          this.logger.info('Reattached cached Matter robot accessory.');
        } else {
          this.logger.info('Registering Matter robot accessory!');
          await this.api.matter.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [matterAccessory]);
        }
        hasRegisteredAccessory = true;
      }
    } else if (this.restoredCachedMatterAccessory && this.api.matter) {
      this.logger.info('Removing stale Matter accessory because this robot is configured for HAP or Matter is disabled.');
      await this.api.matter.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.restoredCachedMatterAccessory]);
      this.restoredCachedMatterAccessory = null;
    }

    if (hasRegisteredAccessory && this.deviceEnabled) {
      this.logger.info('Everything looks good! Initiating property polling!');
      this.miotDevice.startPropertyPolling();
    } else if (hasRegisteredAccessory) {
      this.logger.warn('Device disabled, property polling will not be initiated! Please enable the device in the config.');
    }
  }

  /*----------========== PUBLIC ==========----------*/

  getAccessoryUuid() {
    return this.UUID;
  }

  getMatterAccessoryUuid() {
    return this.MatterUUID;
  }

  setRestoredCachedAccessory(accessory) {
    this.restoredCachedAccessory = accessory;
  }

  setRestoredCachedMatterAccessory(accessory) {
    this.restoredCachedMatterAccessory = accessory;
  }


  /*----------========== HELPERS ==========----------*/

  _saveDeviceInfo(miotDevice) {
    if (miotDevice) {
      this.cachedDeviceInfo.model = miotDevice.getModel();
      this.cachedDeviceInfo.deviceId = miotDevice.getDeviceId();
      this.cachedDeviceInfo.firmwareRev = miotDevice.getFirmwareRevision();
      const deviceInfo = JSON.stringify(this.cachedDeviceInfo);
      fs.writeFile(this.deviceInfoFile, deviceInfo, 'utf8').then(() => {
        this.logger.debug('Successfully saved device info!');
      }).catch((err) => {
        this.logger.debug(`Could not write device info! Error: ${err}`);
      });
    }
  }

  async _loadDeviceInfo() {
    try {
      const deviceInfo = await fs.readFile(this.deviceInfoFile, 'utf8');
      if (deviceInfo) {
        this.cachedDeviceInfo = JSON.parse(deviceInfo);
        this.logger.debug(`Found cached device information: ${this.cachedDeviceInfo.model}`);
      }
    } catch (err) {
      this.logger.debug('No cached device info found!');
    }
  }

  async _loadCachedMiCloudSession() {
    try {
      const cachedSession = await fs.readFile(this.cachedMiCloudSessionFile, 'utf8');
      if (cachedSession) {
        this.miCloudConfig.cachedSession = JSON.parse(cachedSession);
        this.logger.debug(`Found cached MiCloud session from: ${this.miCloudConfig.cachedSession.loggedInAt}`);
      }
    } catch (err) {
      this.logger.debug('No cached MiCloud session found!');
    }
  }

  _saveMiotSpec(miotDevice) {
    if (miotDevice && miotDevice.getMiotSpec()) {
      let fileName = this.specDir + miotDevice.getModel() + '.spec.json';
      const miotSpec = JSON.stringify(miotDevice.getMiotSpec(), null, 2);
      fs.writeFile(fileName, miotSpec, 'utf8').then(() => {
        this.logger.debug('Successfully saved device miot spec!');
      }).catch((err) => {
        this.logger.debug(`Could not save device miot spec! Error: ${err}`);
      });
    }
  }

  _getAccessoryExposure() {
    if (!this.device || this.device.getType() !== DevTypes.ROBOT_CLEANER) {
      return { hap: true, matter: false };
    }

    const matterMode = this._getMatterMode();
    const matterReady = this._isMatterReady();
    const usesMiCloud = this._shouldUseMiCloudForRobotCleaner();
    const canExposeMatter = matterReady && !usesMiCloud;

    if (matterMode === MATTER_MODE_HAP) {
      return { hap: true, matter: false };
    }

    if (matterMode === MATTER_MODE_BOTH) {
      this._warnIfMatterUnavailable(matterMode, matterReady, usesMiCloud);
      return { hap: true, matter: canExposeMatter };
    }

    if (canExposeMatter) {
      return { hap: false, matter: true };
    }

    this._warnIfMatterUnavailable(matterMode, matterReady, usesMiCloud);
    return { hap: true, matter: false };
  }

  _getMatterMode() {
    return getMatterMode(this.config, this.logger);
  }

  _warnIfMatterUnavailable(matterMode, matterReady, usesMiCloud) {
    if (matterReady && !usesMiCloud) {
      return;
    }

    if (!matterReady && matterMode !== MATTER_MODE_AUTO) {
      this._warnMatterFallback(`Matter mode "${matterMode}" requested, but Homebridge Matter is unavailable or disabled. Falling back to the HAP robot switch.`);
    } else if (usesMiCloud && matterMode === MATTER_MODE_BOTH) {
      this._warnMatterFallback('Matter mode "both" requested, but this robot is configured to use MiCloud. Matter robot controls require local MIOT, so only the HAP accessory will be exposed.');
    } else if (usesMiCloud && matterMode === MATTER_MODE_MATTER) {
      this._warnMatterFallback('Matter mode "matter" requested, but this robot is configured to use MiCloud. Matter robot controls require local MIOT, so falling back to the HAP robot switch.');
    } else if (usesMiCloud && matterMode === MATTER_MODE_AUTO) {
      this._warnMatterFallback('Matter auto mode found Homebridge Matter enabled, but this robot is configured to use MiCloud. Exposing the HAP robot switch because Matter robot controls require local MIOT.');
    }
  }

  _isMatterReady() {
    return !!(this.api?.isMatterAvailable?.() && this.api?.isMatterEnabled?.() && this.api.matter);
  }

  _warnMatterFallback(message) {
    if (!this.matterModeWarningShown) {
      this.logger.warn(message);
      this.matterModeWarningShown = true;
    }
  }

  _getMatterRoomCacheFile() {
    return this.prefsDir + 'matter_rooms_' + this.ip.split('.').join('') + '_' + this.token + '.json';
  }

  _logRobotCleanerMiCloudPolicy() {
    if (!this._isRobotCleanerCandidate() || !this.miotDevice || this.robotCleanerMiCloudPolicyLogged) {
      return;
    }

    this.robotCleanerMiCloudPolicyLogged = true;
    if (this._shouldUseMiCloudForRobotCleaner()) {
      this.logger.info('Robot cleaner is configured to use MiCloud. HAP control can use MiCloud; Matter robot controls require a local MIOT connection.');
    } else {
      this.logger.info('Robot cleaner will use local MIOT. If local connection fails, use the plugin UI Matter setup to switch this robot to MiCloud/HAP.');
    }
  }

  _applyRobotCleanerMatterConnectionPolicy() {
    if (!this._shouldForceLocalRobotCleanerMatter()) {
      return;
    }

    const wasUsingMiCloud = this.miotDevice.shouldUseMiCloud();
    this.miotDevice.forceLocalConnection();
    if (wasUsingMiCloud) {
      this.logger.info('Robot cleaner Matter mode selected; using local MIOT instead of MiCloud because Matter robot controls require a local connection.');
    }
  }

  _shouldForceLocalRobotCleanerMatter() {
    const matterMode = this._getMatterMode();
    return this._isRobotCleanerCandidate() &&
      this._isMatterReady() &&
      (matterMode === MATTER_MODE_MATTER || matterMode === MATTER_MODE_BOTH);
  }

  _shouldUseMiCloudForRobotCleaner() {
    return this._isRobotCleanerCandidate() && this.miotDevice && this.miotDevice.shouldUseMiCloud();
  }

  _isRobotCleanerCandidate() {
    return (this.device && this.device.getType() === DevTypes.ROBOT_CLEANER) || looksLikeRobotCleaner(this.model || this.cachedDeviceInfo.model);
  }

  async _createDirIfNeeded(dir) {
    try {
      await fs.access(dir)
    } catch (err) {
      this.logger.debug(`Directory ${dir} is missing! Creating!`);
      await fs.mkdir(dir, {
        recursive: true
      });
    }
  }

}


/*----------========== PLATFORM STUFF ==========----------*/
class miotPlatform {
  constructor(log, config, api) {

    this.cachedAccessories = [];
    this.log = log;
    this.api = api;
    this.config = config;
    this.cachedMatterAccessories = [];

    if (this.api) {
      /*
       * When this event is fired, homebridge restored all cached accessories from disk and did call their respective
       * `configureAccessory` method for all of them. Dynamic Platform plugins should only register new accessories
       * after this event was fired, in order to ensure they weren't added to homebridge already.
       * This event can also be used to start discovery of new accessories.
       */
      this.api.on("didFinishLaunching", async () => {
        try {
          await this.initDevices();
        } catch (err) {
          this.log.error(`Failed to initialize devices: ${err.message}`);
        }
      });
    }

  }

  /*
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory) {
    this.log.debug(`Found cached accessory ${accessory.displayName}`);
    this.cachedAccessories.push(accessory);
  }

  configureMatterAccessory(accessory) {
    this.log.debug(`Found cached Matter accessory ${accessory.displayName}`);
    this.cachedMatterAccessories.push(accessory);
  }

  // ------------ CUSTOM METHODS ------------

  async initDevices() {
    this.log.info('Initializing devices');

    // read from config.devices
    if (this.config.devices && Array.isArray(this.config.devices)) {
      for (let deviceConfig of this.config.devices) {
        if (deviceConfig) {
          this.initDevice(deviceConfig);
        }
      }
    } else if (this.config.devices) {
      this.log.info(`The devices property is not of type array. Cannot initialize. Type: ${typeof this.config.devices}`);
    }

    if (!this.config.devices && !this.config.fans) {
      this.log.info('-------------------------------------------');
      this.log.info('No device configuration found');
      this.log.info('Missing devices in your platform config');
      this.log.info('-------------------------------------------');
    }

    await this.removeStaleExternalMatterAccessories();

    // remove all accessories which are still left over
    this.removeAccessories();
    await this.removeMatterAccessories();

  }

  initDevice(deviceConfig) {
    const newDevCtrl = new miotDeviceController(this.log, deviceConfig, this.config.micloud, this.api);
    const restoredAccessory = this.cachedAccessories.find(accessory => accessory.UUID === newDevCtrl.getAccessoryUuid());
    const restoredMatterAccessoryIndex = this.cachedMatterAccessories.findIndex(accessory => accessory.UUID === newDevCtrl.getMatterAccessoryUuid());
    const restoredMatterAccessory = restoredMatterAccessoryIndex > -1 ? this.cachedMatterAccessories[restoredMatterAccessoryIndex] : null;
    if (restoredAccessory) {
      newDevCtrl.setRestoredCachedAccessory(restoredAccessory);
      this.cachedAccessories = this.cachedAccessories.filter(item => item !== restoredAccessory); // remove the cached accessory from the list since the controller will remove it later.
    }
    if (restoredMatterAccessory) {
      newDevCtrl.setRestoredCachedMatterAccessory(restoredMatterAccessory);
      this.cachedMatterAccessories.splice(restoredMatterAccessoryIndex, 1);
    }
    newDevCtrl.setupController().catch((err) => {
      this.log.error(`Failed to setup device ${deviceConfig.name}: ${err.message}`);
    }); // begin the controller setup
  }

  removeAccessories() {
    if (this.cachedAccessories && this.cachedAccessories.length > 0) {
      // we don't have any special identifiers, we just remove all our accessories
      this.log.debug('Removing all cached accessories');
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.cachedAccessories);
      this.cachedAccessories = []; // clear out the array
    } else {
      this.log.debug('No accessories to remove!');
    }
  }

  removeAccessory(accessory) {
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.cachedAccessories = this.cachedAccessories.filter(item => item !== accessory);
  }

  async removeMatterAccessories() {
    if (!this.cachedMatterAccessories || this.cachedMatterAccessories.length === 0) {
      this.log.debug('No Matter accessories to remove!');
      return;
    }

    if (!this.api.matter) {
      this.log.warn(`Cannot remove ${this.cachedMatterAccessories.length} stale Matter accessor${this.cachedMatterAccessories.length === 1 ? 'y' : 'ies'} because Homebridge Matter is unavailable.`);
      return;
    }

    const accessories = this.cachedMatterAccessories;
    const names = accessories.map(accessory => `${accessory.displayName || 'Unnamed Matter accessory'} (${accessory.UUID})`).join(', ');
    this.log.info(`Removing ${accessories.length} stale Matter accessor${accessories.length === 1 ? 'y' : 'ies'} no longer present in config: ${names}`);
    try {
      await this.api.matter.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, accessories);
    } finally {
      this.cachedMatterAccessories = [];
    }
  }

  async removeStaleExternalMatterAccessories() {
    if (!this.api || !this.api.user || !this.api.user.storagePath) {
      return;
    }

    const matterPath = path.join(this.api.user.storagePath(), 'matter');
    const backupPath = path.join(this.api.user.storagePath(), '.miot_matter_stale');
    const expectedMatterUuids = this._getExpectedMatterAccessoryUuids();
    let matterEntries = [];

    try {
      matterEntries = await fs.readdir(matterPath, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of matterEntries) {
      if (!entry.isDirectory() || !/^[A-F0-9]{12}$/i.test(entry.name)) {
        continue;
      }

      const matterBridgePath = path.join(matterPath, entry.name);
      const accessoriesPath = path.join(matterBridgePath, 'accessories.json');
      let accessories = [];

      try {
        accessories = JSON.parse(await fs.readFile(accessoriesPath, 'utf8'));
      } catch (err) {
        continue;
      }

      if (!Array.isArray(accessories)) {
        continue;
      }

      const staleAccessories = accessories.filter(accessory => {
        const uuid = accessory.uuid || accessory.UUID;
        return accessory.plugin === PLUGIN_NAME && uuid && !expectedMatterUuids.has(uuid);
      });

      if (staleAccessories.length === 0) {
        continue;
      }

      await fs.mkdir(backupPath, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupEntryPath = path.join(backupPath, `${entry.name}-${timestamp}`);
      const staleNames = staleAccessories.map(accessory => `${accessory.displayName || 'Unnamed Matter accessory'} (${accessory.uuid || accessory.UUID})`).join(', ');

      if (staleAccessories.length === accessories.length) {
        await fs.rename(matterBridgePath, backupEntryPath);
        this.log.info(`Moved stale external Matter storage for ${staleNames} to ${backupEntryPath}`);
        continue;
      }

      const remainingAccessories = accessories.filter(accessory => !staleAccessories.includes(accessory));
      await fs.writeFile(path.join(backupPath, `${entry.name}-${timestamp}-accessories.json`), JSON.stringify(accessories, null, 2), 'utf8');
      await fs.writeFile(accessoriesPath, JSON.stringify(remainingAccessories, null, 2), 'utf8');
      this.log.info(`Removed stale Matter cache entries no longer present in config: ${staleNames}`);
    }
  }

  _getExpectedMatterAccessoryUuids() {
    const uuids = new Set();
    if (!this.config.devices || !Array.isArray(this.config.devices)) {
      return uuids;
    }

    for (const deviceConfig of this.config.devices) {
      const matterMode = getMatterMode(deviceConfig);
      const shouldExpectMatter = looksLikeRobotCleaner(`${deviceConfig.model || ''} ${deviceConfig.name || ''}`) &&
        (matterMode === MATTER_MODE_MATTER || matterMode === MATTER_MODE_BOTH || (matterMode !== MATTER_MODE_HAP && !isMiCloudForcedForConfig(deviceConfig, this.config.micloud)));
      if (!shouldExpectMatter || !deviceConfig.ip || !deviceConfig.token) {
        continue;
      }

      uuids.add(Homebridge.hap.uuid.generate(deviceConfig.token + deviceConfig.ip + (deviceConfig.deviceId || '') + PLATFORM_NAME + ':matter'));
    }

    return uuids;
  }

}

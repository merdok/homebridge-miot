const fs = require('fs').promises;
const MiotDevice = require('./lib/protocol/MiotDevice.js');
const DeviceFactory = require('./lib/factories/DeviceFactory.js');
const DevTypes = require('./lib/constants/DevTypes.js');
const Constants = require('./lib/constants/Constants.js');
const Logger = require('./lib/utils/Logger.js');
const Events = require('./lib/constants/Events.js');

let Service, Characteristic, Homebridge, Accessory;

const PLUGIN_NAME = 'homebridge-miot';
const PLATFORM_NAME = 'miot';
const PLUGIN_VERSION = '1.7.8';

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

    //spec dir to store device specs
    this.specDir = this.prefsDir + 'spec/';

    // create device model info file name
    this.deviceInfoFile = this.prefsDir + 'info_' + this.ip.split('.').join('') + '_' + this.token;

    // generate uuid
    if (this.deviceId) {
      this.UUID = Homebridge.hap.uuid.generate(this.token + this.ip + this.deviceId + PLATFORM_NAME);
    } else {
      this.UUID = Homebridge.hap.uuid.generate(this.token + this.ip + PLATFORM_NAME);
    }

    // prepare variables
    this.miotDevice = undefined;
    this.device = undefined;
    this.cachedDeviceInfo = {};

    //restored cashed accessory
    this.restoredCachedAccessory = null;
  }


  /*----------========== SETUP ==========----------*/

  async setupController() {
    // check if the preferences directory exists, if not then create it
    await this._createDirIfNeeded(this.prefsDir);

    // check if the spec directory exists, if not then create it recursively
    await this._createDirIfNeeded(this.specDir);

    // first try to load cached device info
    await this._loadDeviceInfo();

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
      this._initDevice(miotDevice);
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
        this.prepareAccessoryAndStartPolling();
      } else {
        this.logger.warn(`Something went wrong during device creation! Initialization failed, cannot create device!`);
      }
    }
  }


  /*----------========== SETUP SERVICES ==========----------*/

  prepareAccessoryAndStartPolling() {
    // first unregister a cached accessory if present!
    if (this.restoredCachedAccessory) {
      this.logger.debug('Found cached accessory for this device! Unregistering it first!');
      this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.restoredCachedAccessory]);
      this.restoredCachedAccessory = null;
    }

    // init the accessory
    this.device.initDeviceAccessory(this.getAccessoryUuid(), this.config, this.api, this.cachedDeviceInfo);

    if (this.device.getAccessoryWrapper() && this.device.getAccessories().length > 0) {
      this.logger.info(`Registering ${this.device.getAccessories().length} accessories!`);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.device.getAccessories());

      if (this.deviceEnabled) {
        this.logger.info('Everything looks good! Initiating property polling!');
        this.miotDevice.startPropertyPolling();
      } else {
        this.logger.warn('Device disabled, property polling will not be initiated! Please enable the device in the config.');
      }
    }
  }

  /*----------========== PUBLIC ==========----------*/

  getAccessoryUuid() {
    return this.UUID;
  }

  setRestoredCachedAccessory(accessory) {
    this.restoredCachedAccessory = accessory;
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

    if (this.api) {
      /*
       * When this event is fired, homebridge restored all cached accessories from disk and did call their respective
       * `configureAccessory` method for all of them. Dynamic Platform plugins should only register new accessories
       * after this event was fired, in order to ensure they weren't added to homebridge already.
       * This event can also be used to start discovery of new accessories.
       */
      this.api.on("didFinishLaunching", () => {
        this.initDevices();
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

  // ------------ CUSTOM METHODS ------------

  initDevices() {
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

    // remove all accessories which are still left over
    this.removeAccessories();

  }

  initDevice(deviceConfig) {
    const newDevCtrl = new miotDeviceController(this.log, deviceConfig, this.config.micloud, this.api);
    const restoredAccessory = this.cachedAccessories.find(accessory => accessory.UUID === newDevCtrl.getAccessoryUuid());
    if (restoredAccessory) {
      newDevCtrl.setRestoredCachedAccessory(restoredAccessory);
      this.cachedAccessories = this.cachedAccessories.filter(item => item !== restoredAccessory); // remove the cached accessory from the list since the controller will remove it later.
    }
    newDevCtrl.setupController(); // begin the controller setup
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


}

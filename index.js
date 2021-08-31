const fs = require('fs');
const mkdirp = require('mkdirp');
const MiotController = require('./lib/MiotController.js');
const AccessoryFactory = require('./lib/factories/AccessoryFactory.js');
const Logger = require('./lib/utils/Logger.js');
const Events = require('./lib/constants/Events.js');

let Service, Characteristic, Homebridge, Accessory;

const PLUGIN_NAME = 'homebridge-miot';
const PLATFORM_NAME = 'miot';
const PLUGIN_VERSION = '0.9.10';

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  Homebridge = homebridge;
  Accessory = homebridge.platformAccessory;
  homebridge.registerPlatform(PLUGIN_NAME, PLATFORM_NAME, miotPlatform, true);
};


class xiaomiMiotDevice {
  constructor(log, config, api) {
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
      this.logger.error(`Failed to create platform device, missing mandatory information!`);
      this.logger.error(`Please check your device config!`);
      return;
    }

    // configuration
    this.name = config.name;
    this.ip = config.ip;
    this.token = config.token;
    this.deviceId = config.deviceId;
    this.model = config.model;
    this.pollingInterval = config.pollingInterval || 5;
    this.pollingInterval = this.pollingInterval * 1000;
    this.prefsDir = config.prefsDir || api.user.storagePath() + '/.xiaomiMiot/';
    this.deepDebugLog = config.deepDebugLog;
    if (this.deepDebugLog === undefined) {
      this.deepDebugLog = false;
    }


    this.logger.info(`Got device configuration, initializing device with name: ${this.name}`);

    // set deep debug log
    this.logger.setDeepDebugLogEnabled(this.deepDebugLog);

    // check if prefs directory ends with a /, if not then add it
    if (this.prefsDir.endsWith('/') === false) {
      this.prefsDir = this.prefsDir + '/';
    }

    // check if the fan preferences directory exists, if not then create it
    if (fs.existsSync(this.prefsDir) === false) {
      mkdirp(this.prefsDir);
    }

    // create device model info file name
    this.deviceInfoFile = this.prefsDir + 'info_' + this.ip.split('.').join('') + '_' + this.token;

    // prepare variables
    this.miotController = undefined;
    this.miotDevice = undefined;
    this.cachedDeviceInfo = {};

    //try to load cached device info
    this.loadDeviceInfo();

    //start the device discovery
    this.initMiotController();
  }


  /*----------========== SETUP ==========----------*/

  initMiotController() {
    let deviceId = this.deviceId || this.cachedDeviceInfo.deviceId;
    let model = this.model || this.cachedDeviceInfo.model;
    // if the user specified a model then use that, else try to get cached model
    this.miotController = new MiotController(this.ip, this.token, deviceId, model, this.name, this.pollingInterval, this.config, this.logger);

    this.miotController.on(Events.CONTROLLER_DEVICE_READY, (miotDevice) => {
      this.setupMiotDevice(miotDevice);
    });

    this.miotController.connectToDevice();
  }

  setupMiotDevice(miotDevice) {
    this.miotDevice = miotDevice;
    //prepare the accessory and do initial accessory information service update
    if (!this.deviceAccessoryObj) {
      this.logger.info('Initializing accessory!');
      this.initAccessory();
      this.updateInformationService();
    }

    this.miotDevice.on(Events.DEVICE_CONNECTED, (miotDevice) => {
      this.logger.debug('Device connected!');
      // update device information since we have more information about the device now. Only if no cached data available!
      if (!this.cachedDeviceInfo || Object.keys(this.cachedDeviceInfo).length === 0) {
        this.updateInformationService();
      }

      // save device information
      this.saveDeviceInfo();
    });

    this.miotDevice.on(Events.DEVICE_DISCONNECTED, (miotDevice) => {
      this.logger.debug('Device diconnected!');
      if (this.deviceAccessoryObj) {
        this.deviceAccessoryObj.updateDeviceStatus();
      }
    });

    this.miotDevice.on(Events.DEVICE_ALL_PROPERTIES_UPDATED, (miotDevice) => {
      if (this.deviceAccessoryObj) {
        this.deviceAccessoryObj.updateDeviceStatus();
      }
    });

    this.miotDevice.on(Events.DEVICE_PROPERTY_UPDATED, (property) => {
      if (this.deviceAccessoryObj) {
        this.deviceAccessoryObj.updateDeviceStatus();
      }
    });

  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    // generate uuid
    this.UUID = Homebridge.hap.uuid.generate(this.token + this.ip + PLATFORM_NAME);

    // prepare the fan accessory
    this.deviceAccessoryObj = AccessoryFactory.createAccessory(this.name, this.miotDevice, this.UUID, this.config, this.api, this.logger);

    if (this.deviceAccessoryObj) {
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [this.deviceAccessoryObj.getAccessory()]);
      this.logger.info('Accessory successfully initialized!');
    } else {
      this.logger.error('Something went wrong. Could not initialize accessory!');
    }
  }

  updateInformationService() {
    if (this.deviceAccessoryObj) {
      let model = 'Unknown';
      let deviceId = 'Unknown';
      if (this.miotDevice) {
        model = this.miotDevice.getModel() || model;
        deviceId = this.miotDevice.getDeviceId() || deviceId;
      }
      this.deviceAccessoryObj.updateInformationService(this.name, 'Xiaomi', model, deviceId, PLUGIN_VERSION);
    }
  }


  /*----------========== HELPERS ==========----------*/

  saveDeviceInfo() {
    // save model name and deviceId
    if (this.miotDevice) {
      this.cachedDeviceInfo.model = this.miotDevice.getModel();
      this.cachedDeviceInfo.deviceId = this.miotDevice.getDeviceId();
      fs.writeFile(this.deviceInfoFile, JSON.stringify(this.cachedDeviceInfo), (err) => {
        if (err) {
          this.logger.debug('Error occured could not write device model info %s', err);
        } else {
          this.logger.debug('Successfully saved device info!');
        }
      });
    }
  }

  loadDeviceInfo() {
    try {
      this.cachedDeviceInfo = JSON.parse(fs.readFileSync(this.deviceInfoFile));
      this.logger.debug(`Found cached device information: ${this.cachedDeviceInfo.model}`);
    } catch (err) {
      this.logger.debug('Device info file does not exist yet!');
    }
  }

}


/*----------========== PLATFORM STUFF ==========----------*/
class miotPlatform {
  constructor(log, config, api) {

    this.devices = [];
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
        this.removeAccessories(); // remove all cached devices, we do not want to use cache for now, maybe in future?
        this.initDevices();
      });
    }

  }

  /*
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory) {
    this.log.debug("Found cached accessory %s", accessory.displayName);
    this.devices.push(accessory);
  }

  // ------------ CUSTOM METHODS ------------

  initDevices() {
    this.log.info('Initializing devices');

    // read from config.devices
    if (this.config.devices && Array.isArray(this.config.devices)) {
      for (let device of this.config.devices) {
        if (device) {
          new xiaomiMiotDevice(this.log, device, this.api);
        }
      }
    } else if (this.config.devices) {
      this.log.info('The devices property is not of type array. Cannot initialize. Type: %s', typeof this.config.devices);
    }

    if (!this.config.devices && !this.config.fans) {
      this.log.info('-------------------------------------------');
      this.log.info('No device configuration found');
      this.log.info('Missing devices in your platform config');
      this.log.info('-------------------------------------------');
    }

  }

  removeAccessories() {
    // we don't have any special identifiers, we just remove all our accessories
    this.log.debug("Removing all cached accessories");
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.devices);
    this.devices = []; // clear out the array
  }

  removeAccessory(accessory) {
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
    this.devices = this.devices.filter(item => item !== accessory);
  }


}

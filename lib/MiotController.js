const miio = require('miio');
var EventEmitter = require('events');
const MiotDevice = require('./protocol/MiotDevice.js');
const DeviceFactory = require('./DeviceFactory.js');
const Events = require('./constants/Events.js');
const DevTypes = require('./constants/DevTypes.js');

class MiotController extends EventEmitter {
  constructor(ip, token, deviceId, model, name, pollingInterval, config, logger) {
    super();

    // config
    this.ip = ip;
    this.token = token;
    this.deviceId = deviceId;
    this.model = model;
    this.name = name;
    this.pollingInterval = pollingInterval || 5000;
    this.logger = logger;

    this.miCloudConfig = config.micloud || {};

    if (!this.ip) {
      this.logger.error(`ip required!`);
    }

    if (!this.token) {
      this.logger.error(`token required!`);
    }

    //variables
    this.miotDevice = undefined;
    this.checkDeviceStatusInterval = undefined;
  }

  connectToDevice() {
    if (this.model && this.model.length > 0) {
      this.logger.info(`Device model known: ${this.model}! Creating device!`);
      this.createMiotDevice(null, this.model); // we have model info so we already know what device we are dealing with
      this.startDeviceDiscovery(); // try to connect to the device
    } else {
      this.logger.info(`Device model unknown! Starting discovery!`);
      this.startDeviceDiscovery();
    }
  }

  startDeviceDiscovery() {
    let checkDelayTime = this.pollingInterval * 6; // 6 times alive polling interval
    miio.device({
      address: this.ip,
      token: this.token
    }).then(device => {
      this.logger.info(`Connected to device: ${device.miioModel}`);
      this.createMiotDevice(device, null);
    }).catch(err => {
      this.logger.debug(err);
      this.logger.debug(`Could not connect to the device! Retrying in ${checkDelayTime/1000} seconds!`);
      if (this.miotDevice) {
        this.miotDevice.disconnectAndDestroyMiioDevice();
      }
      setTimeout(() => {
        this.startDeviceDiscovery();
      }, checkDelayTime);
    });
  }

  createMiotDevice(miioDevice, model) {
    // if we do not have a miot device yet then create one and notify listeners
    if (!this.miotDevice && (miioDevice || model)) {
      this.logger.debug(`Creating miot device!`);

      // if miio device instance specified then try to get model info from there, else use the specified model
      let deviceModel = miioDevice ? miioDevice.miioModel : model;

      // create the miot device
      this.miotDevice = DeviceFactory.createDevice(miioDevice, deviceModel, this.deviceId, this.name, this.logger);
      this.miotDevice.setMiCloudConfig(this.miCloudConfig);

      if (this.miotDevice) {
        if (this.miotDevice.getType() === DevTypes.UNKNOWN) {
          this.logger.warn(`Device not supported! Using a generic device with limited properties! Consider requesting device support!`);
        } else {
          this.logger.info(`Device successfully created! It is a ${this.miotDevice.getType()} device!`);
        }

        // on single property update propagate that to the accessory as an all properties update
        this.miotDevice.on(Events.DEVICE_PROPERTY_UPDATED, (prop) => {
          this.emit(Events.DEVICE_ALL_PROPERTIES_UPDATED, this.miotDevice);
        });

        // notify the listener when a new miio device has been setup
        this.miotDevice.on(Events.DEVICE_SETUP_FINISHED, (device) => {
          this.startDevicePolling();
          this.emit(Events.DEVICE_CONNECTED, this.miotDevice);
        });

        this.emit(Events.DEVICE_READY, this.miotDevice); // notify listeners that a miot device was created
      }
    }

    if (this.miotDevice && miioDevice) {
      // if we have a miot device then setup the miot device
      this.miotDevice.setupDevice(miioDevice);
    }
  }

  startDevicePolling() {
    this.checkDeviceStatusInterval = setInterval(() => {
      this.miotDevice.pollProperties().then(result => {
        //this.logger.debug(`Poll successful! Got data from miot device!`);
        this.emit(Events.DEVICE_ALL_PROPERTIES_UPDATED, this.miotDevice);
        this.logger.deepDebug(`Device properties updated: \n ${JSON.stringify(this.miotDevice.getAllPropNameValues(), null, 2)}`);
      }).catch(err => {
        if (this.checkDeviceStatusInterval) {
          this.logger.debug(`Poll failed! No response from device! Stopping polling! Error: ${err}`);
          clearInterval(this.checkDeviceStatusInterval);
          this.checkDeviceStatusInterval = undefined;
          if (this.miotDevice.isConnected()) {
            this.emit(Events.DEVICE_DISCONNECTED, null);
          }
          this.miotDevice.disconnectAndDestroyMiioDevice();
          this.logger.debug(`Trying to reconnect`);
          this.startDeviceDiscovery();
        }
      });
    }, this.pollingInterval);
  }

}

module.exports = MiotController;

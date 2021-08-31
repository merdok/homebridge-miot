const miio = require('miio');
var EventEmitter = require('events');
const MiotDevice = require('./protocol/MiotDevice.js');
const DeviceFactory = require('./factories/DeviceFactory.js');
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

  /*----------========== PUBLIC ==========----------*/

  connectToDevice() {
    if (this.model && this.model.length > 0) {
      this.logger.info(`Device model known: ${this.model}! Creating device!`);
      this._createMiotDevice(null, this.model); // we have model info so we already know what device we are dealing with
      this._startDeviceDiscovery(); // try to connect to the device
    } else {
      this.logger.info(`Device model unknown! Starting discovery!`);
      this._startDeviceDiscovery();
    }
  }


  /*----------========== HELPERS ==========----------*/

  _startDeviceDiscovery() {
    let checkDelayTime = this.pollingInterval * 6; // 6 times alive polling interval
    miio.device({
      address: this.ip,
      token: this.token
    }).then(device => {
      this.logger.info(`Connected to device: ${device.miioModel}`);
      this._createMiotDevice(device, null);
    }).catch(err => {
      this.logger.debug(err);
      this.logger.debug(`Could not connect to the device! Retrying in ${checkDelayTime/1000} seconds!`);
      if (this.miotDevice) {
        this.miotDevice.disconnectAndDestroyMiioDevice();
      }
      setTimeout(() => {
        this._startDeviceDiscovery();
      }, checkDelayTime);
    });
  }

  _createMiotDevice(miioDevice, model) {
    // if we do not have a miot device yet then create one and notify listeners
    if (!this.miotDevice && (miioDevice || model)) {
      this.logger.debug(`Creating miot device!`);

      // if miio device instance specified then try to get model info from there, else use the specified model
      let deviceModel = miioDevice ? miioDevice.miioModel : model;

      // create the miot device
      this.miotDevice = DeviceFactory.createDevice(deviceModel, this.deviceId, this.name, this.logger);
      this.miotDevice.setMiCloudConfig(this.miCloudConfig);

      if (this.miotDevice) {
        if (this.miotDevice.getType() === DevTypes.UNKNOWN) {
          this.logger.warn(`Device not supported! Using a generic device with limited properties! Consider requesting device support!`);
        } else {
          this.logger.info(`Successfully created a ${this.miotDevice.getType()} device! It is a ${this.miotDevice.getDeviceName()}.`);
        }

        // restart discovery when a device disconnected
        this.miotDevice.on(Events.DEVICE_DISCONNECTED, (device) => {
          this._startDeviceDiscovery();
        });

        this.emit(Events.CONTROLLER_DEVICE_READY, this.miotDevice); // notify listeners that a miot device was created
      }
    }

    // if we have a miot device then setup the miot device
    if (this.miotDevice && miioDevice) {
      this.miotDevice.setupDevice(miioDevice);
    }
  }

}

module.exports = MiotController;

const MiotDevice = require('./MiotDevice.js');
const FanFactory = require('./modules/fan/FanFactory.js');


class DeviceFactory {

  static createDevice(miioDevice, deviceModel, deviceId, name, logger) {
    let miotDevice = null;

    if (deviceModel) {
      logger.debug(`Device Factory - Creating device instance by model: ${deviceModel}!`);
      var deviceFactoryClass = null;

      if (!deviceFactoryClass) {
        deviceFactoryClass = FanFactory.getDeviceClassForModel(deviceModel);
      }

      if (!deviceFactoryClass) {
        deviceFactoryClass = MiotDevice;
      }

      if (deviceFactoryClass) {
        miotDevice = new deviceFactoryClass(miioDevice, deviceModel, deviceId, name, logger);
      }
    }

    if (!miotDevice) {
      logger.error(`Device Factory - Something went wrong. Could not create a miot device instance!`);
    }

    return miotDevice;
  }

}

module.exports = DeviceFactory;

const GenericDevice = require('./modules/generic/GenericDevice.js');
const FanFactory = require('./modules/fan/FanFactory.js');
const HeaterFactory = require('./modules/heater/HeaterFactory.js');
const HumidifierFactory = require('./modules/humidifier/HumidifierFactory.js');
const AirPurifierFactory = require('./modules/airpurifier/AirPurifierFactory.js');
const CeilingFanFactory = require('./modules/ceilingfan/CeilingFanFactory.js');
const OutletFactory = require('./modules/outlet/OutletFactory.js');


class DeviceFactory {

  static createDevice(miioDevice, deviceModel, deviceId, name, logger) {
    let miotDevice = null;

    if (deviceModel) {
      logger.debug(`Device Factory - Creating device instance by model: ${deviceModel}!`);
      var deviceFactoryClass = null;

      // fans
      if (!deviceFactoryClass) {
        deviceFactoryClass = FanFactory.getDeviceClassForModel(deviceModel);
      }

      // heaters
      if (!deviceFactoryClass) {
        deviceFactoryClass = HeaterFactory.getDeviceClassForModel(deviceModel);
      }

      // humidifier
      if (!deviceFactoryClass) {
        deviceFactoryClass = HumidifierFactory.getDeviceClassForModel(deviceModel);
      }

      // air purifier
      if (!deviceFactoryClass) {
        deviceFactoryClass = AirPurifierFactory.getDeviceClassForModel(deviceModel);
      }

      // ceiling fan
      if (!deviceFactoryClass) {
        deviceFactoryClass = CeilingFanFactory.getDeviceClassForModel(deviceModel);
      }

      // outlet
      if (!deviceFactoryClass) {
        deviceFactoryClass = OutletFactory.getDeviceClassForModel(deviceModel);
      }

      // generic
      if (!deviceFactoryClass) {
        deviceFactoryClass = GenericDevice;
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

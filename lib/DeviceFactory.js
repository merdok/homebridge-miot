const GenericDevice = require('./modules/generic/GenericDevice.js');
const FanFactory = require('./modules/fan/FanFactory.js');
const HeaterFactory = require('./modules/heater/HeaterFactory.js');
const HumidifierFactory = require('./modules/humidifier/HumidifierFactory.js');
const AirPurifierFactory = require('./modules/airpurifier/AirPurifierFactory.js');
const CeilingFanFactory = require('./modules/ceilingfan/CeilingFanFactory.js');
const OutletFactory = require('./modules/outlet/OutletFactory.js');
const CurtainFactory = require('./modules/curtain/CurtainFactory.js');
const FreshAirSystemFactory = require('./modules/freshairsystem/FreshAirSystemFactory.js');
const RobotCleanerFactory = require('./modules/robotcleaner/RobotCleanerFactory.js');
const DehumidifierFactory = require('./modules/dehumidifier/DehumidifierFactory.js');
const LightFactory = require('./modules/light/LightFactory.js');


class DeviceFactory {

  static createDevice(deviceModel, deviceId, name, logger) {
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

      // curtain
      if (!deviceFactoryClass) {
        deviceFactoryClass = CurtainFactory.getDeviceClassForModel(deviceModel);
      }

      // fresh air system
      if (!deviceFactoryClass) {
        deviceFactoryClass = FreshAirSystemFactory.getDeviceClassForModel(deviceModel);
      }

      // robot cleaner
      if (!deviceFactoryClass) {
        deviceFactoryClass = RobotCleanerFactory.getDeviceClassForModel(deviceModel);
      }

      // dehumidifier
      if (!deviceFactoryClass) {
        deviceFactoryClass = DehumidifierFactory.getDeviceClassForModel(deviceModel);
      }

      // light
      if (!deviceFactoryClass) {
        deviceFactoryClass = LightFactory.getDeviceClassForModel(deviceModel);
      }

      // generic
      if (!deviceFactoryClass) {
        deviceFactoryClass = GenericDevice;
      }

      if (deviceFactoryClass) {
        miotDevice = new deviceFactoryClass(deviceModel, deviceId, name, logger);
      }
    }

    if (!miotDevice) {
      logger.error(`Device Factory - Something went wrong. Could not create a miot device instance!`);
    }

    return miotDevice;
  }

}

module.exports = DeviceFactory;

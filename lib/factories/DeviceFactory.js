const GenericDevice = require('../modules/generic/GenericDevice.js');
const FanFactory = require('../modules/fan/FanFactory.js');
const HeaterFactory = require('../modules/heater/HeaterFactory.js');
const HumidifierFactory = require('../modules/humidifier/HumidifierFactory.js');
const AirPurifierFactory = require('../modules/airpurifier/AirPurifierFactory.js');
const CeilingFanFactory = require('../modules/ceilingfan/CeilingFanFactory.js');
const OutletFactory = require('../modules/outlet/OutletFactory.js');
const CurtainFactory = require('../modules/curtain/CurtainFactory.js');
const FreshAirSystemFactory = require('../modules/freshairsystem/FreshAirSystemFactory.js');
const RobotCleanerFactory = require('../modules/robotcleaner/RobotCleanerFactory.js');
const DehumidifierFactory = require('../modules/dehumidifier/DehumidifierFactory.js');
const LightFactory = require('../modules/light/LightFactory.js');
const AirConditionerFactory = require('../modules/airconditioner/AirConditionerFactory.js');
const AirerFactory = require('../modules/airer/AirerFactory.js');
const OvenFactory = require('../modules/oven/OvenFactory.js');
const CoffeeMachineFactory = require('../modules/coffeemachine/CoffeeMachineFactory.js');
const CameraFactory = require('../modules/camera/CameraFactory.js');
const BathHeaterFactory = require('../modules/bathheater/BathHeaterFactory.js');
const KettleFactory = require('../modules/kettle/KettleFactory.js');

const allFactories = [FanFactory, HeaterFactory, HumidifierFactory, AirPurifierFactory,
  CeilingFanFactory, OutletFactory, CurtainFactory, FreshAirSystemFactory,
  RobotCleanerFactory, DehumidifierFactory, LightFactory, AirConditionerFactory,
  AirerFactory, OvenFactory, CoffeeMachineFactory, CameraFactory,
  BathHeaterFactory, KettleFactory
];


class DeviceFactory {

  static createDevice(deviceModel, deviceId, name, logger) {
    let miotDevice = null;

    if (deviceModel) {
      logger.debug(`Device Factory - Creating device instance by model: ${deviceModel}!`);
      var deviceClass = null;

      // search in all device factories if the device is implemented
      for (let factory of allFactories) {
        deviceClass = factory.getDeviceClassForModel(deviceModel);
        if (deviceClass) {
          break;
        }
      }

      // generic
      if (!deviceClass) {
        deviceClass = GenericDevice;
      }

      if (deviceClass) {
        miotDevice = new deviceClass(deviceModel, deviceId, name, logger);
      }
    }

    if (!miotDevice) {
      logger.error(`Device Factory - Something went wrong. Could not create a miot device instance!`);
    }

    return miotDevice;
  }

}

module.exports = DeviceFactory;

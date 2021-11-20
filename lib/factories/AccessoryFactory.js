const DevTypes = require('../constants/DevTypes.js');
const GenericAccessory = require('../modules/generic/GenericAccessory.js');
const FanAccessory = require('../modules/fan/FanAccessory.js');
const HeaterAccessory = require('../modules/heater/HeaterAccessory.js');
const HumidifierAccessory = require('../modules/humidifier/HumidifierAccessory.js');
const AirPurifierAccessory = require('../modules/airpurifier/AirPurifierAccessory.js');
const CeilingFanAccessory = require('../modules/ceilingfan/CeilingFanAccessory.js');
const OutletAccessory = require('../modules/outlet/OutletAccessory.js');
const CurtainAccessory = require('../modules/curtain/CurtainAccessory.js');
const FreshAirSystemAccessory = require('../modules/freshairsystem/FreshAirSystemAccessory.js');
const RobotCleanerAccessory = require('../modules/robotcleaner/RobotCleanerAccessory.js');
const DehumidifierAccessory = require('../modules/dehumidifier/DehumidifierAccessory.js');
const LightAccessory = require('../modules/light/LightAccessory.js');
const AirConditionerAccessory = require('../modules/airconditioner/AirConditionerAccessory.js');
const AirerAccessory = require('../modules/airer/AirerAccessory.js');
const OvenAccessory = require('../modules/oven/OvenAccessory.js');
const CoffeeMachineAccessory = require('../modules/coffeemachine/CoffeeMachineAccessory.js');
const CameraAccessory = require('../modules/camera/CameraAccessory.js');
const BathHeaterAccessory = require('../modules/bathheater/BathHeaterAccessory.js');
const KettleAccessory = require('../modules/kettle/KettleAccessory.js');
const ThermostatAccessory = require('../modules/thermostat/ThermostatAccessory.js');
const SwitchAccessory = require('../modules/switch/SwitchAccessory.js');


class AccessoryFactory {

  static createAccessory(name, miotDevice, uuid, config, api, logger) {
    let deviceAccesory = null;
    var accessoryClass = GenericAccessory;

    if (miotDevice) {
      let deviceType = miotDevice.getType();
      logger.debug(`Accessory Factory - Creating ${deviceType} accessory for device ${name}!`);

      switch (deviceType) {
        case DevTypes.FAN:
          accessoryClass = FanAccessory;
          break;
        case DevTypes.HEATER:
          accessoryClass = HeaterAccessory;
          break;
        case DevTypes.HUMIDIFIER:
          accessoryClass = HumidifierAccessory;
          break;
        case DevTypes.AIR_PURIFIER:
          accessoryClass = AirPurifierAccessory;
          break;
        case DevTypes.CEILING_FAN:
          accessoryClass = CeilingFanAccessory;
          break;
        case DevTypes.OUTLET:
          accessoryClass = OutletAccessory;
          break;
        case DevTypes.CURTAIN:
          accessoryClass = CurtainAccessory;
          break;
        case DevTypes.FRESH_AIR_SYSTEM:
          accessoryClass = FreshAirSystemAccessory;
          break;
        case DevTypes.ROBOT_CLEANER:
          accessoryClass = RobotCleanerAccessory;
          break;
        case DevTypes.DEHUMIDIFIER:
          accessoryClass = DehumidifierAccessory;
          break;
        case DevTypes.LIGHT:
          accessoryClass = LightAccessory;
          break;
        case DevTypes.AIR_CONDITIONER:
          accessoryClass = AirConditionerAccessory;
          break;
        case DevTypes.AIRER:
          accessoryClass = AirerAccessory;
          break;
        case DevTypes.OVEN:
          accessoryClass = OvenAccessory;
          break;
        case DevTypes.COFFEE_MACHINE:
          accessoryClass = CoffeeMachineAccessory;
          break;
        case DevTypes.CAMERA:
          accessoryClass = CameraAccessory;
          break;
        case DevTypes.BATH_HEATER:
          accessoryClass = BathHeaterAccessory;
          break;
        case DevTypes.KETTLE:
          accessoryClass = KettleAccessory;
          break;
        case DevTypes.THERMOSTAT:
          accessoryClass = ThermostatAccessory;
          break;
        case DevTypes.SWITCH:
          accessoryClass = SwitchAccessory;
          break;
        default:
          accessoryClass = GenericAccessory;
          break;
      }
    }

    if (accessoryClass) {
      deviceAccesory = new accessoryClass(name, miotDevice, uuid, config, api, logger);
    }

    if (!deviceAccesory) {
      logger.error(`Accessory Factory - Something went wrong. Could not create a homekit accessory!`);
    }

    return deviceAccesory;
  }

}

module.exports = AccessoryFactory;

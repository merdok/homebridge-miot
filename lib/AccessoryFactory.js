const DevTypes = require('./constants/DevTypes.js');
const GenericAccessory = require('./modules/generic/GenericAccessory.js');
const FanAccessory = require('./modules/fan/FanAccessory.js');
const HeaterAccessory = require('./modules/heater/HeaterAccessory.js');
const HumidifierAccessory = require('./modules/humidifier/HumidifierAccessory.js');
const AirPurifierAccessory = require('./modules/airpurifier/AirPurifierAccessory.js');
const CeilingFanAccessory = require('./modules/ceilingfan/CeilingFanAccessory.js');
const OutletAccessory = require('./modules/outlet/OutletAccessory.js');
const CurtainAccessory = require('./modules/curtain/CurtainAccessory.js');
const FreshAirSystemAccessory = require('./modules/freshairsystem/FreshAirSystemAccessory.js');
const RobotCleanerAccessory = require('./modules/robotcleaner/RobotCleanerAccessory.js');
const DehumidifierAccessory = require('./modules/dehumidifier/DehumidifierAccessory.js');
const LightAccessory = require('./modules/light/LightAccessory.js');
const AirConditionerAccessory = require('./modules/airconditioner/AirConditionerAccessory.js');
const AirerAccessory = require('./modules/airer/AirerAccessory.js');


class AccessoryFactory {

  static createAccessory(name, miotDevice, uuid, config, api, logger) {
    let deviceAccesory = null;
    var accessoryClass = GenericAccessory;

    if (miotDevice) {
      let deviceType = miotDevice.getType();
      logger.debug(`Accessory Factory - Creating ${deviceType} accessory for device ${name}!`);

      if (deviceType === DevTypes.FAN) {
        accessoryClass = FanAccessory;
      } else if (deviceType === DevTypes.HEATER) {
        accessoryClass = HeaterAccessory;
      } else if (deviceType === DevTypes.HUMIDIFIER) {
        accessoryClass = HumidifierAccessory;
      } else if (deviceType === DevTypes.AIR_PURIFIER) {
        accessoryClass = AirPurifierAccessory;
      } else if (deviceType === DevTypes.CEILING_FAN) {
        accessoryClass = CeilingFanAccessory;
      } else if (deviceType === DevTypes.OUTLET) {
        accessoryClass = OutletAccessory;
      } else if (deviceType === DevTypes.CURTAIN) {
        accessoryClass = CurtainAccessory;
      } else if (deviceType === DevTypes.FRESH_AIR_SYSTEM) {
        accessoryClass = FreshAirSystemAccessory;
      } else if (deviceType === DevTypes.ROBOT_CLEANER) {
        accessoryClass = RobotCleanerAccessory;
      } else if (deviceType === DevTypes.DEHUMIDIFIER) {
        accessoryClass = DehumidifierAccessory;
      } else if (deviceType === DevTypes.LIGHT) {
        accessoryClass = LightAccessory;
      } else if (deviceType === DevTypes.AIR_CONDITIONER) {
        accessoryClass = AirConditionerAccessory;
      } else if (deviceType === DevTypes.AIRER) {
        accessoryClass = AirerAccessory;
      } else {
        accessoryClass = GenericAccessory;
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

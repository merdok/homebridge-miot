const DevTypes = require('./constants/DevTypes.js');
const GenericAccessory = require('./modules/generic/GenericAccessory.js');
const FanAccessory = require('./modules/fan/FanAccessory.js');
const HeaterAccessory = require('./modules/heater/HeaterAccessory.js');
const HumidifierAccessory = require('./modules/humidifier/HumidifierAccessory.js');
const AirPurifierAccessory = require('./modules/airpurifier/AirPurifierAccessory.js');
const CeilingFanAccessory = require('./modules/ceilingfan/CeilingFanAccessory.js');


class AccessoryFactory {

  static createAccessory(name, miotDevice, uuid, log, config, api, logger) {
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
      } else {
        accessoryClass = GenericAccessory;
      }
    }


    if (accessoryClass) {
      deviceAccesory = new accessoryClass(name, miotDevice, uuid, log, config, api, logger);
    }

    if (!deviceAccesory) {
      logger.error(`Accessory Factory - Something went wrong. Could not create a homekit accessory!`);
    }

    return deviceAccesory;
  }

}

module.exports = AccessoryFactory;

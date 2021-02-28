const DevTypes = require('./constants/DevTypes.js');
const GenericAccessory = require('./modules/generic/GenericAccessory.js');
const FanAccessory = require('./modules/fan/FanAccessory.js');
const HeaterAccessory = require('./modules/heater/HeaterAccessory.js');


class AccessoryFactory {

  static createAccessory(name, miotDevice, uuid, log, config, api, logger) {
    let deviceAccesory = null;
    var accessoryClass = GenericAccessory;

    if (miotDevice) {
      let deviceType = miotDevice.getType();

      if (deviceType === DevTypes.FAN) {
        logger.debug(`Creating fan accessory for device ${name}!`);
        accessoryClass = FanAccessory;
      } else if (deviceType === DevTypes.HEATER) {
        logger.debug(`Creating heater accessory for device ${name}!`);
        accessoryClass = HeaterAccessory;
      } else {
        logger.debug(`Creating generic accessory for device ${name}!`);
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

const DevTypes = require('../constants/DevTypes.js');
const UnknownAccessory = require('../modules/unknown/UnknownAccessory.js');


class AccessoryFactory {

  static createAccessory(name, device, uuid, config, api, logger) {
    var accessoryClass = undefined;

    if (device) {
      let deviceType = device.getType();
      if (!deviceType) {
        deviceType = DevTypes.UNKNOWN;
      }
      accessoryClass = AccessoryFactory._getAccessoryClassByType(deviceType, name, logger);
    }

    // unknown
    if (!accessoryClass) {
      logger.debug(`No accessory class found for the device! Falling back to UnknownAccessory!`);
      accessoryClass = UnknownAccessory;
    }

    return AccessoryFactory._createAccessoryByClass(accessoryClass, name, device, uuid, config, api, logger);
  }

  static createAccessoryByType(deviceType, name, device, uuid, config, api, logger) {
    var accessoryClass = undefined;

    if (deviceType) {
      accessoryClass = AccessoryFactory._getAccessoryClassByType(deviceType, name, logger);
    }

    return AccessoryFactory._createAccessoryByClass(accessoryClass, name, device, uuid, config, api, logger);
  }

  static _getAccessoryClassByType(deviceType, name, logger) {
    var accessoryClass = undefined;
    if (deviceType) {
      logger.debug(`Creating ${deviceType} accessory for device ${name}!`);
      let deviceAccessoryPath = `../modules/${deviceType.toLowerCase()}/${deviceType}Accessory.js`
      try {
        accessoryClass = require(deviceAccessoryPath);
        logger.debug(`Found accessory class at ${deviceAccessoryPath}!`);
      } catch (err) {
        logger.deepDebug(`Accessory class for device type ${deviceType} at ${deviceAccessoryPath} not found! Devices with the type are not supported yet!`);
        if(!err.code || err.code !== 'MODULE_NOT_FOUND'){
          // seems like a crash so display the error
          logger.warn(`Error while trying to load accessory class: \n ${err} \n ${err.stack}`);
        }
      }
    }
    return accessoryClass;
  }

  static _createAccessoryByClass(accessoryClass, name, device, uuid, config, api, logger) {
    let deviceAccessory = null;
    if (accessoryClass) {
      deviceAccessory = new accessoryClass(name, device, uuid, config, api, logger);
    }

    if (!deviceAccessory) {
      logger.error(`Something went wrong. Could not create a homekit accessory!`);
    }
    return deviceAccessory;
  }

}

module.exports = AccessoryFactory;

class MatterAccessoryFactory {

  static async createMatterAccessory(name, device, uuid, config, api, logger, cachedDeviceInfo, restoredMatterAccessory, options = {}) {
    let accessoryClass = null;

    if (device && device.getType()) {
      accessoryClass = MatterAccessoryFactory._getMatterAccessoryClassByType(device.getType(), name, logger);
    }

    if (!accessoryClass) {
      return null;
    }

    const matterAccessory = new accessoryClass(name, device, uuid, config, api, logger, cachedDeviceInfo, restoredMatterAccessory, options);
    return matterAccessory.init();
  }

  static _getMatterAccessoryClassByType(deviceType, name, logger) {
    const matterAccessoryPath = `../modules/${deviceType.toLowerCase()}/${deviceType}MatterAccessory.js`;
    let resolvedMatterAccessoryPath;

    try {
      logger.debug(`Creating ${deviceType} Matter accessory for device ${name}!`);
      resolvedMatterAccessoryPath = require.resolve(matterAccessoryPath);
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        logger.deepDebug(`Matter accessory class for device type ${deviceType} at ${matterAccessoryPath} not found! Devices with the type are not supported yet!`);
        return null;
      }
      logger.warn(`Error while resolving Matter accessory class: \n ${err} \n ${err.stack}`);
      throw err;
    }

    try {
      const accessoryClass = require(resolvedMatterAccessoryPath);
      logger.debug(`Found Matter accessory class at ${matterAccessoryPath}!`);
      return accessoryClass;
    } catch (err) {
      logger.warn(`Error while loading Matter accessory class: \n ${err} \n ${err.stack}`);
      throw err;
    }
  }

}

module.exports = MatterAccessoryFactory;

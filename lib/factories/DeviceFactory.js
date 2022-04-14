const fs = require('fs').promises;
const DevTypes = require('../constants/DevTypes.js');
const UnknownDevice = require('../modules/unknown/UnknownDevice.js');
const CustomDevice = require('../modules/custom/CustomDevice.js');


class DeviceFactory {

  static async createDevice(miotDevice, specDir, name, isCustomAccessory, logger) {
    let deviceInstance = null;

    if (miotDevice && miotDevice.getModel()) {
      var deviceClass = null;;

      logger.debug(`Creating device instance by model: ${miotDevice.getModel()}!`);

      if (isCustomAccessory) {
        deviceClass = await DeviceFactory.getCustomDeviceClass(miotDevice, specDir, logger);
      } else {
        deviceClass = await DeviceFactory.getDeviceClass(miotDevice, specDir, logger);
      }

      if (deviceClass) {
        deviceInstance = new deviceClass(miotDevice, name, logger);
      }
    }

    if (!deviceInstance) {
      logger.error(`Something went wrong. Could not create a miot device instance!`);
    }

    return deviceInstance;
  }

  static async getDeviceClass(miotDevice, specDir, logger) {
    let deviceClass = null;

    // try to find device specific class
    const modulesList = await fs.readdir(__dirname + "/../modules/");
    if (modulesList) {
      modulesList.some((devModule) => {
        let devicePath = `../modules/${devModule}/devices/${miotDevice.getModel()}.js`
        try {
          deviceClass = require(devicePath);
          logger.debug(`It is a ${devModule} device! Found device class at ${devicePath}!`);
          return true;
        } catch (err) {
          logger.deepDebug(`Not a ${devModule} device! Device class could not be found: ${devicePath}`);
          if (!err.code || err.code !== 'MODULE_NOT_FOUND') {
            // seems like a crash so display the error
            logger.debug(`Error while trying to load device class: \n ${err} \n ${err.stack}`);
          }
        }
      });
    }

    // try to find module class for device by spec
    if (!deviceClass) {
      logger.debug(`Did not find device class! Trying to identify device from miot spec!`);
      let devType = await DeviceFactory.identifyDeviceTypeByModel(miotDevice, specDir, logger);
      if (devType) {
        logger.debug(`Got device type ${devType} from spec!`);
        let devicePath = `../modules/${devType.toLowerCase()}/${devType}Device.js`
        try {
          deviceClass = require(devicePath);
          logger.debug(`Found device type class at ${devicePath}!`);
          logger.info(`Using module class for device type ${devType}, indentified by miot spec! Not all features might work!`);
        } catch (err) {
          logger.info(`Device class for device type ${devType} at ${devicePath} not found! Devices with the type are not supported yet!`)
        }
      }
    }

    // unknown - use unknown class
    if (!deviceClass) {
      logger.debug(`No device class found! Falling back to UnknownDevice!`);
      deviceClass = UnknownDevice;
    }

    return deviceClass;
  }

  static async getCustomDeviceClass(miotDevice, specDir, logger) {
    logger.debug(`Custom accessory requires miot spec! Trying to fetch...`);
    try {
      await DeviceFactory._loadCachedMiotSpecIfAvailable(miotDevice, specDir, logger);
      await miotDevice.fetchMiotSpec(false);
    } catch (err) {
      logger.error(`A custom accessory requires the miot spec but fetch failed! Cannot create a custom accessory!`);
      logger.debug(`Error while trying to fetch miot spec: \n ${err} \n ${err.stack}`);
    }
    logger.debug(`Creating a custom device!`);
    return CustomDevice;
  }

  static async identifyDeviceTypeByModel(miotDevice, specDir, logger) {
    try {
      await DeviceFactory._loadCachedMiotSpecIfAvailable(miotDevice, specDir, logger);
      await miotDevice.fetchMiotSpec(false);

      logger.debug(`Using ${miotDevice.getType()} type and ${miotDevice.getDescription()} description for device identification!`);

      let identifiedDevType = DevTypes.identifyDeviceBySpecType(miotDevice.getType());

      if (!identifiedDevType) {
        identifiedDevType = DevTypes.identifyDeviceBySpecType(miotDevice.getDescription());
      }

      if (!identifiedDevType) {
        logger.debug(`Could not identify device!`);
      }

      return identifiedDevType;
    } catch (err) {
      logger.debug(`Failed to fetch miot spec, continuing without extended device info!`);
      logger.deepDebug(`Error while trying to fetch miot spec: \n ${err} \n ${err.stack}`);
    }
  }

  static async _loadCachedMiotSpecIfAvailable(miotDevice, specDir, logger) {
    if (miotDevice && !miotDevice.getMiotSpec()) {
      let fileName = specDir + miotDevice.getModel() + '.spec.json';
      try {
        const cachedMiotSpec = await fs.readFile(fileName, 'utf8');
        if (cachedMiotSpec) {
          logger.debug(`Found cached miot spec for device: ${miotDevice.getModel()}`);
          miotDevice.setMiotSpec(JSON.parse(cachedMiotSpec));
        }
      } catch (err) {
        logger.debug('No cached miot spec found! Trying to fetch from https://miot-spec.org/');
      }
    }
  }

}

module.exports = DeviceFactory;

const DevTypes = require('../constants/DevTypes.js');
const RobotCleanerMatterAccessory = require('../modules/robotcleaner/RobotCleanerMatterAccessory.js');


class MatterAccessoryFactory {

  static async createMatterAccessory(name, device, uuid, config, api, logger, cachedDeviceInfo, restoredMatterAccessory, options = {}) {
    if (!device || device.getType() !== DevTypes.ROBOT_CLEANER) {
      return null;
    }

    const matterAccessory = new RobotCleanerMatterAccessory(name, device, uuid, config, api, logger, cachedDeviceInfo, restoredMatterAccessory, options);
    return matterAccessory.init();
  }

}

module.exports = MatterAccessoryFactory;

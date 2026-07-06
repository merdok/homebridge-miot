const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'logout';
exports.description = 'Log out from the MiCloud';
exports.builder = {
  'homebridge-storage': {
    type: 'string',
    description: 'Homebridge storage path where the cached MiCloud session should also be cleared'
  }
};

exports.handler = async argv => {
  const {
    homebridgeStorage
  } = argv;

  MiCloudHelper.logout();
  log.success(`Successfully logged out from the MiCloud!`);
  if (homebridgeStorage) {
    MiCloudHelper.clearHomebridgeCachedSession(homebridgeStorage);
    log.success(`Successfully cleared the MiCloud session from Homebridge storage at ${chalk.green.bold(homebridgeStorage)}`);
  }

  process.exit(0);
};

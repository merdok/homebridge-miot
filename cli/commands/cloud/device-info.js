const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'device-info <deviceId>';
exports.description = 'Get device info for the specified device from MiCloud';
exports.builder = {
  country: {
    required: false,
    alias: 'c',
    type: 'string',
    description: 'Country code'
  }
};

exports.handler = async argv => {
  let {
    deviceId,
    country
  } = argv;

  if (!deviceId) {
    log.error(`Missing device id!`);
    process.exit(0);
  }

  if (!MiCloudHelper.isLoggedIn()) {
    log.error(`Not logged in to MiCloud! Please log in first!`);
    process.exit(0);
  }

  MiCloudHelper.setCountry(country);

  log.info(`Getting info for device with id ${chalk.yellow.bold(deviceId)} from country ${chalk.magenta.bold(MiCloudHelper.getCountry())}...`);

  let result = await MiCloudHelper.getDevice(deviceId);
  if (result !== undefined) {
    log.success(`Got device info from MiCloud`);
    log.plain(chalk.bold(JSON.stringify(result, null, 2)));
  } else {
    log.error(`The device with id ${chalk.yellow.bold(deviceId)} could not be found on the ${chalk.magenta.bold(MiCloudHelper.getCountry())} server! Please make sure that the specified micloud country is correct and the device id is correct!`);
  }

  process.exit(0);
};

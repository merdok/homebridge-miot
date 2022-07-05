const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'country <country>';
exports.description = 'Set the default country';
exports.builder = {};

exports.handler = async argv => {
  let {
    country
  } = argv;

  if (!country) {
    log.error(`Missing country!`);
    process.exit(0);
  }

  try {
    await MiCloudHelper.setDefaultCountry(country);
    log.info(`Default country successfully set to ${chalk.magenta.bold(country)}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

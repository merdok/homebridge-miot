const chalk = require('chalk');
const log = require('../../log');
const MiioProtocolHelper = require('../../../lib/tools/MiioProtocolHelper');

exports.command = 'show <ip>';
exports.description = 'Show the stored token for the given device';
exports.builder = {};

exports.handler = async argv => {
  const {
    ip
  } = argv;

  if (!ip) {
    log.error(`Missing ip! Please specify an ip!`);
  } else {
    let token = await MiioProtocolHelper.getStoredToken(ip);
    if (token) {
      log.info(`Stored token for the device with ip ${chalk.yellow(ip)} ----> ${chalk.magenta(token)}`);
    } else {
      log.info(`The device with ip ${chalk.yellow(ip)} has no token stored!`);
    }
  }

  process.exit(0);
};

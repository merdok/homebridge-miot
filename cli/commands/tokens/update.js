const chalk = require('chalk');
const log = require('../../log');
const MiioProtocolHelper = require('../../../lib/tools/MiioProtocolHelper');

exports.command = 'update <ip> <token>';
exports.description = 'Update the token to use for the given device';
exports.builder = {};

exports.handler = async argv => {
  const {
    ip,
    token
  } = argv;

  if (!ip) {
    log.error(`Missing ip! Please specify an ip!`);
  } else if (!token) {
    log.error(`Missing token! Please specify a token!`);
  } else {
    MiioProtocolHelper.updateStoredToken(ip, token);
    log.info(`Updated token for device with ip ${chalk.yellow(ip)} to ${chalk.magenta(token)}`);
  }

  process.exit(0);
};

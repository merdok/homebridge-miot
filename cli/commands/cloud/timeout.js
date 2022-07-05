const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'timeout <timeout>';
exports.description = 'Set the default request timeout';
exports.builder = {};

exports.handler = async argv => {
  let {
    timeout
  } = argv;

  if (!timeout) {
    log.error(`Missing timeout!`);
    process.exit(0);
  }

  try {
    await MiCloudHelper.setDefaultTimeout(timeout);
    log.info(`Default timeout successfully set to ${chalk.inverse(timeout)}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

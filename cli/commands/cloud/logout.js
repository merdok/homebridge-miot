const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'logout';
exports.description = 'Log out from the MiCloud';
exports.builder = {};

exports.handler = async argv => {
  MiCloudHelper.logout();
  log.success(`Successfully logged out from the MiCloud!`);

  process.exit(0);
};

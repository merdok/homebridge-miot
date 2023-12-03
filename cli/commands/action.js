const log = require('../log');
const chalk = require('chalk');
const MiioProtocolHelper = require('../../lib/tools/MiioProtocolHelper');
const MiotProtocolUtils = require('../../lib/utils/MiotProtocolUtils');

exports.command = 'action <ip> <actionId>';
exports.description = 'Execute the action with the specified action id!';
exports.builder = {
  token: {
    required: false,
    alias: 't',
    type: 'string',
    description: 'The device token'
  },
  retries: {
    required: false,
    alias: 'r',
    type: 'number',
    description: 'Number of retries'
  },
  timeout: {
    required: false,
    alias: 'T',
    type: 'number',
    description: 'Timeout'
  },
  debug: {
    required: false,
    alias: 'd',
    type: 'boolean',
    description: 'Enable debug output'
  }
};

exports.handler = async argv => {
  const {
    ip,
    actionId,
    token,
    retries,
    timeout,
    debug
  } = argv;

  let storedToken = MiioProtocolHelper.getStoredToken(ip);

  if (!storedToken && !token) {
    log.error(`No stored token for the device ${chalk.yellow(ip)} found! Please store a token or use the --token argument!`);
    process.exit(0);
  }

  let actionIdStr = String(actionId); // make sure we have a string

  if (!MiotProtocolUtils.isSpecId(actionIdStr)) {
    log.error(`The specified action id is incorrect!`);
    process.exit(0);
  }

  let tokenToUse = token || storedToken;

  const actionRequest = {};
  actionRequest.siid = parseInt(actionIdStr.split('.')[0]);
  actionRequest.aiid = parseInt(actionIdStr.split('.')[1]);
  actionRequest.in = [];

  try {
    log.info(`Connecting to device at  ${chalk.yellow(ip)}`);
    await MiioProtocolHelper.connect(ip, tokenToUse);
    log.info(`Device found! Executing action: ${chalk.cyan.bold(actionId)}`);
    const res = await MiioProtocolHelper.send(ip, 'action', actionRequest, retries, timeout, debug);
    log.success(`Successfully executed the action!`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

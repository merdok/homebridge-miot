const log = require('../log');
const chalk = require('chalk');
const MiioProtocolHelper = require('../../lib/tools/MiioProtocolHelper');

exports.command = 'test <ip>';
exports.description = 'Test connection to a device';
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

  let tokenToUse = token || storedToken;

  try {
    log.info(`Connecting to device at ${chalk.yellow(ip)}`);
    await MiioProtocolHelper.connect(ip, tokenToUse);
    const res = await MiioProtocolHelper.getInfo(ip, retries, timeout, debug);
    log.success(`Connected to device at ${chalk.yellow(ip)}! Token and ip are correct!`);
    log.plain(`Device info:`);
    log.plain(`${chalk.bold(JSON.stringify(res, null, 2))}`);
  } catch (err) {
    log.plain(err.message);
    log.error(`Could not connect to the device at ${chalk.yellow(ip)}! Make sure the ip and token are correct!`);
  }

  process.exit(0);
};

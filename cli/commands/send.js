const log = require('../log');
const chalk = require('chalk');
const MiioProtocolHelper = require('../../lib/tools/MiioProtocolHelper');

exports.command = 'send <ip> <method> [params]';
exports.description = 'Call a raw method on a device';
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
    method,
    params,
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
  const parsedParams = params ? JSON.parse(params) : [];

  try {
    log.info(`Connecting to device at  ${chalk.yellow(ip)}`);
    await MiioProtocolHelper.connect(ip, tokenToUse);
    log.info(`Device found! Sending command: ${chalk.blueBright.bold(method)} ${chalk.cyan.bold(JSON.stringify(parsedParams))}`);
    const res = await MiioProtocolHelper.send(ip, method, parsedParams, retries, timeout, debug);
    log.success(`Response from device -> ${chalk.bold(JSON.stringify(res))}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

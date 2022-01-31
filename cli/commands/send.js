const log = require('../log');
const MiioProtocolHelper = require('../../lib/tools/MiioProtocolHelper');

exports.command = 'send <ip> <token> <method> [params]';
exports.description = 'Call a raw method on a device';
exports.builder = {};

exports.handler = async argv => {
  const {
    ip,
    token,
    method,
    params
  } = argv;

  const parsedParams = params ? JSON.parse(params) : [];

  try {
    log.info(`Connecting to device at ${ip}`);
    await MiioProtocolHelper.connect(ip, token);
    log.info(`Device found! Sending command: ${method} ${JSON.stringify(parsedParams)}`);
    const res = await MiioProtocolHelper.send(ip, method, parsedParams);
    log.success(`Response from device -> ${JSON.stringify(res)}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

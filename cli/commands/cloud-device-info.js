const log = require('../log');
const MiCloudHelper = require('../../lib/tools/MiCloudHelper');

exports.command = 'cloud-device-info';
exports.description = 'Get device info for the specified device from MiCloud';
exports.builder = {
  username: {
    alias: 'u',
    type: 'string',
    description: 'Username'
  },
  password: {
    alias: 'p',
    type: 'string',
    description: 'Password'
  },
  file: {
    alias: 'f',
    type: 'string',
    description: 'File with the micloud credentials'
  },
  deviceId: {
    alias: 'd',
    type: 'string',
    description: 'Device id (did) for which to fetch the info'
  },
  country: {
    alias: 'c',
    type: 'string',
    description: 'Country code',
    default: 'cn'
  }
};

exports.handler = async argv => {
  let {
    username,
    password,
    file,
    deviceId,
    country
  } = argv;

  try {
    await MiCloudHelper.login(username, password, file);
  } catch (err) {
    log.error(err.message);
    return;
  }

  MiCloudHelper.setCountry(country);

  log.info(`Getting device info...`);

  let result = await MiCloudHelper.getDevice(deviceId);
  if (result !== undefined) {
    log.info(`Got device info from MiCloud`);
    log.info(JSON.stringify(result, null, 2));
  } else {
    log.error(`The device with id ${deviceId} could not be found on the ${country} server! Please make sure that the specified micloud country is correct and the device id is correct!`);
  }

};

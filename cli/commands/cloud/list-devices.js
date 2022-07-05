const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'list-devices';
exports.description = 'List all devices from MiCloud';
exports.builder = {
  country: {
    required: false,
    alias: 'c',
    type: 'string',
    description: 'Country code'
  }
};

exports.handler = async argv => {
  let {
    deviceId,
    country
  } = argv;

  if (!MiCloudHelper.isLoggedIn()) {
    log.error(`Not logged in to MiCloud! Please log in first!`);
    process.exit(0);
  }

  var devices = [];

  log.info(`Getting device list...`);

  // list all device from all available countries
  for (const country of MiCloudHelper.availableCountries) {
    try {
      log.info(`Getting devices from country ${chalk.magenta.bold(country)}...`);
      MiCloudHelper.setCountry(country);
      // prevent duplicate devices
      const allList = (await MiCloudHelper.getDevices()).filter(device => !devices.find(d => d.did === device.did));
      // filter out device without an local ip and without ssid (most probably bluetooth devices)
      const validList = allList.filter(device => device.localip && device.localip.length > 0 && device.ssid && device.ssid.length > 0);
      validList.map(device => device.country = country);
      devices.push(...validList);
      log.info(`Found ${chalk.bold.underline(validList.length)} devices!`);
    } catch (err) {
      log.error(err.message);
    }
  }

  if (devices) {
    devices = devices.map(({
      name,
      model,
      token,
      localip,
      did,
      country
    }) => {
      return {
        name,
        model,
        token,
        localip,
        did,
        country
      };
    });

    log.success(`Got devices from MiCloud!`);
    log.table(devices);
  } else {
    log.warn(`No device found!`);
  }

  process.exit(0);
};

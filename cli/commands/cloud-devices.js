const log = require('../log');
const MiCloudHelper = require('../../lib/tools/MiCloudHelper');

exports.command = 'cloud-devices';
exports.description = 'List all devices from MiCloud';
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
  }
};

exports.handler = async argv => {
  let {
    username,
    password,
    file
  } = argv;

  try {
    await MiCloudHelper.login(username, password, file);
  } catch (err) {
    log.error(err.message);
    return;
  }

  var devices = [];

  log.info(`Getting devices...`);

  // list all device from all available countries
  for (const country of MiCloudHelper.availableCountries) {
    try {
      MiCloudHelper.setCountry(country);
      // prevent duplicate devices
      const allList = (await MiCloudHelper.getDevices()).filter(device => !devices.find(d => d.did === device.did));
      // filter out device without an local ip and without ssid (most probably bluetooth devices)
      const validList = allList.filter(device => device.localip && device.localip.length > 0 && device.ssid && device.ssid.length > 0);
      validList.map(device => device.country = country);
      devices.push(...validList);
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

};

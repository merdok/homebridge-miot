const chalk = require('chalk');
const log = require('../../log');
const {
  getSession,
  printSessionMetadata,
  checkSession
} = require('../../utils/cloud-session');

exports.command = 'session';
exports.description = 'Inspect a cached MiCloud session';
exports.builder = {
  storage: {
    type: 'string',
    choices: ['cli', 'homebridge'],
    default: 'cli',
    description: 'Cached session storage to inspect'
  },
  'homebridge-storage': {
    type: 'string',
    description: 'Homebridge storage path, used when --storage homebridge is selected'
  },
  check: {
    type: 'boolean',
    description: 'Validate the cached session with a read-only MiCloud device list request'
  },
  country: {
    type: 'string',
    default: 'cn',
    description: 'MiCloud country to use for --check'
  }
};

exports.handler = async argv => {
  const {
    storage,
    homebridgeStorage,
    check,
    country
  } = argv;

  try {
    const {
      storagePath,
      tokenJson
    } = getSession(storage, homebridgeStorage);

    printSessionMetadata(storage, storagePath, tokenJson);

    if (check) {
      log.info(`Checking cached session using country ${chalk.magenta.bold(country)}...`);
      const result = await checkSession(tokenJson, country);
      log.success(`Validity check: success. Country: ${result.country}. Devices visible: ${result.deviceCount}`);
    } else {
      log.info(`Validity check: skipped`);
    }
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

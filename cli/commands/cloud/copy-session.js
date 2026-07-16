const chalk = require('chalk');
const log = require('../../log');
const {
  getSession,
  setSession,
  printSessionMetadata,
  checkSession
} = require('../../utils/cloud-session');

exports.command = 'copy-session';
exports.description = 'Copy a cached MiCloud session between CLI and Homebridge storage';
exports.builder = {
  from: {
    type: 'string',
    choices: ['cli', 'homebridge'],
    demandOption: true,
    description: 'Source cached session storage'
  },
  to: {
    type: 'string',
    choices: ['cli', 'homebridge'],
    demandOption: true,
    description: 'Destination cached session storage'
  },
  'homebridge-storage': {
    type: 'string',
    description: 'Homebridge storage path, used when either source or destination is homebridge'
  },
  force: {
    type: 'boolean',
    description: 'Overwrite an existing destination cached session'
  },
  check: {
    type: 'boolean',
    description: 'Validate the copied cached session with a read-only MiCloud device list request'
  },
  country: {
    type: 'string',
    default: 'cn',
    description: 'MiCloud country to use for --check'
  }
};

exports.handler = async argv => {
  const {
    from,
    to,
    homebridgeStorage,
    force,
    check,
    country
  } = argv;

  try {
    if (from === to) {
      throw new Error(`Source and destination storage must be different.`);
    }

    const source = getSession(from, homebridgeStorage);
    if (!source.tokenJson) {
      throw new Error(`No MiCloud session found in ${from} storage.`);
    }

    const destination = getSession(to, homebridgeStorage);
    if (destination.tokenJson && !force) {
      throw new Error(`A MiCloud session already exists in ${to} storage. Use --force to overwrite it.`);
    }

    const destinationPath = setSession(to, homebridgeStorage, source.tokenJson);
    log.success(`Copied MiCloud session from ${chalk.magenta.bold(from)} to ${chalk.magenta.bold(to)}.`);
    printSessionMetadata(to, destinationPath, source.tokenJson);

    if (check) {
      log.info(`Checking copied session using country ${chalk.magenta.bold(country)}...`);
      const result = await checkSession(source.tokenJson, country);
      log.success(`Validity check: success. Country: ${result.country}. Devices visible: ${result.deviceCount}`);
    } else {
      log.info(`Validity check: skipped`);
    }
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

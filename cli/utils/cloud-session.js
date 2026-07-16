const chalk = require('chalk');
const log = require('../log');
const MiCloudHelper = require('../../lib/tools/MiCloudHelper');

function getSession(storage, homebridgeStorage) {
  if (storage === 'cli') {
    return {
      storagePath: MiCloudHelper.configFile,
      tokenJson: MiCloudHelper.getCliCachedSession()
    };
  }

  if (storage === 'homebridge') {
    const storagePath = MiCloudHelper.getHomebridgeStoragePath(homebridgeStorage);
    return {
      storagePath,
      tokenJson: MiCloudHelper.getHomebridgeCachedSession(storagePath)
    };
  }

  throw new Error(`Unsupported session storage: ${storage}`);
}

function setSession(storage, homebridgeStorage, tokenJson) {
  if (storage === 'cli') {
    MiCloudHelper.setServiceToken(tokenJson);
    return MiCloudHelper.configFile;
  }

  if (storage === 'homebridge') {
    const storagePath = MiCloudHelper.getHomebridgeStoragePath(homebridgeStorage);
    MiCloudHelper.setHomebridgeCachedSession(storagePath, tokenJson);
    return storagePath;
  }

  throw new Error(`Unsupported session storage: ${storage}`);
}

function printSessionMetadata(storage, storagePath, tokenJson) {
  log.info(`Storage: ${chalk.magenta.bold(storage)}`);
  log.info(`Path: ${chalk.green.bold(storagePath)}`);

  if (!tokenJson) {
    log.warn(`MiCloud session found: no`);
    return;
  }

  const metadata = MiCloudHelper.getSessionMetadata(tokenJson);
  log.success(`MiCloud session found: yes`);
  log.info(`Login time: ${metadata.displayLoggedInAt}`);
  log.info(`Login method: ${metadata.loginMethod}`);
  log.info(`Timestamp age: ${metadata.age}`);

  const table = Object.entries(metadata.fields).map(([field, value]) => {
    return {
      field,
      present: value.present,
      length: value.length,
      sha256: value.sha256 || ''
    };
  });
  log.table(table);
}

async function checkSession(tokenJson, country) {
  if (!tokenJson) {
    throw new Error(`No MiCloud session found.`);
  }

  return MiCloudHelper.checkSession(tokenJson, country);
}

module.exports = {
  getSession,
  setSession,
  printSessionMetadata,
  checkSession
};

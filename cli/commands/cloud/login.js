const log = require('../../log');
const chalk = require('chalk');
const fs = require('fs').promises;
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'login';
exports.description = 'Log in to the MiCloud';
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

  if (!file && (!username || !password)) {
    file = './micloudlogin.json';
  }

  if (file) {
    if (file.endsWith('/')) {
      file = file + 'micloudlogin.json';
    }
    const micloudFile = await fs.readFile(file, 'utf8');
    if (micloudFile) {
      log.info(`Found mi cloud credentials file at ${chalk.green.bold(file)}`);
      micloudJson = JSON.parse(micloudFile);
      username = micloudJson.username;
      password = micloudJson.password;
    } else {
      log.error(`Could not read the credentials file at${chalk.green(file)}`);
      process.exit(0);
    }
  }

  if (!file && (!username || !password)) {
    log.error(`You must specify a username and password or a micloudlogin.json file containing the credentials!`);
    process.exit(0);
  }

  log.info(`Log in to MiCloud with username ${chalk.yellow.bold(username)}`);

  try {
    await MiCloudHelper.login(username, password);
    log.success(`Successfully logged in to MiCloud with username ${chalk.yellow.bold(username)}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

const log = require('../../log');
const chalk = require('chalk');
const fs = require('fs').promises;
const qrcode = require('qrcode-terminal');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'login';
exports.description = 'Log in to the MiCloud';
exports.builder = {
  qr: {
    type: 'boolean',
    description: 'Log in using a QR code'
  },
  locale: {
    type: 'string',
    default: 'zh_CN',
    description: 'Locale to use for QR login'
  },
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
    qr,
    locale,
    username,
    password,
    file
  } = argv;

  if (qr) {
    await loginWithQr(locale);
    process.exit(0);
  }

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
      const micloudJson = JSON.parse(micloudFile);
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

async function loginWithQr(locale) {
  try {
    log.info(`Creating MiCloud QR login session...`);
    const qrLogin = await MiCloudHelper.createQrLogin(locale);
    const qrValue = qrLogin.loginUrl || qrLogin.qr;
    const pollInterval = Math.max(Number(qrLogin.timeInterval || 3), 2) * 1000;
    const timeoutAt = Date.now() + (Number(qrLogin.timeout || 300) * 1000);

    log.info(`Scan the QR code with the Mi Home app or Xiaomi account app, then approve the login.`);
    qrcode.generate(qrValue, {
      small: true
    });

    if (qrLogin.loginUrl) {
      log.info(`If the QR code cannot be scanned, open this URL: ${chalk.cyan(qrLogin.loginUrl)}`);
    }

    while (Date.now() <= timeoutAt) {
      await wait(pollInterval);
      const qrLoginData = await MiCloudHelper.pollQrLogin(qrLogin.lp);
      if (qrLoginData.success) {
        await MiCloudHelper.completeQrLogin(qrLoginData);
        log.success(`Successfully logged in to MiCloud using QR code.`);
        return;
      }

      if (qrLoginData.desc) {
        log.info(`Waiting for QR confirmation: ${qrLoginData.desc}`);
      } else {
        log.info(`Waiting for QR confirmation...`);
      }
    }

    log.error(`QR login timed out. Please run the command again to create a new QR code.`);
  } catch (err) {
    log.error(err.message);
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

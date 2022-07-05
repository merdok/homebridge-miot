const log = require('../../log');
const chalk = require('chalk');
const MiCloudHelper = require('../../../lib/tools/MiCloudHelper');

exports.command = 'get-props [params]';
exports.description = 'Execute the get properties command over MiCloud';
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
    params,
    country
  } = argv;

  if (!params) {
    log.error(`Missing params!`);
    process.exit(0);
  }

  if (!MiCloudHelper.isLoggedIn()) {
    log.error(`Not logged in to MiCloud! Please log in first!`);
    process.exit(0);
  }

  MiCloudHelper.setCountry(country);
  const parsedParams = MiCloudHelper.parseParams(params);

  try {
    log.info(`Executing ${chalk.blueBright.bold("get_properties")} command over MiCloud country ${chalk.magenta.bold(MiCloudHelper.getCountry())} with params ${chalk.cyan.bold(JSON.stringify(parsedParams))} - timeout: ${MiCloudHelper.getRequestTimeout()}`);
    const res = await MiCloudHelper.getProps(parsedParams);
    log.success(`Response from MiCloud -> ${chalk.bold(JSON.stringify(res))}`);
  } catch (err) {
    log.error(err.message);
  }

  process.exit(0);
};

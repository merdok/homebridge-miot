const log = require('../log');
const chalk = require('chalk');
const MiotSpecFetcher = require('../../lib/protocol/MiotSpecFetcher');

exports.command = 'fetch-metadata <model>';
exports.description = 'Fetch the metadata for the specified device model';
exports.builder = {};

exports.handler = async argv => {
  const deviceModel = argv.model;

  if (!deviceModel) {
    log.error(`Please specify a device model!`);
    return;
  }

  try {
    log.info(`Fetching ${chalk.yellow.bold(deviceModel)} metadata from miot spec...`);
    const result = await MiotSpecFetcher.fetchMiotSpecByModel(deviceModel, true);
    let {
      description,
      properties,
      actions,
      events
    } = result;

    properties = Object.values(properties).map((prop) => {
      const name = prop.name;
      const id = `${prop.siid}.${prop.piid}`;
      const description = prop.description;
      return {
        name,
        id,
        description
      };
    });

    actions = Object.values(actions).map((action) => {
      const name = action.name;
      const id = `${action.siid}.${action.aiid}`;
      const description = action.description;
      const inProps = action.in || '';
      return {
        name,
        id,
        description,
        inProps
      };
    });

    events = Object.values(events).map((tmpEvent) => {
      const name = tmpEvent.name;
      const id = `${tmpEvent.siid}.${tmpEvent.eiid}`;
      const description = tmpEvent.description;
      return {
        name,
        id,
        description
      };
    });

    log.success(`Got device miot spec! It is a ${description}!`);
    log.info(`Properties:`);
    log.table(properties);

    if (actions && actions.length > 0) {
      log.info(`Actions:`);
      log.table(actions);
    }

    if (events && events.length > 0) {
      log.info(`Events:`);
      log.table(events);
    }

  } catch (err) {
    log.error(err.message);
  }
};

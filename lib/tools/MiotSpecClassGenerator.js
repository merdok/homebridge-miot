const EventEmitter = require('events');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const os = require('os');
const MiotSpecFetcher = require('../protocol/MiotSpecFetcher.js');
const Logger = require('../utils/Logger.js');
const DevTypes = require('../constants/DevTypes.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all
// device types: http://miot-spec.org/miot-spec-v2/spec/devices
// service types: http://miot-spec.org/miot-spec-v2/spec/services


class MiotSpecClassGenerator extends EventEmitter {
  constructor(model, miotSpecUrl, devName, devType, requiresMiCloud, oDir) {
    super();

    // config
    this.model = model || 'newDevice';
    this.miotSpecUrl = miotSpecUrl;
    this.devName = devName || 'Unknown';
    this.devType = devType;
    this.requiresMiCloud = requiresMiCloud || false;
    this.logger = new Logger();

    this.outputDir = oDir || './'

    if (this.outputDir.endsWith('/') === false) {
      this.outputDir = this.outputDir + '/';
    }

    this.filePath = this.outputDir + this.model + '.js';

    this.parentDevClass = "GenericDevice";

    this.devClassName = this.model.split(".").map((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }).join("")
  }


  /*----------========== PUBLIC ==========----------*/

  async generate() {
    // make sure we have the miot spec url, if not then try to find it by model
    if (!this.miotSpecUrl && this.model) {
      try {
        this.logger.info(`===--> Missing miot spec url! Trying to find by model!`);
        this.miotSpecUrl = await MiotSpecFetcher.findDeviceMiotSpecUrlByModel(this.model);
        this.logger.info(`===--> Got miot spec url: ${this.miotSpecUrl}`);
      } catch (err) {
        let errMsg = `===--> Failed to find miot spec url for ${this.model}. Is the specified device model correct?`;
        this.logger.error(errMsg);
        this.logger.error(err);
        throw new Error(errMsg);
      }
    }

    // create and write the actual file
    if (this.miotSpecUrl) {
      this._prepareFile();

      this.logger.info(`===--> Requesting miot spec!`);
      const specResult = await MiotSpecFetcher.fetchMiotSpecFromUrl(this.miotSpecUrl, true);
      const {
        type,
        description,
        services,
        properties,
        actions,
        events
      } = specResult;

      this._prepareParentDeviceClass(type, description);
      this.logger.info(`===--> Parent device class: ${this.parentDevClass}`);

      await this._generateClassHeader();
      this.logger.info(`===--> Done class header!`);

      await this._generateServices(services);
      this.logger.info(`===--> Done services! Parsed ${services.length} services!`);

      await this._generateProperties(properties);
      this.logger.info(`===--> Done properties! Parsed ${Object.keys(properties).length} properties!`);

      await this._generateActions(actions);
      this.logger.info(`===--> Done actions! Parsed ${Object.keys(actions).length} actions!`);

      await this._generateEvents(events);
      this.logger.info(`===--> Done events! Parsed ${Object.keys(events).length} events!`);

      await this._generateClassFooter();
      this.logger.info(`===--> Done class footer!`);

      this.logger.info(`Finished! Generated the spec file!`);
    } else {
      this.logger.info(`Missing miot spec url!`);
    }
  }

  getOutputFilePath() {
    return this.filePath;
  }

  getDeviceType() {
    return this.devType;
  }


  /*----------========== PRIVATE ==========----------*/

  async _prepareFile() {
    // check if the output directory exists, if not then create it recursively
    try {
      await fs.access(this.outputDir)
    } catch (err) {
      await fs.mkdir(this.outputDir, {
        recursive: true
      });
    }

    // remove the file if already exists
    try {
      await fs.unlink(this.filePath);
    } catch (err) {
      //file does not exist
    }
  }

  _prepareParentDeviceClass(specType, specDescription) {
    const devType = specType ? specType.split(':')[3] : null;
    if (!this.devType) {
      this.devType = DevTypes.identifyDeviceBySpecType(devType);
    }

    if (!this.devType) {
      this.devType = DevTypes.identifyDeviceBySpecType(specDescription);
    }

    if (!this.devType) {
      this.devType = 'Generic';
    }

    if (this.devType) {
      this.parentDevClass = `${this.devType}Device`;
    }
  }

  async _generateClassHeader() {
    const classHeaderTemplate =
      `const ${this.parentDevClass} = require('../${this.parentDevClass}.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ${this.devClassName} extends ${this.parentDevClass} {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return \'${this.devName}\';
  }

  getMiotSpecUrl() {
    return \'${this.miotSpecUrl}\';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return ${this.requiresMiCloud};
  }


  /*----------========== METADATA ==========----------*/`
    await fs.appendFile(this.filePath, classHeaderTemplate, 'utf8');
    await this._addNewLines(2);
  }

  async _generateServices(services) {
    const initDevServices = `  initDeviceServices() {` + os.EOL;
    await fs.appendFile(this.filePath, initDevServices, 'utf8');
    if (services) {
      services.forEach(async serviceSpec => {
        let serviceEntry = `    this.createServiceByString(\'${this._stringifyEscaped(serviceSpec)}\');`
        this.logger.info(`-->> Writting service entry: ${serviceEntry}`);
        await fs.appendFile(this.filePath, serviceEntry + os.EOL, 'utf8');
      });
    }
    const closeDevServices = `  }` + os.EOL;
    await fs.appendFile(this.filePath, closeDevServices, 'utf8');
    await this._addNewLines(1);
  }

  async _generateProperties(properties) {
    const initDevProps = `  initDeviceProperties() {` + os.EOL;
    await fs.appendFile(this.filePath, initDevProps, 'utf8');
    if (properties) {
      Object.keys(properties).forEach(async key => {
        const prop = properties[key];
        delete prop.name; // we do no need the name
        let propEntry = `    this.addPropertyByString(\'${key}\', \'${this._stringifyEscaped(prop)}\');`
        this.logger.info(`-->> Writting property entry: ${propEntry}`);
        await fs.appendFile(this.filePath, propEntry + os.EOL, 'utf8');

      });
    }
    const closeDevProps = `  }` + os.EOL;
    await fs.appendFile(this.filePath, closeDevProps, 'utf8');
    await this._addNewLines(1);
  }

  async _generateActions(actions) {
    const initDevActions = `  initDeviceActions() {` + os.EOL;
    await fs.appendFile(this.filePath, initDevActions, 'utf8');
    if (actions) {
      Object.keys(actions).forEach(async key => {
        const action = actions[key];
        delete action.name; // we do no need the name
        let actionEntry = `    this.addActionByString(\'${key}\', \'${this._stringifyEscaped(action)}\');`
        this.logger.info(`-->> Writting action entry: ${actionEntry}`);
        await fs.appendFile(this.filePath, actionEntry + os.EOL, 'utf8');
      });
      if (Object.keys(actions).length === 0) {
        const noDevActions = `   //no actions` + os.EOL;
        await fs.appendFile(this.filePath, noDevActions, 'utf8');
      }
    }
    const closeDevActions = `  }` + os.EOL;
    await fs.appendFile(this.filePath, closeDevActions, 'utf8');
    await this._addNewLines(1);
  }

  async _generateEvents(events) {
    const initDevEvents = `  initDeviceEvents() {` + os.EOL;
    await fs.appendFile(this.filePath, initDevEvents, 'utf8');
    if (events) {
      Object.keys(events).forEach(async key => {
        const eventObj = events[key];
        delete eventObj.name; // we do no need the name
        let eventEntry = `    this.addEventByString(\'${key}\', \'${this._stringifyEscaped(eventObj)}\');`
        this.logger.info(`-->> Writting event entry: ${eventEntry}`);
        await fs.appendFile(this.filePath, eventEntry + os.EOL, 'utf8');
      });
      if (Object.keys(events).length === 0) {
        const noDevEvents = `    //no events` + os.EOL;
        await fs.appendFile(this.filePath, noDevEvents, 'utf8');
      }
    }
    const closeDevEvents = `  }` + os.EOL;
    await fs.appendFile(this.filePath, closeDevEvents, 'utf8');
    await this._addNewLines(2);
  }

  async _generateClassFooter() {
    const classFooterTemplate =
      `  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ${this.devClassName};`
    await fs.appendFile(this.filePath, classFooterTemplate, 'utf8');
  }


  async _addNewLines(count) {
    for (let a = 0; a < count; a++) {
      await fs.appendFile(this.filePath, os.EOL, 'utf8');
    }
  }

  _stringifyEscaped(object) {
    //Stringify and escpase single quotes
    return JSON.stringify(object).replace(/'/g, "\\'");
  }

}

module.exports = MiotSpecClassGenerator;

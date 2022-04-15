const EventEmitter = require('events');
const fetch = require('node-fetch');
const MiioProtocol = require('./MiioProtocol.js');
const MiotSpecFetcher = require('./MiotSpecFetcher.js');
const MiotService = require('./MiotService.js');
const MiotProperty = require('./MiotProperty.js');
const MiotAction = require('./MiotAction.js');
const MiotEvent = require('./MiotEvent.js');
const MiCloud = require('./MiCloud.js');
const DevTypes = require('../constants/DevTypes.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const MiotProtocolHelpers = require('./MiotProtocolHelpers.js');

const COMMAND_GET = 'get_properties';
const COMMAND_SET = 'set_properties';
const COMMAND_ACTION = 'action';
const ALL_PROP_REQUEST_CHUNK_SIZE = 14;
const MAX_POLL_RETRIES = 4;

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all
// device types: http://miot-spec.org/miot-spec-v2/spec/devices
// service types: http://miot-spec.org/miot-spec-v2/spec/services

// Miot subcommand response codes
// | 0 | Success |
// | 1 | Request received, but the operation has not been completed yet |
// | -4001 | Unreadable attribute |
// | -4002 | Attribute is not writable |
// | -4003 | Properties, methods, events do not exist |
// | -4004 | Other internal errors |
// | -4005 | Attribute value error |
// | -4006 | Method in parameter error |
// | -4007 | did error


class MiotDevice extends EventEmitter {
  constructor(ip, token, deviceId, model, name, logger) {
    super();

    // config
    this.ip = ip;
    this.token = token;
    this.deviceId = deviceId;
    this.model = model;
    this.name = name;
    this.logger = logger;

    if (!this.ip) {
      this.logger.error(`ip required!`);
    }

    if (!this.token) {
      this.logger.error(`token required!`);
    }

    //device info
    this.miCloud = undefined;
    this.miCloudDeviceInfo = {};
    this.miotSpec = null;

    // prepare the variables
    this.connected = false;
    this.pollingInterval = Constants.DEFAULT_POLLING_INTERVAL;
    this.services = [];
    this.allPropertiesMap = {};
    this.allActionsMap = {};
    this.allEventsMap = {};
    this.updateDevicePropertiesInterval = undefined;
    this.pollRetries = 0;
    this.isMiCloudRequired = false;
    this.propertiesToMonitor = [];

    this.miCloudConfig = {};
    this.reducedPollingInterval = null;
    this.reconnectTimeout = Math.max(this.pollingInterval * 4, 30000); // 4 times alive polling interval, at least 30 seconds

    this.miioProtocol = new MiioProtocol(this.logger);
    this.miioProtocol.updateDevice(this.ip, {
      token: this.token
    })
  }


  /*----------========== CONNECTION ==========----------*/

  connect() {
    if (this.model && this.model.length > 0) {
      this.logger.info(`Model known: ${this.model}!`);
      this.emit(Events.MIOT_DEVICE_IDENTIFIED, this); // we have model info so we already know what device we are dealing with
    } else {
      this.logger.info(`Model unknown! Starting device discovery!`);
      this._startDeviceDiscovery(true, true);
    }
  }

  startPropertyPolling() {
    if (this.isConnected()) {
      this._startPropertyPolling();
    } else {
      this._startDeviceDiscovery(false, true);
    }
  }


  /*----------========== SETTINGS ==========----------*/

  setMiCloudConfig(newMiCloudConfig = {}) {
    this.miCloudConfig = newMiCloudConfig;
  }

  setPollingInterval(newPollingInterval = Constants.DEFAULT_POLLING_INTERVAL) {
    if (newPollingInterval >= 1000) {
      this.pollingInterval = newPollingInterval;
    }
  }

  requiresMiCloud() {
    return this.isMiCloudRequired || this._getMiCloudForce() === true;
  }

  setRequiresMiCloud(required = false) {
    this.isMiCloudRequired = required;
  }

  getPropertiesToMonitor() {
    return this.propertiesToMonitor || [];
  }

  setPropertiesToMonitor(propsToMonitor = []) {
    propsToMonitor = Array.isArray(propsToMonitor) ? propsToMonitor : [];
    this.propertiesToMonitor = [];
    if (propsToMonitor.length > 0) {
      this.propertiesToMonitor = propsToMonitor.filter(prop => this._canMonitorProperty(prop));
    }
  }

  addPropertyToMonitor(miotProp) {
    const propToMonitor = this.getProperty(miotProp);
    //if length 0 then we already monitoring all properties so no need to add
    if (this._canMonitorProperty(propToMonitor) && this.propertiesToMonitor && this.propertiesToMonitor.length !== 0 && !this.propertiesToMonitor.includes(propToMonitor.getName())) {
      this.propertiesToMonitor.push(propToMonitor.getName());
    }
  }

  setMiotSpec(miotSpec) {
    if (miotSpec) {
      this.miotSpec = miotSpec;
      this._parseMiotSpec();
    }
  }


  /*----------========== DEVICE CONTROL ==========----------*/
  async pollProperties() {
    if (this.isConnected()) {
      await this.requestAllProperties();
      this.emit(Events.MIOT_DEVICE_ALL_PROPERTIES_UPDATED, this);
      this.logger.deepDebug(`Device properties updated: \n${this.getBeautifiedAllPropNameValues()}`);
    } else {
      throw new Error('Device not connected');
    }
  }

  async fetchMiotSpec(forceFetch = false) {
    if (!this.getMiotSpec() || forceFetch) {
      this.logger.info(`Fetching device miot spec by model: ${this.getModel()}`);
      const result = await MiotSpecFetcher.fetchMiotSpecByModel(this.getModel(), true);
      this._processMiotSpecFetchResult(result);
    }
    return this.getMiotSpec();
  }

  async fetchMiotSpecFromUrl(specUrl, forceFetch = false) {
    if (!this.getMiotSpec() || forceFetch) {
      this.logger.info(`Fetching device miot spec from url: ${specUrl}`);
      const result = await MiotSpecFetcher.fetchMiotSpecFromUrl(specUrl, true);
      this._processMiotSpecFetchResult(result);
    }
    return this.getMiotSpec();
  }


  /*----------========== INFO ==========----------*/

  isLocallyConnected() {
    return this.connected;
  }

  isConnected() {
    if (this.requiresMiCloud()) {
      return this.isLocallyConnected() && this.isLoggedIntoMiCloud();
    }
    return this.isLocallyConnected();
  }

  getModel() {
    if (this.isConnected()) {
      return this.miioProtocol.getDevice(this.ip).deviceInfo.model;
    }
    return this.model;
  }

  getRawType() {
    return this.getMiotSpec() ? this.getMiotSpec().type : '';
  }

  getType() {
    return this.getRawType().split(':')[3] || null;
  }

  getDescription() {
    return this.getMiotSpec() ? this.getMiotSpec().description : '';
  }

  getDeviceInfo() {
    return this.miioProtocol.getDevice(this.ip).deviceInfo;
  }

  getDeviceId() {
    return this.deviceId;
  }

  getFirmwareRevision() {
    let fwRev;
    if (this.getDeviceInfo()) {
      fwRev = this.getDeviceInfo().fw_ver;
    }
    return fwRev;
  }

  isLoggedIntoMiCloud() {
    return this.miCloud && this.miCloud.isLoggedIn();
  }

  getMiotSpec() {
    return this.miotSpec;
  }


  /*----------========== DISCOVERY ==========----------*/

  async _startDeviceDiscovery(isInital = false, fullSetup = true) {
    //clear any previous discoveries which might be running
    if (this.deviceDiscoveryTimeout) clearTimeout(this.deviceDiscoveryTimeout);

    try {
      await this.miioProtocol.handshake(this.ip);
      const result = await this.miioProtocol.getInfo(this.ip);
      this.logger.info(`Device found: ${result.model}`);
      this._deviceFound(isInital, fullSetup);
    } catch (err) {
      this.logger.debug(err);
      this.logger.debug(`Could not connect to the device! Retrying in ${ this.reconnectTimeout/1000} seconds!`);
      if (this.isConnected()) {
        this._disconnect();
      }
      this.deviceDiscoveryTimeout = setTimeout(() => {
        this._startDeviceDiscovery();
      }, this.reconnectTimeout);
    }
  }

  async _deviceFound(isInital, fullSetup) {
    if (!this.isConnected()) {
      this.deviceDiscoveryTimeout = undefined;
      this.connected = true;
      let foundDeviceModel = this.getDeviceInfo().model;

      if (!this.model) {
        this.model = foundDeviceModel;
        this.emit(Events.MIOT_DEVICE_IDENTIFIED, this);
      } else if (this.model !== foundDeviceModel) {
        this.logger.warn(`Found device model ${foundDeviceModel} does not match specified model ${this.model}! Some services might not work!`);
      }

      try {
        await this._setupDeviceInternal(fullSetup);
        this.logger.info(`Connected to device: ${foundDeviceModel}`);
        this.emit(Events.MIOT_DEVICE_CONNECTED, this);
      } catch (error) {
        this.logger.warn(`Setup failed!`);
        this.logger.warn(error);
        this._reconnect();
        return; // If setup failed due to missing did or micloud error, do a reconnect and do not continue!
      }

      if (!isInital) {
        this._startPropertyPolling();
      }
    }
  }

  _disconnect() {
    this.connected = false;
    clearInterval(this.updateDevicePropertiesInterval);
    this.updateDevicePropertiesInterval = undefined;

    // if required, also refresh the micloud connection
    if (this.miCloud && this.requiresMiCloud()) {
      if (this.miCloud.isLoggedIn()) {
        this.miCloud.logout();
      }
    }

    this.logger.debug('Device diconnected!');
    this.emit(Events.MIOT_DEVICE_DISCONNECTED, this);
  }

  _reconnect() {
    this._disconnect();
    this.logger.debug(`Trying to reconnect in ${ this.reconnectTimeout/1000} seconds...`);
    this.deviceDiscoveryTimeout = setTimeout(() => {
      this._startDeviceDiscovery(false, false);
    }, this.reconnectTimeout);
  }


  /*----------========== SETUP ==========----------*/

  async _setupDeviceInternal(fullSetup) {
    this.logger.info(`Setting up miot device!`);
    if (!this.getDeviceId() || fullSetup) {
      await this._basicSetup();
    }

    // setup MiCloud if required
    await this._miCloudSetup();

    this.logger.info(`Device setup finished! Miot device ready!`);
  }

  async _basicSetup() {
    this.logger.debug(`Doing basic setup`);

    // get the device info
    this.logger.debug(`Device firmware: ${this.getDeviceInfo().fw_ver}`);
    this.logger.deepDebug(`Full device info: \n${JSON.stringify(this.getDeviceInfo(), null, 2)}`);

    // get the device deviceId if not specified
    if (!this.getDeviceId()) {
      if (this.isLocallyConnected() && this.miioProtocol) {
        this.deviceId = String(this.miioProtocol.getDevice(this.ip).did); // returns did as number, so convert o string
      }
      if (this.getDeviceId()) {
        this.logger.info(`Did not specified. Got did: ${this.getDeviceId()} from device!`);
      }
    }

    //make sure did is in a string format, if not then correct, did must be of type string for micloud request else cloud will respond with -8 "data type not valid"
    if (this.getDeviceId() && !this._isString(this.getDeviceId())) {
      this.logger.debug(`Did is not of type string. Converting to string!`);
      this.deviceId = String(this.getDeviceId());
    }

    // make sure we have the did, soft warning to the user if not
    this._checkDid()
  }

  async _miCloudSetup() {
    this.logger.debug(`Doing MiCloud setup`);

    // if device requires a MiCloud connection then try to connect
    if (this.requiresMiCloud()) {
      this.logger.info(`Device requires MiCloud! Trying to connect!`);
      try {
        await this._connectToMiCloud();
      } catch (err) {
        this.logger.warn(err);
        this.logger.warn(`The specified MiCloud login credentials might be incorrect or the account does not exist...`);
        throw new Error(`MiCloud is required but login to MiCloud failed!`);
      }
    }

    // get device info from MiCloud if specified
    if (!this.miCloudDeviceInfo || Object.keys(this.miCloudDeviceInfo).length === 0) {
      try {
        await this._connectToMiCloud();
        if (this.isLoggedIntoMiCloud()) {
          this.logger.info(`Getting device info from MiCloud!`);
          let result = await this.miCloud.getDevice(this.getDeviceId());
          if (result !== undefined) {
            this.miCloudDeviceInfo = result;
            this.logger.debug(`Got device info from MiCloud: \n${JSON.stringify(result, null, 2)}`);
          } else {
            throw new Error(`The device with id ${this.getDeviceId()} could not be found on the ${this._getMiCloudCountry()} server! Please make sure that the specified micloud country is correct!`);
          }
        }
      } catch (err) {
        if (this.requiresMiCloud()) {
          this.logger.warn(`${err}`);
        } else {
          this.logger.debug(`${err}`);
        }
      }
    }
  }


  /*----------========== SETUP HELPERS ==========----------*/

  async _connectToMiCloud() {
    if (this._canUseMiCloud()) {
      if (!this.miCloud) {
        this.miCloud = new MiCloud(this.logger);
        let requestTimeout = parseInt(this._getMiCloudTimeout());
        if (requestTimeout) {
          requestTimeout = requestTimeout > this.pollingInterval ? this.pollingInterval : requestTimeout; // make sure we do not exceed polling interval
          this.miCloud.setRequestTimeout(requestTimeout);
        }
      }
      if (!this.miCloud.isLoggedIn()) {
        await this.miCloud.login(this._getMiCloudUsername(), this._getMiCloudPassword());
        this.logger.debug(`Using server country: ${this._getMiCloudCountry()}`);
        this.miCloud.setCountry(this._getMiCloudCountry());
        this.logger.info(`Successfully connected to MiCloud!`);
      }
    } else if (this.requiresMiCloud()) {
      throw new Error(`The device requires a MiCloud connection! In order to control the device please specify a MiCloud username and password! Canceling setup!`);
    }
  }

  _checkDid() {
    // make sure that we have the deviceId, not sure if this is required for local calls even on the miot protocol(maybe only required for cloud calls)
    // just a soft warning since locally the control works also without did
    try {
      if (!this.getDeviceId()) throw new Error(`Could not find deviceId for ${this.name}! This may cause issues! Please specify a deviceId in the 'config.json' file!`);
    } catch (error) {
      this.logger.warn(error);
      if (this.requiresMiCloud()) {
        throw new Error(`DeviceId is required for MiCloud!`);
      }
    }
  }


  /*----------========== DEVICE LIFECYCLE ==========----------*/

  async _startPropertyPolling() {
    if (!this.updateDevicePropertiesInterval) {

      // initial properties fetch
      await this._doInitialPropertiesFetch();

      // start device property polling
      this._pollDeviceProperties();
    } else {
      this.logger.info(`Property polling is already in running!`);
    }
  }


  async _doInitialPropertiesFetch() {
    this.logger.info(`Doing initial property fetch.`);
    try {
      // initial properties fetch
      await this.requestAllProperties();
      // on initial connection log the retrieved properties
      this.logger.debug(`Got initial device properties: \n${this.getBeautifiedAllPropNameValues()}`);
      this.emit(Events.MIOT_DEVICE_INITIAL_PROPERTY_FETCH_DONE, this);
    } catch (err) {
      this.logger.debug(`Error on initial property request! ${err}`);
    }
  }

  _pollDeviceProperties() {
    this.logger.info(`Starting property polling.`);
    this.updateDevicePropertiesInterval = setInterval(async () => {
      try {
        await this.pollProperties();
        this.pollRetries = 0;
      } catch (err) {
        this.pollRetries++;
        this.logger.debug(`Poll failed ${this.pollRetries} times!`);
        if (this.updateDevicePropertiesInterval && this.pollRetries >= MAX_POLL_RETRIES) {
          this.logger.warn(`Poll failed ${this.pollRetries} times in a row! Stopping polling and trying to reconnect! Reason: ${err}`);
          this.pollRetries = 0;
          this._reconnect();
        } else {
          this.logger.debug(`Poll failed! Error: ${err}`);
          this._checkIfPollingIntervalReductionIsNecessary(err);
        }
      }
    }, this.pollingInterval);
  }

  _checkIfPollingIntervalReductionIsNecessary(err) {
    //if we have a 'user ack timeout' response from device then most likley the device is spammed by to many commands, so let's reduce the polling interval
    if (!this.reducedPollingInterval && err && err.message && err.message.includes("user ack timeout")) {
      this.reducedPollingInterval = this.pollingInterval * 2;
      this.pollingInterval = this.reducedPollingInterval;
    }
  }


  /*----------========== MICLOUD ==========----------*/

  _getMiCloudConfigProp(key) {
    if (this.miCloudConfig) {
      if (this.miCloudConfig.device && Object.keys(this.miCloudConfig.device).includes(key)) {
        return this.miCloudConfig.device[key];
      } else if (this.miCloudConfig.global && Object.keys(this.miCloudConfig.global).includes(key)) {
        return this.miCloudConfig.global[key];
      }
    }
    return null;
  }

  _canUseMiCloud() {
    return this.miCloudConfig && this._getMiCloudUsername() && this._getMiCloudPassword();
  }

  _getMiCloudUsername() {
    return this._getMiCloudConfigProp('username');
  }

  _getMiCloudPassword() {
    return this._getMiCloudConfigProp('password');
  }

  _getMiCloudCountry() {
    return this._getMiCloudConfigProp('country') || 'cn';
  }

  _getMiCloudTimeout() {
    return this._getMiCloudConfigProp('timeout');
  }

  _getMiCloudForce() {
    return this._getMiCloudConfigProp('forceMiCloud');
  }


  /*----------========== SPEC ==========----------*/

  _processMiotSpecFetchResult(result) {
    this.setMiotSpec(result);
    this.logger.info(`Successfully got device miot spec!`);
    this.logger.info(`Spec device type: ${this.getType()} description: ${this.getDescription()}`);
    this.logger.deepDebug(`Miot spec: ${JSON.stringify(result, null, 2)}`);
    this.emit(Events.MIOT_DEVICE_SPEC_FETCHED, this);
  }

  _parseMiotSpec() {
    if (this.getMiotSpec()) {
      this.logger.debug(`Parsing miot spec!`);

      //reset variables
      if (this.services && this.services.length > 0) {
        this.logger.debug(`Already have parsed spec! Reseting!`);
        this.services = [];
        this.allPropertiesMap = {};
        this.allActionsMap = {};
        this.allEventsMap = {};
      }

      const {
        services,
        properties,
        actions,
        events
      } = this.getMiotSpec();

      if (services) {
        services.forEach((serviceSpec) => {
          this.createServiceBySpec(serviceSpec);
        });
      }
      if (properties) {
        Object.keys(properties).forEach(key => {
          const propSpec = properties[key];
          this.addPropertyBySpec(key, propSpec);
        });
      }
      if (actions) {
        Object.keys(actions).forEach(key => {
          const actionSpec = actions[key];
          this.addActionBySpec(key, actionSpec);
        });
      }
      if (events) {
        Object.keys(events).forEach(key => {
          const eventSpec = events[key];
          this.addEventBySpec(key, eventSpec);
        });
      }
    }
  }


  /*----------========== METADATA ==========----------*/

  // services
  createService(siid, type, description) {
    if (!MiotProtocolHelpers.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid})! Cannot create service! Type: ${type} Description: ${description}`);
      return;
    }

    if (this.hasServiceWithId(siid)) {
      this.logger.warn(`Service with siid ${siid} already exists. Not creating!`);
      return;
    }

    let newService = new MiotService(siid, type, description);
    this.services.push(newService);
    return newService;
  }

  createServiceBySpec(serviceSpec) {
    return this.createService(serviceSpec.siid, serviceSpec.type, serviceSpec.description);
  }

  createServiceByString(specString) {
    let service = undefined;
    try {
      const serviceSpec = JSON.parse(specString);
      service = this.createServiceBySpec(serviceSpec);
    } catch (err) {
      this.logger.warn(`Failed to parse miot service by string! Spec string: ${specString}!`);
      this.logger.debug(err);
    }
    return service;
  }

  getServiceById(siid) {
    if (!siid) {
      return null;
    }
    return this.services.find(service => service.getId() == siid);
  }

  getServiceByType(type) {
    if (!type) {
      return null;
    }
    return this.services.find(service => service.getType() === type);
  }

  getAllServicesByType(type) {
    if (!type) {
      return [];
    }
    return this.services.filter(service => service.getType() === type);
  }

  hasServiceWithId(siid) {
    return !!this.getServiceById(siid);
  }

  hasServiceWithType(type) {
    return !!this.getServiceByType(type);
  }

  getAllServices() {
    return this.services;
  }

  getAllServiceTypes() {
    return this.getAllServices().map(service => service.getType());
  }


  // properties
  addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create property!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(piid)) {
      this.logger.warn(`Missing or invalid piid (${piid}) for ${name} property! Cannot create!`);
      return;
    }

    if (this.hasPropertyByName(name)) {
      this.logger.warn(`Property with name ${name} already exists. Not creating!`);
      return;
    }

    let newProp = new MiotProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList);
    this.allPropertiesMap[name] = newProp;

    const service = this.getServiceById(siid);
    if (service) {
      service.addProperty(newProp);
    } else {
      this.logger.debug(`Could not find service with id ${siid}! Property not added to service!`);
    }

    return newProp;
  }

  addPropertyBySpec(name, propSpec) {
    return this.addProperty(propSpec.name || name, propSpec.siid, propSpec.piid, propSpec.type, propSpec.description, propSpec.format, propSpec.access, propSpec.unit, propSpec.valueRange, propSpec.valueList);
  }

  addPropertyByString(name, specString) {
    let prop = undefined;
    try {
      const propSpec = JSON.parse(specString);
      prop = this.addPropertyBySpec(name, propSpec);
    } catch (err) {
      this.logger.warn(`Failed to parse miot property by string ${name}!`);
    }
    return prop;
  }

  hasProperty(miotProp) {
    return this.getProperty(miotProp) !== null;
  }

  hasPropertyByName(propName) {
    return this.getPropertyByName(propName) !== null;
  }

  hasPropertyById(propId) {
    return this.getPropertyById(propId) !== null;
  }

  getProperty(miotProp) {
    if (this._isPropertyObj(miotProp)) {
      return miotProp;
    }
    if (this._isString(miotProp)) {
      if (this.hasPropertyByName(miotProp)) {
        return this.getPropertyByName(miotProp);
      } else if (this.hasPropertyById(miotProp)) {
        return this.getPropertyById(miotProp);
      }
    }
    return null;
  }

  getPropertyByName(propName) {
    return this.allPropertiesMap[propName] || null;
  }

  getPropertyById(propId) {
    if (propId && propId.includes('.')) {
      const siid = propId.split('.')[0];
      const piid = propId.split('.')[1];
      const tmpService = this.getAllServices().find(service => service.getId() == siid);
      if (tmpService) {
        return tmpService.getPropertyById(piid);
      }
    }
    return null;
  }

  findPropertyByType(propType) {
    return Object.values(this.getAllProperties()).find(tmpProp => tmpProp.getType() === propType);
  }

  getAllProperties() {
    return this.allPropertiesMap;
  }

  getAllPropertyNames() {
    return Object.keys(this.allPropertiesMap);
  }

  getBeautifiedAllPropNameValues() {
    // only readable properties
    let readablePropNames = this.getAllPropertyNames().filter(name => this.getPropertyByName(name).isReadable());
    let propNameValues = readablePropNames.map(name => this.getPropertyByName(name).getNameValueString());
    return JSON.stringify(propNameValues, null, 2);
  }


  // actions
  addAction(name, siid, aiid, type, description, inDef) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create action!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(aiid)) {
      this.logger.warn(`Missing or invalid aiid (${aiid}) for ${name} action! Cannot create!`);
      return;
    }

    if (this.hasPropertyByName(name)) {
      this.logger.warn(`Action with name ${name} already exists. Not creating!`);
      return;
    }

    let newAction = new MiotAction(name, siid, aiid, type, description, inDef);
    this.allActionsMap[name] = newAction;

    const service = this.getServiceById(siid);
    if (service) {
      service.addAction(newAction);
    } else {
      this.logger.debug(`Could not find service with id ${siid}! Action not added to service!`);
    }

    return newAction;
  }

  addActionBySpec(name, actionSpec) {
    return this.addAction(actionSpec.name || name, actionSpec.siid, actionSpec.aiid, actionSpec.type, actionSpec.description, actionSpec.in);
  }

  addActionByString(name, specString) {
    let action = undefined;
    try {
      const actionSpec = JSON.parse(specString);
      action = this.addActionBySpec(name, actionSpec);
    } catch (err) {
      this.logger.warn(`Failed to parse miot action by string ${name}!`);
    }
    return action;
  }

  hasAction(miotAction) {
    return this.getAction(miotAction) !== null;
  }

  hasActionByName(actionName) {
    return this.getActionByName(actionName) !== null;
  }

  hasActionById(actionId) {
    return this.getActionById(actionId) !== null;
  }

  hasActions() {
    return this.allActionsMap && Object.keys(this.allActionsMap).length > 0;
  }

  getAction(miotAction) {
    if (this._isActionObj(miotAction)) {
      return miotAction;
    }
    if (this._isString(miotAction)) {
      if (this.hasActionByName(miotAction)) {
        return this.getActionByName(miotAction);
      } else if (this.hasActionById(miotAction)) {
        return this.getActionById(miotAction);
      }
    }
    return null;
  }

  getActionByName(actionName) {
    return this.allActionsMap[actionName] || null;
  }

  getActionById(actionId) {
    if (actionId && actionId.includes('.')) {
      const siid = actionId.split('.')[0];
      const aiid = actionId.split('.')[1];
      const tmpService = this.getAllServices().find(service => service.getId() == siid);
      if (tmpService) {
        return tmpService.getActionById(aiid);
      }
    }
    return null;
  }

  findActionByType(actionType) {
    return Object.values(this.getAllActions()).find(tmpAction => tmpAction.getType() === actionType);
  }

  getAllActions() {
    return this.allActionsMap;
  }

  getAllActionNames() {
    return Object.keys(this.allActionsMap);
  }


  // events
  addEvent(name, siid, eiid, type, description, argumentsDef) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create event!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolHelpers.isValidMiotId(eiid)) {
      this.logger.warn(`Missing or invalid eiid (${eiid}) for ${name} event! Cannot create!`);
      return;
    }

    if (this.hasPropertyByName(name)) {
      this.logger.warn(`Event with name ${name} already exists. Not creating!`);
      return;
    }

    let newEvent = new MiotEvent(name, siid, eiid, type, description, argumentsDef);
    this.allEventsMap[name] = newEvent;

    const service = this.getServiceById(siid);
    if (service) {
      service.addEvent(newEvent);
    } else {
      this.logger.debug(`Could not find service with id ${siid}! Event not added to service!`);
    }

    return newEvent;
  }

  addEventBySpec(name, eventSpec) {
    return this.addEvent(eventSpec.name || name, eventSpec.siid, eventSpec.eiid, eventSpec.type, eventSpec.description, eventSpec.arguments);
  }

  addEventByString(name, specString) {
    let action = undefined;
    try {
      const eventSpec = JSON.parse(specString);
      action = this.addEventBySpec(name, eventSpec);
    } catch (err) {
      this.logger.warn(`Failed to parse miot event by string ${name}!`);
    }
    return action;
  }

  hasEvent(miotEvent) {
    return this.getEvent(miotEvent) !== null;
  }

  hasEventByName(eventName) {
    return this.getEventByName(eventName) !== null;
  }

  hasEventById(eventId) {
    return this.getEventById(eventId) !== null;
  }

  hasEvents() {
    return this.allEventsMap && Object.keys(this.allEventsMap).length > 0;
  }

  getEvent(miotEvent) {
    if (this._isEventObj(miotEvent)) {
      return miotEvent;
    }
    if (this._isString(miotEvent)) {
      if (this.hasEventByName(miotEvent)) {
        return this.getEventByName(miotEvent);
      } else if (this.hasEventById(miotEvent)) {
        return this.getEventById(miotEvent);
      }
    }
    return null;
  }

  getEventByName(eventName) {
    return this.allEventsMap[eventName] || null;
  }

  getEventById(eventId) {
    if (eventId && eventId.includes('.')) {
      const siid = eventId.split('.')[0];
      const eiid = eventId.split('.')[1];
      const tmpService = this.getAllServices().find(service => service.getId() == siid);
      if (tmpService) {
        return tmpService.getEventById(eiid);
      }
    }
    return null;
  }

  findEventByType(evenType) {
    return Object.values(this.getAllEvents()).find(tmpEvent => tmpEvent.getType() === evenType);
  }

  getAllEvents() {
    return this.allEventsMap;
  }

  getAllEventNames() {
    return Object.keys(this.allEventsMap);
  }


  /*----------========== PROTOCOL ==========----------*/

  // properties
  // seems like there is a limit on how many props the device can process at once, observed a limit of 16
  // for this reason we are going to split all props into chunks and do sepearte requests for each chunk
  async requestAllProperties() {
    if (this.isConnected()) {
      let propRequestPromises = [];
      let propNameChunks = this._getAllReadablePropNameChunks();
      this.logger.debug(`Splitting properties into chunks. Number of chunks: ${propNameChunks.length}. Chunk size: ${ALL_PROP_REQUEST_CHUNK_SIZE}`);
      this.logger.deepDebug(`Chunks:  ${JSON.stringify(propNameChunks, null, 1)}`);
      propNameChunks.forEach((propChunk) => {
        propRequestPromises.push(this.requestPropertyChunk(propChunk));
      });
      return Promise.all(propRequestPromises);
    } else {
      return this._createErrorPromise(`Cannot poll all properties! Device not connected!`);
    }
  }

  async requestPropertyChunk(propKeys) {
    if (!propKeys) {
      return this._createErrorPromise(`Cannot request property chunk values! No property keys specified!`);
    }
    if (!this.isConnected()) {
      return this._createErrorPromise(`Cannot request property chunk values! Device not connected!`);
    }
    let protcolProps = propKeys.map(key => this.getPropertyByName(key).getReadProtocolObjForDid(this.getDeviceId()));
    const result = await this.getMiotProperties(protcolProps);
    // if no response or response empty then throw an error so that the the poll will fail
    if (!result || result.length === 0) {
      throw new Error(`No response or response empty!`);
    }
    // all good, process the data
    const obj = {};
    for (let i = 0; i < result.length; i++) {
      this._updatePropertyValueFromDevice(obj, propKeys[i], result[i]);
    }
    return obj;
  }

  // currently not used, but can be used to retrieve a single property value
  async requestProperty(prop) {
    try {
      if (!prop) {
        throw new Error(`Missing property! Cannot execute read request!`);
      }
      if (!this.isConnected()) {
        throw new Error(`Cannot update property ${prop.getName()}! Device not connected!`);
      }
      if (!this.isReadable()) {
        throw new Error(`Cannot update property ${prop.getName()}! Property is not readable!`);
      }
      let propDef = prop.getReadProtocolObjForDid(this.getDeviceId());
      this.logger.deepDebug(`Request ${prop.getName()} property! RAW: ${JSON.stringify(propDef)}`);
      const result = await this.getMiotProperties([propDef]);
      this.logger.debug(`Successfully updated property ${prop} value! Result: ${JSON.stringify(result)}`);
      const obj = {};
      this._updatePropertyValueFromDevice(obj, prop.getName(), result[0]);
      this.emit(Events.MIOT_DEVICE_PROPERTY_VALUE_UPDATED, prop);
      return obj;
    } catch (err) {
      this.logger.debug(err);
    }
  }

  // set property
  async setProperty(prop, value) {
    try {
      if (!prop) {
        throw new Error(`Missing property! Cannot set the value!`);
      }
      if (!this.isConnected()) {
        throw new Error(`Cannot set property ${prop.getName()} to value ${value}! Device not connected!`);
      }
      let propDef = prop.getWriteProtocolObjForDid(this.getDeviceId(), value);
      this.logger.deepDebug(`Set ${prop.getName()} property request! RAW: ${JSON.stringify(propDef)}`);
      const result = await this.setMiotProperties([propDef]);
      if (this._isResponseValid(result[0])) {
        this.logger.debug(`Successfully set property ${prop.getName()} to value ${value}! Response: ${JSON.stringify(result)}`);
        prop.updateInternalValue(value); // do not wait for poll, update the local prop and notifiy listeners after successful set
        this.emit(Events.MIOT_DEVICE_PROPERTY_VALUE_SET, prop);
        return result;
      } else {
        throw new Error(`Error while setting property ${prop.getName()} to value ${value}! Invalid response. Response: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      this.logger.debug(err);
    }
  }

  // actions
  async executeAction(action, paramValues = []) {
    try {
      if (!action) {
        throw new Error(`Missing action! Cannot execute action request!`);
      }
      if (!this.isConnected()) {
        throw new Error(`Cannot execute action ${action.getName()} with params ${JSON.stringify(paramValues)}! Device not connected!`);
      }
      let actionDef = action.getProtocolAction(this.getDeviceId(), paramValues);
      this.logger.deepDebug(`Send action! RAW: ${JSON.stringify(actionDef)}`);
      const result = await this.miotAction(actionDef);
      action.setLastResult(result);
      if (this._isResponseValid(result)) {
        this.logger.debug(`Successfully executed action ${action.getName()} with params ${paramValues}! Result: ${JSON.stringify(result)}`);
        this.emit(Events.MIOT_DEVICE_ACTION_EXECUTED, action);
        return result;
      } else {
        throw new Error(`Error while executing action ${action.getName()} with params ${paramValues}! Invalid response from device. Response: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      this.logger.debug(err);
    }
  }


  /*----------========== PROTOCOL CALLS ==========----------*/

  async getMiotProperties(params = []) {
    if (this.requiresMiCloud() && this.isLoggedIntoMiCloud()) {
      return this.miCloud.miotGetProps(params);
    } else {
      return this.miioProtocol.send(this.ip, COMMAND_GET, params);
    }
  }

  async setMiotProperties(params = []) {
    if (this.requiresMiCloud() && this.isLoggedIntoMiCloud()) {
      return this.miCloud.miotSetProps(params);
    } else {
      return this.miioProtocol.send(this.ip, COMMAND_SET, params, {
        retries: 2,
        timeout: 4000
      });
    }
  }

  async miotAction(param = {}) {
    if (this.requiresMiCloud() && this.isLoggedIntoMiCloud()) {
      return this.miCloud.miotAction(param);
    } else {
      return this.miioProtocol.send(this.ip, COMMAND_ACTION, param);
    }
  }


  /*----------========== PROTOCOL HELPERS ==========----------*/

  _canMonitorProperty(miotProp) {
    let tmpProp = this.getProperty(miotProp);
    if (tmpProp && tmpProp.isReadable()) {
      return true;
    }
    return false;
  }

  _getPropKeysToMonitor() {
    let tmpPropKeysToMonitor = this.getPropertiesToMonitor();
    if (!tmpPropKeysToMonitor || tmpPropKeysToMonitor.length === 0) {
      tmpPropKeysToMonitor = this.getAllPropertyNames();
    }
    return tmpPropKeysToMonitor;
  }

  // get only properties which are reabadle
  _getReadablePropsToMonitor() {
    let tmpReadablePropsToMonitor = {};
    this._getPropKeysToMonitor().forEach((key) => {
      let tmpProp = this.getPropertyByName(key);
      if (tmpProp && tmpProp.isReadable()) {
        tmpReadablePropsToMonitor[key] = tmpProp;
      }
    });
    return tmpReadablePropsToMonitor;
  }

  // split all readable props into smaller chunks
  _getAllReadablePropNameChunks() {
    let propertyChunks = [];
    const allReadableProps = this._getReadablePropsToMonitor();
    const readablePropNames = Object.keys(allReadableProps);
    for (let i = 0; i < readablePropNames.length; i += ALL_PROP_REQUEST_CHUNK_SIZE) {
      let propChunk = readablePropNames.slice(i, i + ALL_PROP_REQUEST_CHUNK_SIZE);
      propertyChunks.push(propChunk);
    }
    return propertyChunks;
  }

  // updates the property value with the value retrieved from the device
  _updatePropertyValueFromDevice(result, propName, response) {
    if (this._isResponseValid(response)) {
      this.getPropertyByName(propName).updateInternalValue(response.value);
      result[propName] = response.value;
    } else {
      this.logger.debug(`Error while parsing response from device for property ${propName}. Response: ${JSON.stringify(response)}`);
    }
  }

  _isResponseValid(response) {
    if (response && response.code === 0) {
      return true;
    } else {
      return false;
    }
  }


  /*----------========== HELPERS ==========----------*/

  _createErrorPromise(msg) {
    return new Promise((resolve, reject) => {
      reject(new Error(msg));
    }).catch(err => {
      this.logger.debug(err);
    });
  }

  _isString(object) {
    if (typeof object === 'string' || object instanceof String) {
      return true;
    }
    return false;
  }

  _isPropertyObj(object) {
    if (object instanceof MiotProperty) {
      return true;
    }
    return false;
  }

  _isActionObj(object) {
    if (object instanceof MiotAction) {
      return true;
    }
    return false;
  }

  _isEventObj(object) {
    if (object instanceof MiotEvent) {
      return true;
    }
    return false;
  }


}

module.exports = MiotDevice;

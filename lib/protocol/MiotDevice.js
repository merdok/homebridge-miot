const EventEmitter = require('events');
const fs = require('fs').promises;
const path = require('path');
const MiioProtocol = require('./MiioProtocol.js');
const MiioDiscovery = require('./MiioDiscovery.js');
const MiotSpecFetcher = require('./MiotSpecFetcher.js');
const MiotSpec = require('./MiotSpec.js');
const MiCloud = require('./MiCloud.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const Errors = require("../utils/Errors.js");
const MiCloudUtils = require('../utils/MiCloudUtils.js');
const ErrorUtils = require('../utils/ErrorUtils.js');
const TimeUtils = require('../utils/TimeUtils.js');

const COMMAND_GET = 'get_properties';
const COMMAND_SET = 'set_properties';
const COMMAND_ACTION = 'action';
const ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE = 14;
const MAX_POLL_RETRIES = 4;
const MICLOUD_REACHABILITY_CACHE_MS = 30000;

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

    //device spec
    this.spec = new MiotSpec(this.logger);

    //mi cloud
    this.miCloud = undefined;
    this.miCloudConfig = {};
    this.isMiCloudRequired = false;
    this.miCloudDisabled = false;
    this.miCloudDeviceInfo = {};
    this.miCloudReachability = {
      checkedAt: 0,
      reachable: false,
      inFlight: null
    };

    //config
    this.parseActionParams = true;

    // prepare the variables
    this.localConnected = false;
    this.pollingInterval = Constants.DEFAULT_POLLING_INTERVAL;
    this.updateDevicePropertiesInterval = undefined;
    this.pollRetries = 0;
    this.propertyPollingUnsupported = false;
    this.allPropRequestChunkSize = ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE;
    this.propertiesToMonitor = [];
    this.localDeviceInfoReader = null;
    this.localPropertyReader = null;
    this.localDiscovery = false;

    this.reducedPollingInterval = null;
    this.reconnectTimeoutTime = Math.max(this.pollingInterval * 4, 30000); // 4 times alive polling interval, at least 30 seconds

    this.miioProtocol = new MiioProtocol(this.logger);
    this.miioProtocol.updateDevice(this.ip, {
      token: this.token
    })
  }


  /*----------========== CONNECTION ==========----------*/

  identify() {
    if (this.model && this.model.length > 0) {
      this.logger.info(`Model known: ${this.model}!`);
      this.emit(Events.MIOT_DEVICE_IDENTIFIED, this); // we have model info so we already know what device we are dealing with
    } else {
      this.logger.info(`Model unknown! Starting device discovery!`);
      this._identifyDevice();
    }
  }

  startPropertyPolling() {
    if (this.isConnected()) {
      this._startPropertyPolling();
    } else {
      this._connectToDeviceAndPoll();
    }
  }


  /*----------========== SETTINGS ==========----------*/

  setMiCloudConfig(newMiCloudConfig = {}) {
    if (this.miCloudDisabled) {
      return;
    }
    this.miCloudConfig = newMiCloudConfig;
  }

  disableMiCloud() {
    this.miCloudDisabled = true;
    this.isMiCloudRequired = false;
    this.miCloudConfig = {};
    this.miCloudDeviceInfo = {};
    if (this.isLoggedIntoMiCloud()) {
      this.miCloud.logout();
    }
  }

  async tryLocalConnection() {
    await this._connectToLocalDevice();
    return this.isConnectedToLocalDevice();
  }

  forceLocalConnection() {
    this.isMiCloudRequired = false;
    this.miCloudConfig = Object.assign({}, this.miCloudConfig, {
      global: Object.assign({}, this.miCloudConfig.global, { forceMiCloud: false }),
      device: Object.assign({}, this.miCloudConfig.device, { forceMiCloud: false })
    });
  }

  setPollingInterval(newPollingInterval = Constants.DEFAULT_POLLING_INTERVAL) {
    if (newPollingInterval >= 1000) {
      this.pollingInterval = newPollingInterval;
    }
  }

  requiresMiCloud() {
    return this.isMiCloudRequired;
  }

  setRequiresMiCloud(required = false) {
    this.isMiCloudRequired = this.miCloudDisabled ? false : required;
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

  setLocalPropertyReader(reader = null) {
    this.localPropertyReader = typeof reader === 'function' ? reader : null;
  }

  setLocalDeviceInfoReader(reader = null) {
    this.localDeviceInfoReader = typeof reader === 'function' ? reader : null;
  }

  setLocalDiscovery(enabled = false) {
    this.localDiscovery = enabled === true;
  }

  addPropertyToMonitor(miotProp) {
    const propToMonitor = this.getProperty(miotProp);
    //if length 0 then we already monitoring all properties so no need to add
    if (this._canMonitorProperty(propToMonitor) && this.propertiesToMonitor && this.propertiesToMonitor.length !== 0 && !this.propertiesToMonitor.includes(propToMonitor.getName())) {
      this.propertiesToMonitor.push(propToMonitor.getName());
    }
  }

  getAllPropRequestChunkSize() {
    return this.allPropRequestChunkSize || ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE;
  }

  setAllPropRequestChunkSize(chunkSize = ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE) {
    if (chunkSize < 1) {
      chunkSize = 1;
    }
    if (chunkSize > ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE) {
      chunkSize = ALL_PROP_REQUEST_DEFAULT_CHUNK_SIZE;
    }
    this.allPropRequestChunkSize = chunkSize;
  }

  setMiotSpec(miotSpec) {
    if (miotSpec) {
      this.spec.setRaw(miotSpec);
    }
  }

  isParseActionParams() {
    return this.parseActionParams;
  }

  setParseActionParams(parseEnabled = true) {
    this.parseActionParams = parseEnabled;
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

  // general
  isConnected() {
    if (this.shouldUseMiCloud()) {
      return this.isConnectedToCloud();
    }
    return this.isConnectedToLocalDevice();
  }

  getModel() {
    if (this.isConnectedToCloud()) {
      return this.getCloudDeviceInfo().model;
    }
    if (this.isConnectedToLocalDevice()) {
      const deviceInfo = this.getDeviceInfo();
      return deviceInfo && deviceInfo.model ? deviceInfo.model : this.model;
    }
    return this.model;
  }

  getDeviceId() {
    return this.deviceId;
  }

  getFirmwareRevision() {
    if (this.isConnectedToCloud()) {
      if (this.getCloudDeviceInfo().extra) {
        return this.getCloudDeviceInfo().extra.fw_version;
      }
    }
    if (this.isConnectedToLocalDevice()) {
      return this.getDeviceInfo().fw_ver;
    }
    return "unknown";
  }

  //local
  isConnectedToLocalDevice() {
    return this.localConnected;
  }

  getDeviceInfo() {
    return this.miioProtocol.getDevice(this.ip).deviceInfo;
  }

  // micloud
  shouldUseMiCloud() {
    return !this.miCloudDisabled && (this.requiresMiCloud() || this._getMiCloudForce() === true);
  }

  isConnectedToCloud() {
    return this.isLoggedIntoMiCloud() && !!this.getCloudDeviceInfo();
  }

  async isReachableThroughMiCloud(force = false) {
    if (this.isConnectedToCloud()) {
      return this.getCloudDeviceInfo().isOnline !== false;
    }
    const canUseCachedSession = this._getMiCloudUseCachedSession() && this._getCachedMiCloudSession();
    if (!this.getDeviceId() || !this.miCloudConfig || (!this._hasMiCloudCredentials() && !canUseCachedSession)) {
      return false;
    }

    const now = Date.now();
    if (!force && now - this.miCloudReachability.checkedAt < MICLOUD_REACHABILITY_CACHE_MS) {
      return this.miCloudReachability.reachable;
    }
    if (this.miCloudReachability.inFlight) {
      return this.miCloudReachability.inFlight;
    }

    this.miCloudReachability.inFlight = this._probeMiCloudReachability()
      .then(reachable => {
        this.miCloudReachability.checkedAt = Date.now();
        this.miCloudReachability.reachable = reachable;
        return reachable;
      })
      .finally(() => {
        this.miCloudReachability.inFlight = null;
      });
    return this.miCloudReachability.inFlight;
  }

  async _probeMiCloudReachability() {
    try {
      return await this._withMiCloudSession(async miCloud => {
        const cloudDevice = await miCloud.getDevice(this.getDeviceId());
        return !!cloudDevice && cloudDevice.isOnline !== false;
      });
    } catch (err) {
      this.logger.debug(`MiCloud reachability check failed: ${err.message}`);
      return false;
    }
  }

  async getMiCloudFile(objectName) {
    if (this.miCloudDisabled || (!this._hasMiCloudCredentials() &&
      !(this._getMiCloudUseCachedSession() && this._getCachedMiCloudSession()))) {
      throw new Errors.MissingMiCloudCredentials();
    }
    return this._withMiCloudSession(miCloud => miCloud.getInterimFile(objectName));
  }

  // Use a separate client so metadata requests never switch local device control
  // to MiCloud or mark an otherwise healthy LAN connection disconnected.
  async _withMiCloudSession(operation) {
    let miCloud = new MiCloud(this.logger);
    miCloud.setRequestTimeout(this._getMiCloudTimeout() || 10000);
    let usedCachedSession = false;
    try {
      if (this._getMiCloudUseCachedSession() && this._getCachedMiCloudSession()) {
        miCloud.setServiceToken(this._getCachedMiCloudSession());
        usedCachedSession = true;
      } else {
        await miCloud.login(this._getMiCloudUsername(), this._getMiCloudPassword());
      }
      miCloud.setCountry(this._getMiCloudCountry());
      try {
        return await operation(miCloud);
      } catch (err) {
        if (!usedCachedSession || !this._hasMiCloudCredentials()) {
          throw err;
        }

        this.logger.debug(`Cached MiCloud session failed. Refreshing it with configured credentials.`);
        try {
          miCloud.logout();
        } catch (logoutErr) {
          this.logger.deepDebug(`Could not reset cached MiCloud reachability session: ${logoutErr.message}`);
        }
        miCloud = new MiCloud(this.logger);
        miCloud.setRequestTimeout(this._getMiCloudTimeout() || 10000);
        await miCloud.login(this._getMiCloudUsername(), this._getMiCloudPassword());
        miCloud.setCountry(this._getMiCloudCountry());
        // only persist/reuse the refreshed session when the user opted into cached sessions.
        // otherwise a credentials-only user would be silently opted into session caching.
        if (this._getMiCloudUseCachedSession()) {
          this.miCloudConfig.cachedSession = miCloud.getServiceToken();
          await this._saveReachabilitySession();
        }
        return await operation(miCloud);
      }
    } finally {
      try {
        if (miCloud.isLoggedIn()) {
          miCloud.logout();
        }
      } catch (err) {
        this.logger.deepDebug(`Could not close temporary MiCloud session: ${err.message}`);
      }
    }
  }

  async _saveReachabilitySession() {
    const cacheFile = this._getMiCloudCachedSessionFile();
    if (!this._getMiCloudUseCachedSession() || !cacheFile || !this.miCloudConfig.cachedSession) {
      return;
    }
    try {
      await fs.writeFile(cacheFile, JSON.stringify(this.miCloudConfig.cachedSession), 'utf8');
    } catch (err) {
      this.logger.debug(`Could not save refreshed MiCloud reachability session: ${err.message}`);
    }
  }

  isLoggedIntoMiCloud() {
    return this.miCloud && this.miCloud.isLoggedIn();
  }

  getCloudDeviceInfo() {
    return this.miCloudDeviceInfo;
  }

  //spec
  getMiotSpec() {
    return this.spec.getRaw();
  }

  getRawType() {
    return this.spec.getRawType();
  }

  getSpecType() {
    return this.spec.getSpecType();
  }

  getDescription() {
    return this.spec.getDescription();
  }


  /*----------========== GENERAL DEVICE CONNECTION ==========----------*/

  async _identifyDevice() {
    this._prepareNewConnection();
    try {
      if (this.shouldUseMiCloud()) {
        await this._identifyCloudDevice();
      } else {
        await this._identifyLocalDevice();
      }
    } catch (err) {
      this._handleConnectionError(err, 'device identify', this._identifyDevice.bind(this));
    }
  }

  async _connectToDeviceAndPoll() {
    this._prepareNewConnection();
    try {
      if (this.shouldUseMiCloud()) {
        await this._connectToCloudDevice();
      } else {
        await this._connectToLocalDevice();
      }
      this._startPropertyPolling();
    } catch (err) {
      this._handleConnectionError(err, 'connection', this._connectToDeviceAndPoll.bind(this));
    }
  }

  _disconnect() {
    this.localConnected = false;
    this._clearTimeoutAndInterval();

    // if required, also refresh the micloud connection
    if (this.shouldUseMiCloud()) {
      if (this.isLoggedIntoMiCloud()) {
        this.miCloud.logout();
      }
    }

    this.logger.debug('Device diconnected!');
    this.emit(Events.MIOT_DEVICE_DISCONNECTED, this);
  }


  /*----------========== LOCAL DEVICE ==========----------*/

  async _connectToLocalDevice() {
    if (!this.isConnectedToLocalDevice()) {
      const lastAddress = this.ip;
      let result;
      try {
        if (this.localDiscovery) {
          // Keep controller/config IP untouched: existing accessory UUIDs use it.
          // Only this runtime destination follows the device around the LAN.
          try {
            this.ip = await MiioDiscovery.discoverAddress(this.deviceId);
          } catch (error) {
            this.logger.debug(`Local discovery unavailable; trying last address: ${error.message}`);
          }
          // Re-handshake even at a previously used address after a disconnect.
          this.miioProtocol.updateDevice(this.ip, { token: this.token, _serverStampTime: 0 });
        }
        await this.miioProtocol.handshake(this.ip);
        if (this.localDiscovery && String(this.miioProtocol.getDevice(this.ip).did) !== String(this.deviceId)) {
          throw new Error('Local device ID mismatch; refusing to use this address');
        }
        result = await this._getLocalDeviceInfo();
      } catch (error) {
        // Unauthenticated discovery must not replace the last usable fallback.
        if (this.localDiscovery) this.ip = lastAddress;
        throw error;
      }
      if (this.localDiscovery) this.logger.info(`Local discovery authenticated device at ${this.ip}`);
      this.localConnected = true;
      this.logger.info(`Device found! Setting up miot device from local connection!`);
      await this._localDeviceSetup();
      this.logger.info(`Connected to device: ${result.model}`);
      this.emit(Events.MIOT_DEVICE_CONNECTED, this);
    }
  }

  async _getLocalDeviceInfo() {
    try {
      return await this.miioProtocol.getInfo(this.ip);
    } catch (err) {
      if (!this.localDeviceInfoReader) {
        throw err;
      }
      this.logger.debug(`Local miIO.info failed. Trying model-specific local device info fallback. Error: ${err.message}`);
      const deviceInfo = await this.localDeviceInfoReader(this);
      if (!deviceInfo || !deviceInfo.model) {
        throw err;
      }
      this.miioProtocol.getDevice(this.ip).deviceInfo = deviceInfo;
      return deviceInfo;
    }
  }

  async _localDeviceSetup() {
    // log some basic device info
    this.logger.debug(`Device firmware: ${this.getFirmwareRevision()}`);
    this.logger.deepDebug(`Full device info: \n${JSON.stringify(this.getDeviceInfo(), null, 2)}`);

    //  retrieve the deviceId from the device
    if (!this.getDeviceId()) {
      this.deviceId = String(this.miioProtocol.getDevice(this.ip).did); // returns did as number, so convert o string

      if (this.getDeviceId()) {
        this.logger.info(`Did not specified. Got did: ${this.getDeviceId()} from device!`);
      }
    }

    this._validateDid();

    // validate if the specified model is the same as the actual model of the connected device
    this._validateModel();
  }

  async _identifyLocalDevice() {
    await this._connectToLocalDevice();
    let foundDeviceModel = this.getDeviceInfo().model;
    this._identfiyDeviceInternal(foundDeviceModel);
  }


  /*----------========== MICLOUD DEVICE ==========----------*/

  async _connectToCloudDevice() {
    if (this.isConnectedToCloud()) {
      return;
    }

    if (!this._canUseMiCloud()) {
      throw new Errors.MissingMiCloudCredentials();
    }

    this._ensureMiCloudClient();
    let usedCachedSession = false;
    if (this._getMiCloudUseCachedSession() && this._getCachedMiCloudSession()) {
      const cachedSession = this._getCachedMiCloudSession();
      this.logger.info(`Using cached session for MiCloud connection! Session login time: ${TimeUtils.getSessionLoginTime(cachedSession)}; login method: ${cachedSession.loginMethod || Constants.LOGIN_METHOD.UNKNOWN}`);
      this.miCloud.setServiceToken(cachedSession);
      usedCachedSession = true;
    } else {
      if (this._getMiCloudUseCachedSession() && !this._hasMiCloudCredentials()) {
        this.logger.info(`No cached MiCloud session found! Cannot fallback to login as credentials are missing...`);
        throw new Errors.MissingMiCloudCredentials();
      }
      if (this._getMiCloudUseCachedSession()) {
        this.logger.info(`No cached MiCloud session found! Will try to login using the provided credentials...`);
      }
      this.logger.info(`Log in to MiCloud!`);
      await this.miCloud.login(this._getMiCloudUsername(), this._getMiCloudPassword());
      await this._saveCachedMiCloudSession();
    }

    const setupCloudDevice = async () => {
      this.logger.debug(`Using server country: ${this._getMiCloudCountry()}`);
      this.miCloud.setCountry(this._getMiCloudCountry());
      this.logger.info(`Successfully connected to MiCloud! Setting up miot device from MiCloud connection!`);
      await this._cloudDeviceSetup();
      this.logger.info(`Connected to device: ${this.getModel()}`);
      this.emit(Events.MIOT_DEVICE_CONNECTED, this);
    };

    try {
      await setupCloudDevice();
    } catch (err) {
      const cannotRefresh = !usedCachedSession ||
        !this._hasMiCloudCredentials() ||
        err instanceof Errors.MissingDeviceId ||
        err instanceof Errors.DeviceNotFound ||
        err instanceof Errors.DeviceNotOnline ||
        err instanceof Errors.TwoFactorRequired;
      if (cannotRefresh) {
        this.logger.debug(`Connection to MiCloud device failed!`);
        this.logger.deepDebug(err.stack);
        throw err;
      }

      this.logger.warn(`Cached MiCloud session failed. Refreshing it with configured MiCloud credentials and retrying once.`);
      this.logger.deepDebug(err.stack);
      try {
        if (this.miCloud.isLoggedIn()) {
          this.miCloud.logout();
        }
      } catch (logoutErr) {
        this.logger.debug(`Could not reset MiCloud login before refresh: ${logoutErr.message}`);
      }
      this.logger.info(`Log in to MiCloud!`);
      await this.miCloud.login(this._getMiCloudUsername(), this._getMiCloudPassword());
      await this._saveCachedMiCloudSession();
      await setupCloudDevice();
    }
  }

  async _cloudDeviceSetup() {
    // when no device id specified try to retrieve the deviceId from the device
    if (!this.getDeviceId()) {
      this.logger.info(`DeviceId not specified but is required for a MiCloud connection! Trying to connect to the device using a local connection and get the deviceId!`);
      await this._connectToLocalDevice();
    }

    // validate that we have a deviceId
    this._validateDid();

    // fetch the cloud device info
    await this._fetchCloudDeviceInfoDevice();

    // validate if the specified model is the same as the actual model of the connected device
    this._validateModel();

    // check if the device is online, soft warning that the device is not online
    if (!this.getCloudDeviceInfo().isOnline) {
      this.logger.warn(`The device with deviceId ${ this.getDeviceId() } is not online! Device must be online for proper synchronization!`);
    }
  }

  async _identifyCloudDevice() {
    await this._connectToCloudDevice();
    let foundDeviceModel = this.getCloudDeviceInfo().model;
    this._identfiyDeviceInternal(foundDeviceModel);
  }

  async _fetchCloudDeviceInfoDevice() {
    this.logger.debug(`Fetching device info from the MiCloud!`);
    let result = await this.miCloud.getDevice(this.getDeviceId());
    if (result != undefined) {
      this.miCloudDeviceInfo = result;
      this.logger.debug(`Got device info from MiCloud: \n${JSON.stringify(result, null, 2)}`);
    } else {
      throw new Errors.DeviceNotFound(this.getDeviceId(), this._getMiCloudCountry());
    }
  }


  /*----------========== INTERNAL HELPERS ==========----------*/

  _getReconnectTimeoutSeconds() {
    return this.reconnectTimeoutTime / 1000;
  }

  _runTimeoutAction(actionFunc) {
    this.currentRunningTimeout = setTimeout(() => {
      actionFunc();
    }, this.reconnectTimeoutTime);
  }

  _clearTimeoutAndInterval() {
    clearTimeout(this.currentRunningTimeout);
    this.currentRunningTimeout = undefined;
    clearInterval(this.updateDevicePropertiesInterval);
    this.updateDevicePropertiesInterval = undefined;
  }

  _prepareNewConnection() {
    clearTimeout(this.currentRunningTimeout); //clear any previous discoveries which might be running
  }

  async _handleConnectionError(err, actionName, timeoutFunction) {
    if (ErrorUtils.isNonRecoverableError(err)) { // non recoverable errors, do not try to reconnect
      this.logger.error(err);
      this.logger.error(`Stopping ${ actionName }! Missing or invalid required information!`);
    } else {
      this.logger.debug(err);
      this.logger.debug(`Error during ${ actionName }! Retrying in ${ this._getReconnectTimeoutSeconds() } seconds!`);
      if (this.isConnected()) {
        this._disconnect();
      }
      this._runTimeoutAction(timeoutFunction.bind(this));
    }
  }

  async _identfiyDeviceInternal(foundDeviceModel) {
    if (foundDeviceModel) {
      if (!this.model) {
        this.model = foundDeviceModel;
        this.logger.info(`Device identified! Model: ${foundDeviceModel}`);
        this.emit(Events.MIOT_DEVICE_IDENTIFIED, this);
      }
    } else {
      throw new Errors.UnknownDeviceModel();
    }
  }

  _validateDid() {
    //make sure did is in a string format, if not then correct, did must be of type string for micloud request else cloud will respond with -8 "data type not valid"
    if (this.getDeviceId() && !this._isString(this.getDeviceId())) {
      this.logger.debug(`Did is not of type string. Converting to string!`);
      this.deviceId = String(this.getDeviceId());
    }

    // make sure that we have the deviceId
    if (!this.getDeviceId()) {
      if (this.shouldUseMiCloud()) {
        throw new Errors.MissingDeviceId(this.name);
      } else {
        // just a soft warning since local device the control works also without did
        this.logger.warn(`Could not find deviceId for ${this.name}! This may cause issues! Please specify a deviceId in the 'config.json' file!`);
      }
    }
  }

  _validateModel() {
    if (this.model && this.model !== this.getModel()) {
      this.logger.debug(`Found device model ${this.getModel()} does not match specified model ${this.model}! Some services might not work correctly!`);
    }
  }


  /*----------========== DEVICE LIFECYCLE ==========----------*/

  async _startPropertyPolling() {
    if (this.propertyPollingUnsupported) {
      this.logger.warn(`Property polling is disabled because this device does not support local MIOT property polling.`);
      return;
    }
    if (!this.updateDevicePropertiesInterval) {

      // initial properties fetch
      const shouldStartPolling = await this._doInitialPropertiesFetch();
      if (!shouldStartPolling) {
        return;
      }

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
      return true;
    } catch (err) {
      if (err instanceof Errors.UnsupportedLocalMiotPropertyPolling) {
        this._stopPropertyPollingAsUnsupported(err);
        return false;
      }
      this.logger.debug(`Error on initial property request! ${err}`);
      return true;
    }
  }

  _pollDeviceProperties() {
    this.logger.info(`Starting property polling.`);
    this.updateDevicePropertiesInterval = setInterval(async () => {
      try {
        await this.pollProperties();
        this.pollRetries = 0;
      } catch (err) {
        if (err instanceof Errors.UnsupportedLocalMiotPropertyPolling) {
          this._stopPropertyPollingAsUnsupported(err);
          return;
        }
        this.pollRetries++;
        this.logger.debug(`Poll failed ${this.pollRetries} times!`);
        if (this.updateDevicePropertiesInterval && this.pollRetries >= MAX_POLL_RETRIES) {
          let warnMsg = `Poll failed ${this.pollRetries} times in a row! Stopping polling and trying to reconnect! Reason: ${err}`;
          this.pollRetries = 0;
          if (err instanceof Errors.DeviceNotOnline) { // no need to disconnect when device is not online, just retry after some time
            this.logger.debug(warnMsg); // hide the device offline message behind debug as this is expected!
            this._restartPolling();
          } else {
            this.logger.warn(warnMsg);
            this._reconnectAndRestartPolling();
          }
        } else {
          this.logger.debug(`Poll failed! ${err}`);
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

  _stopPropertyPollingAsUnsupported(err) {
    this.propertyPollingUnsupported = true;
    this.pollRetries = 0;
    this._clearTimeoutAndInterval();
    this.logger.warn(`${err.message} Stopping property polling for this device. The Matter accessory will remain registered, but state updates require a device model that supports local MIOT polling.`);
  }

  _restartPolling() {
    this._clearTimeoutAndInterval();
    this.logger.debug(`Restarting polling in ${ this._getReconnectTimeoutSeconds() } seconds...`);
    this._runTimeoutAction(this._pollDeviceProperties.bind(this));
  }

  _reconnectAndRestartPolling() {
    this._disconnect();
    this.logger.debug(`Reconnecting and restarting polling in ${ this._getReconnectTimeoutSeconds() } seconds...`);
    this._runTimeoutAction(this._connectToDeviceAndPoll.bind(this));
  }


  /*----------========== MICLOUD CONFIG ==========----------*/

  _ensureMiCloudClient() {
    if (this.miCloud) {
      return;
    }

    this.miCloud = new MiCloud(this.logger);
    let requestTimeout = parseInt(this._getMiCloudTimeout());
    if (requestTimeout) {
      requestTimeout = requestTimeout > this.pollingInterval ? this.pollingInterval : requestTimeout; // make sure we do not exceed polling interval
      this.miCloud.setRequestTimeout(requestTimeout);
    }
    this.miCloud.setUseUnencryptedRequests(this._getMiCloudUseUnencryptedRequests());
  }

  async _saveCachedMiCloudSession() {
    if (!this._getMiCloudUseCachedSession() || !this._getMiCloudCachedSessionFile() || !this.miCloud || !this.miCloud.isLoggedIn()) {
      return;
    }

    const serviceToken = this.miCloud.getServiceToken();
    if (!serviceToken) {
      return;
    }

    const cacheFile = this._getMiCloudCachedSessionFile();
    try {
      await fs.mkdir(path.dirname(cacheFile), { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify(serviceToken), 'utf8');
      this.miCloudConfig.cachedSession = serviceToken;
      this.logger.info(`Saved cached MiCloud session for future use.`);
    } catch (err) {
      this.logger.warn(`Could not save cached MiCloud session: ${err.message}`);
    }
  }

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

  _getCachedMiCloudSession() {
    if (this.miCloudConfig) {
      return this.miCloudConfig.cachedSession;
    }
    return null;
  }

  _getMiCloudCachedSessionFile() {
    if (this.miCloudConfig) {
      return this.miCloudConfig.cachedSessionFile;
    }
    return null;
  }

  _canUseMiCloud() {
    return this.miCloudConfig && (this._hasMiCloudCredentials() || this._getMiCloudUseCachedSession());
  }

  _hasMiCloudCredentials() {
    return this._getMiCloudUsername() && this._getMiCloudPassword();
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

  _getMiCloudUseUnencryptedRequests() {
    return this._getMiCloudConfigProp('unencryptedRequests');
  }

  _getMiCloudUseCachedSession() {
    return this._getMiCloudConfigProp('useCachedSession');
  }


  /*----------========== MIOT SPEC ==========----------*/

  _processMiotSpecFetchResult(result) {
    this.setMiotSpec(result);
    this.logger.info(`Successfully got device miot spec!`);
    this.logger.info(`Spec device type: ${this.getSpecType()} description: ${this.getDescription()}`);
    this.logger.deepDebug(`Miot spec: ${JSON.stringify(result, null, 2)}`);
    this.emit(Events.MIOT_DEVICE_SPEC_FETCHED, this);
  }


  /*----------========== METADATA (delegated to MiotSpec) ==========----------*/

  // services
  createService(siid, type, description) { return this.spec.createService(siid, type, description); }
  createServiceBySpec(serviceSpec) { return this.spec.createServiceBySpec(serviceSpec); }
  createServiceByString(specString) { return this.spec.createServiceByString(specString); }
  getServiceById(siid) { return this.spec.getServiceById(siid); }
  getServiceByType(type) { return this.spec.getServiceByType(type); }
  getAllServicesByType(type) { return this.spec.getAllServicesByType(type); }
  hasServiceWithId(siid) { return this.spec.hasServiceWithId(siid); }
  hasServiceWithType(type) { return this.spec.hasServiceWithType(type); }
  getAllServices() { return this.spec.getAllServices(); }
  getAllServiceTypes() { return this.spec.getAllServiceTypes(); }

  // properties
  addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList) { return this.spec.addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList); }
  addPropertyBySpec(name, propSpec) { return this.spec.addPropertyBySpec(name, propSpec); }
  addPropertyByString(name, specString) { return this.spec.addPropertyByString(name, specString); }
  hasProperty(miotProp) { return this.spec.hasProperty(miotProp); }
  hasPropertyByName(propName) { return this.spec.hasPropertyByName(propName); }
  hasPropertyById(propId) { return this.spec.hasPropertyById(propId); }
  getProperty(miotProp) { return this.spec.getProperty(miotProp); }
  getPropertyByName(propName) { return this.spec.getPropertyByName(propName); }
  getPropertyById(propId) { return this.spec.getPropertyById(propId); }
  findPropertyByType(propType) { return this.spec.findPropertyByType(propType); }
  getAllProperties() { return this.spec.getAllProperties(); }
  getAllPropertyNames() { return this.spec.getAllPropertyNames(); }

  getBeautifiedAllPropNameValues() {
    // only readable properties
    let readablePropNames = this.getAllPropertyNames().filter(name => this.getPropertyByName(name).isReadable());
    let propNameValues = readablePropNames.map(name => this.getPropertyByName(name).getNameValueString());
    return JSON.stringify(propNameValues, null, 2);
  }

  // actions
  addAction(name, siid, aiid, type, description, inDef) { return this.spec.addAction(name, siid, aiid, type, description, inDef); }
  addActionBySpec(name, actionSpec) { return this.spec.addActionBySpec(name, actionSpec); }
  addActionByString(name, specString) { return this.spec.addActionByString(name, specString); }
  hasAction(miotAction) { return this.spec.hasAction(miotAction); }
  hasActionByName(actionName) { return this.spec.hasActionByName(actionName); }
  hasActionById(actionId) { return this.spec.hasActionById(actionId); }
  hasActions() { return this.spec.hasActions(); }
  getAction(miotAction) { return this.spec.getAction(miotAction); }
  getActionByName(actionName) { return this.spec.getActionByName(actionName); }
  getActionById(actionId) { return this.spec.getActionById(actionId); }
  findActionByType(actionType) { return this.spec.findActionByType(actionType); }
  getAllActions() { return this.spec.getAllActions(); }
  getAllActionNames() { return this.spec.getAllActionNames(); }

  // events
  addEvent(name, siid, eiid, type, description, argumentsDef) { return this.spec.addEvent(name, siid, eiid, type, description, argumentsDef); }
  addEventBySpec(name, eventSpec) { return this.spec.addEventBySpec(name, eventSpec); }
  addEventByString(name, specString) { return this.spec.addEventByString(name, specString); }
  hasEvent(miotEvent) { return this.spec.hasEvent(miotEvent); }
  hasEventByName(eventName) { return this.spec.hasEventByName(eventName); }
  hasEventById(eventId) { return this.spec.hasEventById(eventId); }
  hasEvents() { return this.spec.hasEvents(); }
  getEvent(miotEvent) { return this.spec.getEvent(miotEvent); }
  getEventByName(eventName) { return this.spec.getEventByName(eventName); }
  getEventById(eventId) { return this.spec.getEventById(eventId); }
  findEventByType(evenType) { return this.spec.findEventByType(evenType); }
  getAllEvents() { return this.spec.getAllEvents(); }
  getAllEventNames() { return this.spec.getAllEventNames(); }


  /*----------========== PROTOCOL ==========----------*/

  // properties
  // seems like there is a limit on how many props the device can process at once, observed a limit of 16
  // for this reason we are going to split all props into chunks and do sepearte requests for each chunk
  async requestAllProperties() {
    if (this.isConnected()) {
      let propNameChunks = this._getAllReadablePropNameChunks();
      this.logger.debug(`Preparing property poll!`);
      this.logger.debug(`Splitting properties into chunks. Number of chunks: ${propNameChunks.length}. Chunk size: ${this.getAllPropRequestChunkSize()}`);
      this.logger.deepDebug(`Chunks:  ${JSON.stringify(propNameChunks, null, 1)}`);
      // Request the chunks sequentially rather than all at once. Sending every chunk in parallel can
      // overwhelm slower devices, which then reject some requests with -30012 "busy". See issue #773.
      let results = [];
      for (const propChunk of propNameChunks) {
        results.push(await this.requestPropertyChunk(propChunk));
      }
      return results;
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
    if (!Array.isArray(result)) {
      if (this._isUnsupportedLocalMiotPropertyResponse(result)) {
        throw new Errors.UnsupportedLocalMiotPropertyPolling(this.getModel());
      }
      throw new Error(`Invalid property response from device. Expected array but received: ${JSON.stringify(result)}`);
    }
    this.logger.deepDebug(`Successfully updated property chunk! RAW: ${JSON.stringify(result)}`);
    // all good, process the data
    const obj = {};
    for (let i = 0; i < result.length; i++) {
      this._updatePropertyValueFromDevice(obj, propKeys[i], result[i]);
    }
    return obj;
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
      let actionDef = action.getProtocolAction(this.getDeviceId(), paramValues, this.isParseActionParams());
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

  //method
  async executeMethod(methodName, paramValues = []) {
    if (!methodName) {
      throw new Error(`Missing method! Cannot execute method request!`);
    }
    if (!this.isConnected()) {
      throw new Error(`Cannot execute method ${methodName} with params ${JSON.stringify(paramValues)}! Device not connected!`);
    }
    this.logger.deepDebug(`Executing method! Method: ${methodName} Params: ${JSON.stringify(paramValues)}`);
    const result = await this.miotSend(methodName, paramValues);
    if (result && !result.includes("unknown_method")) {
      this.logger.debug(`Successfully executed method ${methodName} with params ${paramValues}! Result: ${JSON.stringify(result)}`);
      this.emit(Events.MIOT_DEVICE_METHOD_EXECUTED, methodName);
      return result;
    } else {
      throw new Error(`Error while executing method ${methodName} with params ${JSON.stringify(paramValues)}! Invalid response from device. Response: ${JSON.stringify(result)}`);
    }
  }

  /*----------========== PROTOCOL CALLS ==========----------*/

  async getMiotProperties(params = []) {
    if (this.shouldUseMiCloud() && this.isConnectedToCloud()) {
      return this.miCloud.miotGetProps(params);
    } else if (this.isConnectedToLocalDevice()) {
      try {
        const result = await this.miioProtocol.send(this.ip, COMMAND_GET, params);
        if (!this.localPropertyReader || !this._isUnsupportedLocalMiotPropertyResponse(result)) {
          return result;
        }
      } catch (err) {
        if (!this.localPropertyReader) {
          throw err;
        }
      }
      return this.localPropertyReader(params, this);
    } else {
      throw new Error(`Not connected to device!`);
    }
  }

  async setMiotProperties(params = []) {
    if (this.shouldUseMiCloud() && this.isConnectedToCloud()) {
      return this.miCloud.miotSetProps(params);
    } else if (this.isConnectedToLocalDevice()) {
      return this.miioProtocol.send(this.ip, COMMAND_SET, params);
    } else {
      throw new Error(`Not connected to device!`);
    }
  }

  async miotAction(param = {}) {
    if (this.shouldUseMiCloud() && this.isConnectedToCloud()) {
      return this.miCloud.miotAction(param);
    } else if (this.isConnectedToLocalDevice()) {
      return this.miioProtocol.send(this.ip, COMMAND_ACTION, param);
    } else {
      throw new Error(`Not connected to device!`);
    }
  }

  async miotSend(methodName, params = []) {
    if (this.shouldUseMiCloud() && this.isConnectedToCloud()) {
      return this.miCloud.miioCall(this.getDeviceId(), methodName, params);
    } else if (this.isConnectedToLocalDevice()) {
      return this.miioProtocol.send(this.ip, methodName, params);
    } else {
      throw new Error(`Not connected to device!`);
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
    for (let i = 0; i < readablePropNames.length; i += this.getAllPropRequestChunkSize()) {
      let propChunk = readablePropNames.slice(i, i + this.getAllPropRequestChunkSize());
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
    // "code" == 0 -> request was successful
    if (response && response.code === 0) {
      return true;
    }

    // on some devices no "code" is send back in the response altrough the request was successful (only for getting properties, actions and property setters does not send back a value)
    if (response && response.code == null && response.value != null) {
      return true;
    }

    // code -704042011 -> device offline for cloud devices
    if (response && MiCloudUtils.isDeviceOfflineResponseCode(response.code)) {
      throw new Errors.DeviceNotOnline(this.getDeviceId());
      return false;
    }

    return false;
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

  _isUnsupportedLocalMiotPropertyResponse(response) {
    return !this.shouldUseMiCloud() &&
      this.isConnectedToLocalDevice() &&
      typeof response === 'string' &&
      response.includes('unknown_method');
  }


}

module.exports = MiotDevice;

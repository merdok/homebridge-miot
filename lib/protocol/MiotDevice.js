const fs = require('fs');
const path = require('path');
const miio = require('miio');
const EventEmitter = require('events');
const MiotProperty = require('./MiotProperty.js');
const MiotAction = require('./MiotAction.js');
const MiCloud = require('./MiCloud.js');
const Properties = require('../constants/Properties.js');
const DevTypes = require('../constants/DevTypes.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');

const COMMAND_GET = 'get_properties';
const COMMAND_SET = 'set_properties';
const COMMAND_ACTION = 'action';
const ALL_PROP_REQUEST_CHUNK_SIZE = 14;
const MAX_POLL_RETRIES = 4;

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all
// device types: http://miot-spec.org/miot-spec-v2/spec/devices
// service types: http://miot-spec.org/miot-spec-v2/spec/services


class MiotDevice extends EventEmitter {
  constructor(model, deviceId, name, logger) {
    super();

    // config
    this.deviceId = deviceId;
    this.model = model;
    this.name = name;
    this.logger = logger;

    this.miCloudConfig = {};
    this.pollingInterval = 5000;

    if (!this.model) {
      this.logger.error(`Missing model information!`);
    }

    //device info
    this.miioDevice = undefined;
    this.deviceInfo = {};
    this.miCloud = undefined;
    this.miCloudDeviceInfo = {};

    // prepare the variables
    this.properties = {};
    this.actions = {};
    this.updateDevicePropertiesInterval = undefined;
    this.pollRetries = 0;

    // init the device
    this._initDevice();
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return null;
  }

  getDeviceName() {
    return "Unknown";
  }

  getDeviceMiotSpec() {
    return null;
  }


  /*----------========== INIT ==========----------*/

  _initDevice() {
    // init device properties
    this.logger.info(`Initializing device properties`);
    this.initDeviceProperties();
    this.logger.debug(`Device properties: ${JSON.stringify(Object.keys(this.properties), null, 2)}`);

    // init device actions
    this.logger.info(`Initializing device actions`);
    this.initDeviceActions();
    this.logger.info(`Device actions: ${JSON.stringify(Object.keys(this.actions), null, 2)}`);
  }


  /*----------========== SETUP ==========----------*/

  async _setupDeviceInternal() {
    this.logger.info(`Setting up device!`);

    // get the device info
    this._fetchDeviceInfo();

    // get the device deviceId if not specified
    if (!this.deviceId) {
      this.deviceId = this.getDeviceId();
      this.logger.info(`Did not specified. Got did: ${this.deviceId} from device!`);
    }

    // make sure we have the did, soft warning to the user if not
    this._checkDid();

    // do a device specific device setup
    this.logger.info(`Doing device specific setup`);
    this.deviceSpecificSetup();

    // if device requires a MiCloud connection then try to connect
    if (this.requiresMiCloud()) {
      this.logger.info(`Device requires MiCloud! Trying to connect!`);
      try {
        await this._connectToMiCloud();
      } catch (err) {
        this.logger.warn(err);
        this.disconnectAndDestroyMiioDevice();
        let reconnectTimeout = this.pollingInterval * 6;
        this.logger.debug(`Trying to reconnect in ${reconnectTimeout/1000} seconds...`);
        setTimeout(() => {
          this.emit(Events.DEVICE_DISCONNECTED, this);
        }, reconnectTimeout);
        throw new Error(`MiCloud is required but login to MiCloud failed!`);
      }
    }

    // get device info from MiCloud if specified
    if (!this.miCloudDeviceInfo || Object.keys(this.miCloudDeviceInfo).length === 0) {
      this._connectToMiCloud().then(() => {
        if (this.miCloud && this.miCloud.isLoggedIn()) {
          this.logger.info(`Getting device info from MiCloud!`);
          this.miCloud.getDevice(this.deviceId).then((result) => {
            if (result !== undefined) {
              this.miCloudDeviceInfo = result;
              this.logger.debug(`Got device info from MiCloud: \n ${JSON.stringify(result, null, 2)}`);
            } else {
              throw new Error(`The device with id ${this.deviceId} could not be found on the ${this.miCloudConfig.country || 'cn'} server! Please make sure that the specified micloud country is correct!`);
            }
          }).catch((err) => {
            this.logger.debug(`Could not retrieve device info from MiCloud!`);
            if (this.requiresMiCloud()) {
              this.logger.warn(`${err}`);
            } else {
              this.logger.debug(`${err}`);
            }
          });
        }
      });
    }

    // initial properties fetch
    this._doInitialPropertiesFetch();

    // start device property polling
    this._pollDeviceProperties();

    this.logger.info(`Device setup finished! Device ready, you can now control your device!`);
  }

  _fetchDeviceInfo() {
    // get the device info
    if (!this.deviceInfo || Object.keys(this.deviceInfo).length === 0) {
      this.logger.debug(`Fetching device info.`);
      this.miioDevice.management.info().then((info) => {
        this.deviceInfo = info;
        this.logger.debug(`Got device info! Device firmware: ${this.deviceInfo.fw_ver}`);
        this.logger.deepDebug(`Full device info: \n ${JSON.stringify(this.deviceInfo, null, 2)}`);
      }).catch(err => {
        this.logger.debug(`Could not retrieve device info: ${err}`);
      });
    }
  }

  _checkDid() {
    // make sure that we have the deviceId, not sure if this is required for local calls even on the miot protocol(maybe only required for cloud calls)
    // just a soft warning since locally the control works also without did
    try {
      if (!this.getDeviceId()) throw new Error(`Could not find deviceId for ${this.name}! This may cause issues! Please specify a deviceId in the 'config.json' file!`);
    } catch (error) {
      this.logger.warn(error);
    }
  }

  async _connectToMiCloud() {
    if (this.miCloudConfig && this.miCloudConfig.username && this.miCloudConfig.password) {
      if (!this.miCloud) {
        this.miCloud = new MiCloud(this.logger);
        this.miCloud.setRequestTimeout(this.pollingInterval); // use the polling interval as request timeout
        await this.miCloud.login(this.miCloudConfig.username, this.miCloudConfig.password, this.miCloudConfig.country);
        this.logger.info(`Successfully connected to MiCloud!`);
      }
    } else if (this.requiresMiCloud()) {
      throw new Error(`The device requires a MiCloud connection! In order to control the device please specify a MiCloud username and password! Canceling setup!`);
    }
  }


  /*----------========== DEVICE LIFECYCLE ==========----------*/

  _doInitialPropertiesFetch() {
    this.logger.info(`Doing initial property fetch`);
    // initial properties fetch
    this.requestAllProperties().then((result) => {
      // on initial connection log the retrieved properties
      this.logger.debug(`Got initial device properties: \n ${JSON.stringify(this.getAllPropNameValues(), null, 2)}`);
      this._gotInitialPropertiesFromDevice();
    }).catch(err => {
      this.logger.debug(`Error on initial property request! ${err}`);
    });
  }

  _gotInitialPropertiesFromDevice() {
    // log the total use time if the device supports it
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Device total use time: ${this.getUseTime()} minutes.`);
    }

    // devices actions
    this.initialPropertyFetchDone();
  }

  _pollDeviceProperties() {
    this.updateDevicePropertiesInterval = setInterval(() => {
      this.pollProperties().then(result => { //TODO: result is empty here and above, there should be a list of updated properties which i can then react to
        //this.logger.debug(`Poll successful! Got data from miot device!`);
        this.emit(Events.DEVICE_ALL_PROPERTIES_UPDATED, this);
        this.logger.deepDebug(`Device properties updated: \n ${JSON.stringify(this.getAllPropNameValues(), null, 2)}`);
        this.pollRetries = 0;
      }).catch(err => {
        this.pollRetries++;
        this.logger.debug(`Poll failed! No response from device! ${err}`);
        if (this.updateDevicePropertiesInterval && this.pollRetries >= MAX_POLL_RETRIES) {
          this.logger.warn(`Poll failed ${this.pollRetries} times in a row! Stopping polling and trying to reconnect!`);
          clearInterval(this.updateDevicePropertiesInterval);
          this.updateDevicePropertiesInterval = undefined;
          this.pollRetries = 0;
          this.disconnectAndDestroyMiioDevice();
          this.logger.debug(`Trying to reconnect...`);
          this.emit(Events.DEVICE_DISCONNECTED, this);
        }
      });
    }, this.pollingInterval);
  }


  /*----------========== DEVICE CONTROL ==========----------*/

  setMiCloudConfig(newMiCloudConfig) {
    this.miCloudConfig = newMiCloudConfig;
  }

  setPollingInterval(newPollingInterval) {
    if (newPollingInterval >= 1000) {
      this.pollingInterval = newPollingInterval;
    }
  }

  async setupDevice(newMiioDevice) {
    if (newMiioDevice === undefined) {
      this.logger.warn(`Missing miio device! Cannot proceed with setup!`);
      return;
    }

    try {
      if (!this.miioDevice) {
        this.miioDevice = newMiioDevice;
        await this._setupDeviceInternal(); // run setup only for the first time
      } else {
        //TODO: what to do with this? is actaully never called since miotcontroller destroys the miiodevice calling the bloew method
        this.miioDevice = newMiioDevice;
        this.logger.info(`Reconnected to device!`);
      }

      this.emit(Events.DEVICE_CONNECTED, this);
    } catch (error) {
      this.logger.warn(`Setup failed!`);
      this.logger.warn(error);
    }
  }

  disconnectAndDestroyMiioDevice() {
    if (this.miioDevice) {
      this.miioDevice.destroy();
    }
    this.miioDevice = undefined;

    // if required, also refresh the micloud connection
    if (this.miCloud && this.requiresMiCloud()) {
      if (this.miCloud.isLoggedIn()) {
        this.miCloud.logout();
      }
      this.miCloud = null;
    }
  }

  async pollProperties() {
    if (this.isConnected()) {
      return this.requestAllProperties();
    }
    return new Promise((resolve, reject) => {
      reject(new Error('Device not connected'));
    });
  }


  /*----------========== DEVICE OVERRIDES ==========----------*/

  initDeviceProperties() {
    // implemented by devices
  }

  initDeviceActions() {
    // implemented by devices
  }

  deviceSpecificSetup() {
    // implemented by devices
  }

  initialPropertyFetchDone() {
    // implemented by devices
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false || this.miCloudConfig.forceMiCloud === true;
  }


  /*----------========== INFO ==========----------*/

  isConnected() {
    if (this.requiresMiCloud()) {
      return this.miioDevice && this.miCloud && this.miCloud.isLoggedIn();
    }
    return this.miioDevice !== undefined;
  }

  getModel() {
    if (this.isConnected()) {
      return this.miioDevice.miioModel;
    }
    return this.model;
  }

  getType() {
    return DevTypes.UNKNOWN;
  }

  getDeviceInfo() {
    return this.deviceInfo;
  }

  getDeviceId() {
    if (this.miioDevice && this.miioDevice.id) {
      return this.miioDevice.id.replace(/^miio:/, '');
    }
    return this.deviceId;
  }


  /*----------========== METADATA ==========----------*/

  // properties
  addProperty(name, siid, piid, format, access, unit, valueRange, valueList) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create property!`);
      return;
    }

    if (!siid || !piid) {
      this.logger.warn(`Missing siid or piid for ${name} property! Cannot create!`);
      return;
    }

    let newProp = new MiotProperty(name, siid, piid, format, access, unit, valueRange, valueList, this);
    this.properties[name] = newProp;
    return newProp;
  }

  hasProperty(propName) {
    if (!propName || propName.length === 0) {
      return false;
    }
    return this.properties[propName] !== undefined;
  }

  getProperty(propName) {
    let prop = this.properties[propName];
    if (prop) {
      return prop;
    }
    this.logger.warn(`The property ${propName} was not found on this deivce!`);
    return null;
  }

  getAllProperties() {
    return this.properties;
  }

  getAllPropNameValues() {
    // only readable properties
    let readablePropKeys = Object.keys(this.properties).filter(key => this.properties[key].isReadable());
    let propNameValues = readablePropKeys.map(key => this.properties[key].getNameValObj());
    return propNameValues;
  }


  // actions
  addAction(name, siid, aiid, inDef) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create action!`);
      return;
    }

    if (!siid || !aiid) {
      this.logger.warn(`Missing siid or aiid for ${name} action! Cannot create!`);
      return;
    }

    let newActions = new MiotAction(name, siid, aiid, inDef, this);
    this.actions[name] = newActions;
    return newActions;
  }

  hasAction(actionName) {
    return this.actions[actionName] !== undefined;
  }

  hasActions() {
    return this.actions && Object.keys(this.actions).length > 0;
  }

  getAction(actionName) {
    let action = this.actions[actionName];
    if (action) {
      return action;
    }
    this.logger.warn(`The action ${actionName} was not found on this deivce!`);
    return null;
  }

  getAllActions() {
    return this.actions;
  }


  /*----------========== PROPERTY HELPERS ==========----------*/

  getPropertyValue(propName) {
    let prop = this.getProperty(propName);
    if (prop) {
      return prop.getValue();
    }
    return undefined;
  }

  getSafePropertyValue(propName) {
    let prop = this.getProperty(propName);
    if (prop) {
      return prop.getSafeValue();
    }
    return 0;
  }

  getPropertyValueRange(propName) {
    if (this.hasProperty(propName)) {
      let prop = this.getProperty(propName);
      if (prop.hasValueRange()) {
        return prop.getValueRange();
      }
    }
    return [];
  }

  getPropertyValueList(propName) {
    if (this.hasProperty(propName)) {
      let prop = this.getProperty(propName);
      if (prop.hasValueList()) {
        return prop.getValueList();
      }
    }
    return [];
  }

  async setPropertyValue(propName, value) {
    let prop = this.getProperty(propName);
    if (prop) {
      let adjustedValue = prop.adjustValueToPropRange(value);
      if (adjustedValue !== value) {
        let propRange = prop.getValueRange();
        this.logger.debug(`Trying to set ${prop.getName()} property with an out of range value: ${value} Range: ${JSON.stringify(propRange)}. Adjusting value to: ${adjustedValue}`);
      }
      if (prop.getValue() !== adjustedValue) {
        return this.setProperty(prop, adjustedValue);
      } else {
        this.logger.debug(`Property ${prop.getName()} seems to have already the value: ${adjustedValue}. Set not needed! Skipping...`);
      }
    }
  }


  /*----------========== ACTION HELPERS ==========----------*/

  async fireAction(actionName, paramValues = []) {
    let action = this.getAction(actionName);
    if (action) {
      return this.sendAction(action, paramValues);
    }
  }


  /*----------========== PROTOCOL ==========----------*/

  // properties
  // seems like there is a limit on how many props the device can process at once, observed a limit of 16
  // for this reason we are going to split all props into chunks and do sepearte requests for each chunk
  async requestAllProperties() {
    if (this.isConnected()) {
      let propRequestPromises = [];
      let propKeyChunks = this.getAllReadablePropKeysChunks();
      this.logger.debug(`Splitting properties into chunks. Number of chunks: ${propKeyChunks.length}. Chunk size: ${ALL_PROP_REQUEST_CHUNK_SIZE}`);
      this.logger.deepDebug(`Chunks:  ${JSON.stringify(propKeyChunks, null, 1)}`);
      propKeyChunks.forEach((propChunk) => {
        propRequestPromises.push(this.requestPropertyChunk(propChunk));
      });
      return Promise.all(propRequestPromises);
    } else {
      return this.createErrorPromise(`Cannot poll all properties! Device not connected!`);
    }
  }

  async requestPropertyChunk(propKeys) {
    if (this.isConnected()) {
      let protcolProps = propKeys.map(key => this.getProperty(key).getReadProtocolObjForDid(this.deviceId));
      return this.getMiotProperties(protcolProps)
        .then(result => {
          // if no response or response empty then throw an error so that the the poll will fail
          if (!result || result.length === 0) {
            throw new Error(`No response or response empty!`)
          }
          // all good, process the data
          const obj = {};
          for (let i = 0; i < result.length; i++) {
            this.updatePropertyValueFromDevice(obj, propKeys[i], result[i]);
          }
          return obj;
        });
      // no catch here, catch has to be handled by caller, in that case the property polling
    } else {
      return this.createErrorPromise(`Cannot request property chunk values! Device not connected!`);
    }
  }

  // currently not used, but can be used to retrieve a single property value
  async requestProperty(prop) {
    if (prop) {
      if (this.isConnected()) {
        if (prop.isReadable()) {
          let propDef = prop.getReadProtocolObjForDid(this.deviceId);
          this.logger.deepDebug(`Request ${prop.getName()} property! RAW: ${JSON.stringify(propDef)}`);
          return this.getMiotProperties([propDef])
            .then(result => {
              this.logger.debug(`Successfully updated property ${prop} value! Result: ${JSON.stringify(result)}`);
              const obj = {};
              this.updatePropertyValueFromDevice(obj, prop.getName(), result[0]);
              this.emit(Events.DEVICE_PROPERTY_UPDATED, prop);
              return obj;
            }).catch(err => {
              this.logger.debug(`Error while requesting property ${prop.getName()}! ${err}`);
            });
        } else {
          return this.createErrorPromise(`Cannot update property ${prop.getName()}! Property is write only!`);
        }
      } else {
        return this.createErrorPromise(`Cannot update property ${prop.getName()}! Device not connected!`);
      }
    } else {
      return this.createErrorPromise(`Missing property! Cannot execute read request!`);
    }
  }

  // set property
  async setProperty(prop, value) {
    if (prop) {
      if (this.isConnected()) {
        let propDef = prop.getWriteProtocolObjForDid(this.deviceId, value);
        this.logger.deepDebug(`Set ${prop.getName()} property request! RAW: ${JSON.stringify(propDef)}`);
        return this.setMiotProperties([propDef]).then(result => {
          if (this.isResponseValid(result[0])) {
            this.logger.debug(`Successfully set property ${prop.getName()} to value ${value}! Response: ${JSON.stringify(result)}`);
            prop.updateInternalValue(value); // do not wait for poll, update the local prop and notifiy listeners after successful set
            this.emit(Events.DEVICE_PROPERTY_UPDATED, prop);
          } else {
            throw new Error(`Invalid response. Response: ${JSON.stringify(result)}`);
          }
        }).catch(err => {
          this.logger.debug(`Error while setting property ${prop.getName()} to value ${value}! ${err}`);
        });
      } else {
        return this.createErrorPromise(`Cannot set property ${prop.getName()} to value ${value}! Device not connected!`);
      }
    } else {
      return this.createErrorPromise(`Missing property! Cannot set the value!`);
    }
  }

  // actions
  async sendAction(action, paramValues = []) {
    if (action) {
      if (this.isConnected()) {
        let actionDef = action.getProtocolAction(this.deviceId, paramValues);
        this.logger.deepDebug(`Send action! RAW: ${JSON.stringify(actionDef)}`);
        return this.miotAction(actionDef).then(result => {
          if (this.isResponseValid(result)) {
            this.logger.debug(`Successfully executed action ${action.getName()} with params ${paramValues}! Result: ${JSON.stringify(result)}`);
            this.emit(Events.DEVICE_ACTION_EXECUTED, action);
          } else {
            throw new Error(`Invalid response. Response: ${JSON.stringify(result)}`);
          }
          action.setLastResult(result);
          return action;
        }).catch(err => {
          this.logger.debug(`Error while executing action ${action.getName()} with params ${paramValues}! ${err}`);
        });
      } else {
        return this.createErrorPromise(`Cannot execute action ${action.getName()} with params ${paramValues}! Device not connected!`);
      }
    } else {
      return this.createErrorPromise(`Missing action! Cannot execute action request!`);
    }
  }


  /*----------========== PROTOCOL CALLS ==========----------*/

  async getMiotProperties(params = []) {
    if (this.requiresMiCloud()) {
      return this.miCloud.miotGetProps(params);
    } else {
      return this.miioDevice.call(COMMAND_GET, params);
    }
  }

  async setMiotProperties(params = []) {
    if (this.requiresMiCloud()) {
      return this.miCloud.miotSetProps(params);
    } else {
      return this.miioDevice.call(COMMAND_SET, params);
    }
  }

  async miotAction(param = {}) {
    if (this.requiresMiCloud()) {
      return this.miCloud.miotAction(param);
    } else {
      return this.miioDevice.call(COMMAND_ACTION, param);
    }
  }


  /*----------========== PROTOCOL HELPERS ==========----------*/

  // get only properties which are reabadle
  getAllReadableProps() {
    let tmpAllReadableProps = {};
    let allPropKeys = Object.keys(this.properties);
    allPropKeys.forEach((key) => {
      let tmpProp = this.properties[key];
      if (tmpProp && tmpProp.isReadable()) {
        tmpAllReadableProps[key] = tmpProp;
      }
    });
    return tmpAllReadableProps;
  }

  // split all readable props into smaller chunks
  getAllReadablePropKeysChunks() {
    let propertyChunks = [];
    let allReadableProps = this.getAllReadableProps();
    let readablePropKeys = Object.keys(allReadableProps);
    for (let i = 0; i < readablePropKeys.length; i += ALL_PROP_REQUEST_CHUNK_SIZE) {
      let propChunk = readablePropKeys.slice(i, i + ALL_PROP_REQUEST_CHUNK_SIZE);
      propertyChunks.push(propChunk);
    }
    return propertyChunks;
  }

  // updates the property value with the value retrieved from the device
  updatePropertyValueFromDevice(result, propName, response) {
    if (this.isResponseValid(response)) {
      this.getProperty(propName).updateInternalValue(response.value);
      result[propName] = response.value;
    } else {
      this.logger.debug(`Error while parsing response from device for property ${propName}. Response: ${JSON.stringify(response)}`);
    }
  }

  isResponseValid(response) {
    if (response && response.code === 0) {
      return true;
    } else {
      return false;
    }
  }


  /*----------========== HELPERS ==========----------*/

  createErrorPromise(msg) {
    return new Promise((resolve, reject) => {
      reject(new Error(msg));
    }).catch(err => {
      this.logger.debug(err);
    });
  }


}

module.exports = MiotDevice;

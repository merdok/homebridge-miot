const fs = require('fs');
const path = require('path');
const miio = require('miio');
var EventEmitter = require('events');
const MiotProperty = require('./MiotProperty.js');
const Capabilities = require('./constants/Capabilities.js');
const Properties = require('./constants/Properties.js');
const DevTypes = require('./constants/DevTypes.js');
const Constants = require('./constants/Constants.js');
const Events = require('./constants/Events.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all


class MiotDevice extends EventEmitter {
  constructor(miioDevice, model, deviceId, name, logger) {
    super();

    // config
    this.deviceId = deviceId;
    this.model = model;
    this.name = name;
    this.logger = logger;

    if (!this.model) {
      this.logger.error(`Missing model information!`);
    }

    //device info
    this.miioDevice = undefined;
    this.deviceInfo = {};
    this.deviceConfig = {};

    // prepare the variables
    this.capabilities = {};
    this.properties = {};

    // init the device
    this.initDevice();

    // if we construct with a miio device then we can start with the setup
    if (miioDevice) {
      this.updateMiioDevice(miioDevice);
    }

  }


  /*----------========== INIT ==========----------*/

  initDevice() {
    // init device properties
    this.logger.info(`Initializing device properties`);
    this.initDeviceProperties();
    this.logger.debug(`Device properties: ${JSON.stringify(this.properties, null, 2)}`);

    // init device capabilities
    this.logger.info(`Initializing device capabilities`);
    this.initDeviceCapabilities();
    this.logger.debug(`Device capabillities: ${JSON.stringify(this.capabilities, null, 2)}`);
  }

  initDeviceProperties() {
    // implemented by devices
    // most devices have the power control on 2,1 so use that for generic devices
    this.addProperty(Properties.POWER, 2, 1, 'bool', ['read', 'write', 'notify']);
  }

  initDeviceCapabilities() {
    // implemented by devices
  }


  /*----------========== SETUP ==========----------*/

  setupDevice() {
    this.logger.info(`Setting up device!`);

    // get the device info
    this.fetchDeviceInfo();

    // get the device deviceId if not specified
    if (!this.deviceId) {
      this.deviceId = this.getDeviceId();
      this.logger.info(`Did not specified. Got did: ${this.deviceId} from device`);
    }

    // make sure we have the did, soft warning to the user if not
    this.checkDid();

    // do a device specific device setup
    this.logger.info(`Doing device specific setup`);
    this.deviceSpecificSetup();

    // initial properties fetch
    this.doInitialPropertiesFetch();

    this.logger.info(`Device setup finished! Device ready, you can now control your device!`);
  }

  fetchDeviceInfo() {
    // get the device info
    if (!this.deviceInfo) {
      this.logger.debug(`Fetching device info.`);
      this.miioDevice.management.info().then((info) => {
        this.deviceInfo = info;
      }).catch(err => {
        this.logger.debug(`Could not retrieve device info: ${err}`);
      });
    }
  }

  checkDid() {
    this.logger.debug(`Making sure we have did`);
    // make sure that we have the deviceId, not sure if this is required for local calls even on the miot protocol(maybe only required for cloud calls)
    // just a soft warning since locally the control works also without did
    try {
      if (!this.getDeviceId()) throw new Error(`Could not find deviceId for ${this.name}! This may cause issues! Please specify a deviceId in the 'config.json' file!`);
    } catch (error) {
      this.logger.warn(error);
      return;
    }
  }

  deviceSpecificSetup() {
    // implemented by devices
  }


  /*----------========== DEVICE CONTROL ==========----------*/

  disconnectAndDestroyMiioDevice() {
    if (this.miioDevice) {
      this.miioDevice.destroy();
    }
    this.miioDevice = undefined;
  }

  updateMiioDevice(newMiioDevice) {
    if (!this.miioDevice) {
      this.miioDevice = newMiioDevice;
      this.setupDevice(); // run setup only for the first time
    } else {
      this.miioDevice = newMiioDevice;
      this.logger.info(`Reconnected to device!`);
    }
  }


  /*----------========== DEVICE LIFECYCLE ==========----------*/

  doInitialPropertiesFetch() {
    this.logger.info(`Doing initial properties fetch`);
    // initial properties fetch
    this.requestAllProperties().then(() => {
      // on initial connection log the retrieved properties
      this.logger.debug(`Got initial device properties: \n ${JSON.stringify(this.getAllPropNameValues(), null, 2)}`);
      this.gotInitialPropertiesFromDevice();
    }).catch(err => {
      this.logger.debug(`Error on initial property request! ${err}`);
    });
  }

  async pollProperties() {
    if (this.isConnected()) {
      return this.requestAllProperties();
    }
    return new Promise((resolve, reject) => {
      reject(new Error('Device not connected'));
    });
  }

  gotInitialPropertiesFromDevice() {
    // log the total use time if the device supports it
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Device total use time: ${this.getUseTime()} minutes.`);
    }

    // devices actions
    this.initialPropertyFetchDone();
  }

  initialPropertyFetchDone() {
    // implemented by devices
  }


  /*----------========== INFO ==========----------*/

  isConnected() {
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

  getAllCapabilities() {
    return this.capabilities;
  }

  getAllProperties() {
    return this.properties;
  }

  getAllPropNameValues() {
    let propNameValues = Object.keys(this.properties).map(key => this.properties[key].getNameValObj());
    return propNameValues;
  }

  getDeviceId() {
    if (this.isConnected()) {
      return this.miioDevice.id.replace(/^miio:/, '');
    }
    return this.deviceId;
  }


  /*----------========== CAPABILITIES ==========----------*/

  supportsPowerControl() {
    return this.properties[Properties.POWER] !== undefined;
  }

  supportsChildLock() {
    return this.properties[Properties.CHILD_LOCK] !== undefined;
  }

  // power off timer
  supportsPowerOffTimer() {
    return this.properties[Properties.POWER_OFF_TIME] !== undefined; // if a power off timer can be configured
  }

  powerOffTimerUnit() {
    return this.capabilities[Capabilities.POWER_OFF_TIMER_UNIT] || ''; // the unit of the power off timer
  }

  powerOffTimerRange() {
    return this.capabilities[Capabilities.POWER_OFF_TIMER_RANGE] || []; // range for the power off timer
  }

  // alarm
  supportsBuzzerControl() {
    return this.properties[Properties.ALARM] !== undefined; // if buzzer can be configured on/off
  }

  // led
  supportsLedControl() {
    return this.properties[Properties.LED] !== undefined; // if indicator light can be configured on/off
  }

  ledControlRange() {
    return this.capabilities[Capabilities.LED_CONTROL_RANGE] || [];
  }

  supportsLedControlRange() {
    return this.ledControlRange().length > 0 ? true : false;
  }

  supportsLedControlBrightness() {
    return this.ledControlRange().length > 1 && this.ledControlRange()[0] === 0 && this.ledControlRange()[1] === 100;
  }

  // temperature
  supportsTemperatureReporting() {
    return this.properties[Properties.TEMPERATURE] !== undefined; // whether the device has a built in temperature sensor which can be read
  }

  // relative humidity
  supportsRelativeHumidityReporting() {
    return this.properties[Properties.RELATIVE_HUMIDITY] !== undefined; // whether the device has a built in humidity sensor which can be read
  }

  // battery
  hasBuiltInBattery() {
    return this.capabilities[Capabilities.BUILT_IN_BATTERY] || false; // whether the device has a built in battery
  }

  supportsBatteryPowerReporting() {
    return this.properties[Properties.BATTERY_POWER] !== undefined; // whether the device reports if it is running on battery power
  }

  supportsBatteryLevelReporting() {
    return this.properties[Properties.BATTERY_LEVEL] !== undefined; // whether the device reports the state of the built in battery
  }

  supportsAcPowerReporting() {
    return this.properties[Properties.AC_POWER] !== undefined; // whether the device reports if it is running on ac power
  }

  // use time
  supportsUseTimeReporting() {
    return this.properties[Properties.USE_TIME] !== undefined;
  }

  useTimeUnit() {
    return this.supportsUseTimeReporting() ? this.properties[Properties.USE_TIME].getUnit() : Constants.PROP_UNIT_MINUTES;
  }


  /*----------========== STATUS ==========----------*/

  isPowerOn() {
    return this.getPropertyValue(Properties.POWER);
  }

  isChildLockActive() {
    return this.getPropertyValue(Properties.CHILD_LOCK);
  }

  isBuzzerEnabled() {
    return this.getPropertyValue(Properties.ALARM);
  }

  isLedEnabled() {
    if (this.supportsLedControlBrightness()) {
      return this.getPropertyValue(Properties.LED) > 0;
    } else if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      return this.getPropertyValue(Properties.LED) !== maxLevel; // last one is usually off
    }
    return this.getPropertyValue(Properties.LED);
  }

  getLedBrightness() {
    if (this.supportsLedControlBrightness()) {
      return this.getPropertyValue(Properties.LED);
    }
    return this.isLedEnabled() ? 100 : 0;
  }

  getShutdownTimer() {
    let value = this.getPropertyValue(Properties.POWER_OFF_TIME);
    if (this.powerOffTimerUnit() === Constants.PROP_UNIT_HOURS) {
      return value * 60;
    } else if (this.powerOffTimerUnit() === Constants.PROP_UNIT_SECONDS) {
      return Math.ceil(value / 60);
    }
    return value;
  }

  isShutdownTimerEnabled() {
    return this.getShutdownTimer() > 0;
  }

  getTemperature() {
    return this.getPropertyValue(Properties.TEMPERATURE);
  }

  getRelativeHumidity() {
    return this.getPropertyValue(Properties.RELATIVE_HUMIDITY);
  }

  isOnBatteryPower() {
    return this.getPropertyValue(Properties.BATTERY_POWER);
  }

  getBatteryLevel() {
    return this.getPropertyValue(Properties.BATTERY_LEVEL);
  }

  getUseTime() {
    let useTime = this.getPropertyValue(Properties.USE_TIME);
    if (this.useTimeUnit() === Constants.PROP_UNIT_HOURS) {
      return useTime * 60;
    } else if (this.useTimeUnit() === Constants.PROP_UNIT_SECONDS) {
      return Math.ceil(useTime / 60)
    }
    return useTime;
  }


  /*----------========== COMMANDS ==========----------*/

  async setPowerOn(power) {
    this.setPropertyValue(Properties.POWER, power);
  }

  async setChildLock(active) {
    this.setPropertyValue(Properties.CHILD_LOCK, active);
  }

  async setBuzzerEnabled(enabled) {
    this.setPropertyValue(Properties.ALARM, enabled);
  }

  async setLedEnabled(enabled) {
    if (this.supportsLedControlBrightness()) {
      let value = enabled ? 100 : 0;
      this.setPropertyValue(Properties.LED, value);
    } else if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      let level = minLevel; // first one is usually full brightness
      if (enabled === false) {
        level = maxLevel; // last one is usually off
      }
      this.setPropertyValue(Properties.LED, level);
    } else {
      this.setPropertyValue(Properties.LED, enabled);
    }
  }

  async setLedBrightness(brightness) {
    if (this.supportsLedControlBrightness()) {
      this.setPropertyValue(Properties.LED, brightness);
    } else {
      let enabled = brightness > 0 ? true : false;
      this.setLedEnabled(enabled);
    }
  }

  async setShutdownTimer(minutes) {
    if (this.powerOffTimerUnit() === 'seconds') {
      let seconds = minutes * 60;
      this.setPropertyValue(Properties.POWER_OFF_TIME, seconds);
    } else if (this.powerOffTimerUnit() === 'hours') {
      let hours = minutes / 60;
      this.setPropertyValue(Properties.POWER_OFF_TIME, hours);
    } else {
      this.setPropertyValue(Properties.POWER_OFF_TIME, minutes);
    }
  }


  /*----------========== METADATA ==========----------*/

  addCapability(name, value) {
    this.capabilities[name] = value;
  }

  addProperty(name, siid, piid, format, access, unit, valueRange) {
    this.properties[name] = new MiotProperty(name, siid, piid, format, access, unit, valueRange);
  }


  /*----------========== HELPERS ==========----------*/

  createErrorPromise(msg) {
    return new Promise((resolve, reject) => {
      reject(new Error(msg));
    }).catch(err => {
      this.logger.debug(err);
    });
  }

  getPropertyValue(propName) {
    let prop = this.properties[propName];
    if (prop) {
      return prop.getValue();
    }
    this.logger.warn(`The property ${propName} was not found on this deivce!`);
    return 0;
  }

  setPropertyValue(propName, value) {
    let prop = this.properties[propName];
    if (prop) {
      this.setProperty(propName, value);
    } else {
      this.logger.warn(`The property ${propName} was not found on this deivce!`);
    }
  }


  /*----------========== PROTOCOL ==========----------*/

  updatePropertyValue(result, name, returnObj) {
    if (returnObj.code === 0) {
      this.properties[name].setValue(returnObj.value);
      result[name] = returnObj.value;
    }
  }

  // actions
  async sendCommnd(propName, value) {
    if (this.isConnected()) {
      let cmdDef = this.properties[propName].getProtocolObjForDid(this.deviceId, value);
      this.logger.deepDebug(`Send command! RAW: ${JSON.stringify(cmdDef)}`);
      return this.miioDevice.call('set_properties', [cmdDef]).then(result => {
        this.logger.debug(`Successfully send command ${cpropNamemd} with value ${value}! Result: ${JSON.stringify(result)}`);
      }).catch(err => {
        this.logger.debug(`Error while executing command ${propName} with value ${value}! ${err}`);
      });
    } else {
      return this.createErrorPromise(`Cannot execute command ${propName} with value ${value}! Device not connected!`);
    }
  }

  async setProperty(propName, value) {
    if (this.isConnected()) {
      let propDef = this.properties[propName].getProtocolObjForDid(this.deviceId, value);
      this.logger.deepDebug(`Set Property! RAW: ${JSON.stringify(propDef)}`);
      return this.miioDevice.call('set_properties', [propDef]).then(result => {
        this.logger.debug(`Successfully set property ${propName} to value ${value}! Result: ${JSON.stringify(result)}`);
        // update the local prop and notifiy listeners
        this.properties[propName].setValue(value);
        this.emit(Events.DEVICE_DEVICE_MANUAL_PROPERTIES_UPDATE, result);
      }).catch(err => {
        this.logger.debug(`Error while setting property ${propName} to value ${value}! ${err}`);
      });
    } else {
      return this.createErrorPromise(`Cannot set property ${propName} to value ${value}! Device not connected!`);
    }
  }

  async requestAllProperties() {
    if (this.isConnected()) {
      let props = Object.keys(this.properties).map(key => this.properties[key].getProtocolObjForDid(this.deviceId));
      let propKeys = Object.keys(this.properties);
      return this.miioDevice.call('get_properties', props)
        .then(result => {
          const obj = {};
          for (let i = 0; i < result.length; i++) {
            this.updatePropertyValue(obj, propKeys[i], result[i]);
          }
          return obj;
        });
      // no catch here, catch has to be handled by caller, in that case the property polling
    } else {
      return this.createErrorPromise(`Cannot poll all properties! Device not connected!`);
    }
  }

  // currently not used, but can be used to retrieve a isngle property value
  async requestProperty(propName) {
    if (this.isConnected()) {
      let propDef = this.properties[propName].getProtocolObjForDid(this.deviceId);
      this.logger.deepDebug(`Request Property! RAW: ${JSON.stringify(propDef)}`);
      return this.miioDevice.call('get_properties', [propDef])
        .then(result => {
          this.logger.debug(`Successfully updated property ${prop} value! Result: ${JSON.stringify(result)}`);
          const obj = {};
          this.updatePropertyValue(obj, prop, result[0]);
          this.emit(Events.DEVICE_DEVICE_MANUAL_PROPERTIES_UPDATE, result);
          return obj;
        }).catch(err => {
          this.logger.debug(`Error while requesting property ${propName}! ${err}`);
        });
    } else {
      return this.createErrorPromise(`Cannot update property ${propName}! Device not connected!`);
    }
  }

}

module.exports = MiotDevice;

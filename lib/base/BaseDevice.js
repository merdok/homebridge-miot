const EventEmitter = require('events');
const MiotDevice = require('../protocol/MiotDevice.js');
const MiotService = require('../protocol/MiotService.js');
const MiotProperty = require('../protocol/MiotProperty.js');
const MiotAction = require('../protocol/MiotAction.js');
const MiotEvent = require('../protocol/MiotEvent.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const DevTypes = require('../constants/DevTypes.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');
const AccessoryFactory = require('../factories/AccessoryFactory.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=released

class BaseDevice extends EventEmitter {
  constructor(miotDevice, name, logger) {
    super();

    if (new.target === BaseDevice) {
      throw new Error("Cannot instantiate BaseDevice directly!")
    }

    this.miotDevice = miotDevice;
    this.name = name;
    this.logger = logger;

    if (!this.miotDevice) {
      this.logger.error(`Missing miot device!`);
    }

    this.accessoryWrapper = null;
  }


  /*----------========== INIT ==========----------*/

  async initDevice() {
    // init device services
    this.logger.info(`Initializing device services`);
    this.initDeviceServices();
    this.logger.info(`Device services: ${JSON.stringify(this.getAllServiceTypes(), null, 2)}`);

    // init device properties
    this.logger.info(`Initializing device properties`);
    this.initDeviceProperties();
    this.logger.info(`Device properties: ${JSON.stringify(this.getAllPropertyNames(), null, 2)}`);

    // init device actions
    this.logger.info(`Initializing device actions`);
    this.initDeviceActions();
    if (this.hasActions()) {
      this.logger.info(`Device actions: ${JSON.stringify(this.getAllActionNames(), null, 2)}`);
    }

    // init device events
    this.logger.debug(`Initializing device events`);
    this.initDeviceEvents();
    if (this.hasEvents()) {
      this.logger.debug(`Device events: ${JSON.stringify(this.getAllEventNames(), null, 2)}`);
    }

    this.getMiotDevice().on(Events.MIOT_DEVICE_CONNECTED, (miotDevice) => {
      this.deviceConnected();
      this.updateAccessoryStatus();
    });

    this.getMiotDevice().on(Events.MIOT_DEVICE_DISCONNECTED, (miotDevice) => {
      this.deviceDisconnected();
      this.updateAccessoryStatus();
    });

    this.getMiotDevice().on(Events.MIOT_DEVICE_INITIAL_PROPERTY_FETCH_DONE, (miotDevice) => {
      this._initialPropertiesFetched();
      this.updateAccessoryStatus();
    });

    this.getMiotDevice().on(Events.MIOT_DEVICE_ALL_PROPERTIES_UPDATED, (miotDevice) => {
      this.allPropertiesUpdated();
      this.updateAccessoryStatus();
    });

    this.getMiotDevice().on(Events.MIOT_DEVICE_PROPERTY_VALUE_SET, (property) => {
      this.propertyValueSet(property);
      this.updateAccessoryStatus();
    });

    this.getMiotDevice().on(Events.MIOT_DEVICE_ACTION_EXECUTED, (action) => {
      this.actionExecuted(action);
      //  this.updateAccessoryStatus(); // no need to update accessory status since an action does not change properties directly
    });

    // set which properties to monitor initially
    const propsToMonitor = this._getInitialPropsToMonitor();
    this.getMiotDevice().setPropertiesToMonitor(propsToMonitor);
    this._logPropsToMonitor('Initial');

    // set whether the device requires a mi cloud connection
    this.getMiotDevice().setRequiresMiCloud(this.requiresMiCloud());
  }

  initDeviceAccessory(uuid, config, api, cachedDeviceInfo) {
    this.logger.info('Initializing accessory!');
    this.accessoryWrapper = AccessoryFactory.createAccessory(this.getName(), this, uuid, config, api, this.logger);
    if (this.accessoryWrapper) {
      this.updateAccessoryInformationService(cachedDeviceInfo);
      this.logger.info('Accessory successfully initialized!');
      this._logPropsToMonitor('Final');
    } else {
      this.logger.error('Something went wrong. Could not initialize accessory!');
    }
  }


  /*----------========== LIFECYCLE ==========----------*/

  _initialPropertiesFetched() {
    this.initialPropertyFetchDone();
  }


  /*----------========== DEVICE OVERRIDES ==========----------*/

  initDeviceServices() {
    // implemented by devices
  }

  initDeviceProperties() {
    // implemented by devices
  }

  initDeviceActions() {
    // implemented by devices
  }

  initDeviceEvents() {
    // implemented by devices
  }

  deviceSpecificSetup() {
    // implemented by devices
  }

  deviceConnected() {
    // implemented by devices
  }

  deviceDisconnected() {
    // implemented by devices
  }

  initialPropertyFetchDone() {
    // implemented by devices
  }

  allPropertiesUpdated() {
    // implemented by devices
  }

  propertyValueSet(prop) {
    // implemented by devices
  }

  actionExecuted(action) {
    // implemented by devices
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.UNKNOWN;
  }

  getModel() {
    return this.getMiotDevice().getModel();
  }

  getDeviceName() {
    return this.getSpecDescription() || 'Unknown device';
  }

  getMiotSpecUrl() {
    return null;
  }


  /*----------========== GETTERS ==========----------*/

  isConnected() {
    return this.getMiotDevice().isConnected();
  }

  isLocallyConnected() {
    return this.getMiotDevice().isLocallyConnected();
  }

  getName() {
    return this.name;
  }

  getMiotDevice() {
    return this.miotDevice;
  }

  getSpecDescription() {
    return this.getMiotDevice().getDescription();
  }

  getMiotSpec() {
    return this.getMiotDevice().getMiotSpec();
  }


  /*----------========== ACCESSORY STUFF ==========----------*/

  getAccessoryWrapper() {
    return this.accessoryWrapper;
  }

  getAccessories() {
    return this.accessoryWrapper.getAccessories();
  }

  updateAccessoryStatus() {
    if (this.accessoryWrapper) this.accessoryWrapper.updateAccessoryStatus();
  }

  updateAccessoryInformationService(cachedDeviceInfo) {
    if (this.accessoryWrapper) {
      let manufacturer = 'Xiaomi';
      let model = this.getMiotDevice().getModel() || cachedDeviceInfo.model || 'Unknown';
      let deviceId = this.getMiotDevice().getDeviceId() || cachedDeviceInfo.deviceId || 'Unknown';
      let firmwareRev = this.getMiotDevice().getFirmwareRevision() || cachedDeviceInfo.firmwareRev || 'Unknown';

      if (model.includes('yeelink.')) {
        manufacturer = 'Yeelight Technology';
      } else if (model.includes('.')) {
        const tmpMan = model.split('.')[0];
        if (tmpMan && tmpMan.length) {
          manufacturer = tmpMan.charAt(0).toUpperCase() + tmpMan.substring(1);
        }
      }

      this.accessoryWrapper.updateInformationService(this.getName(), manufacturer, model, deviceId, firmwareRev);
    }
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  propertiesToMonitor() {
    return [];
  }

  devicePropertiesToMonitor() {
    return null; //needs to be null to know if a device did override properties to monitor
  }

  commonProperties() {
    return [];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/

  _getInitialPropsToMonitor() {
    let propsToMonitor = [];

    const deviceSpecificPropsToMonitor = this.devicePropertiesToMonitor();
    // if device class specified an empty array then monitor all properties
    if (deviceSpecificPropsToMonitor !== null && deviceSpecificPropsToMonitor.length === 0) {
      return propsToMonitor;
    }

    //if the device specified an array of properties then get it
    if (deviceSpecificPropsToMonitor !== null && deviceSpecificPropsToMonitor.length > 0) {
      propsToMonitor = [...new Set([...propsToMonitor, ...deviceSpecificPropsToMonitor])];
    }

    // merge the device properties to monitor with the ones specified by the module
    if (propsToMonitor !== null) {
      const modulePropsToMonitor = this.propertiesToMonitor();
      propsToMonitor = [...new Set([...propsToMonitor, ...modulePropsToMonitor])];
    }

    // combine the result from above with common properties
    if (propsToMonitor !== null && propsToMonitor.length > 0) { //empty array = all properties, if not all specified then append the common properties
      const commonPropsToMonitor = this.commonProperties();
      propsToMonitor = [...new Set([...propsToMonitor, ...commonPropsToMonitor])];
    }

    //if something failed for any reason then monitor all
    if (!propsToMonitor) {
      propsToMonitor = [];
    }

    return propsToMonitor;
  }

  _registerForPropUpdate(miotProp) {
    if (miotProp) {
      miotProp.on(Events.PROP_VALUE_CHANGED, (prop) => {
        this.logger.debug(`Property ${prop.getName()} value changed to ---> ${prop.getValue()}`);
      });
    }
  }

  _registerForActionExecuted(miotAction) {
    if (miotAction) {
      miotAction.on(Events.ACTION_EXECUTED, (action) => {
        this.logger.debug(`Action ${action.getName()} executed! Updating properties!`);
        try {
          this.getMiotDevice().pollProperties(); // trigger a manual property update since some properties might have changed
        } catch (err) {
          this.logger.debug(`Property poll after action executed failed: Error: ${err}`);
        }
      });
    }
  }


  /*----------========== PROPERTY HELPERS ==========----------*/

  getPropertyValue(propObj) {
    let prop = this.getProperty(propObj);
    if (prop) {
      return prop.getValue();
    }
    return undefined;
  }

  getSafePropertyValue(propObj) {
    let prop = this.getProperty(propObj);
    if (prop) {
      return prop.getSafeValue();
    }
    return 0;
  }

  getPropertyValueRange(propObj) {
    let prop = this.getProperty(propObj);
    if (prop && prop.hasValueRange()) {
      return prop.getValueRange();
    }
    return [];
  }

  getPropertyValueList(propObj) {
    let prop = this.getProperty(propObj);
    if (prop && prop.hasValueList()) {
      return prop.getValueList();
    }
    return [];
  }

  async setPropertyValue(propObj, value) {
    let prop = this.getProperty(propObj);
    if (prop) {
      let adjustedValue = prop.adjustValueToPropRange(value);
      if (adjustedValue !== value) {
        let propRange = prop.getValueRange();
        this.logger.debug(`Trying to set ${prop.getName()} property with an out of range value: ${value} Range: ${JSON.stringify(propRange)}. Adjusting value to: ${adjustedValue}`);
      }
      if (prop.getValue() !== adjustedValue) {
        return this.getMiotDevice().setProperty(prop, adjustedValue);
      } else {
        this.logger.debug(`Property ${prop.getName()} seems to have already the value: ${adjustedValue}. Set not needed! Skipping...`);
      }
    }
  }

  getPropertyUnit(propObj) {
    let prop = this.getProperty(propObj);
    if (prop) {
      return prop.getUnit();
    }
    return PropUnit.NONE;
  }


  /*----------========== ACTION HELPERS ==========----------*/

  async fireAction(actionObj, paramValues = []) {
    let action = this.getAction(actionObj);
    if (action) {
      return this.getMiotDevice().executeAction(action, paramValues);
    }
  }


  /*----------========== EVENT HELPERS ==========----------*/


  /*----------========== INTERNAL HELPERS ==========----------*/

  _logPropsToMonitor(status) {
    const propsToMonitor = this.getMiotDevice().getPropertiesToMonitor();
    if (propsToMonitor.length > 0) {
      this.logger.debug(`${status} properties to monitor: ${JSON.stringify(propsToMonitor, null, 2)}`);
    } else {
      this.logger.debug(`!-!-! ${status} - Monitoring all properties !-!-!`);
    }
  }


  /*----------========== PROXY CALLS ==========----------*/

  // services
  createService(siid, type, description) {
    return this.getMiotDevice().createService(siid, type, description);
  }

  createServiceBySpec(serviceSpec) {
    return this.getMiotDevice().createServiceBySpec(serviceSpec);
  }

  createServiceByString(specString) {
    return this.getMiotDevice().createServiceByString(specString);
  }

  getServiceById(siid) {
    return this.getMiotDevice().getServiceById(siid);
  }

  getServiceByType(type) {
    return this.getMiotDevice().getServiceByType(type);
  }

  getAllServicesByType(type) {
    return this.getMiotDevice().getAllServicesByType(type);
  }

  hasServiceWithId(siid) {
    return this.getMiotDevice().hasServiceWithId(siid);
  }

  hasServiceWithType(type) {
    return this.getMiotDevice().hasServiceWithType(type);
  }

  getAllServices() {
    return this.getMiotDevice().getAllServices();
  }

  getAllServiceTypes() {
    return this.getMiotDevice().getAllServiceTypes();
  }

  // properties
  addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList) {
    const newProp = this.getMiotDevice().addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList);
    this._registerForPropUpdate(newProp);
    return newProp;
  }

  addPropertyBySpec(name, propSpec) {
    const newProp = this.getMiotDevice().addPropertyBySpec(name, propSpec);
    this._registerForPropUpdate(newProp);
    return newProp;
  }

  addPropertyByString(name, specString) {
    const newProp = this.getMiotDevice().addPropertyByString(name, specString);
    this._registerForPropUpdate(newProp);
    return newProp;
  }

  hasProperty(miotProp) {
    return this.getMiotDevice().hasProperty(propName);
  }

  hasPropertyByName(propName) {
    return this.getMiotDevice().hasPropertyByName(propName);
  }

  hasPropertyById(propId) {
    return this.getMiotDevice().hasPropertyById(propId);
  }

  getProperty(miotProp) {
    return this.getMiotDevice().getProperty(miotProp);
  }

  getPropertyByName(propName) {
    return this.getMiotDevice().getPropertyByName(propName);
  }

  getPropertyById(propId) {
    return this.getMiotDevice().getPropertyById(propId);
  }

  findPropertyByType(propType) {
    return this.getMiotDevice().findPropertyByType(propType);
  }

  getAllProperties() {
    return this.getMiotDevice().getAllProperties();
  }

  getAllPropertyNames() {
    return this.getMiotDevice().getAllPropertyNames();
  }

  getBeautifiedAllPropNameValues() {
    return this.getMiotDevice().getBeautifiedAllPropNameValues();
  }


  // actions
  addAction(name, siid, aiid, type, description, inDef) {
    const newAction = this.getMiotDevice().addAction(name, siid, aiid, type, description, inDef);
    this._registerForActionExecuted(newAction);
    return newAction;
  }

  addActionBySpec(name, actionSpec) {
    const newAction = this.getMiotDevice().addActionBySpec(name, actionSpec);
    this._registerForActionExecuted(newAction);
    return newAction;
  }

  addActionByString(name, specString) {
    const newAction = this.getMiotDevice().addActionByString(name, specString);
    this._registerForActionExecuted(newAction);
    return newAction;
  }

  hasAction(miotAction) {
    return this.getMiotDevice().hasAction(miotAction);
  }

  hasActionByName(actionName) {
    return this.getMiotDevice().hasActionByName(actionName);
  }

  hasActionById(actionId) {
    return this.getMiotDevice().hasActionById(actionId);
  }

  hasActions() {
    return this.getMiotDevice().hasActions();
  }

  getAction(miotAction) {
    return this.getMiotDevice().getAction(miotAction);
  }

  getActionByName(actionName) {
    return this.getMiotDevice().getActionByName(actionName);
  }

  getActionyById(actionId) {
    return this.getMiotDevice().getActionyById(actionId);
  }

  findActionByType(actionType) {
    return this.getMiotDevice().findActionByType(actionType);
  }

  getAllActions() {
    return this.getMiotDevice().getAllActions();
  }

  getAllActionNames() {
    return this.getMiotDevice().getAllActionNames();
  }


  // events
  addEvent(name, siid, eiid, type, description, argumentsDef) {
    return this.getMiotDevice().addEvent(name, siid, eiid, type, description, argumentsDef);
  }

  addEventBySpec(name, eventSpec) {
    return this.getMiotDevice().addEventBySpec(name, eventSpec);
  }

  addEventByString(name, specString) {
    return this.getMiotDevice().addEventByString(name, specString);
  }

  hasEvent(miotEvent) {
    return this.getMiotDevice().hasEvent(miotEvent);
  }

  hasEventByName(eventName) {
    return this.getMiotDevice().hasEventByName(eventName);
  }

  hasEventById(eventId) {
    return this.getMiotDevice().hasEventById(eventId);
  }

  hasEvents() {
    return this.getMiotDevice().hasEvents();
  }

  getEvent(miotEvent) {
    return this.getMiotDevice().getEvent(miotEvent);
  }

  getEventByName(eventName) {
    return this.getMiotDevice().getEventByName(eventName);
  }

  getEventById(eventId) {
    return this.getMiotDevice().getEventById(eventId);
  }

  findEventByType(evenType) {
    return this.getMiotDevice().findEventByType(evenType);
  }

  getAllEvents() {
    return this.getMiotDevice().getAllEvents();
  }

  getAllEventNames() {
    return this.getMiotDevice().getAllEventNames();
  }


  //config
  addPropertyToMonitor(miotProp) {
    this.getMiotDevice().addPropertyToMonitor(miotProp);
  }


}

module.exports = BaseDevice;

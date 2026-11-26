const MiotService = require('./MiotService.js');
const MiotProperty = require('./MiotProperty.js');
const MiotAction = require('./MiotAction.js');
const MiotEvent = require('./MiotEvent.js');
const MiotProtocolUtils = require('../utils/MiotProtocolUtils.js');


// Owns a device's miot spec: the raw spec json and the parsed structure
// (services, properties, actions, events) plus derived metadata (type,
// description, version). The parse/builder/accessor logic mirrors what
// MiotDevice does today so this can later back MiotDevice via delegation
// without any behavior change.
class MiotSpec {
  constructor(logger) {
    this.logger = logger;
    this.raw = null;
    this.services = [];
    this.allPropertiesMap = {};
    this.allActionsMap = {};
    this.allEventsMap = {};
  }


  /*----------========== RAW / PARSE ==========----------*/

  setRaw(spec) {
    if (spec) {
      this.raw = spec;
      this._parse();
    }
  }

  getRaw() {
    return this.raw;
  }

  _parse() {
    if (this.getRaw()) {
      this.logger.debug(`Parsing miot spec!`);

      //reset variables
      if (this.services && this.services.length > 0) {
        this.logger.debug(`Already have parsed spec! Resetting!`);
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
      } = this.getRaw();

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

  getRawType() {
    return this.getRaw() ? this.getRaw().type : '';
  }

  getSpecType() {
    return this.getRawType().split(':')[3] || null;
  }

  getDescription() {
    return this.getRaw() ? this.getRaw().description : '';
  }

  getVersion() {
    return MiotProtocolUtils.parseSpecVersionFromUrl(this.getRawType());
  }


  /*----------========== SERVICES ==========----------*/

  createService(siid, type, description) {
    if (!MiotProtocolUtils.isValidMiotId(siid)) {
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


  /*----------========== PROPERTIES ==========----------*/

  addProperty(name, siid, piid, type, description, format, access, unit, valueRange, valueList) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create property!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(piid)) {
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


  /*----------========== ACTIONS ==========----------*/

  addAction(name, siid, aiid, type, description, inDef) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create action!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(aiid)) {
      this.logger.warn(`Missing or invalid aiid (${aiid}) for ${name} action! Cannot create!`);
      return;
    }

    if (this.hasActionByName(name)) {
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


  /*----------========== EVENTS ==========----------*/

  addEvent(name, siid, eiid, type, description, argumentsDef) {
    if (!name) {
      this.logger.warn(`Missing name! Cannot create event!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(siid)) {
      this.logger.warn(`Missing or invalid siid (${siid}) for ${name} property! Cannot create!`);
      return;
    }

    if (!MiotProtocolUtils.isValidMiotId(eiid)) {
      this.logger.warn(`Missing or invalid eiid (${eiid}) for ${name} event! Cannot create!`);
      return;
    }

    if (this.hasEventByName(name)) {
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


  /*----------========== HELPERS ==========----------*/

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

module.exports = MiotSpec;

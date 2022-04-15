const EventEmitter = require('events');
const Events = require('../constants/Events.js');
const Constants = require('../constants/Constants.js');
const MiotProperty = require('./MiotProperty.js');
const MiotAction = require('./MiotAction.js');
const MiotEvent = require('./MiotEvent.js');
const MiotProtocolHelpers = require('./MiotProtocolHelpers.js');

// service types: https://miot-spec.org/miot-spec-v2/spec/services

class MiotService extends EventEmitter {
  constructor(siid, type, description) {
    super();

    this.siid = MiotProtocolHelpers.validateMiotId(siid);
    this.type = type || '';
    this.description = description || '';
    this.properties = [];
    this.actions = [];
    this.events = [];

    if (this.siid === null) {
      throw new Error(`Failed to create miot service! Invalid or missing service id! siid: ${siid}`);
    }
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getId() {
    return this.siid;
  }

  getRawType() {
    return this.type;
  }

  getType() {
    return this.type.split(':')[3] || '';
  }

  getDescription() {
    return this.description;
  }

  addProperty(miotProperty) {
    if (miotProperty instanceof MiotProperty && !this.properties.includes(miotProperty)) {
      this.properties.push(miotProperty);
    }
  }

  addAction(miotAction) {
    if (miotAction instanceof MiotAction && !this.actions.includes(miotAction)) {
      this.actions.push(miotAction);
    }
  }

  addEvent(miotEvent) {
    if (miotEvent instanceof MiotEvent && !this.events.includes(miotEvent)) {
      this.events.push(miotEvent);
    }
  }

  getProperties() {
    return this.properties;
  }

  getActions() {
    return this.actions;
  }

  getEvents() {
    return this.events;
  }

  getPropertyByType(propType) {
    return this.properties.find(prop => prop.getType() === propType);
  }

  getActionByType(actionType) {
    return this.actions.find(action => action.getType() === actionType);
  }

  getEventByType(eventType) {
    return this.events.find(eventObj => eventObj.getType() === eventType);
  }

  getPropertyById(piid) {
    return this.properties.find(prop => prop.getId() == piid);
  }

  getActionById(aiid) {
    return this.actions.find(action => action.getId() == aiid);
  }

  getEventById(eiid) {
    return this.events.find(eventObj => eventObj.getId() == eiid);
  }


  /*----------========== PROTOCOL ==========----------*/


  /*----------========== HELPERS ==========----------*/


  /*----------========== INTERNAL HELPERS ==========----------*/


}

module.exports = MiotService;

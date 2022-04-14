const EventEmitter = require('events');
const Events = require('../constants/Events.js');
const Constants = require('../constants/Constants.js');
const MiotProtocolHelpers = require('./MiotProtocolHelpers.js');

// event types: https://miot-spec.org/miot-spec-v2/spec/events

class MiotEvent extends EventEmitter {
  constructor(name, siid, eiid, type, description, argumentsDef) {
    super();

    this.name = name || null;
    this.siid = siid || null;
    this.eiid = eiid || null;
    this.type = type || '';
    this.description = description || '';
    this.argumentsDef = argumentsDef || [];
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  getId() {
    return this.eiid;
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


  /*----------========== PROTOCOL ==========----------*/

  getProtocolEvent(deviceId, params = []) {
    if (!deviceId) {
      throw new Error(`Cannot create protocol event object. Missing device id!`);
      return null;
    }

    if (!this.siid || !MiotProtocolHelpers.isValidMiotId(this.eiid)) {
      throw new Error(`Cannot create protocol event object. Invalid siid or eiid!`);
      return null;
    }

    let protocolEvent = {};
    protocolEvent.did = deviceId;
    protocolEvent.siid = this.siid;
    protocolEvent.eiid = this.eiid;
    protocolEvent.arguments = this.argumentsDef
    return protocolEvent;
  }


  /*----------========== HELPERS ==========----------*/


  /*----------========== INTERNAL HELPERS ==========----------*/


}

module.exports = MiotEvent;

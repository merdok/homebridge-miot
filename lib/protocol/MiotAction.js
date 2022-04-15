const EventEmitter = require('events');
const Events = require('../constants/Events.js');
const Constants = require('../constants/Constants.js');
const MiotProtocolHelpers = require('./MiotProtocolHelpers.js');

// action types: http://miot-spec.org/miot-spec-v2/spec/actions

class MiotAction extends EventEmitter {
  constructor(name, siid, aiid, type, description, inDef) {
    super();

    this.name = name || null;
    this.siid = MiotProtocolHelpers.validateMiotId(siid);
    this.aiid = MiotProtocolHelpers.validateMiotId(aiid);
    this.type = type || '';
    this.description = description || '';
    this.inDef = inDef || [];
    this.out = [];
    this.lastResult = {};

    if (this.siid === null || this.aiid === null) {
      throw new Error(`Failed to create miot action! Invalid or missing service id and/or action id! siid: ${siid} aiid: ${aiid}`);
    }
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  getId() {
    return this.aiid;
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

  setOut(out = []) {
    this.out = out;
  }

  getOut() {
    return this.out;
  }

  setLastResult(lastResult = {}) {
    this.lastResult = lastResult;
    if (this.lastResult && this.lastResult.code === 0) {
      if (this.lastResult.out) {
        this.setOut(this.lastResult.out);
      }
      this.emit(Events.ACTION_EXECUTED, this);
    }
  }

  getLastResult() {
    return this.lastResult;
  }


  /*----------========== PROTOCOL ==========----------*/

  getProtocolAction(deviceId, params = []) {
    if (!deviceId) {
      throw new Error(`Cannot create protocol action object. Missing device id!`);
      return null;
    }

    if (this.siid === null || this.aiid === null) {
      throw new Error(`Cannot create protocol action object. Invalid siid or aiid!`);
      return null;
    }

    let protocolAction = {};
    protocolAction.did = deviceId;
    protocolAction.siid = this.siid;
    protocolAction.aiid = this.aiid;
    protocolAction.in = this._parseParams(params);
    return protocolAction;
  }


  /*----------========== HELPERS ==========----------*/


  /*----------========== INTERNAL HELPERS ==========----------*/

  _parseParams(paramValues = []) {
    if (paramValues && Array.isArray(paramValues) && paramValues.length > 0) {
      let params = [];
      paramValues.forEach((param, i) => {
        let newParam = {};
        if (this._isObject(param)) {
          newParam.piid = param.piid;
          newParam.value = param.value;
        } else if (this.inDef[i]) {
          newParam.piid = this.inDef[i];
          newParam.value = param;
        }
        if (newParam.piid && newParam.value !== null && newParam.value !== undefined) {
          params.push(newParam);
        }
      });
      return params;
    }
    return [];
  }

  _isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }

}

module.exports = MiotAction;

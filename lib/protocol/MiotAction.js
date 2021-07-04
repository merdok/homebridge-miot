const EventEmitter = require('events');
const Events = require('../constants/Events.js');
const Constants = require('../constants/Constants.js');

// action types: http://miot-spec.org/miot-spec-v2/spec/actions

class MiotAction extends EventEmitter {
  constructor(name, siid, aiid, inDef, device) {
    super();

    this.name = name || null;
    this.siid = siid || null;
    this.aiid = aiid || null;
    this.inDef = inDef || [];
    this.device = device;
    this.out = [];
    this.lastResult = {};
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
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
      this.emit(Events.ACTION_EXECUTED);
      if (this.lastResult.out) {
        this.setOut(this.lastResult.out);
      }
    }
  }

  getLastResult() {
    return this.lastResult;
  }


  /*----------========== PROTOCOL ==========----------*/

  getProtocolAction(deviceId, params = []) {
    if (!deviceId || !this.siid || !this.aiid) {
      return null;
    }

    let protocolAction = {};
    protocolAction.did = deviceId;
    protocolAction.siid = this.siid;
    protocolAction.aiid = this.aiid;
    protocolAction.in = this.parseParams(params);
    return protocolAction;
  }


  /*----------========== HELPERS ==========----------*/

  async execute(paramValues = []) {
    if (this.device && this.device.fireAction) {
      return this.device.fireAction(this.getName(), paramValues);
    }
  }


  /*----------========== INTERNAL HELPERS ==========----------*/

  parseParams(paramValues = []) {
    if (this.inDef && this.inDef.length > 0 && paramValues && paramValues.length > 0) {
      let params = [];
      this.inDef.forEach((piid, i) => {
        let newParam = {};
        newParam.piid = piid;
        newParam.value = paramValues[i];
        params.push(newParam);
      });
      return params;
    }
    return [];
  }


}

module.exports = MiotAction;

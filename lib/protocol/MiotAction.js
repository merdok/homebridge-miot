const Constants = require('../constants/Constants.js');

class MiotAction {
  constructor(name, siid, aiid, inDef) {
    this.name = name || null;
    this.siid = siid || null;
    this.aiid = aiid || null;
    this.inDef = inDef || [];
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
    if (this.lastResult && this.lastResult.out) {
      this.setOut(this.lastResult.out);
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
    protocolAction.in = params ;
    return protocolAction;
  }


  /*----------========== HELPERS ==========----------*/


  /*----------========== INTERNAL HELPERS ==========----------*/


}

module.exports = MiotAction;

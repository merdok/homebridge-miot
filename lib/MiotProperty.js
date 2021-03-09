const Constants = require('./constants/Constants.js');

class MiotProperty {
  constructor(name, siid, piid, format, access, unit, valueRange) {

    this.name = name || null;
    this.siid = siid || null;
    this.piid = piid || null;
    this.format = format || null;
    this.access = access || ['read', 'write', 'notify'];
    this.unit = unit || Constants.PROP_UNIT_NONE;
    this.valueRange = valueRange || null;

    this.value = null;

  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  setValue(newVal) {
    this.value = newVal;
  }

  getValue() {
    return this.value;
  }

  getUnit() {
    return this.unit;
  }

  getValueRange() {
    return this.valueRange;
  }


  /*----------========== PROTOCOL ==========----------*/

  getProtocolObjForDid(deviceId, value) {

    if (!deviceId || !this.siid || !this.piid) {
      this.logWarn(`Cannot create property request! Missing required information! prop name: ${this.name},  did: ${deviceId},  siid: ${this.siid},  piid: ${this.piid}}!`);
      return;
    }

    let protcolProp = {};
    protcolProp.did = deviceId;
    protcolProp.siid = this.siid;
    protcolProp.piid = this.piid;
    if (value !== undefined) {
      protcolProp.value = value;
    }

    return protcolProp;
  }


  /*----------========== HELPERS ==========----------*/

  getNameValObj() {
    let nameValObj = {};
    nameValObj.name = this.name;
    nameValObj.value = this.value;
    return nameValObj;
  }

  isReadOnly() {
    return this.access.length > 0 && !this.access.includes('write');
  }

  isWriteOnly() {
    return this.access.length === 1 && this.access.includes('write');
  }



}

module.exports = MiotProperty;

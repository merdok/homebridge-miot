const Constants = require('./constants/Constants.js');

class MiotProperty {
  constructor(name, siid, piid, format, access, unit, valueRange) {

    this.name = name || null;
    this.siid = siid || null;
    this.piid = piid || null;
    this.format = format || Constants.PROP_FORMAT_UNKNOWN;
    this.access = access || ['read', 'write', 'notify'];
    this.unit = unit || Constants.PROP_UNIT_NONE;
    this.valueRange = valueRange || [];

    this.value = 0;
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

  getFormat() {
    return this.format;
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
      // watch out, there is no logger here
      // this.logWarn(`Cannot create property request! Missing required information! prop name: ${this.name},  did: ${deviceId},  siid: ${this.siid},  piid: ${this.piid}}!`);
      return null;
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

  getValueAdjustedToRange() {
    let value = this.getValue();
    let valueRange = this.getValueRange();
    if (valueRange != null && valueRange.length > 1) {
      let low = valueRange[0];
      let high = valueRange[1];
      if (value > high) {
        value = high;
      } else if (value < low) {
        value = low;
      }
    }
    return value;
  }


}

module.exports = MiotProperty;

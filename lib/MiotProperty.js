const Constants = require('./constants/Constants.js');
const PropFormat = require('./constants/PropFormat.js');

class MiotProperty {
  constructor(name, siid, piid, format, access, unit, valueRange, valueList) {

    this.name = name || null;
    this.siid = siid || null;
    this.piid = piid || null;
    this.format = format || PropFormat.UNKNOWN;
    this.access = access || ['read', 'write', 'notify'];
    this.unit = unit || Constants.PROP_UNIT_NONE;
    this.valueRange = valueRange || [];
    this.valueList = valueList || null;

    this.value = this._getInitialFormattedValue();
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  setValue(newVal) {
    this.value = newVal;
  }

  updateValue(newVal) {
    if (this.value !== newVal) {
      this.value = newVal;
      return true;
    }
    return false;
  }

  getValue() {
    return this.value;
  }

  getSafeValue() {
    let safeValue = this._getValueAdjustedToRange();
    return safeValue;
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

  setValueList(valueList) {
    this.valueList = valueList;
  }

  getValueList() {
    return this.valueList;
  }



  /*----------========== PROTOCOL ==========----------*/

  getProtocolObjForDid(deviceId, value) {
    if (!deviceId || !this.siid || !this.piid) {
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

  hasValueRange() {
    if (this.getValueRange() && this.getValueRange().length > 0) {
      return true;
    }
    return false;
  }

  hasValueList() {
    if (this.getValueList() && Object.keys(this.getValueList()).length > 0) {
      return true;
    }
    return false;
  }


  /*----------========== INTERNAL HELPERS ==========----------*/

  _getValueAdjustedToRange() {
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

  _getInitialFormattedValue() {
    let valueFormat = this.getFormat();
    if (valueFormat === PropFormat.BOOL) {
      return false;
    } else if (valueFormat === PropFormat.STRING) {
      return '';
    } else if (valueFormat === PropFormat.FLOAT) {
      return 0.0;
    } else {
      return 0;
    }
  }


}

module.exports = MiotProperty;

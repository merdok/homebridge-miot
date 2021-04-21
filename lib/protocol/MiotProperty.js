const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');

class MiotProperty {
  constructor(name, siid, piid, format, access, unit, valueRange, valueList) {

    this.name = name || null;
    this.siid = siid || null;
    this.piid = piid || null;
    this.format = format || PropFormat.UNKNOWN;
    this.access = access || PropAccess.READ_WRITE_NOTIFY;
    this.unit = unit || PropUnit.NONE;
    this.valueRange = valueRange || [];
    this.valueList = valueList || [];

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
    if (this.isWriteOnly()) {
      return undefined;
    }
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

  getReadProtocolObjForDid(deviceId) {
    if (!deviceId || !this.siid || !this.piid) {
      return null;
    }

    let protocolProp = {};
    protocolProp.did = deviceId;
    protocolProp.siid = this.siid;
    protocolProp.piid = this.piid;
    return protocolProp;
  }

  getWriteProtocolObjForDid(deviceId, value) {
    let protocolProp = this.getReadProtocolObjForDid(deviceId);
    if (!protocolProp) {
      return null;
    }

    protocolProp.value = value;
    return protocolProp;
  }


  /*----------========== HELPERS ==========----------*/

  getNameValObj() {
    let nameValObj = {};
    nameValObj.name = this.name;
    nameValObj.value = this.value;
    return nameValObj;
  }

  isReadable() {
    return this.access.length > 0 && this.access.includes('read');
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

  isValueWithinRange(value) {
    if (this.hasValueRange()) {
      let low = this.getValueRange()[0];
      let high = this.getValueRange()[1];
      return value >= low && value <= high;
    }
    return true;
  }


  /*----------========== INTERNAL HELPERS ==========----------*/

  _getValueAdjustedToRange() {
    let value = this.getValue();
    let valueRange = this.getValueRange();
    if (value != undefined && valueRange != null && valueRange.length > 1) {
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

const EventEmitter = require('events');
const Events = require('../constants/Events.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');
const MiotProtocolHelpers = require('./MiotProtocolHelpers.js');

// property types: http://miot-spec.org/miot-spec-v2/spec/properties

class MiotProperty extends EventEmitter {
  constructor(name, siid, piid, type, description, format, access, unit, valueRange, valueList) {
    super();

    this.name = name || null;
    this.siid = MiotProtocolHelpers.validateMiotId(siid);
    this.piid = MiotProtocolHelpers.validateMiotId(piid);
    this.type = type || '';
    this.description = description || '';
    this.format = format || PropFormat.UNKNOWN;
    this.access = access || PropAccess.READ_WRITE_NOTIFY;
    this.unit = unit || PropUnit.NONE;
    this.valueRange = valueRange || [];
    this.valueList = valueList || [];

    this.value = this._getInitialFormattedValue();

    if (this.siid === null || this.piid === null) {
      throw new Error(`Failed to create miot property! Invalid or missing service id and/or property id! siid: ${siid} piid: ${piid}`);
    }
  }


  /*----------========== SETTER/GETTERS ==========----------*/

  getName() {
    return this.name;
  }

  getId() {
    return this.piid;
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

  updateInternalValue(newVal) {
    if (this.getValue() !== newVal && this.isWriteOnly() === false) {
      this.value = newVal;
      this.emit(Events.PROP_VALUE_CHANGED, this);
    }
  }

  getValue() {
    if (this.isWriteOnly()) {
      return undefined;
    }
    return this.value;
  }

  getSafeValue() {
    let value = this.getValue();
    let safeValue = this.adjustValueToPropRange(value);
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
    if (!deviceId) {
      throw new Error(`Cannot create protocol property object. Missing device id!`);
      return null;
    }

    if (this.siid === null || this.piid === null) {
      throw new Error(`Cannot create protocol property object. Invalid siid or piid!`);
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

  getNameValueString() {
    return this.name + ': ' + this.value;
  }

  isReadable() {
    return this.access.length > 0 && this.access.includes('read');
  }

  isWritable() {
    return this.access.length > 0 && this.access.includes('write');
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

  adjustValueToPropRange(value) {
    let adjustedValue = value;
    if (this.hasValueRange() && value != undefined) {
      let valueRange = this.getValueRange();
      let low = valueRange[0];
      let high = valueRange[1];
      if (value > high) {
        adjustedValue = high;
      } else if (value < low) {
        adjustedValue = low;
      }
    }
    return adjustedValue;
  }


  /*----------========== INTERNAL HELPERS ==========----------*/

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

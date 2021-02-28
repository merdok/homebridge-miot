class MiotProperty {
  constructor(name, siid, piid, format, access, unit) {

    this.name = name || null;
    this.siid = siid || null;
    this.piid = piid || null;
    this.format = format || null;
    this.access = access || ['read', 'write', 'notify'];

    this.value = null;

  }


  /*----------========== SETTER/GETTERS ==========----------*/

  setValue(newVal) {
    this.value = newVal;
  }

  getValue() {
    return this.value;
  }


  /*----------========== PROTOCOL ==========----------*/

  getProtocolObjForDid(deviceId, value) {

    if (!deviceId || !siid || !piid) {
      this.logWarn(`Cannot create property request! Missing required information! did: ${deviceId},  siid: ${siid},  piid: ${piid}}!`);
      return;
    }

    let protcolProp = {};
    protcolProp.did = deviceId;
    protcolProp.siid = this.siid;
    protcolProp.piid = this.piid;
    if (value) {
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

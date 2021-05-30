const BaseDevice = require('../../base/BaseDevice.js');
const OutletProperties = require('./OutletProperties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class OutletDevice extends BaseDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.OUTLET;
  }


  /*----------========== CONFIG ==========----------*/


  /*----------========== FEATURES ==========----------*/

  //outlets
  supportsOutletPower1() {
    return this.hasProperty(OutletProperties.OUTLET_POWER1);
  }

  supportsOutletPower2() {
    return this.hasProperty(OutletProperties.OUTLET_POWER2);
  }

  supportsOutletPower3() {
    return this.hasProperty(OutletProperties.OUTLET_POWER3);
  }

  supportsOutletPower4() {
    return this.hasProperty(OutletProperties.OUTLET_POWER4);
  }

  supportsUsbPower() {
    return this.hasProperty(OutletProperties.USB_POWER);
  }

  //off memory
  supportsOffMemory() {
    return this.hasProperty(OutletProperties.OFF_MEMORY);
  }

  /*----------========== GETTERS ==========----------*/

  isOutletPower1On() {
    return this.getPropertyValue(OutletProperties.OUTLET_POWER1);
  }

  isOutletPower2On() {
    return this.getPropertyValue(OutletProperties.OUTLET_POWER2);
  }

  isOutletPower3On() {
    return this.getPropertyValue(OutletProperties.OUTLET_POWER3);
  }

  isOutletPower4On() {
    return this.getPropertyValue(OutletProperties.OUTLET_POWER4);
  }

  isUsbPowerOn() {
    return this.getPropertyValue(OutletProperties.USB_POWER);
  }

  getOffMemory(){
    return this.getPropertyValue(OutletProperties.OFF_MEMORY);
  }


  /*----------========== SETTERS ==========----------*/

  async setOutletPower1On(value) {
    this.setPropertyValue(OutletProperties.OUTLET_POWER1, value);
  }

  async setOutletPower2On(value) {
    this.setPropertyValue(OutletProperties.OUTLET_POWER2, value);
  }

  async setOutletPower3On(value) {
    this.setPropertyValue(OutletProperties.OUTLET_POWER3, value);
  }

  async setOutletPower4On(value) {
    this.setPropertyValue(OutletProperties.OUTLET_POWER4, value);
  }

  async setUsbPowerOn(value) {
    this.setPropertyValue(OutletProperties.USB_POWER, value);
  }

  async setOffMemory(value) {
    this.setPropertyValue(OutletProperties.OFF_MEMORY, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = OutletDevice;

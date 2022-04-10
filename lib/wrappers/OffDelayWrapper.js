let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BasePropertyWrapper = require('./BasePropertyWrapper.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class OffDelayWrapper extends BasePropertyWrapper {
  constructor(wrapperName, device, accessory, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(wrapperName, device, accessory, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, api, logger);
  }


  /*----------========== PROPERTY WRAPPER INFO ==========----------*/

  getWrapperType() {
    return 'Off Delay';
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareWrapper() {

    if (this.isBoolean()) {
      this.handleBoolean();
      this.getLogger().deepDebug('<-W-> Off delay is a boolean!');
      return true;
    }

    if (this.hasValueRange()) {
      this.handleValueRange();
      this.getLogger().deepDebug('<-W-> Off delay is a value range!');
      return true;
    }

    return false;
  }

  // boolean
  handleBoolean() {
    // simple on/off switch
    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;
    let serviceId = this.generateServiceId();

    this.offDelayBooleanService = new Service.Switch(serviceName, serviceId);
    this.offDelayBooleanService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isOffDelayBooleanSwitchOn.bind(this))
      .onSet(this.setOffDelayBooleanSwitchOn.bind(this));
    this.addAccessoryService(this.offDelayBooleanService);
  }

  // value range
  handleValueRange() {
    // create a lightbulb where the value is a percentage representation
    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;
    let serviceId = this.generateServiceId();

    this.offDelayLightbulbService = new Service.Lightbulb(serviceName, serviceId);
    this.offDelayLightbulbService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isOffDelayLightbulbOn.bind(this))
      .onSet(this.setOffDelayLightbulbOn.bind(this));
    this.offDelayLightbulbService
      .addCharacteristic(new Characteristic.Brightness())
      .onGet(this.getOffDelayBrightness.bind(this))
      .onSet(this.setOffDelayBrightness.bind(this));

    this.addAccessoryService(this.offDelayLightbulbService);
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  // boolean
  isOffDelayBooleanSwitchOn() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getPropValue();
    }
    return false;
  }

  setOffDelayBooleanSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.setPropValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // value range
  isOffDelayLightbulbOn() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getOffDelayInMinutes() > 0;
    }
    return false;
  }

  setOffDelayLightbulbOn(value) {
    if (this.isMiotDeviceConnected()) {
      if (value === false) { // only if disabling, enabling will automatically set it to 100%
        this.setOffDelayInMinutes(0);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getOffDelayBrightness() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return Math.min(this.getOffDelayInMinutes(), 100);
    }
    return 0;
  }

  setOffDelayBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      if (this.offDelayTimeout) clearTimeout(this.offDelayTimeout);
      this.offDelayTimeout = setTimeout(() => this.setOffDelayInMinutes(value), Constants.SLIDER_DEBOUNCE);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateWrapperStatus() {
    super.updateWrapperStatus(); // call super implementation

    if (this.offDelayBooleanService) this.offDelayBooleanService.getCharacteristic(Characteristic.On).updateValue(this.isOffDelayBooleanSwitchOn());

    if (this.offDelayLightbulbService) this.offDelayLightbulbService.getCharacteristic(Characteristic.On).updateValue(this.isOffDelayLightbulbOn());
    if (this.offDelayLightbulbService) this.offDelayLightbulbService.getCharacteristic(Characteristic.Brightness).updateValue(this.getOffDelayBrightness());
  }


  /*----------========== STATE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  getOffDelayInMinutes() {
    let value = this.getPropValue();
    value = this.getDevice().convertToMinutes(value, this.getUnit());
    return value;
  }

  setOffDelayInMinutes(minutes) {
    let value = this.getDevice().convertMinutesToUnit(minutes, this.getUnit());
    this.setPropValue(value);
  }


  /*----------========== HELPERS ==========----------*/

  getUnit() {
    let unit = super.getUnit();
    if (unit === PropUnit.NONE) {
      let valRange = this.valueRange();
      if (valRange && valRange.length > 1) {
        let maxVal = valRange[1];
        let maxValDiv = maxVal / 60;
        if (maxValDiv <= 1) {
          unit = PropUnit.HOURS;
        } else if (maxValDiv <= 60) {
          unit = PropUnit.MINUTES;
        } else {
          unit = PropUnit.SECONDS;
        }
      }
    }
    return unit;
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/


}


module.exports = OffDelayWrapper;

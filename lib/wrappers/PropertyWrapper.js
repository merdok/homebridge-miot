let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BasePropertyWrapper = require('./BasePropertyWrapper.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class PropertyWrapper extends BasePropertyWrapper {
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
    return "Property";
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareWrapper() {

    if (this.hasFixedValue()) {
      this.handleFixedValue();
      this.getLogger().deepDebug('<-W-> Property type: Fixed Value! Creating value switch!');
      return true;
    }

    if (this.isBoolean()) {
      this.handleBoolean();
      this.getLogger().deepDebug('<-W-> Property type: Boolean! Creating on/off switch!');
      return true;
    }

    if (this.hasValueRange()) {
      this.lastValueRangeValue = null;
      this.handleValueRange();
      this.getLogger().deepDebug('<-W-> Property type: Value Range! Creating 0%-100% lightbulb!');
      return true;
    }

    if (this.hasValueList()) {
      this.handleValueList();
      this.getLogger().deepDebug('<-W-> Property type: Value List! Creating list item switches!');
      return true;
    }

    if (this.isWriteOnly()) {
      this.getLogger().warn('<-W-> This is a write only property and write only properties require a value!');
      return false;
    }

    return false;
  }

  //fixedValue
  handleFixedValue() {
    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;
    let serviceId = this.generateServiceId();

    if (this.isWriteOnly()) {
      this.fixedValueStatelessService = this.createStatlessSwitch(serviceName, serviceId, this.setStatelessFixedValueSwitchOn);
      this.addAccessoryService(this.fixedValueStatelessService);
    } else {
      this.fixedValueStatefulService = this.createStatefulSwitch(serviceName, serviceId, this.isStatefulFixedValueSwitchOn, this.setStatefulFixedValueSwitchOn);
      this.addAccessoryService(this.fixedValueStatefulService);
    }
  }

  // boolean
  handleBoolean() {
    // simple on/off switch
    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;
    let serviceId = this.generateServiceId();

    this.propBooleanService = new Service.Switch(serviceName, serviceId);
    this.propBooleanService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isBooleanSwitchOn.bind(this))
      .onSet(this.setBooleanSwitchOn.bind(this));
    this.addAccessoryService(this.propBooleanService);
  }

  // value range
  handleValueRange() {
    // create a lightbulb where the value is a percentage representation
    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;
    let serviceId = this.generateServiceId();

    this.propBrightnessService = new Service.Lightbulb(serviceName, serviceId);
    this.propBrightnessService
      .getCharacteristic(Characteristic.On)
      .onGet(this.isPropBrightnessSwitchOn.bind(this))
      .onSet(this.setPropBrightnessSwitchOn.bind(this));
    this.propBrightnessService
      .addCharacteristic(new Characteristic.Brightness())
      .onGet(this.getPropBrightness.bind(this))
      .onSet(this.setPropBrightness.bind(this));
    this.addAccessoryService(this.propBrightnessService);
  }

  // value list
  handleValueList() {
    // create switches for every item where only one item can be active at a time
    this.propValueListServices = new Array();
    this.valueList().forEach((item, i) => {
      let itemVal = item.value;
      let itemDesc = item.description;
      let propName = this.getProp().getName();
      let name = this.getWrapperName() || propName;

      let switchName = name + ' - ' + itemDesc;
      let switchId = this.generateServiceId(itemVal);

      let tmpSwitch = null;
      if (this.isWriteOnly()) {
        tmpSwitch = this.createStatlessSwitch(switchName, switchId, (value) => {
          this.setStatlessValueListSwitchOn(value, itemVal);
        });
      } else {
        tmpSwitch = this.createStatefulSwitch(switchName, switchId,
          () => {
            return this.isValueListSwitchOn(itemVal);
          },
          (value) => {
            this.setValueListSwitchOn(value, itemVal);
          });
      }

      this.addAccessoryService(tmpSwitch);
      this.propValueListServices.push(tmpSwitch);
    });
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  //fixed value - stateful
  isStatefulFixedValueSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getProp().getValue() === this.getFixedValue();
    }
    return false;
  }

  setStatefulFixedValueSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.enableLinkedPropIfNecessary();
        this.setPropValue(this.getFixedValue());
        this.fixedValueStatefulService.getCharacteristic(Characteristic.On).updateValue(true);
      } else {
        // if user tries to turn off an fixed value switch, then re enable it
        setTimeout(() => {
          this.fixedValueStatefulService.getCharacteristic(Characteristic.On).updateValue(true);
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  //fixed value - stateless
  setStatelessFixedValueSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.enableLinkedPropIfNecessary();
      this.setPropValue(value);
      setTimeout(() => {
        this.setStatelessFixedValueSwitchOn.getCharacteristic(Characteristic.On).updateValue(false);
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // boolean
  isBooleanSwitchOn() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getProp().getValue();
    }
    return false;
  }

  setBooleanSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.setPropValue(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // value range
  isPropBrightnessSwitchOn() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.isPropValueRangeEnabled();
    }
    return false;
  }

  setPropBrightnessSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      if (!value || this.isPropValueRangeEnabled() === false) {
        //TODO: it gets called twice once the previous value and once 100% find a fix for that?
        // check screen brightness at zhimi.airpurifier.mb4 device which has the issue
        this.setPropValueRangeEnabled(value);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getPropBrightness() {
    if (this.isMiotDeviceConnected()) {
      return this.getPropValueRangePercentage();
    }
    return 0;
  }

  setPropBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the slider
      if (this.ledBrightnessTimeout) clearTimeout(this.ledBrightnessTimeout);
      this.ledBrightnessTimeout = setTimeout(() => this.setPropValueRangePercentage(value), Constants.SLIDER_DEBOUNCE);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // value list - stateful
  isValueListSwitchOn(itemVal) {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getProp().getValue() === itemVal;
    }
    return false;
  }

  setValueListSwitchOn(state, itemVal) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.enableLinkedPropIfNecessary();
        this.setPropValue(itemVal);
        this.updateStatefulValueListSwitches(itemVal);
      } else {
        // if user tries to turn off active switch, then reset the state of all switches
        setTimeout(() => {
          this.updateStatefulValueListSwitches();
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // value list - stateless
  setStatlessValueListSwitchOn(state, itemVal) {
    if (this.isMiotDeviceConnected()) {
      this.enableLinkedPropIfNecessary();
      this.setPropValue(itemVal);
      this.resetStatlessValueListSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateWrapperStatus() {
    super.updateWrapperStatus(); // call super implementation

    if (this.fixedValueStatefulService) this.fixedValueStatefulService.getCharacteristic(Characteristic.On).updateValue(this.isStatefulFixedValueSwitchOn());

    if (this.propBooleanService) this.propBooleanService.getCharacteristic(Characteristic.On).updateValue(this.isBooleanSwitchOn());

    if (this.propBrightnessService) this.propBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.isPropBrightnessSwitchOn());
    if (this.propBrightnessService) this.propBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getPropBrightness());

    this.updateStatefulValueListSwitches();
  }


  /*----------========== STATE HELPERS ==========----------*/

  updateStatefulValueListSwitches(activeVal) {
    if (!this.isWriteOnly() && this.propValueListServices) {
      activeVal = activeVal !== undefined ? activeVal : this.getProp().getValue(); // if activeVal specified from outside then use that, else get current prop value
      this.propValueListServices.forEach((tmpValSwitch, i) => {
        let item = this.valueList()[i];
        let itemVal = item.value;
        let isSwitchOn = (activeVal === itemVal) && this.checkLinkedPropStatus();
        tmpValSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  resetStatlessValueListSwitches() {
    if (this.isWriteOnly() && this.propValueListServices) {
      setTimeout(() => {
        this.propValueListServices.forEach((tmpSwitch, i) => {
          tmpSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        });
      }, Constants.BUTTON_RESET_TIMEOUT);
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  isPropValueRangeEnabled() {
    return this.getProp().getValue() > 0;
  }

  setPropValueRangeEnabled(enabled) {
    let valueToSet = enabled;

    // save the previous value
    if (!enabled && !this.lastValueRangeValue) {
      this.lastValueRangeValue = this.getProp().getValue();
    }

    // set the new value
    if (enabled && this.lastValueRangeValue) {
      valueToSet = this.lastValueRangeValue;
      this.lastValueRangeValue == null;
    } else {
      let minLevel = this.valueRange()[0];
      let maxLevel = this.valueRange()[1];
      valueToSet = enabled ? maxLevel : minLevel;
    }
    this.setPropValue(valueToSet);
  }

  getPropValueRangePercentage() {
    if (this.isValueRangePercentage()) {
      return this.getProp().getValue();
    } else {
      return this.getDevice().convertPropValueToPercentage(this.getProp());
    }
  }

  setPropValueRangePercentage(percentage) {
    if (this.isValueRangePercentage()) {
      this.setPropValue(percentage);
    } else {
      let valPercentage = this.getDevice().convertPercentageToPropValue(percentage, this.getProp());
      this.setPropValue(valPercentage);
    }
  }


  /*----------========== HELPERS ==========----------*/

  isValueRangePercentage() {
    return this.getUnit() === PropUnit.PERCENTAGE || (this.valueRange()[1] === 100 && this.valueRange()[2] === 1); // if prop unit percentage or value range has max range of 100 and 1 step
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/


  /*----------========== PROXY CAllS on ACCESSORY OBJ ==========----------*/


}


module.exports = PropertyWrapper;

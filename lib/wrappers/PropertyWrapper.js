let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const AbstractPropertyWrapper = require('./AbstractPropertyWrapper.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class PropertyWrapper extends AbstractPropertyWrapper {
  constructor(wrapperName, prop, device, accessory, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(wrapperName, prop, device, accessory, api, logger);
  }


  /*----------========== PROPERTY WRAPPER INFO ==========----------*/

  getWrapperType() {
    return 'Property';
  }


  /*----------========== SETUP WRAPPER ==========----------*/

  prepareWrapper() {

    if (!this.isWritable()) {
      this.getLogger().warn('<-W-> This property is not writable! Cannot create property wrapper!');
      return false;
    }

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
      this.getLogger().deepDebug(`<-W-> Property type: Value Range! Creating 0%-100% lightbulb! Is value range percentage: ${this._isValueRangePercentage() ? 'YES' : 'NO - emulating!'}`);
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
    this.propBooleanService.addOptionalCharacteristic(Characteristic.ConfiguredName);
    this.propBooleanService.setCharacteristic(Characteristic.ConfiguredName, serviceName);
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

    let isFan = this.getConfiguration() && this.getConfiguration().type === 'fan';

    if (isFan) {
      // fan
      this.propFanService = new Service.Fanv2(serviceName, serviceId);
      this.propFanService.addOptionalCharacteristic(Characteristic.ConfiguredName);
      this.propFanService.setCharacteristic(Characteristic.ConfiguredName, serviceName);
      this.propFanService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.isPropFanSwitchOn.bind(this))
        .onSet(this.setPropFanSwitchOn.bind(this));
      this.propFanService.addCharacteristic(Characteristic.RotationSpeed)
        .onGet(this.getPropRotationSpeed.bind(this))
        .onSet(this.setPropRotationSpeed.bind(this));
      this.addAccessoryService(this.propFanService);
    } else {
      // light bulb
      this.propBrightnessService = new Service.Lightbulb(serviceName, serviceId);
      this.propBrightnessService.addOptionalCharacteristic(Characteristic.ConfiguredName);
      this.propBrightnessService.setCharacteristic(Characteristic.ConfiguredName, serviceName);
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
      this.setPropValue(this.getFixedValue());
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
  // -- lightbulb
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

  // -- fan
  isPropFanSwitchOn() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return Characteristic.Active.ACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setPropFanSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.setPropValueRangeEnabled(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getPropRotationSpeed() {
    if (this.isMiotDeviceConnected()) {
      return this.getPropValueRangePercentage();
    }
    return 0;
  }

  setPropRotationSpeed(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the slider
      if (this.fanRotationSpeedTimeout) clearTimeout(this.fanRotationSpeedTimeout);
      this.fanRotationSpeedTimeout = setTimeout(() => this.setPropValueRangePercentage(value), Constants.SLIDER_DEBOUNCE);
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
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateWrapperStatus() {
    super.updateWrapperStatus(); // call super implementation

    if (this.fixedValueStatefulService) this.fixedValueStatefulService.getCharacteristic(Characteristic.On).updateValue(this.isStatefulFixedValueSwitchOn());

    if (this.propBooleanService) this.propBooleanService.getCharacteristic(Characteristic.On).updateValue(this.isBooleanSwitchOn());

    if (this.propBrightnessService) {
      this.propBrightnessService.getCharacteristic(Characteristic.On).updateValue(this.isPropBrightnessSwitchOn());
      this.propBrightnessService.getCharacteristic(Characteristic.Brightness).updateValue(this.getPropBrightness());
    }

    if (this.propFanService) {
      this.propFanService.getCharacteristic(Characteristic.Active).updateValue(this.isPropFanSwitchOn());
      this.propFanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(this.getPropRotationSpeed());
    }

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
    if (enabled && this.lastValueRangeValue !== null && this.lastValueRangeValue !== undefined) {
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
    if (this._isValueRangePercentage()) {
      return this.getProp().getValue();
    } else {
      return this.getDevice().convertPropValueToPercentage(this.getProp());
    }
  }

  setPropValueRangePercentage(percentage) {
    if (this._isValueRangePercentage()) {
      this.setPropValue(percentage);
    } else {
      let valPercentage = this.getDevice().convertPercentageToPropValue(percentage, this.getProp());
      this.setPropValue(valPercentage);
    }
  }


  /*----------========== HELPERS ==========----------*/

  _isValueRangePercentage() {
    if (this.getUnit() === PropUnit.PERCENTAGE) {
      return this._checkMaxRangeAndStepForPercentage(); // sometimes the prop unit is wrong so make sure that this is actaully a percentage by checking the max range and step.
    }
    return this._checkMaxRangeAndStepForPercentage(); // unit is empty or not percentage so check just based on the value range.
  }

  _checkMaxRangeAndStepForPercentage() {
    return (this.valueRange()[1] === 100 && this.valueRange()[2] === 1); // make sure value range has max range of 100 and 1 step, this should be a good indication for percentage value range.
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/


}


module.exports = PropertyWrapper;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BasePropertyWrapper = require('./BasePropertyWrapper.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class PropValueListWrapper extends BasePropertyWrapper {
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
    return 'Value List';
  }


  /*----------========== SETUP SERVICE ==========----------*/


  prepareWrapper() {
    if (!this.hasValueList()) {
      return false;
    }

    if (this.valueList().length < 1) {
      return false;
    }

    this.propValueListServices = new Array();
    this.valueList().forEach((item, i) => {
      let itemVal = item.value;
      let itemDesc = item.description;
      let propName = this.getProp().getName();
      let name = this.getWrapperName() || propName;

      let switchName = name + ' - ' + itemDesc;
      let switchId = propName + 'ControlService' + itemVal;

      let tmpSwitch = null;
      if (this.isWriteOnly()) {
        tmpSwitch = this.createStatlessSwitch(switchName, switchId, itemVal);
      } else {
        tmpSwitch = this.createStatefulSwitch(switchName, switchId, itemVal);
      }

      this.addAccessoryService(tmpSwitch);
      this.propValueListServices.push(tmpSwitch);
    });

    return true;
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  isSwitchOn(itemVal) {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getProp().getValue() === itemVal;
    }
    return false;
  }

  setSwitchOn(state, itemVal) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.enableLinkedPropIfNecessary();
        this.getDevice().setPropertyValue(this.getProp(), itemVal);
        this.updateValueListSwitches(itemVal);
      } else {
        // if user tries to turn off active switch, then reset the state of all switches
        setTimeout(() => {
          this.updateValueListSwitches();
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // write only value list

  setStatlessSwitchOn(state, itemVal) {
    if (this.isMiotDeviceConnected()) {
      this.enableLinkedPropIfNecessary();
      this.getDevice().setPropertyValue(this.getProp(), value);
      this.resetStatlessSwitches();
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isStatelessSwitchOn() {
    return false;
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateWrapperStatus() {
    super.updateWrapperStatus(); // call super implementation

    this.updateValueListSwitches();
  }


  /*----------========== STATE HELPERS ==========----------*/

  updateValueListSwitches(activeVal) {
    if (this.propValueListServices) {
      activeVal = activeVal !== undefined ? activeVal : this.getProp().getValue(); // if activeVal specified from outside then use that, else get current prop value
      this.propValueListServices.forEach((tmpValSwitch, i) => {
        let item = this.valueList()[i];
        let itemVal = item.value;
        let isSwitchOn = (activeVal === itemVal) && this.checkLinkedPropStatus();
        tmpValSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }

  resetStatlessSwitches() {
    if (this.propValueListServices) {
      setTimeout(() => {
        this.propValueListServices.forEach((tmpSwitch, i) => {
          tmpSwitch.getCharacteristic(Characteristic.On).updateValue(false);
        });
      }, Constants.BUTTON_RESET_TIMEOUT);
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== HELPERS ==========----------*/

  createStatefulSwitch(switchName, switchId, itemVal) {
    let tmpStatefulSwitch = new Service.Switch(switchName, switchId);
    tmpStatefulSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(() => {
        return this.isSwitchOn(itemVal);
      })
      .onSet((value) => {
        this.setSwitchOn(value, itemVal);
      });

    return tmpStatefulSwitch;
  }

  createStatlessSwitch(switchName, switchId, itemVal) {
    let tmpStatlessSwitch = new Service.Switch(switchName, switchId);
    tmpStatlessSwitch
      .getCharacteristic(Characteristic.On)
      .onGet(() => {
        return this.isStatelessSwitchOn();
      })
      .onSet((value) => {
        this.setStatlessSwitchOn(value, itemVal);
      });

    return tmpStatlessSwitch;
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/


}


module.exports = PropValueListWrapper;

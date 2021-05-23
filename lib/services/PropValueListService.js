let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseCustomService = require('./BaseCustomService.js');
const Properties = require('../constants/Properties.js');
const Constants = require('../constants/Constants.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class PropValueListService extends BaseCustomService {
  constructor(serviceName, accessoryObj, prop, linkedProp, configuration, api, logger) {
    super(serviceName, accessoryObj, prop, linkedProp, configuration, api, logger);
  }


  /*----------========== GENERAL SETUP ==========----------*/

  initHapConstants() {
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;
  }

  getServiceType() {
    return "Value List";
  }


  /*----------========== SETUP SERVICE ==========----------*/


  prepareService() {
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
      let name = this.getServiceName() || propName;

      let switchName = name + ' - ' + itemDesc;
      let switchId = propName + 'ControlService' + itemVal;

      let tmpStatefulSwitch = new Service.Switch(switchName, switchId);
      tmpStatefulSwitch
        .getCharacteristic(Characteristic.On)
        .onGet(() => {
          return this.isSwitchOn(itemVal);
        })
        .onSet((value) => {
          this.setSwitchOn(value, itemVal);
        });

      this.addAccessoryService(tmpStatefulSwitch);
      this.propValueListServices.push(tmpStatefulSwitch);
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
        this.getProp().setValue(itemVal);
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


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateServiceStatus() {
    super.updateServiceStatus(); // call super implementation

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


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


  /*----------========== LINKED PROP HELPERS ==========----------*/


  /*----------========== PROXY CAllS on ACCESSORY OBJ ==========----------*/


}


module.exports = PropValueListService;

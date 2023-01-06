let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class SwitchAccessory extends BaseAccessory {
  constructor(name, device, uuid, config, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(name, device, uuid, config, api, logger);
  }


  /*----------========== INIT ==========----------*/

  initAccessoryObject() {
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.SWITCH;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.SWITCH)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    if (this.getDevice().hasMultiplySwitchServices()) {
      this.getDevice().getAllSwitchServices().forEach((service, i) => {
        let serviceDesc = service.getDescription();
        let serviceOnProp = service.getPropertyByType('on');
        if (serviceOnProp) {
          this.addPropWrapper(serviceDesc, serviceOnProp, null, null, null, null);
        }
      });
    } else {
      this.switchService = this.createStatefulSwitch(this.getName(), 'switchService', this.isSwitchOn, this.setSwitchOn);
      this.addAccessoryService(this.switchService);
    }
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  //overrides
  prepareModeControlServices() {
    if (this.getDevice().hasMultiplySwitchServices()) {
      this.getDevice().getAllSwitchServices().forEach((service, i) => {
        let serviceDesc = service.getDescription();
        let serviceModeProp = service.getPropertyByType('mode');
        if (serviceModeProp) {
          this.addPropWrapper(`${serviceDesc} Mode`, serviceModeProp, null, null, null, null);
        }
      });
    } else {
      super.prepareModeControlServices();
    }
  }


  //accessory specific


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  isSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn();
    }
    return false;
  }

  setSwitchOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.switchService) this.switchService.getCharacteristic(Characteristic.On).updateValue(this.isSwitchOn());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = SwitchAccessory;

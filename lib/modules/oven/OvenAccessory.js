let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class OvenAccessory extends BaseAccessory {
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
    return DevTypes.OVEN;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_HEATER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.ovenSwitchService = this.createStatefulSwitch(this.getName(), 'ovenSwitchService', this.isOvenOn, this.setOvenOn);
    this.addAccessoryService(this.ovenSwitchService);

    // if supports target temperature then additionally add a heater cooler service to set the temperature
    if (this.getDevice().supportsTargetTemperature()) {
      this.ovenHeaterService = new Service.HeaterCooler(this.getName(), 'ovenHeaterService');
      this.ovenHeaterService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getOvenHeaterActiveState.bind(this))
        .onSet(this.setOvenHeaterActiveState.bind(this));

      this.ovenHeaterService
        .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .onGet(this.getCurrentOvenHeaterCoolerState.bind(this))
        .setProps({
          maxValue: Characteristic.CurrentHeaterCoolerState.HEATING,
          validValues: [
            Characteristic.CurrentHeaterCoolerState.INACTIVE,
            Characteristic.CurrentHeaterCoolerState.HEATING
          ],
        });

      this.ovenHeaterService
        .getCharacteristic(Characteristic.TargetHeaterCoolerState)
        .onGet(this.getTargetOvenHeaterCoolerState.bind(this))
        .onSet(this.setTargetOvenHeaterCoolerState.bind(this))
        .setProps({
          maxValue: Characteristic.TargetHeatingCoolingState.HEAT,
          validValues: [
            Characteristic.TargetHeaterCoolerState.HEAT
          ]
        });

      this.addCurrentTemperatureCharacteristic(this.ovenHeaterService);

      this.ovenHeaterService
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .onGet(this.getOvenHeatingThresholdTemperature.bind(this))
        .onSet(this.setOvenHeatingThresholdTemperature.bind(this))
        .setProps({
          minValue: this.getDevice().targetTemperatureRange()[0],
          maxValue: this.getDevice().targetTemperatureRange()[1],
          minStep: this.getDevice().targetTemperatureRange()[2]
        });

      this.ovenHeaterService
        .getCharacteristic(Characteristic.TemperatureDisplayUnits)
        .setProps({
          maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
          validValues: [
            Characteristic.TemperatureDisplayUnits.CELSIUS
          ]
        })
        .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

      this.addAccessoryService(this.ovenHeaterService);
    }
  }

  setupAdditionalAccessoryServices() {
    this.prepareLeftTimeService();
    this.prepareCookingCompleteService();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLeftTimeService() {
    if (this.getDevice().supportsLeftTimeReporting()) {
      this.addPropMonitorWrapper('Left Time', this.getDevice().leftTimeProp(), null, null, null, null);
    }
  }

  prepareCookingCompleteService() {
    if (this.getDevice().supportsCookingCompleteStatus()) {
      this.addPropMonitorWrapper('Cooking Complete', this.getDevice().statusProp(), null, this.getDevice().statusCompletedValue(), null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  // switch service
  isOvenOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating();
    }
    return false;
  }

  setOvenOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setCookingActive(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // heater service
  getOvenHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return Characteristic.Active.ACTIVE
    }
    return Characteristic.Active.INACTIVE;
  }

  setOvenHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      // keep the heater on
      if (state === Characteristic.Active.INACTIVE) {
        setTimeout(() => {
          this.ovenHeaterService.getCharacteristic(Characteristic.Active).updateValue(Characteristic.Active.ACTIVE);
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentOvenHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return Characteristic.CurrentHeaterCoolerState.HEATING;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetOvenHeaterCoolerState() {
    return Characteristic.TargetHeaterCoolerState.HEAT;
  }

  setTargetOvenHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      //nothing
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getOvenHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setOvenHeatingThresholdTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().supportsTemperatureReporting()) {
        return this.getDevice().getTemperature();
      } else {
        return this.getDevice().getTargetTemperatureSafe(); // override temperature for devices which does not spport temperature reporting
      }
    }
    return 0;
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    // switch stuff
    if (this.ovenSwitchService) this.ovenSwitchService.getCharacteristic(Characteristic.On).updateValue(this.isOvenOn());

    // heater stuff
    if (this.ovenHeaterService) this.ovenHeaterService.getCharacteristic(Characteristic.Active).updateValue(this.getOvenHeaterActiveState());
    if (this.ovenHeaterService) this.ovenHeaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentOvenHeaterCoolerState());
    if (this.ovenHeaterService) this.ovenHeaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetOvenHeaterCoolerState());
    if (this.ovenHeaterService) this.ovenHeaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getOvenHeatingThresholdTemperature());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OvenAccessory;

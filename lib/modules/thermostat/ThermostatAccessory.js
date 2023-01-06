let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class ThermostatAccessory extends BaseAccessory {
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
    return DevTypes.THERMOSTAT;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.THERMOSTAT)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.thermostatService = new Service.Thermostat(this.getName(), 'thermostatService');

    this.thermostatService
      .getCharacteristic(Characteristic.CurrentHeatingCoolingState)
      .onGet(this.getCurrentHeatingCoolingState.bind(this));

    this.thermostatService
      .getCharacteristic(Characteristic.TargetHeatingCoolingState)
      .onGet(this.getTargetHeatingCoolingState.bind(this))
      .onSet(this.setTargetHeatingCoolingState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHeatingCoolingState.COOL,
        validValues: [
          Characteristic.TargetHeatingCoolingState.OFF,
          Characteristic.TargetHeatingCoolingState.HEAT,
          Characteristic.TargetHeatingCoolingState.COOL,
        ],
      });

    this.addCurrentTemperatureCharacteristic(this.thermostatService);

    this.thermostatService
      .getCharacteristic(Characteristic.TargetTemperature)
      .onGet(this.getTargetTemperature.bind(this))
      .onSet(this.setTargetTemperature.bind(this))
      .setProps({
        minValue: this.getDevice().targetTemperatureRange()[0],
        maxValue: this.getDevice().targetTemperatureRange()[1],
        minStep: this.getDevice().targetTemperatureRange()[2]
      });

    this.thermostatService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .setProps({
        maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
        validValues: [
          Characteristic.TemperatureDisplayUnits.CELSIUS
        ]
      })
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

    this.addAccessoryService(this.thermostatService);
  }

  setupAdditionalAccessoryServices() {
    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentHeatingCoolingState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        if (this.getDevice().isStatusHeating()) {
          return Characteristic.CurrentHeatingCoolingState.HEAT;
        } else if (this.getDevice().isCooling()) {
          return Characteristic.CurrentHeatingCoolingState.COOL;
        } else {
          return Characteristic.CurrentHeatingCoolingState.OFF;
        }
      }
    }
    return Characteristic.CurrentHeatingCoolingState.OFF;
  }

  getTargetHeatingCoolingState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isOn()) {
        if (this.getDevice().isStatusHeating()) {
          return Characteristic.TargetHeatingCoolingState.HEAT;
        } else if (this.getDevice().isCooling()) {
          return Characteristic.TargetHeatingCoolingState.COOL;
        } else {
          return Characteristic.TargetHeatingCoolingState.OFF;
        }
      }
    }
    return Characteristic.TargetHeatingCoolingState.OFF;
  }

  setTargetHeatingCoolingState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetHeatingCoolingState.HEAT) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().startHeating(); // start heating
      } else if (state === Characteristic.TargetHeatingCoolingState.COOL) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().startCooling(); // start heating
      } else if (state === Characteristic.TargetHeatingCoolingState.OFF) {
        this.getDevice().setOn(false);
      } else {
        throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
    }
  }

  getTargetTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setTargetTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(this.getCurrentHeatingCoolingState());
    if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).updateValue(this.getTargetHeatingCoolingState());
    if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.TargetTemperature).updateValue(this.getTargetTemperature());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = ThermostatAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class ThermostatAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, config, api, logger) {
    super(name, miotDevice, uuid, config, api, logger);
  }


  /*----------========== SETUP ACCESSORY ==========----------*/

  initHapConstants() {
    Service = this.api.hap.Service;
    Characteristic = this.api.hap.Characteristic;
    Accessory = this.api.platformAccessory;
    HapStatusError = this.api.hap.HapStatusError;
    HAPStatus = this.api.hap.HAPStatus;
  }

  initConfigProperties(config) {
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
  }

  getAccessoryType() {
    return DevTypes.THERMOSTAT;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.THERMOSTAT);
  }

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

    this.thermostatService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

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
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getCurrentHeatingCoolingState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isPowerOn()) {
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
      if (this.getDevice().isPowerOn()) {
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
        this.getDevice().setPowerOn(false);
      } else {
        throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
      }
    }

    getTargetTemperature() {
      if (this.isMiotDeviceConnected()) {
        return this.getDevice().getTargetTemperature();
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

    updateDeviceStatus() {
      if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(this.getCurrentHeatingCoolingState());
      if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState).updateValue(this.getTargetHeatingCoolingState());
      if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.thermostatService) this.thermostatService.getCharacteristic(Characteristic.TargetTemperature).updateValue(this.getTargetTemperature());

      super.updateDeviceStatus();
    }


    /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


    /*----------========== GETTERS ==========----------*/


    /*----------========== HELPERS ==========----------*/


  }


  module.exports = ThermostatAccessory;

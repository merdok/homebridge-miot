let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class BathHeaterAccessory extends BaseAccessory {
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
    this.modeControl = this.getPropValue(config['modeControl'], false);
    this.lightModeControl = this.getPropValue(config['lightModeControl'], false);
    this.blowControl = this.getPropValue(config['blowControl'], true);
    this.ventilationControl = this.getPropValue(config['ventilationControl'], true);
  }

  getAccessoryType() {
    return DevTypes.BATH_HEATER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HEATER);
  }

  setupMainAccessoryService() {
    this.heaterService = new Service.HeaterCooler(this.getName(), 'heaterService');
    this.heaterService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getHeaterActiveState.bind(this))
      .onSet(this.setHeaterActiveState.bind(this));

    this.heaterService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .onGet(this.getCurrentHeaterCoolerState.bind(this))
      .setProps({
        maxValue: Characteristic.CurrentHeaterCoolerState.HEATING,
        validValues: [
          Characteristic.CurrentHeaterCoolerState.INACTIVE,
          Characteristic.CurrentHeaterCoolerState.IDLE,
          Characteristic.CurrentHeaterCoolerState.HEATING,
        ],
      });

    this.heaterService
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .onGet(this.getTargetHeaterCoolerState.bind(this))
      .onSet(this.setTargetHeaterCoolerState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHeatingCoolingState.HEAT,
        validValues: [
          Characteristic.TargetHeaterCoolerState.HEAT
        ]
      });

    // only if supports temperature reporting
    if (this.getDevice().supportsTemperatureReporting()) {
      this.heaterService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));
    }

    this.heaterService
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .onGet(this.getHeatingThresholdTemperature.bind(this))
      .onSet(this.setHeatingThresholdTemperature.bind(this))
      .setProps({
        minValue: this.getDevice().targetTemperatureRange()[0],
        maxValue: this.getDevice().targetTemperatureRange()[1],
        minStep: this.getDevice().targetTemperatureRange()[2]
      });

    this.heaterService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .setProps({
        maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
        validValues: [
          Characteristic.TemperatureDisplayUnits.CELSIUS
        ]
      })
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

    this.addChildLockCharacteristic(this.heaterService);

    this.addAccessoryService(this.heaterService);
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.modeControl) this.prepareModeControlServices();

    this.prepareLightService();
    if (this.lightModeControl) this.prepareLightModeControlServices();

    if (this.blowControl) this.prepareBlowControlService();
    if (this.ventilationControl) this.prepareVentilationControlService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLightService() {
    if (this.getDevice().hasBuiltInLight()) {
      this.lightService = new Service.Lightbulb('Light', 'lightService');
      this.lightService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isLightOn.bind(this))
        .onSet(this.setLightOn.bind(this));

      this.addBrightnessCharacteristic(this.lightService);

      this.addColorTemperatureCharacteristic(this.lightService);

      this.addAccessoryService(this.lightService);
    }
  }

  prepareLightModeControlServices() {
    if (this.getDevice().supportsLightModes()) {
      this.addPropValueListWrapper('Light Mode', Properties.LIGHT_MODE, null);
    }
  }

  prepareBlowControlService() {
    if (this.getDevice().supportsBlow()) {
      this.blowControlService = this.createStatefulSwitch('Blow', 'blowControlService', this.isBlowOn, this.setBlowOn);
      this.addAccessoryService(this.blowControlService);
    }
  }

  prepareVentilationControlService() {
    if (this.getDevice().supportsVentilation()) {
      this.ventilationControlService = this.createStatefulSwitch('Ventilation', 'ventilationControlService', this.isVentilationOn, this.setVentilationOn);
      this.addAccessoryService(this.ventilationControlService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isHeating = state === Characteristic.Active.ACTIVE;
      this.getDevice().setHeating(isHeating);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.CurrentHeaterCoolerState.HEATING : Characteristic.CurrentHeaterCoolerState.IDLE;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetHeaterCoolerState() {
    return Characteristic.TargetHeaterCoolerState.HEAT;
  }

  setTargetHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().startHeatingIfNecessary(); // start heating
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperature();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setHeatingThresholdTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services

  isLightOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isLightOn();
    }
    return false;
  }

  setLightOn(value) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setLightOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isBlowOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isBlow();
    }
    return false;
  }

  setBlowOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setBlow(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  isVentilationOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isVentilation();
    }
    return false;
  }

  setVentilationOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setVentilation(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
    if (this.heaterService && this.getDevice().supportsTemperatureReporting()) this.heaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());

    if (this.lightService) this.lightService.getCharacteristic(Characteristic.On).updateValue(this.isLightOn());

    if (this.blowControlService) this.blowControlService.getCharacteristic(Characteristic.On).updateValue(this.isBlowOn());
    if (this.ventilationControlService) this.ventilationControlService.getCharacteristic(Characteristic.On).updateValue(this.isVentilationOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = BathHeaterAccessory;

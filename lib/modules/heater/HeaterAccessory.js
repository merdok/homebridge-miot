let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HeaterAccessory extends BaseAccessory {
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
    this.offDelayControl = this.getConfigValue('offDelayControl', false);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.HEATER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_HEATER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    // if supports target temperature then use a heater cooler service
    if (this.getDevice().supportsTargetTemperature()) {
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

      this.addCurrentTemperatureCharacteristic(this.heaterService);

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

    } else {
      // if not then use a fan service
      this.heaterService = new Service.Fanv2(this.getName(), 'heaterService');
      this.heaterService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getHeaterActiveState.bind(this))
        .onSet(this.setHeaterActiveState.bind(this));
    }

    this.addLockPhysicalControlsCharacteristic(this.heaterService);

    // if supports swing modes then add them
    if (this.getDevice().supportsSwingModes()) {
      this.heaterService
        .addCharacteristic(Characteristic.SwingMode)
        .onGet(this.getSwingModeState.bind(this))
        .onSet(this.setSwingModeState.bind(this));
    }

    this.addAccessoryService(this.heaterService);
  }

  setupAdditionalAccessoryServices() {
    if (this.offDelayControl) this.prepareOffDelayService();

    this.prepareFanService();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareFanService() {
    if (this.getDevice().supportsFanOn()) {
      this.addPropWrapper('Fan', this.getDevice().fanOnProp(), this.getDevice().onProp(), null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setOn(value);
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
      this.getDevice().turnOnIfNecessary(); // start heating
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
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

  getSwingModeState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isFanSwingModeEnabled() ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED;
    }
    return Characteristic.SwingMode.SWING_DISABLED;
  }

  setSwingModeState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.SwingMode.SWING_ENABLED) {
        this.getDevice().enableFanSwingMode();
      } else {
        this.getDevice().enableFanNotSwingMode();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    //heater and fan stuff
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.Active).updateValue(this.getHeaterActiveState());
    if (this.heaterService && this.getDevice().supportsSwingModes()) this.heaterService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    // heater specific stuff
    if (this.getDevice().supportsTargetTemperature()) {
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());
    }

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = HeaterAccessory;

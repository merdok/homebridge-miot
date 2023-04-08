let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class KettleAccessory extends BaseAccessory {
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
    return DevTypes.KETTLE;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_HEATER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.kettleHeaterService = new Service.HeaterCooler(this.getName(), 'kettleHeaterService');
    this.kettleHeaterService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getKettleHeaterActiveState.bind(this))
      .onSet(this.setKettleHeaterActiveState.bind(this));

    this.kettleHeaterService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .onGet(this.getCurrentKettleHeaterCoolerState.bind(this))
      .setProps({
        maxValue: Characteristic.CurrentHeaterCoolerState.HEATING,
        validValues: [
          Characteristic.CurrentHeaterCoolerState.INACTIVE,
          Characteristic.CurrentHeaterCoolerState.IDLE,
          Characteristic.CurrentHeaterCoolerState.HEATING,
        ],
      });

    this.kettleHeaterService
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .onGet(this.getTargetKettleHeaterCoolerState.bind(this))
      .onSet(this.setTargetKettleHeaterCoolerState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHeatingCoolingState.HEAT,
        validValues: [
          Characteristic.TargetHeaterCoolerState.HEAT
        ]
      });

    this.addCurrentTemperatureCharacteristic(this.kettleHeaterService);

    if (this.getDevice().supportsTargetTemperature()) {
      this.kettleHeaterService
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .onGet(this.getKettleHeatingThresholdTemperature.bind(this))
        .onSet(this.setKettleHeatingThresholdTemperature.bind(this))
        .setProps({
          minValue: this.getDevice().targetTemperatureRange()[0],
          maxValue: this.getDevice().targetTemperatureRange()[1],
          minStep: this.getDevice().targetTemperatureRange()[2]
        });
    }

    this.kettleHeaterService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .setProps({
        maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
        validValues: [
          Characteristic.TemperatureDisplayUnits.CELSIUS
        ]
      })
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

    this.addAccessoryService(this.kettleHeaterService);
  }

  setupAdditionalAccessoryServices() {
    this.prepareTdsSensorService();
    this.prepareLeftTimeService();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareTdsSensorService() {
    if (this.getDevice().supportsTdsReporting()) {
      this.addPropMonitorWrapper('TDS Sensor', this.getDevice().tdsSensorTdsOutProp(), null, null, null, null);
    }
  }

  prepareLeftTimeService() {
    if (this.getDevice().supportsLeftTimeReporting()) {
      this.addPropMonitorWrapper('Left Time', this.getDevice().leftTimeProp(), null, null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getKettleHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setKettleHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      if (value) {
        this.getDevice().startHeating();
      } else {
        this.getDevice().stopHeating();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentKettleHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.CurrentHeaterCoolerState.HEATING : Characteristic.CurrentHeaterCoolerState.IDLE;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetKettleHeaterCoolerState() {
    return Characteristic.TargetHeaterCoolerState.HEAT;
  }

  setTargetKettleHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().startHeating(); // start heating
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getKettleHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setKettleHeatingThresholdTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.kettleHeaterService) this.kettleHeaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentKettleHeaterCoolerState());
    if (this.kettleHeaterService) this.kettleHeaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetKettleHeaterCoolerState());
    if (this.kettleHeaterService && this.getDevice().supportsTargetTemperature()) this.kettleHeaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getKettleHeatingThresholdTemperature());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = KettleAccessory;

let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class KettleAccessory extends BaseAccessory {
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
    return DevTypes.KETTLE;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HEATER);
  }

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

    // only if supports temperature reporting
    if (this.getDevice().supportsTemperatureReporting()) {
      this.kettleHeaterService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .onGet(this.getCurrentTemperature.bind(this));
    }

    this.kettleHeaterService
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .onGet(this.getKettleHeatingThresholdTemperature.bind(this))
      .onSet(this.setKettleHeatingThresholdTemperature.bind(this))
      .setProps({
        minValue: this.getDevice().targetTemperatureRange()[0],
        maxValue: this.getDevice().targetTemperatureRange()[1],
        minStep: this.getDevice().targetTemperatureRange()[2]
      });

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
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    this.prepareTdsSensorService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareTdsSensorService() {
    if (this.getDevice().supportsTdsReporting()) {
      this.tdsSensorService = new Service.LightSensor('TDS Sensor', 'tdsSensorService');
      this.tdsSensorService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .onGet(this.getTdsSensorCurrentAmbientLightLevel.bind(this))
        .setProps({
          minValue: 0
        });
      this.tdsSensorService
        .addCharacteristic(Characteristic.StatusActive)
        .onGet(this.getTdsSensorStatusActive.bind(this));
      this.addAccessoryService(this.tdsSensorService);
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
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      if (isPowerOn) {
        this.getDevice().startHeating();
      } else {
        this.getDevice().stopHeating();
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentKettleCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.CurrentKettleCoolerState.HEATING : Characteristic.CurrentKettleCoolerState.IDLE;
    }
    return Characteristic.CurrentKettleCoolerState.INACTIVE;
  }


  getTargetKettleCoolerState() {
    return Characteristic.TargetKettleCoolerState.HEAT;
  }

  setTargetKettleCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().startHeating(); // start heating
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

  getTdsSensorCurrentAmbientLightLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTdsSensor();
    }
    return 0;
  }

  getTdsSensorStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return true;
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.kettleHeaterService) this.kettleHeaterService.getCharacteristic(Characteristic.CurrentKettleCoolerState).updateValue(this.getCurrentKettleCoolerState());
    if (this.kettleHeaterService) this.kettleHeaterService.getCharacteristic(Characteristic.TargetKettleCoolerState).updateValue(this.getTargetKettleCoolerState());
    if (this.kettleHeaterService && this.getDevice().supportsTemperatureReporting()) this.kettleHeaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.kettleHeaterService) this.kettleHeaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());

    if (this.tdsSensorService) this.tdsSensorService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).updateValue(this.getTdsSensorCurrentAmbientLightLevel());
    if (this.tdsSensorService) this.tdsSensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getTdsSensorStatusActive());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = KettleAccessory;

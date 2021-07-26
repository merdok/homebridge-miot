let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../constants/Properties.js');


class OvenAccessory extends BaseAccessory {
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
    return DevTypes.OVEN;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HEATER);
  }

  setupMainAccessoryService() {

    // if supports target temperature then use a heater cooler service
    if (this.getDevice().supportsTargetTemperature()) {
      this.ovenHeaterService = new Service.HeaterCooler(this.getName(), 'ovenHeaterService');
      this.ovenHeaterService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getOvenHeaterActiveState.bind(this))
        .onSet(this.setOvenHeaterActiveState.bind(this));

      this.heaterService
        .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .onGet(this.getCurrentOvenHeaterCoolerState.bind(this))
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
        .onGet(this.getTargetOvenHeaterCoolerState.bind(this))
        .onSet(this.setTargetOvenHeaterCoolerState.bind(this))
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
        .onGet(this.getOvenHeatingThresholdTemperature.bind(this))
        .onSet(this.setOvenHeatingThresholdTemperature.bind(this))
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
      // if not then use a switch service
      this.ovenSwitchService = this.createStatefulSwitch(this.getName(), 'ovenSwitchService', this.isOvenOn, this.setOvenOn);
      this.addAccessoryService(this.ovenSwitchService);
    }
  }

  setupAdditionalAccessoryServices() {
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    this.prepareLeftTimeService();
    this.prepareCookTimeService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareLeftTimeService() {
    if (this.getDevice().supportsLeftTimeReporting()) {
      this.leftTimeService = new Service.LightSensor('Left Time', 'leftTimeService');
      this.leftTimeService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .onGet(this.getLeftTimeCurrentAmbientLightLevel.bind(this))
        .setProps({
          minValue: 0
        });
      this.leftTimeService
        .addCharacteristic(Characteristic.StatusActive)
        .onGet(this.getLeftTimeStatusActive.bind(this));
      this.addAccessoryService(this.leftTimeService);
    }
  }

  prepareCookTimeService() {
    if (this.getDevice().supportsCookTimeReporting()) {
      this.cookTimeService = new Service.LightSensor('Cook Time', 'cookTimeService');
      this.cookTimeService
        .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .onGet(this.getCookTimeCurrentAmbientLightLevel.bind(this))
        .setProps({
          minValue: 0,
          maxValue: this.getDevice().cookTimeRange()[1],
        });
      this.cookTimeService
        .addCharacteristic(Characteristic.StatusActive)
        .onGet(this.getCookTimeStatusActive.bind(this));
      this.addAccessoryService(this.cookTimeService);
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
      return this.getDevice().isHeating() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setOvenHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.getDevice().setCookingActive(isPowerOn);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentOvenHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating() ? Characteristic.CurrentHeaterCoolerState.HEATING : Characteristic.CurrentHeaterCoolerState.IDLE;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetOvenHeaterCoolerState() {
    return Characteristic.TargetHeaterCoolerState.HEAT;
  }

  setTargetOvenHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().startHeatIfNecessary(); // start heating
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getOvenHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperature();
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


  // ----- additional services

  getLeftTimeCurrentAmbientLightLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getLeftTime();
    }
    return 0;
  }

  getLeftTimeStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating();
    }
    return false;
  }

  getCookTimeCurrentAmbientLightLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getCookTime();
    }
    return 0;
  }

  getCookTimeStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating();
    }
    return false;
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.getDevice().supportsTargetTemperature()) {
      // heater stuff
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentOvenHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetOvenHeaterCoolerState());
      if (this.heaterService && this.getDevice().supportsTemperatureReporting()) this.heaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getOvenHeatingThresholdTemperature());
    } else {
      // switch stuff
      if (this.ovenSwitchService) this.ovenSwitchService.getCharacteristic(Characteristic.On).updateValue(this.isOvenOn());
    }
    if (this.leftTimeService) this.leftTimeService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).updateValue(this.getLeftTimeCurrentAmbientLightLevel());
    if (this.leftTimeService) this.leftTimeService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getLeftTimeStatusActive());
    if (this.cookTimeService) this.cookTimeService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).updateValue(this.getCookTimeCurrentAmbientLightLevel());
    if (this.cookTimeService) this.cookTimeService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getCookTimeStatusActive());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = OvenAccessory;

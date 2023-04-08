let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirFryerAccessory extends BaseAccessory {
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
    return DevTypes.AIR_FRYER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_HEATER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.airFryerSwitchService = this.createStatefulSwitch(this.getName(), 'airFryerSwitchService', this.isAirFryerOn, this.setAirFryerOn);
    this.addAccessoryService(this.airFryerSwitchService);

    // if supports target temperature then additionally add a heater cooler service to set the temperature
    if (this.getDevice().supportsTargetTemperature()) {
      this.airFryerHeaterService = new Service.HeaterCooler(this.getName(), 'airFryerHeaterService');
      this.airFryerHeaterService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getAirFryerHeaterActiveState.bind(this))
        .onSet(this.setAirFryerHeaterActiveState.bind(this));

      this.airFryerHeaterService
        .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
        .onGet(this.getCurrentAirFryerHeaterCoolerState.bind(this))
        .setProps({
          maxValue: Characteristic.CurrentHeaterCoolerState.HEATING,
          validValues: [
            Characteristic.CurrentHeaterCoolerState.INACTIVE,
            Characteristic.CurrentHeaterCoolerState.HEATING
          ],
        });

      this.airFryerHeaterService
        .getCharacteristic(Characteristic.TargetHeaterCoolerState)
        .onGet(this.getTargetAirFryerHeaterCoolerState.bind(this))
        .onSet(this.setTargetAirFryerHeaterCoolerState.bind(this))
        .setProps({
          maxValue: Characteristic.TargetHeatingCoolingState.HEAT,
          validValues: [
            Characteristic.TargetHeaterCoolerState.HEAT
          ]
        });

      if (this.getDevice().supportsTemperatureReporting()) {
        this.addCurrentTemperatureCharacteristic(this.airFryerHeaterService);
      } else {
        // if temperature reporting is not supported then use target temperature as current temperature
        this.airFryerHeaterService
          .getCharacteristic(Characteristic.CurrentTemperature)
          .onGet(this.getAirFryerCurrentTemperature.bind(this))
          .setProps({
            maxValue: this.getDevice().targetTemperatureRange()[1]
          });
      }

      this.airFryerHeaterService
        .getCharacteristic(Characteristic.HeatingThresholdTemperature)
        .onGet(this.getAirFryerHeatingThresholdTemperature.bind(this))
        .onSet(this.setAirFryerHeatingThresholdTemperature.bind(this))
        .setProps({
          minValue: this.getDevice().targetTemperatureRange()[0],
          maxValue: this.getDevice().targetTemperatureRange()[1],
          minStep: this.getDevice().targetTemperatureRange()[2]
        });

      this.airFryerHeaterService
        .getCharacteristic(Characteristic.TemperatureDisplayUnits)
        .setProps({
          maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
          validValues: [
            Characteristic.TemperatureDisplayUnits.CELSIUS
          ]
        })
        .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

      this.addAccessoryService(this.airFryerHeaterService);
    }
  }

  setupAdditionalAccessoryServices() {
    this.prepareTargetTimeService();
    this.prepareLeftTimeService();
    this.prepareCookingCompleteService();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareTargetTimeService() {
    if (this.getDevice().supportsTargetTime()) {
      this.targetTimeService = new Service.Lightbulb('Target Time', 'targetTimeService');
      this.targetTimeService.addOptionalCharacteristic(Characteristic.ConfiguredName);
      this.targetTimeService.setCharacteristic(Characteristic.ConfiguredName, 'Target Time');
      this.targetTimeService
        .getCharacteristic(Characteristic.On)
        .onGet(this.isTargetTimeOn.bind(this))
        .onSet(this.setTargetTimeOn.bind(this));
      this.targetTimeService
        .addCharacteristic(new Characteristic.Brightness())
        .onGet(this.getTargetTimeBrightness.bind(this))
        .onSet(this.setTargetTimeBrightness.bind(this));
      this.addAccessoryService(this.targetTimeService);
    }
  }

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
  isAirFryerOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHeating();
    }
    return false;
  }

  setAirFryerOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setCookingActive(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  // heater service
  getAirFryerHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return Characteristic.Active.ACTIVE
    }
    return Characteristic.Active.INACTIVE;
  }

  setAirFryerHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      // keep the heater on
      if (state === Characteristic.Active.INACTIVE) {
        setTimeout(() => {
          this.airFryerHeaterService.getCharacteristic(Characteristic.Active).updateValue(Characteristic.Active.ACTIVE);
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentAirFryerHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      return Characteristic.CurrentHeaterCoolerState.HEATING;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }


  getTargetAirFryerHeaterCoolerState() {
    return Characteristic.TargetHeaterCoolerState.HEAT;
  }

  setTargetAirFryerHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      //nothing
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getAirFryerCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isHeating()) {
        return this.getAirFryerHeatingThresholdTemperature();
      }
      return 0;
    }
    return this.getAirFryerHeatingThresholdTemperature();
  }

  getAirFryerHeatingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setAirFryerHeatingThresholdTemperature(temp) {
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

  isTargetTimeOn() {
    if (this.isMiotDeviceConnected()) {
      return true;
    }
    return false;
  }

  setTargetTimeOn(value) {
    if (this.isMiotDeviceConnected()) {
      //keep the lightbulb on
      if (!value) {
        setTimeout(() => {
          this.targetTimeService.getCharacteristic(Characteristic.On).updateValue(true);
        }, Constants.BUTTON_RESET_TIMEOUT);
      }
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getTargetTimeBrightness() {
    if (this.isMiotDeviceConnected()) {
      return Math.min(this.getDevice().getTargetTime(), 100);
    }
    return 0;
  }

  setTargetTimeBrightness(value) {
    if (this.isMiotDeviceConnected()) {
      // use debounce to limit the number of calls when the user slides the slider
      if (this.targetTimeTimeout) clearTimeout(this.targetTimeTimeout);
      this.targetTimeTimeout = setTimeout(() => this.getDevice().setTargetTime(value), 500);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    // switch stuff
    if (this.airFryerSwitchService) this.airFryerSwitchService.getCharacteristic(Characteristic.On).updateValue(this.isAirFryerOn());

    // heater stuff
    if (this.airFryerHeaterService) this.airFryerHeaterService.getCharacteristic(Characteristic.Active).updateValue(this.getAirFryerHeaterActiveState());
    if (this.airFryerHeaterService) this.airFryerHeaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentAirFryerHeaterCoolerState());
    if (this.airFryerHeaterService) this.airFryerHeaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetAirFryerHeaterCoolerState());
    if (this.airFryerHeaterService) this.airFryerHeaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getAirFryerCurrentTemperature());
    if (this.airFryerHeaterService) this.airFryerHeaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getAirFryerHeatingThresholdTemperature());

    if (this.targetTimeService) this.targetTimeService.getCharacteristic(Characteristic.On).updateValue(this.isTargetTimeOn());
    if (this.targetTimeService) this.targetTimeService.getCharacteristic(Characteristic.Brightness).updateValue(this.getTargetTimeBrightness());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirFryerAccessory;

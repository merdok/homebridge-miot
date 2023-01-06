let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class AirConditionerAccessory extends BaseAccessory {
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
    this.fanLevelControl = this.getConfigValue('fanLevelControl', false);
    this.swingControl = this.getConfigValue('swingControl', false);
    super.initAccessoryObject();
  }


  /*----------========== ACCESSORY INFO ==========----------*/

  getAccessoryType() {
    return DevTypes.AIR_CONDITIONER;
  }


  /*----------========== INIT ACCESSORIES ==========----------*/

  initAccessories(name, uuid) {
    return [new Accessory(name, uuid, this.api.hap.Accessory.Categories.AIR_CONDITIONER)];
  }


  /*----------========== SETUP SERVICES ==========----------*/

  setupMainAccessoryService() {
    this.airConditionerService = new Service.HeaterCooler(this.getName(), 'airConditionerService');
    this.airConditionerService
      .getCharacteristic(Characteristic.Active)
      .onGet(this.getHeaterCoolerActiveState.bind(this))
      .onSet(this.setHeaterCoolerActiveState.bind(this));

    this.airConditionerService
      .getCharacteristic(Characteristic.CurrentHeaterCoolerState)
      .onGet(this.getCurrentHeaterCoolerState.bind(this));

    this.airConditionerService
      .getCharacteristic(Characteristic.TargetHeaterCoolerState)
      .onGet(this.getTargetHeaterCoolerState.bind(this))
      .onSet(this.setTargetHeaterCoolerState.bind(this));

    this.airConditionerService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

    this.airConditionerService
      .getCharacteristic(Characteristic.HeatingThresholdTemperature)
      .onGet(this.getHeatingThresholdTemperature.bind(this))
      .onSet(this.setHeatingThresholdTemperature.bind(this))
      .setProps({
        minValue: this.getDevice().targetTemperatureRange()[0],
        maxValue: this.getDevice().targetTemperatureRange()[1],
        minStep: this.getDevice().targetTemperatureRange()[2]
      });

    this.airConditionerService
      .getCharacteristic(Characteristic.CoolingThresholdTemperature)
      .onGet(this.getCoolingThresholdTemperature.bind(this))
      .onSet(this.setCoolingThresholdTemperature.bind(this))
      .setProps({
        minValue: this.getDevice().targetTemperatureRange()[0],
        maxValue: this.getDevice().targetTemperatureRange()[1],
        minStep: this.getDevice().targetTemperatureRange()[2]
      });

    this.airConditionerService
      .getCharacteristic(Characteristic.TemperatureDisplayUnits)
      .setProps({
        maxValue: Characteristic.TemperatureDisplayUnits.CELSIUS,
        validValues: [
          Characteristic.TemperatureDisplayUnits.CELSIUS
        ]
      })
      .setValue(Characteristic.TemperatureDisplayUnits.CELSIUS);

    this.addLockPhysicalControlsCharacteristic(this.airConditionerService);

    // if supports vertical swing then add them
    if (this.getDevice().supportsVerticalSwing()) {
      this.airConditionerService
        .addCharacteristic(Characteristic.SwingMode)
        .onGet(this.getSwingModeState.bind(this))
        .onSet(this.setSwingModeState.bind(this));
    }

    this.addAccessoryService(this.airConditionerService);
  }

  setupAdditionalAccessoryServices() {
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.swingControl) this.prepareSwingControlService();

    super.setupAdditionalAccessoryServices(); // make sure we call super
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareSwingControlService() {
    if (this.getDevice().supportsVerticalSwing()) {
      this.addPropWrapper('Vertical Swing', this.getDevice().verticalSwingProp(), null, null, null, null);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHeaterCoolerActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHeaterCoolerActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let value = state === Characteristic.Active.ACTIVE;
      this.getDevice().setOn(value);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHeaterCoolerState() {
    if (this.isMiotDeviceConnected()) {
      if (this.getDevice().isHeating()) return Characteristic.CurrentHeaterCoolerState.HEATING;
      if (this.getDevice().isCooling()) return Characteristic.CurrentHeaterCoolerState.COOLING;
      return Characteristic.CurrentHeaterCoolerState.IDLE;
    }
    return Characteristic.CurrentHeaterCoolerState.INACTIVE;
  }

  getTargetHeaterCoolerState() {
    if (this.getDevice().isAutoModeEnabled()) return Characteristic.TargetHeaterCoolerState.AUTO;
    if (this.getDevice().isHeatModeEnabled()) return Characteristic.TargetHeaterCoolerState.HEAT;
    if (this.getDevice().isCoolModeEnabled()) return Characteristic.TargetHeaterCoolerState.COOL;
    return Characteristic.TargetHeaterCoolerState.AUTO;
  }

  setTargetHeaterCoolerState(state) {
    if (this.isMiotDeviceConnected()) {
      if (state === Characteristic.TargetHeaterCoolerState.AUTO) this.getDevice().enableAutoMode();
      else if (state === Characteristic.TargetHeaterCoolerState.HEAT) this.getDevice().enableHeatMode();
      else if (state === Characteristic.TargetHeaterCoolerState.COOL) this.getDevice().enableCoolMode();
      else this.getDevice().enableAutoMode();
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

  getCoolingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperatureSafe();
    }
    return this.getDevice().targetTemperatureRange()[0]; // return minimum value
  }

  setCoolingThresholdTemperature(temp) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetTemperature(temp);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getSwingModeState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isVerticalSwingEnabled() ? Characteristic.SwingMode.SWING_ENABLED : Characteristic.SwingMode.SWING_DISABLED;
    }
    return Characteristic.SwingMode.SWING_DISABLED;
  }

  setSwingModeState(state) {
    if (this.isMiotDeviceConnected()) {
      let isSwingModeActive = state === Characteristic.SwingMode.SWING_ENABLED;
      this.getDevice().setVerticalSwingEnabled(isSwingModeActive);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  // ----- additional services


  /*----------========== STATUS ==========----------*/

  updateAccessoryStatus() {
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.Active).updateValue(this.getHeaterCoolerActiveState());
    if (this.airConditionerService && this.getDevice().supportsVerticalSwing()) this.airConditionerService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(this.getCoolingThresholdTemperature());

    super.updateAccessoryStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== PROPERTY WRAPPERS ==========----------*/


  /*----------========== PROPERTY HELPERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirConditionerAccessory;

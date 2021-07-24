let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const Properties = require('../../Properties.js');


class AirConditionerAccessory extends BaseAccessory {
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
    this.buzzerControl = this.getPropValue(config['buzzerControl'], true);
    this.ledControl = this.getPropValue(config['ledControl'], true);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], true);
    this.modeControl = this.getPropValue(config['modeControl'], true);
    this.swingControl = this.getPropValue(config['swingControl'], false);
  }

  getAccessoryType() {
    return DevTypes.AIR_CONDITIONER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_CONDITIONER);
  }

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

    this.addChildLockCharacteristic(this.airConditionerService);

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
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();
    if (this.swingControl) this.prepareSwingControlService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareSwingControlService() {
    if (this.getDevice().supportsVerticalSwing()) {
      this.verticalSwingControlService = this.createStatefulSwitch('Vertical Swing', 'verticalSwingControlService', this.isVerticalSwingSwitchOn, this.setVerticalSwingSwitchOn);
      this.addAccessoryService(this.verticalSwingControlService);
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHeaterCoolerActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHeaterCoolerActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.getDevice().setPowerOn(isPowerOn);
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
        return this.getDevice().getTargetTemperature(); // override temperature for devices which does not spport temperature reporting
      }
    }
    return 0;
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

  getCoolingThresholdTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetTemperature();
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

  isVerticalSwingSwitchOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isVerticalSwingEnabled();
    }
    return false;
  }

  setVerticalSwingSwitchOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setVerticalSwingEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.Active).updateValue(this.getHeaterCoolerActiveState());
    if (this.airConditionerService && this.getDevice().supportsVerticalSwing()) this.airConditionerService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
    if (this.airConditionerService && this.getDevice().supportsTemperatureReporting()) this.airConditionerService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());
    if (this.airConditionerService) this.airConditionerService.getCharacteristic(Characteristic.CoolingThresholdTemperature).updateValue(this.getCoolingThresholdTemperature());
    if (this.verticalSwingControlService) this.verticalSwingControlService.getCharacteristic(Characteristic.On).updateValue(this.isVerticalSwingSwitchOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = AirConditionerAccessory;

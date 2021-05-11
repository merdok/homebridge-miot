let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HeaterAccessory extends BaseAccessory {
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
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.actionButtons = this.getPropValue(config['actionButtons'], false);
    this.shutdownTimer = this.getPropValue(config['shutdownTimer'], false);
    this.heatLevelControl = this.getPropValue(config['heatLevelControl'], false);
    this.modeControl = this.getPropValue(config['modeControl'], false);
  }

  getAccessoryType() {
    return DevTypes.HEATER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HEATER);
  }

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

    } else {
      // if not then use a fan service
      this.heaterService = new Service.Fanv2(this.getName(), 'heaterService');
      this.heaterService
        .getCharacteristic(Characteristic.Active)
        .onGet(this.getHeaterActiveState.bind(this))
        .onSet(this.setHeaterActiveState.bind(this));
    }

    if (this.childLockControl) this.addChildLockCharacteristic(this.heaterService);

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
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.actionButtons) this.prepareActionButtonServices(this.actionButtons);
    if (this.shutdownTimer) this.prepareShutdownTimerService();
    if (this.heatLevelControl) this.prepareHeatLevelControlServices();
    if (this.modeControl) this.prepareModeControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareHeatLevelControlServices() {
    if (this.getDevice().supportsHeatLevels()) {
      this.addPropValueListService('Heat', this.getDevice().heatLevelProperty(), this.getDevice().powerProperty());
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHeaterActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHeaterActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.getDevice().setPowerOn(isPowerOn);
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

  updateDeviceStatus() {
    if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.Active).updateValue(this.getHeaterActiveState());
    if (this.heaterService && this.getDevice().supportsSwingModes()) this.heaterService.getCharacteristic(Characteristic.SwingMode).updateValue(this.getSwingModeState());
    // heater specifric stuff
    if (this.getDevice().supportsTargetTemperature()) {
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.CurrentHeaterCoolerState).updateValue(this.getCurrentHeaterCoolerState());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.TargetHeaterCoolerState).updateValue(this.getTargetHeaterCoolerState());
      if (this.heaterService && this.getDevice().supportsTemperatureReporting()) this.heaterService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
      if (this.heaterService) this.heaterService.getCharacteristic(Characteristic.HeatingThresholdTemperature).updateValue(this.getHeatingThresholdTemperature());
    }

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = HeaterAccessory;

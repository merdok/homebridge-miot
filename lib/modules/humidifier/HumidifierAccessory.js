let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierAccessory extends BaseAccessory {
  constructor(name, miotDevice, uuid, log, config, api, logger) {
    super(name, miotDevice, uuid, log, config, api, logger);
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
    this.dryControl = this.getPropValue(config['dryControl'], true);
    this.screenBrightnessControl = this.getPropValue(config['screenBrightnessControl'], false);
    this.fanLevelControl = this.getPropValue(config['fanLevelControl'], false);
  }

  getAccessoryType() {
    return DevTypes.HUMIDIFIER;
  }


  /*----------========== SETUP SERVICES ==========----------*/

  initAccessory() {
    return new Accessory(this.getName(), this.getUuid(), this.api.hap.Accessory.Categories.AIR_HUMIDIFIER);
  }


  setupMainAccessoryService() {
    this.humidifierService = new Service.HumidifierDehumidifier(this.getName(), 'humidifierService');

    this.humidifierService.getCharacteristic(Characteristic.Active)
      .onGet(this.getHumidifierActiveState.bind(this))
      .onSet(this.setHumidifierActiveState.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState)
      .onGet(this.getCurrentHumidifierDehumidifierState.bind(this))
      .setProps({
        maxValue: Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
        validValues: [
          Characteristic.CurrentHumidifierDehumidifierState.INACTIVE,
          Characteristic.CurrentHumidifierDehumidifierState.IDLE,
          Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING,
        ],
      });

    this.humidifierService
      .getCharacteristic(Characteristic.TargetHumidifierDehumidifierState)
      .onGet(this.getTargetHumidifierDehumidifierState.bind(this))
      .onSet(this.setTargetHumidifierDehumidifierState.bind(this))
      .setProps({
        maxValue: Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER,
        validValues: [
          Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER
        ],
      });

    this.humidifierService
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .onGet(this.getCurrentRelativeHumidity.bind(this));

    this.humidifierService
      .getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold)
      .onGet(this.getRelativeHumidityHumidifierThreshold.bind(this))
      .onSet(this.setRelativeHumidityHumidifierThreshold.bind(this))
      .setProps({
        minValue: this.getDevice().targetHumidityRange()[0],
        maxValue: this.getDevice().targetHumidityRange()[1],
        minStep: this.getDevice().targetHumidityRange()[2]
      });

    this.addRotationSpeedCharacteristic(this.humidifierService);

    if (this.miotHumidifierDevice.supportsWaterLevelReporting()) {
      this.humidifierService
        .getCharacteristic(Characteristic.WaterLevel)
        .onGet(this.getWaterLevel.bind(this));
    }

    if (this.childLockControl) this.addChildLockCharacteristic(this.humidifierService);

    this.addAccessoryService(this.humidifierService);
  }

  setupAdditionalAccessoryServices() {
    if (this.buzzerControl) this.prepareBuzzerControlService();
    if (this.ledControl) this.prepareLedControlService();
    if (this.dryControl) this.prepareDryControlService();
    if (this.screenBrightnessControl) this.prepareScreenBrightnessControlServices();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareDryControlService() {
    if (this.getDevice().supportsDryMode()) {
      this.dryControlService = new Service.Switch('Dry Mode', 'dryControlService');
      this.dryControlService
        .getCharacteristic(Characteristic.On)
        .onGet(this.getDryState.bind(this))
        .onSet(this.setDryState.bind(this));
      this.accessory.addService(this.dryControlService);
    }
  }

  prepareScreenBrightnessControlServices() {
    if (this.getDevice().supportsScreenBrightnessLevels()) {
      this.screenBrightnessControlServices = new Array();
      this.getDevice().screenBrightnessLevels().forEach((level, i) => {
        let levelVal = level.value;
        let levelDesc = level.description;
        let tmpScreenLevelSwitch = this.createStatefulSwitch('Screen - ' + levelDesc, 'screenBrightnessControlService' + levelVal, () => {
          return this.isScreenLevelSwitchOn(levelVal);
        }, (value) => {
          this.setScreenLevelSwitchOn(value, levelVal);
        });
        this.addAccessoryService(tmpScreenLevelSwitch);
        this.screenBrightnessControlServices.push(tmpScreenLevelSwitch);
      });
    }
  }


  /*----------========== HOMEBRIDGE STATE SETTERS/GETTERS ==========----------*/

  getHumidifierActiveState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isPowerOn() ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
    }
    return Characteristic.Active.INACTIVE;
  }

  setHumidifierActiveState(state) {
    if (this.isMiotDeviceConnected()) {
      let isPowerOn = state === Characteristic.Active.ACTIVE;
      this.getDevice().setPowerOn(isPowerOn);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getCurrentHumidifierDehumidifierState() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isHumidifying() ? Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING : Characteristic.CurrentHumidifierDehumidifierState.IDLE;
    }
    return Characteristic.CurrentHumidifierDehumidifierState.INACTIVE;
  }


  getTargetHumidifierDehumidifierState() {
    return Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER;
  }

  setTargetHumidifierDehumidifierState(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().turnOnIfNecessary(); // start humidifying
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getRelativeHumidityHumidifierThreshold() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().getTargetHumidity();
    }
    return this.getDevice().targetHumidityRange()[0]; // return minimum value
  }

  setRelativeHumidityHumidifierThreshold(hum) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setTargetHumidity(hum);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getWaterLevel() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.getWaterLevelPercentage();
    }
    return 0;
  }


  // ----- additional services

  isScreenLevelSwitchOn(level) {
    if (this.isMiotDeviceConnected() && this.getDevice().isPowerOn()) {
      return this.getDevice().getScreenLevel() === level;
    }
    return false;
  }

  setScreenLevelSwitchOn(state, level) {
    if (this.isMiotDeviceConnected()) {
      if (state) {
        this.getDevice().turnOnIfNecessary();
        this.getDevice().setScreenLevel(level);
      }
      setTimeout(() => {
        this.updateScreenLevelSwitches();
      }, Constants.BUTTON_RESET_TIMEOUT);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }

  getDryState() {
    if (this.isMiotDeviceConnected()) {
      return this.miotHumidifierDevice.isDryEnabled();
    }
    return false;
  }

  setDryState(state) {
    if (this.isMiotDeviceConnected()) {
      this.miotHumidifierDevice.setDryModeEnabled(state);
    } else {
      throw new HapStatusError(HAPStatus.SERVICE_COMMUNICATION_FAILURE);
    }
  }


  /*----------========== STATUS ==========----------*/

  updateDeviceStatus() {
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.Active).updateValue(this.getHumidifierActiveState());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.CurrentHumidifierDehumidifierState).updateValue(this.getCurrentHumidifierDehumidifierState());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.TargetHumidifierDehumidifierState).updateValue(this.getTargetHumidifierDehumidifierState());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.CurrentRelativeHumidity).updateValue(this.getCurrentRelativeHumidity());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.RelativeHumidityHumidifierThreshold).updateValue(this.getRelativeHumidityHumidifierThreshold());
    if (this.humidifierService) this.humidifierService.getCharacteristic(Characteristic.WaterLevel).updateValue(this.getWaterLevel());
    if (this.dryControlService) this.dryControlService.getCharacteristic(Characteristic.On).updateValue(this.getDryState());
    this.updateScreenLevelSwitches();

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/

  updateScreenLevelSwitches() {
    if (this.screenBrightnessControlServices) {
      let currentLevel = this.getDevice().getScreenLevel();
      this.screenBrightnessControlServices.forEach((tmpScreenLevelSwitch, i) => {
        let level = this.getDevice().screenBrightnessLevels()[i];
        let levelVal = level.value;
        let isSwitchOn = (currentLevel === levelVal) && this.getDevice().isPowerOn();
        tmpScreenLevelSwitch.getCharacteristic(Characteristic.On).updateValue(isSwitchOn);
      });
    }
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = HumidifierAccessory;

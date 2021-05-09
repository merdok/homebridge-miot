let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BaseAccessory = require('../../base/BaseAccessory.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');


class HumidifierAccessory extends BaseAccessory {
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
    this.screenControl = this.getPropValue(config['screenControl'], true);
    this.childLockControl = this.getPropValue(config['childLockControl'], true);
    this.dryControl = this.getPropValue(config['dryControl'], true);
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
        minValue: this.getDevice().targetHumidityMinVal(),
        maxValue: this.getDevice().targetHumidityMaxVal(),
        minStep: this.getDevice().targetHumidityStepVal()
      });

    this.addRotationSpeedCharacteristic(this.humidifierService);

    if (this.getDevice().supportsWaterLevelReporting()) {
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
    if (this.screenControl) this.prepareScreenControlService();
    if (this.dryControl) this.prepareDryControlService();
    if (this.fanLevelControl) this.prepareFanLevelControlServices();
    this.prepareTemperatureService();
    this.prepareRelativeHumidityService();
  }


  /*----------========== CREATE ADDITIONAL SERVICES ==========----------*/

  prepareDryControlService() {
    if (this.getDevice().supportsDry()) {
      this.dryControlService = this.createStatefulSwitch('Dry', 'dryControlService', this.isDryOn, this.setDryOn);
      this.addAccessoryService(this.dryControlService);
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
    return this.getDevice().targetHumidityMinVal(); // return minimum value
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
      return this.getDevice().getWaterLevelPercentage();
    }
    return 0;
  }


  // ----- additional services

  isDryOn() {
    if (this.isMiotDeviceConnected()) {
      return this.getDevice().isDryEnabled();
    }
    return false;
  }

  setDryOn(state) {
    if (this.isMiotDeviceConnected()) {
      this.getDevice().setDryEnabled(state);
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
    if (this.dryControlService) this.dryControlService.getCharacteristic(Characteristic.On).updateValue(this.isDryOn());

    super.updateDeviceStatus();
  }


  /*----------========== MULTI-SWITCH SERVICE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== HELPERS ==========----------*/


}


module.exports = HumidifierAccessory;

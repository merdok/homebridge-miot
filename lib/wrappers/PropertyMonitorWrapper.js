let Service, Characteristic, Accessory, HapStatusError, HAPStatus;
const BasePropertyWrapper = require('./BasePropertyWrapper.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');


class PropertyMonitorWrapper extends BasePropertyWrapper {
  constructor(wrapperName, device, accessory, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, api, logger) {

    Service = api.hap.Service;
    Characteristic = api.hap.Characteristic;
    Accessory = api.platformAccessory;
    HapStatusError = api.hap.HapStatusError;
    HAPStatus = api.hap.HAPStatus;

    super(wrapperName, device, accessory, prop, linkedProp, fixedValue, linkedPropFixedValue, configuration, api, logger);
  }


  /*----------========== PROPERTY WRAPPER INFO ==========----------*/

  getWrapperType() {
    return 'Property Monitor';
  }


  /*----------========== SETUP SERVICE ==========----------*/

  prepareWrapper() {

    if (this.isWriteOnly()) {
      this.getLogger().warn('<-W-> This is a write only property, cannot read the property value!');
      return false;
    }

    if (this.isString()) {
      this.getLogger().info('<-W-> This is a string based property. Values of string based properties are displayed in the log!');
      this.getProp().on(Events.PROP_VALUE_CHANGED, (prop) => {
        this.getLogger().info(`<-W-> Monitored string property ${prop.getName()} value changed to ---> ${prop.getValue()}`);
      });
    }

    let propName = this.getProp().getName();
    let serviceName = this.getWrapperName() || propName;

    if (this.hasFixedValue()) {
      this.getLogger().deepDebug('<-W-> Creating property monitor occupancy sensor!');
      this.prepareOccupancyService(propName, serviceName);
    } else if (this.isTemperatureBased()) {
      this.getLogger().deepDebug('<-W-> Creating property monitor temperature sensor!');
      this.prepareTemperatureSensorService(propName, serviceName);
    } else if (!this.isString()) {
      if (this.isBoolean()) {
        this.getLogger().deepDebug('<-W-> Property is a boolean! off/false == 0, on/true == 1');
      }
      this.getLogger().deepDebug('<-W-> Creating property monitor light sensor!');
      this.prepareLightSensorService(propName, serviceName);
    }

    return true;
  }

  prepareLightSensorService(propName, serviceName) {
    let serviceId = this.generateServiceId('Monitor');

    let minVal = 0;
    let maxVal = 100000;

    if (this.hasValueRange()) {
      minVal = this.valueRange()[0];
      maxVal = this.valueRange()[1];
    }

    this.lightSensorService = new Service.LightSensor(serviceName, serviceId);
    this.lightSensorService
      .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getCurrentAmbientLightLevel.bind(this))
      .setProps({
        minValue: minVal,
        maxValue: maxVal
      });
    this.lightSensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getStatusActive.bind(this));
    this.addAccessoryService(this.lightSensorService);
  }

  prepareOccupancyService(propName, serviceName) {
    let serviceId = this.generateServiceId('Occupancy');

    this.occupancySensorService = new Service.OccupancySensor(serviceName, serviceId);
    this.occupancySensorService
      .getCharacteristic(Characteristic.OccupancyDetected)
      .onGet(this.getOccupancyDetected.bind(this));
    this.occupancySensorService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getStatusActive.bind(this));
    this.addAccessoryService(this.occupancySensorService);
  }

  prepareTemperatureSensorService(propName, serviceName) {
    let serviceId = this.generateServiceId('Temperature');

    let minVal = -270;
    let maxVal = 100;

    if (this.hasValueRange()) {
      minVal = this.valueRange()[0];
      maxVal = this.valueRange()[1];
    }

    this.temperatureService = new Service.TemperatureSensor(serviceName, serviceId);
    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this))
      .setProps({
        minValue: minVal,
        maxValue: maxVal
      });
    this.temperatureService
      .addCharacteristic(Characteristic.StatusActive)
      .onGet(this.getStatusActive.bind(this));
    this.addAccessoryService(this.temperatureService);
  }


  /*----------========== STATE SETTERS/GETTERS ==========----------*/

  //status active
  getStatusActive() {
    if (this.isMiotDeviceConnected()) {
      return this.checkLinkedPropStatus();
    }
    return false;
  }

  //light
  getCurrentAmbientLightLevel() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getConvertedPropValue();
    }
    return this.getDefaultValue();
  }

  //occupancy
  getOccupancyDetected() {
    if (this.isMiotDeviceConnected() && this.checkLinkedPropStatus()) {
      return this.getProp().getValue() === this.getFixedValue() ? Characteristic.OccupancyDetected.OCCUPANCY_DETECTED : Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
    }
    return Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED;
  }

  // temperature
  getCurrentTemperature() {
    if (this.isMiotDeviceConnected()) {
      return this.getPropValue();
    }
    return 0;
  }


  /*----------========== SERVICE PROTOCOL ==========----------*/

  updateWrapperStatus() {
    super.updateWrapperStatus(); // call super implementation

    if (this.lightSensorService) this.lightSensorService.getCharacteristic(Characteristic.CurrentAmbientLightLevel).updateValue(this.getCurrentAmbientLightLevel());
    if (this.lightSensorService) this.lightSensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getStatusActive());
    if (this.occupancySensorService) this.occupancySensorService.getCharacteristic(Characteristic.OccupancyDetected).updateValue(this.getOccupancyDetected());
    if (this.occupancySensorService) this.occupancySensorService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getStatusActive());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(this.getCurrentTemperature());
    if (this.temperatureService) this.temperatureService.getCharacteristic(Characteristic.StatusActive).updateValue(this.getStatusActive());
  }


  /*----------========== STATE HELPERS ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  getDefaultValue() {
    let defValue = 0;
    if (this.hasValueRange()) {
      //if 0 within range then return 0, otherwise return min value
      if (this.inValueRange(0, this.valueRange()[0], this.valueRange()[1])) {
        defValue = 0;
      } else {
        defValue = this.valueRange()[0];
      }
    }
    return defValue;
  }

  getConvertedPropValue() {
    if (this.isString()) {
      return 0;
    }
    if (this.isBoolean()) {
      return this.getPropValue() ? 1 : 0;
    }
    return this.getPropValue();
  }


  /*----------========== HELPERS ==========----------*/

  inValueRange(x, min, max) {
    return ((x - min) * (x - max) <= 0);
  }

  isTemperatureBased() {
    return this.getUnit() === PropUnit.CELSIUS;
  }


  /*----------========== LINKED PROP HELPERS ==========----------*/


}


module.exports = PropertyMonitorWrapper;

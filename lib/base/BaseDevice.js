const AbstractDevice = require('./AbstractDevice.js');
const MiotDevice = require('../protocol/MiotDevice.js');
const MiotProperty = require('../protocol/MiotProperty.js');
const Constants = require('../constants/Constants.js');
const Events = require('../constants/Events.js');
const DevTypes = require('../constants/DevTypes.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=released

class BaseDevice extends AbstractDevice {
  constructor(miotDevice, name, logger) {

    if (new.target === BaseDevice) {
      throw new Error("Cannot instantiate BaseDevice directly!")
    }

    super(miotDevice, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initialPropertyFetchDone() {
    // log the the use time when supported
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Use time: ${this.getUseTime()} minutes.`);
    }
  }


  /*----------========== DEVICE INFO ==========----------*/


  /*----------========== INFO ==========----------*/


  /*----------========== CONFIG ==========----------*/

  commonProperties() {
    return ['physical-controls-locked:physical-controls-locked', 'alarm:alarm', 'indicator-light:on', 'indicator-light:brightness',
      'indicator-light:indicator-light', 'screen:on', 'screen:brightness', 'environment:temperature',
      'environment:relative-humidity', 'environment:pm2.5-density', 'environment:pm10-density', 'environment:air-quality',
      'environment:tvoc-density', 'environment:co2-density', 'environment:hcho-density', 'battery:battery-level',
      'battery:charging-state', 'filter:filter-left-time', 'filter:filter-used-time', 'filter:filter-life-level',
      'use-time:use-time'
    ];
  }


  /*----------========== VALUES ==========----------*/

  statusChargingValue() {
    return this.getValueForStatus('Charging');
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusBusyValue() {
    return this.getValueForStatus('Busy');
  }

  chargingStateChargingValue() {
    return this.getValueForChargingState('Charging');
  }

  chargingStateNotChargingValue() {
    return this.getValueForChargingState('Not Charging');
  }

  chargingStateNotChargeableValue() {
    return this.getValueForChargingState('Not Chargeable');
  }

  chargingStateGoChargingValue() {
    return this.getValueForChargingState('Go Charging');
  }


  /*----------========== PROPERTIES ==========----------*/

  onProp() {
    return this.getPropFromMainService('on');
  }

  statusProp() {
    return this.getPropFromMainService('status');
  }

  faultProp() {
    return this.getPropFromMainService('fault');
  }

  modeProp() {
    return this.getPropFromMainService('mode');
  }

  physicalControlsLockedProp() {
    return this.getProperty('physical-controls-locked:physical-controls-locked');
  }

  alarmProp() {
    return this.getProperty('alarm:alarm');
  }

  indicatorLightOnProp() {
    return this.getProperty('indicator-light:on');
  }

  indicatorLightBrightnessProp() {
    return this.getProperty('indicator-light:brightness');
  }

  indicatorLightIndicatorLightProp() {
    return this.getProperty('indicator-light:indicator-light');
  }

  screenOnProp() {
    return this.getProperty('screen:on');
  }

  screenBrightnessProp() {
    return this.getProperty('screen:brightness');
  }

  offDelayProp() {
    return this.getProperty('fan:off-delay');
  }

  speedLevelProp() {
    return this.getProperty('custom-service:speed-level');
  }

  fanLevelProp() {
    return this.getProperty('fan:fan-level');
  }

  anionProp() {
    return this.getProperty('fan:anion');
  }

  brightnessProp() {
    return this.getProperty('light:brightness');
  }

  colorTemperatureProp() {
    return this.getProperty('light:color-temperature');
  }

  colorProp() {
    return this.getProperty('light:color');
  }

  targetTemperatureProp() {
    return this.getPropFromMainService('target-temperature');
  }

  temperatureProp() {
    return this.getProperty('environment:temperature') || this.getPropFromMainService('temperature');
  }

  relativeHumidityProp() {
    return this.getProperty('environment:relative-humidity') || this.getPropFromMainService('relative-humidity');
  }

  illuminationProp() {
    return this.getPropFromMainService('illumination');
  }

  pm25DensityProp() {
    return this.getProperty('environment:pm2.5-density');
  }

  pm10DensityProp() {
    return this.getProperty('environment:pm10-density');
  }

  airQualityProp() {
    return this.getProperty('environment:air-quality');
  }

  tvocDensityProp() {
    return this.getProperty('environment:tvoc-density');
  }

  co2DensityProp() {
    return this.getProperty('environment:co2-density');
  }

  hchoDensityProp() {
    return this.getProperty('environment:hcho-density');
  }

  batteryLevelProp() {
    return this.getProperty('battery:battery-level');
  }

  chargingStateProp() {
    return this.getProperty('battery:charging-state');
  }

  filterLeftTimeProp() {
    return this.getProperty('filter:filter-left-time');
  }

  filterUsedTimeProp() {
    return this.getProperty('filter:filter-used-time');
  }

  filterLifeLevelProp() {
    return this.getProperty('filter:filter-life-level');
  }

  acStateProp() {
    return this.getProperty('custom-service:ac-state');
  }

  batteryStateProp() {
    return this.getProperty('custom-service:battery-state');
  }

  useTimeProp() {
    return this.getProperty('use-time:use-time');
  }

  speedNowProp() {
    return null;
  }

  actaulSpeedProp() {
    return this.getProperty('other:actual-speed');
  }


  /*----------========== ACTIONS ==========----------*/

  resetFilterLifeAction() {
    this.getAction('filter:reset-filter-life');
  }


  /*----------========== SERVICES ==========----------*/

  getLightService() {
    return this.getServiceByType('light');
  }

  getAmbientLightService() {
    return this.getServiceByType('ambient-light');
  }


  /*----------========== FEATURES ==========----------*/

  // on
  supportsOn() {
    return !!this.onProp();
  }

  // status
  supportsStatusReporting() {
    return !!this.statusProp();
  }

  // fault
  supportsFaultReporting() {
    return !!this.faultProp();
  }

  // modes
  supportsModes() {
    return !!this.modeProp();
  }

  //physical controls locked
  supportsChildLock() {
    return !!this.physicalControlsLockedProp();
  }

  // off delay
  supportsOffDelay() {
    return !!this.offDelayProp();
  }

  // alarm
  supportsBuzzerControl() {
    return !!this.alarmProp();
  }

  // indicator light - on
  supportsIndicatorLightOnControl() {
    return !!this.indicatorLightOnProp();
  }

  // indicator light - brightness
  supportsIndicatorLightBrightnessControl() {
    return !!this.indicatorLightBrightnessProp();
  }

  // indicator light - indicator light
  supportsIndicatorLightIndicatorLightControl() {
    return !!this.indicatorLightIndicatorLightProp();
  }

  // screen - on
  supportsScreenOnControl() {
    return !!this.screenOnProp();
  }

  // screen - brightness
  supportsScreenBrightnessControl() {
    return !!this.screenBrightnessProp();
  }

  //speed level
  supportsSpeedLevel() {
    return !!this.speedLevelProp();
  }

  isSpeeLeveldRpm() {
    let range = this.getPropertyValueRange(this.speedLevelProp());
    let isRpm = false;
    if (range && range.length > 2) {
      let rangeDif = range[1] - range[0];
      if (rangeDif > 200) {
        isRpm = true;
      }
    }
    return isRpm || this.getPropertyUnit(this.speedLevelProp()) === PropUnit.RPM;
  }

  // rotation speed
  supportsRotationSpeed() {
    return this.supportsSpeedLevel() || this.supportsFanLevel();
  }

  // fan levels
  supportsFanLevel() {
    return !!this.fanLevelProp();
  }

  fanLevelsList() {
    return this.getPropertyValueList(this.fanLevelProp());
  }

  supportsFanLevelList() {
    return this.fanLevelsList().length > 2;
  }

  fanLevelRange() {
    return this.getPropertyValueRange(this.fanLevelProp());
  }

  supportsFanLevelRange() {
    return this.fanLevelRange().length > 2;
  }

  // ioniser
  supportsIoniser() {
    return !!this.anionProp();
  }

  // brightness
  supportsBrightness() {
    return !!this.brightnessProp();
  }

  // color temperature
  supportsColorTemperature() {
    return !!this.colorTemperatureProp();
  }

  // color
  supportsColor() {
    return !!this.colorProp();
  }

  // target temperature
  supportsTargetTemperature() {
    return !!this.targetTemperatureProp();
  }

  targetTemperatureRange() {
    let range = this.getPropertyValueRange(this.targetTemperatureProp());
    return (range.length > 2) ? range : [10, 35, 1];
  }

  // temperature
  supportsTemperatureReporting() {
    return !!this.temperatureProp();
  }

  // relative humidity
  supportsRelativeHumidityReporting() {
    return !!this.relativeHumidityProp();
  }

  // illumination
  supportsIlluminationReporting() {
    return !!this.illuminationProp();
  }

  // pm2.5 density
  supportsPm25DensityReporting() {
    return !!this.pm25DensityProp();
  }

  // pm10 density
  supportsPm10DensityReporting() {
    return !!this.pm10DensityProp();
  }

  //air quality
  supportsAirQualityReporting() {
    return !!this.airQualityProp();
  }

  //tvoc density
  supportsTvocDensityReporting() {
    return !!this.tvocDensityProp();
  }

  tvocDensityUnit() {
    return this.supportsTvocDensityReporting() ? this.getPropertyUnit(this.tvocDensityProp()) : PropUnit.UGM3;
  }

  tvocDensityRange() {
    let range = this.getPropertyValueRange(this.tvocDensityProp());
    return (range.length > 2) ? this.convertToHomekitTvocRange(range, this.tvocDensityUnit()) : [0, 1000, 1];
  }

  //co2 density
  supportsCo2DensityReporting() {
    return !!this.co2DensityProp();
  }

  //hcho density
  supportsHchoDensityReporting() {
    return !!this.hchoDensityProp();
  }

  hchoDensityUnit() {
    return this.supportsHchoDensityReporting() ? this.getPropertyUnit(this.hchoDensityProp()) : PropUnit.UGM3;
  }

  hchoDensityRange() {
    let range = this.getPropertyValueRange(this.hchoDensityProp());
    return (range.length > 2) ? this.convertToHomekitTvocRange(range, this.hchoDensityUnit()) : [0, 1000, 1];
  }

  // battery
  supportsBatteryLevelReporting() {
    return !!this.batteryLevelProp();
  }

  //charging state
  supportsChargingStateReporting() {
    return !!this.chargingStateProp();
  }

  // filter
  supportsFilterLeftTimeReporting() {
    return !!this.filterLeftTimeProp();
  }

  supportsFilterUsedTimeReporting() {
    return !!this.filterUsedTimeProp();
  }

  supportsFilterLifeLevelReporting() {
    return !!this.filterLifeLevelProp();
  }

  supportsFilterLifeResetAction() {
    return !!this.resetFilterLifeAction();
  }

  //ac power
  supportsAcStateReporting() {
    return !!this.acStateProp();
  }

  // bvattery state
  supportsBatteryStateReporting() {
    return !!this.batteryStateProp();
  }

  //charging
  supportsStatusCharging() {
    return this.supportsStatusReporting() && this.statusChargingValue() !== -1;
  }

  supportsChargingReporting() {
    return this.supportsChargingStateReporting() || this.supportsStatusCharging() || this.supportsBatteryStateReporting() || this.supportsAcStateReporting();
  }

  // use time
  supportsUseTimeReporting() {
    return !!this.useTimeProp();
  }

  useTimeUnit() {
    return this.supportsUseTimeReporting() ? this.getPropertyUnit(this.useTimeProp()) : PropUnit.MINUTES;
  }

  //speed now reporting
  supportsSpeedNowReporting() {
    return !!this.speedNowProp();
  }

  // actual speed reporting
  supportsActualSpeedReporting() {
    return !!this.actaulSpeedProp();
  }

  // light service
  hasLightService() {
    return !!this.getLightService();
  }

  // ambient light service
  hasAmbientLightService() {
    return !!this.getAmbientLightService();
  }


  /*----------========== GETTERS ==========----------*/

  isOn() {
    return this.getPropertyValue(this.onProp());
  }

  getStatus() {
    return this.getPropertyValue(this.statusProp());
  }

  getFault() {
    return this.getPropertyValue(this.faultProp());
  }

  getMode() {
    return this.getPropertyValue(this.modeProp());
  }

  isChildLockActive() {
    return this.getPropertyValue(this.physicalControlsLockedProp());
  }

  isBuzzerEnabled() {
    return this.getPropertyValue(this.alarmProp());
  }

  isIndicatorLightOn() {
    return this.getPropertyValue(this.indicatorLightOnProp());
  }

  getIndicatorLightBrightness() {
    return this.getPropertyValue(this.indicatorLightBrightnessProp());
  }

  getIndicatorLightIndicatorLight() {
    return this.getPropertyValue(this.indicatorLightIndicatorLightProp());
  }

  isScreenOn() {
    return this.getPropertyValue(this.screenOnProp());
  }

  getScreenBrightness() {
    return this.getPropertyValue(this.screenBrightnessProp());
  }

  getOffDelay() {
    return this.getPropertyValue(this.offDelayProp());
  }

  getSpeedLevel() {
    return this.getPropertyValue(this.speedLevelProp());
  }

  getFanLevel() {
    return this.getPropertyValue(this.fanLevelProp());
  }

  isIoniserEnabled() {
    return this.getPropertyValue(this.anionProp());
  }

  getBrightness() {
    return this.getPropertyValue(this.brightnessProp());
  }

  getColorTemperature() {
    return this.getPropertyValue(this.colorTemperatureProp());
  }

  getColor() {
    return this.getPropertyValue(this.colorProp());
  }

  getTargetTemperature() {
    return this.getPropertyValue(this.targetTemperatureProp());
  }

  getTemperature() {
    return this.getPropertyValue(this.temperatureProp());
  }

  getRelativeHumidity() {
    return this.getPropertyValue(this.relativeHumidityProp());
  }

  getIllumination() {
    return this.getPropertyValue(this.illuminationProp());
  }

  getPm25Density() {
    return this.getPropertyValue(this.pm25DensityProp());
  }

  getPm10Density() {
    return this.getPropertyValue(this.pm10DensityProp());
  }

  getAirQuality() {
    return this.getPropertyValue(this.airQualityProp());
  }

  getTvocDensity() {
    let tvoc = this.getPropertyValue(this.tvocDensityProp());
    tvoc = this.convertToHomekitTvoc(tvoc, this.tvocDensityUnit());
    return tvoc;
  }

  getCo2Density() {
    return this.getPropertyValue(this.co2DensityProp());
  }

  getHchoDensity() {
    let hcho = this.getPropertyValue(this.hchoDensityProp());
    hcho = this.convertToHomekitTvoc(hcho, this.hchoDensityUnit());
    return hcho;
  }

  getBatteryLevel() {
    return this.getPropertyValue(this.batteryLevelProp());
  }

  getChargingState() {
    return this.getPropertyValue(this.chargingStateProp());
  }

  getFilterLeftTime() {
    return this.getPropertyValue(this.filterLeftTimeProp());
  }

  getFilterUsedTime() {
    return this.getPropertyValue(this.filterUsedTimeProp());
  }

  getFilterLifeLevel() {
    return this.getPropertyValue(this.filterLifeLevelProp());
  }

  isOnAcPower() {
    return this.getPropertyValue(this.acStateProp());
  }

  isOnBatteryPower() {
    return this.getPropertyValue(this.batteryStateProp());
  }

  getUseTime() {
    let useTime = this.getPropertyValue(this.useTimeProp());
    useTime = this.convertToMinutes(useTime, this.useTimeUnit());
    return useTime;
  }

  getSpeedNow() {
    return this.getPropertyValue(this.speedNowProp());
  }

  getActualSpeed() {
    return this.getPropertyValue(this.actaulSpeedProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setOn(isOn) {
    return this.setPropertyValue(this.onProp(), isOn);
  }

  async setMode(mode) {
    return this.setPropertyValue(this.modeProp(), mode);
  }

  async setChildLock(active) {
    return this.setPropertyValue(this.physicalControlsLockedProp(), active);
  }

  async setBuzzerEnabled(enabled) {
    return this.setPropertyValue(this.alarmProp(), enabled);
  }

  async setIndicatorLightOn(value) {
    return this.setPropertyValue(this.indicatorLightOnProp(), value);
  }

  async setIndicatorLightBrightness(value) {
    return this.setPropertyValue(this.indicatorLightBrightnessProp(), value);
  }

  async setIndicatorLightIndicatorLight(value) {
    return this.setPropertyValue(this.indicatorLightIndicatorLightProp(), value);
  }

  async setScreenOn(value) {
    return this.setPropertyValue(this.screenOnProp(), value);
  }

  async setScreenBrightness(value) {
    return this.setPropertyValue(this.screenBrightnessProp(), value);
  }

  async setOffDelay(value) {
    return this.setPropertyValue(this.offDelayProp(), value);
  }

  async setSpeedLevel(speed) {
    return this.setPropertyValue(this.speedLevelProp(), speed);
  }

  async setFanLevel(level) {
    return this.setPropertyValue(this.fanLevelProp(), level);
  }

  async setIoniserEnabled(enabled) {
    return this.setPropertyValue(this.anionProp(), enabled);
  }

  async setBrightness(value) {
    return this.setPropertyValue(this.brightnessProp(), value);
  }

  async setColorTemperature(value) {
    return this.setPropertyValue(this.colorTemperatureProp(), value);
  }

  async setColor(value) {
    return this.setPropertyValue(this.colorProp(), value);
  }

  async setTargetTemperature(value) {
    return this.setPropertyValue(this.targetTemperatureProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  isDeviceOn() {
    return this.isOn();
  }

  isDeviceCharging() {
    if (this.supportsChargingStateReporting()) {
      return this.isChargingStateCharging();
    } else if (this.supportsStatusCharging()) {
      return this.isStatusCharging();
    } else if (this.supportsBatteryStateReporting()) {
      return !this.isOnBatteryPower();
    } else if (this.supportsAcStateReporting()) {
      return this.isOnAcPower();
    }
    return false;
  }

  // rotation speed
  getRotationSpeedPercentage() {
    if (this.supportsSpeedLevel()) {
      if (this.isSpeeLeveldRpm()) {
        return this.convertPropValueToPercentage(this.speedLevelProp());
      } else {
        return this.getSpeedLevel();
      }
    } else if (this.supportsFanLevel()) {
      return this.convertFanLevelToRotationSpeed();
    }
    return 0;
  }

  async setRotationSpeedPercentage(percentage) {
    if (this.supportsSpeedLevel()) {
      let fanSpeedToSet = percentage;
      if (this.isSpeeLeveldRpm()) {
        fanSpeedToSet = this.convertPercentageToPropValue(percentage, this.speedLevelProp())
      }
      this.setSpeedLevel(fanSpeedToSet);
    } else if (this.supportsFanLevel()) {
      let levelToSet = this.convertRotationSpeedToFanLevel(percentage);
      this.setFanLevel(levelToSet);
    }
  }

  // set on
  turnOnIfNecessary() {
    // if the device is turned off then turn it on
    if (this.isOn() === false) {
      this.setOn(true);
    }
  }

  // filter
  resetFilterLife() {
    return this.fireAction(this.resetFilterLifeAction());
  }

  //target temp
  getTargetTemperatureSafe() {
    return Math.max(this.targetTemperatureRange()[0], this.getTargetTemperature());
  }

  // VOCDensity sensor
  supportsVOCDenstiy() {
    return this.supportsTvocDensityReporting() || this.supportsHchoDensityReporting();
  }

  getVOCDenstiyRange() {
    if (this.supportsTvocDensityReporting()) {
      return this.tvocDensityRange();
    } else if (this.supportsHchoDensityReporting()) {
      return this.hchoDensityRange();
    }
    return [0, 1000, 1];
  }

  getVOCDenstiyValue() {
    if (this.supportsTvocDensityReporting()) {
      return this.getTvocDensity();
    } else if (this.supportsHchoDensityReporting()) {
      return this.getHchoDensity();
    }
    return 0;
  }

  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isStatusCharging() {
    return this.getStatus() === this.statusChargingValue();
  }

  isStatusIdle() {
    return this.getStatus() === this.statusIdleValue();
  }

  isStatusBusy() {
    return this.getStatus() === this.statusBusyValue();
  }

  isChargingStateCharging() {
    return this.getChargingState() === this.chargingStateChargingValue();
  }

  isChargingStateNotCharging() {
    return this.getChargingState() === this.chargingStateNotChargingValue();
  }

  isChargingStateNotChargeable() {
    return this.getChargingState() === this.chargingStateNotChargeableValue();
  }

  isChargingStateGoCharging() {
    return this.getChargingState() === this.chargingStateGoChargingValue();
  }


  /*----------========== PROPERTY MONITORING ==========----------*/

  monitorTemperatureProp() {
    this.addPropertyToMonitor(this.temperatureProp());
  }

  monitorRelativeHumidityProp() {
    this.addPropertyToMonitor(this.relativeHumidityProp());
  }

  monitorIlluminationProp() {
    this.addPropertyToMonitor(this.illuminationProp());
  }


  /*----------========== HELPERS ==========----------*/

  getActionFriendlyName(miotAction) {
    let action = this.getAction(miotAction);
    if (action) {
      return action.getName().split(':')[1].split('-').map((item) => {
        return item.charAt(0).toUpperCase() + item.substring(1);
      }).join(' ');
    }
    return miotAction;
  }

  getPropertyFriendlyName(miotProp) {
    let prop = this.getProperty(miotProp);
    if (prop) {
      let itemArr = prop.getName().split(':').map((item) => {
        return item.charAt(0).toUpperCase().slice(0, 6) + item.substring(1);
      })

      // if service name longer then 6 chars then just return the property name since the overall name might be too long
      if (itemArr[0].length > 6) {
        return itemArr[1];
      }

      return itemArr.join(' - ');
    }
    return miotProp;
  }

  // time
  convertToMinutes(value, unit) {
    if (unit === PropUnit.HOURS) {
      value = value * 60;
    } else if (unit === PropUnit.SECONDS) {
      value = Math.ceil(value / 60);
    }
    return value;
  }

  convertMinutesToUnit(minutes, unit) {
    let converted = minutes;
    if (unit === PropUnit.SECONDS) {
      converted = minutes * 60;
    } else if (unit === PropUnit.HOURS) {
      converted = Math.ceil(minutes / 60);
    }
    return converted;
  }

  // fan speed
  convertRotationSpeedToFanLevel(fanSpeed) {
    let level = 0;
    if (this.supportsFanLevelList()) {
      let numberOfFanLevels = this.fanLevelsList().length;
      let firstValue = this.fanLevelsList()[0].value;
      let lastValue = this.fanLevelsList()[numberOfFanLevels - 1].value;
      let speedPerLevel = 100 / numberOfFanLevels;
      level = firstValue + Math.floor(fanSpeed / speedPerLevel); // round down
      if (level > lastValue) level = lastValue; // make sure we stay in range
    } else if (this.supportsFanLevelRange()) {
      let minLevel = this.fanLevelRange()[0];
      let maxLevel = this.fanLevelRange()[1];
      let numberOfFanLevels = (maxLevel - minLevel) + 1;
      let speedPerLevel = 100 / numberOfFanLevels;
      level = minLevel + Math.floor(fanSpeed / speedPerLevel); // round down
      if (level > maxLevel) level = maxLevel; // make sure we stay in range
    }
    return level;
  }

  convertFanLevelToRotationSpeed() {
    let fanSpeed = 0;
    if (this.supportsFanLevelList()) {
      let numberOfFanLevels = this.fanLevelsList().length;
      let speedPerLevel = 100 / numberOfFanLevels;
      fanSpeed = Math.round(speedPerLevel * this.getFanLevel());
    } else if (this.supportsFanLevelRange()) {
      let minLevel = this.fanLevelRange()[0];
      let maxLevel = this.fanLevelRange()[1];
      let numberOfFanLevels = (maxLevel - minLevel) + 1;
      let speedPerLevel = 100 / numberOfFanLevels;
      fanSpeed = Math.round(speedPerLevel * this.getFanLevel());
    }
    if (fanSpeed > 100) fanSpeed = 100; // make sure we stay in range
    return fanSpeed;
  }

  convertPropValueToPercentage(prop) {
    if (prop && prop.hasValueRange()) {
      let propValue = prop.getSafeValue();
      let propValRange = prop.getValueRange();
      let from = propValRange[0];
      let to = propValRange[1];
      let valuePercentage = (((propValue - from) * 100) / (to - from));
      return Math.round(valuePercentage);
    }
    return null;
  }

  convertPercentageToPropValue(percentage, prop) {
    if (prop && prop.hasValueRange()) {
      let propValRange = prop.getValueRange();
      let from = propValRange[0];
      let to = propValRange[1];
      let value = (percentage * (to - from) / 100) + from;
      return Math.round(value);
    }
    return percentage;
  }

  //convert tvoc to µg/m3 (homekit)
  convertToHomekitTvoc(value, unit) {
    if (unit === PropUnit.MGM3) {
      value = value * 1000;
    }
    return value;
  }

  convertToHomekitTvocRange(range, unit) {
    if (unit === PropUnit.MGM3) {
      range = range.map(val => val * 1000);
    }
    return range;
  }

  //prop value extractor
  getValueForStatus(statusDesc, getAll = false) {
    if (statusDesc && this.supportsStatusReporting()) {
      if (getAll) {
        return this._getAllValuesForDescription(this.statusProp(), statusDesc); // sometimes there are multiple values with exact same description, in that case if desired get all of them
      } else {
        return this._getValueForDescription(this.statusProp(), statusDesc); // get only the first found value
      }
    }
    return -1;
  }

  getValueForMode(modeDesc) {
    if (modeDesc && this.supportsModes()) {
      return this._getValueForDescription(this.modeProp(), modeDesc);
    }
    return -1;
  }

  getValueForChargingState(chargingStateDesc) {
    if (chargingStateDesc && this.supportsChargingStateReporting()) {
      return this._getValueForDescription(this.chargingStateProp(), chargingStateDesc);
    }
    return -1;
  }

  getValueForFault(faultDesc) {
    if (faultDesc && this.supportsFaultReporting()) {
      return this._getValueForDescription(this.faultProp(), faultDesc);
    }
    return -1;
  }

  //prop value checker
  statusContainsOrEqualsValue(value) {
    if (this.supportsStatusReporting()) {
      return this._checkPropValueContainsOrEqualsValue(this.statusProp(), value);
    }
    return false;
  }

  //retrieve a property from main service
  getPropFromMainService(propType) {
    if (!this.mainServicePropCache) {
      this.mainServicePropCache = {}; // init the main service prop cache, saves properties which has been automatically discovered for reuse, stores also not found ones as "null" (key without value)
    }

    if (propType in this.mainServicePropCache) {
      return this.mainServicePropCache[propType];
    }

    const mainService = this.getMainService();
    let foundProp = null;
    if (mainService) {
      foundProp = mainService.getPropertyByType(propType);
    }

    this.mainServicePropCache[propType] = foundProp; // store even not found properties so we do not have to search again
    return foundProp;
  }


  /*----------========== PRIVATE STUFF ==========----------*/

  _getValueForDescription(prop, desc) {
    if (desc && prop) {
      const valList = this.getPropertyValueList(prop);
      if (valList) {
        let foundObj = valList.find(item => this._areDescriptionsEqual(item.description, desc));
        if (foundObj) {
          return foundObj.value;
        }
      }
    }
    return -1;
  }

  _getAllValuesForDescription(prop, desc) {
    if (desc && prop) {
      const valList = this.getPropertyValueList(prop);
      if (valList) {
        let foundObjs = valList.filter(item => this._areDescriptionsEqual(item.description, desc));
        if (foundObjs && foundObjs.length > 0) {
          if (foundObjs.length > 1) {
            return foundObjs.map((item) => item.value);
          } else {
            return foundObjs[0].value;
          }
        }
      }
    }
    return -1;
  }

  _areDescriptionsEqual(desc1, desc2) {
    if (desc1 && desc2) {
      if (Array.isArray(desc2)) {
        let foundDesc = desc2.find(tmpDesc => this._normalizedEqualCompare(desc1, tmpDesc));
        if (foundDesc) {
          return true;
        }
      } else {
        return this._normalizedEqualCompare(desc1, desc2);
      }
    }
    return false;
  }

  _normalizedEqualCompare(text1, text2) {
    if (text1 && text2) {
      const normalizedText1 = text1.replace(/\s+/g, '').toLowerCase();
      const normalizedText2 = text2.replace(/\s+/g, '').toLowerCase();
      if (normalizedText1 === normalizedText2) {
        return true;
      }
    }
    return false;
  }

  _checkPropValueContainsOrEqualsValue(prop, value) {
    let propVal = this.getPropertyValue(prop);
    if (value != null && propVal != null && Array.isArray(value)) {
      return value.includes(propVal);
    } else {
      return propVal === value;
    }
  }

}

module.exports = BaseDevice;

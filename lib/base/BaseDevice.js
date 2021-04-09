const MiotDevice = require('../protocol/MiotDevice.js');
const Capabilities = require('../constants/Capabilities.js');
const Properties = require('../constants/Properties.js');
const Constants = require('../constants/Constants.js');
const DevTypes = require('../constants/DevTypes.js');
const PropFormat = require('../constants/PropFormat.js');
const PropUnit = require('../constants/PropUnit.js');
const PropAccess = require('../constants/PropAccess.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=released

class BaseDevice extends MiotDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    //implemented by superclasses
  }

  initDeviceCapabilities() {
    //implemented by superclasses
  }

  initialPropertyFetchDone() {
    // log the the use time when supported
    if (this.supportsUseTimeReporting()) {
      this.logger.info(`Use time: ${this.getUseTime()} minutes.`);
    }
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== CAPABILITIES ==========----------*/

  // power
  supportsPowerControl() {
    return this.hasProperty(Properties.POWER);
  }

  // child lock
  supportsChildLock() {
    return this.hasProperty(Properties.CHILD_LOCK);
  }

  // power off timer
  supportsPowerOffTimer() {
    return this.hasProperty(Properties.POWER_OFF_TIME);
  }

  powerOffTimerUnit() {
    return this.supportsPowerOffTimer() ? this.properties[Properties.POWER_OFF_TIME].getUnit() : PropUnit.MINUTES;
  }

  powerOffTimerRange() {
    return this.supportsPowerOffTimer() ? this.properties[Properties.POWER_OFF_TIME].getValueRange() : [];
  }

  // alarm
  supportsBuzzerControl() {
    return this.hasProperty(Properties.ALARM);
  }

  // led
  supportsLedControl() {
    return this.hasProperty(Properties.LED);
  }

  ledControlRange() {
    return this.getPropertyValueRange(Properties.LED);
  }

  supportsLedControlRange() {
    return this.ledControlRange().length > 0;
  }

  supportsLedControlBrightness() {
    return this.supportsLedControlRange() && this.ledControlRange()[1] === 100 && this.properties[Properties.LED].getUnit() === PropUnit.PERCENTAGE;
  }

  ledControlList() {
    return this.getPropertyValueList(Properties.LED);
  }

  supportsLedControlList() {
    return this.ledControlList().length > 0;
  }

  // temperature
  supportsTemperatureReporting() {
    return this.hasProperty(Properties.TEMPERATURE);
  }

  // relative humidity
  supportsRelativeHumidityReporting() {
    return this.hasProperty(Properties.RELATIVE_HUMIDITY);
  }

  // battery
  hasBuiltInBattery() {
    return this.capabilities[Capabilities.BUILT_IN_BATTERY] || false;
  }

  supportsBatteryPowerReporting() {
    return this.hasProperty(Properties.BATTERY_POWER);
  }

  supportsBatteryLevelReporting() {
    return this.hasProperty(Properties.BATTERY_LEVEL);
  }

  supportsAcPowerReporting() {
    return this.hasProperty(Properties.AC_POWER);
  }

  // use time
  supportsUseTimeReporting() {
    return this.hasProperty(Properties.USE_TIME);
  }

  useTimeUnit() {
    return this.supportsUseTimeReporting() ? this.properties[Properties.USE_TIME].getUnit() : PropUnit.MINUTES;
  }


  /*----------========== GETTERS ==========----------*/

  isPowerOn() {
    return this.getPropertyValue(Properties.POWER);
  }

  isChildLockActive() {
    return this.getPropertyValue(Properties.CHILD_LOCK);
  }

  isBuzzerEnabled() {
    return this.getPropertyValue(Properties.ALARM);
  }

  getLedValue() {
    return this.getPropertyValue(Properties.LED);
  }

  isLedEnabled() {
    if (this.supportsLedControlBrightness()) {
      return this.getLedValue() > 0;
    } else if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      return this.getLedValue() !== maxLevel; // last one is usually off
    } else if (this.supportsLedControlList()) {
      // list is usually the same as range, first one is full brightness and last one is off
      let valueList = this.ledControlList();
      let listLength = valueList.length;
      return this.getLedValue() !== valueList[listLength - 1]; // last one is usually off
    }
    return this.getLedValue();
  }

  getShutdownTimer() {
    let value = this.getPropertyValue(Properties.POWER_OFF_TIME);
    value = this.convertToMinutes(value, this.powerOffTimerUnit());
    return value;
  }

  isShutdownTimerEnabled() {
    return this.getShutdownTimer() > 0;
  }

  getTemperature() {
    return this.getPropertyValue(Properties.TEMPERATURE);
  }

  getRelativeHumidity() {
    return this.getPropertyValue(Properties.RELATIVE_HUMIDITY);
  }

  isOnBatteryPower() {
    return this.getPropertyValue(Properties.BATTERY_POWER);
  }

  getBatteryLevel() {
    return this.getPropertyValue(Properties.BATTERY_LEVEL);
  }

  getUseTime() {
    let useTime = this.getPropertyValue(Properties.USE_TIME);
    useTime = this.convertToMinutes(useTime, this.useTimeUnit());
    return useTime;
  }


  /*----------========== SETTERS ==========----------*/

  async setPowerOn(power) {
    this.setPropertyValue(Properties.POWER, power);
  }

  async setChildLock(active) {
    this.setPropertyValue(Properties.CHILD_LOCK, active);
  }

  async setBuzzerEnabled(enabled) {
    this.setPropertyValue(Properties.ALARM, enabled);
  }

  async setLedValue(value) {
    this.setPropertyValue(Properties.LED, value);
  }

  async setLedEnabled(enabled) {
    let value = enabled;
    if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      if (this.supportsLedControlBrightness()) {
        // if percentage then highest is full brightness, lowest is off
        value = enabled ? maxLevel : minLevel;
      } else if (this.supportsLedControlRange()) {
        // if a list then lowest is usually full brightness and highest is usually off
        value = enabled ? minLevel : maxLevel;
      }
    } else if (this.supportsLedControlList()) {
      // list is usually the same as range, first one is full brightness and last one is off
      let valueList = this.ledControlList();
      let listLength = valueList.length;
      value = enabled ? valueList[0] : valueList[listLength - 1];
    }
    this.setLedValue(value);
  }

  async setShutdownTimer(minutes) {
    let value = this.convertMinutesToUnit(minutes, this.powerOffTimerUnit());
    this.setPropertyValue(Properties.POWER_OFF_TIME, value);
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  turnOnIfNecessary() {
    // if the device is turned off then turn it on
    if (this.isPowerOn() === false) {
      this.setPowerOn(true);
    }
  }


  /*----------========== HELPERS ==========----------*/

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


}

module.exports = BaseDevice;

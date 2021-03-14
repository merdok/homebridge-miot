const MiotDevice = require('../../MiotDevice.js');
const Capabilities = require('../../constants/Capabilities.js');
const Properties = require('../../constants/Properties.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');

// DEVICES: http://miot-spec.org/miot-spec-v2/instances?status=all

class GenericDevice extends MiotDevice {
  constructor(miioDevice, model, deviceId, name, logger) {
    super(miioDevice, model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // most devices have the power control on 2,1 so use that for base devices
    this.addProperty(Properties.POWER, 2, 1, Constants.PROP_FORMAT_BOOL, ['read', 'write', 'notify'], Constants.PROP_UNIT_NONE, null);
  }

  initDeviceCapabilities() {
    // nothing special yet
  }

  initialPropertyFetchDone() {
    // nothing special yet
  }


  /*----------========== INFO ==========----------*/

  getType() {
    return DevTypes.UNKNOWN;
  }


  /*----------========== CAPABILITIES ==========----------*/

  supportsPowerControl() {
    return this.hasProperty(Properties.POWER);
  }

  supportsChildLock() {
    return this.hasProperty(Properties.CHILD_LOCK);
  }

  // power off timer
  supportsPowerOffTimer() {
    return this.hasProperty(Properties.POWER_OFF_TIME);
  }

  powerOffTimerUnit() {
    return this.supportsPowerOffTimer() ? this.properties[Properties.POWER_OFF_TIME].getUnit() : Constants.PROP_UNIT_MINUTES;
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
    return this.ledControlRange().length > 0 ? true : false;
  }

  supportsLedControlBrightness() {
    return this.supportsLedControlRange() && this.ledControlRange()[0] === 0 && this.ledControlRange()[1] === 100 && this.properties[Properties.LED].getUnit() === Constants.PROP_UNIT_PERCENTAGE;
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
    return this.supportsUseTimeReporting() ? this.properties[Properties.USE_TIME].getUnit() : Constants.PROP_UNIT_MINUTES;
  }


  /*----------========== STATUS ==========----------*/

  isPowerOn() {
    return this.getPropertyValue(Properties.POWER);
  }

  isChildLockActive() {
    return this.getPropertyValue(Properties.CHILD_LOCK);
  }

  isBuzzerEnabled() {
    return this.getPropertyValue(Properties.ALARM);
  }

  isLedEnabled() {
    if (this.supportsLedControlBrightness()) {
      return this.getPropertyValue(Properties.LED) > 0;
    } else if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      return this.getPropertyValue(Properties.LED) !== maxLevel; // last one is usually off
    }
    return this.getPropertyValue(Properties.LED);
  }

  getLedBrightness() {
    if (this.supportsLedControlBrightness()) {
      return this.getPropertyValue(Properties.LED);
    }
    return this.isLedEnabled() ? 100 : 0;
  }

  getShutdownTimer() {
    let value = this.getPropertyValue(Properties.POWER_OFF_TIME);
    if (this.powerOffTimerUnit() === Constants.PROP_UNIT_HOURS) {
      value = value * 60;
    } else if (this.powerOffTimerUnit() === Constants.PROP_UNIT_SECONDS) {
      value = Math.ceil(value / 60);
    }
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
    if (this.useTimeUnit() === Constants.PROP_UNIT_HOURS) {
      return useTime * 60;
    } else if (this.useTimeUnit() === Constants.PROP_UNIT_SECONDS) {
      return Math.ceil(useTime / 60)
    }
    return useTime;
  }


  /*----------========== COMMANDS ==========----------*/

  async setPowerOn(power) {
    this.setPropertyValue(Properties.POWER, power);
  }

  async setChildLock(active) {
    this.setPropertyValue(Properties.CHILD_LOCK, active);
  }

  async setBuzzerEnabled(enabled) {
    this.setPropertyValue(Properties.ALARM, enabled);
  }

  async setLedEnabled(enabled) {
    let value = enabled;
    if (this.supportsLedControlBrightness()) {
      value = enabled ? 100 : 0;
    } else if (this.supportsLedControlRange()) {
      let minLevel = this.ledControlRange()[0];
      let maxLevel = this.ledControlRange()[1];
      let level = minLevel; // first one is usually full brightness
      if (enabled === false) {
        level = maxLevel; // last one is usually off
      }
      value = level;
    }
    this.setPropertyValue(Properties.LED, value);
  }

  async setLedBrightness(brightness) {
    if (this.supportsLedControlBrightness()) {
      this.setPropertyValue(Properties.LED, brightness);
    } else {
      let enabled = brightness > 0 ? true : false;
      this.setLedEnabled(enabled);
    }
  }

  async setShutdownTimer(minutes) {
    let value = minutes;
    if (this.powerOffTimerUnit() === Constants.PROP_UNIT_SECONDS) {
      value = minutes * 60;
    } else if (this.powerOffTimerUnit() === Constants.PROP_UNIT_HOURS) {
      value = Math.ceil(minutes / 60);
    }
    this.setPropertyValue(Properties.POWER_OFF_TIME, value);
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = GenericDevice;

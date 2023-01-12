const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class HumidifierDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.HUMIDIFIER;
  }

  getDeviceName() {
    return 'Unknown humidifier device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['humidifier:on', 'humidifier:fault', 'humidifier:fan-level', 'humidifier:target-humidity',
      'humidifier:water-level', 'humidifier:speed-level', 'humidifier:dry', 'humidifier:use-time',
      'other:actual-speed', 'custom:water-shortage-fault', 'device:water-level', 'dm-service:water-level'
    ];
  }


  /*----------========== VALUES ==========----------*/

  targetHumidityMinVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[0];
    }
    return 0;
  }

  targetHumidityMaxVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[1];
    }
    return 100;
  }

  targetHumidityStepVal() {
    let targetHumRange = this.targetHumidityRange();
    if (targetHumRange.length === 3) {
      return targetHumRange[2];
    }
    return 1;
  }

  statusIdleValue() {
    return this.getValueForStatus('Idle');
  }

  statusBusyValue() {
    return this.getValueForStatus('Busy');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('humidifier:on');
  }

  faultProp() {
    return this.getProperty('humidifier:fault');
  }

  fanLevelProp() {
    return this.getProperty('humidifier:fan-level');
  }

  speedLevelProp() {
    return this.getProperty('humidifier:speed-level');
  }

  actaulSpeedProp() {
    return this.getProperty('other:actual-speed');
  }


  //device specific
  targetHumidityProp() {
    return this.getProperty('humidifier:target-humidity');
  }

  waterLevelProp() {
    return this.getProperty('humidifier:water-level');
  }

  dryProp() {
    return this.getProperty('humidifier:dry');
  }

  waterShortageFaultProp() {
    return this.getProperty('custom:water-shortage-fault');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  // target humidity
  supportsTargetHumidity() {
    return !!this.targetHumidityProp();
  }

  targetHumidityRange() {
    let range = this.getPropertyValueRange(this.targetHumidityProp());
    return (range.length > 2) ? range : [0, 100, 1];
  }

  //water level
  supportsWaterStatusReporting() {
    return this.supportsWaterLevelReporting() || this.supportsWaterShortageFaultReporting();
  }

  supportsWaterLevelReporting() {
    return !!this.waterLevelProp();
  }

  waterLevelRange() {
    return this.getPropertyValueRange(this.waterLevelProp());
  }

  supportsWaterShortageFaultReporting() {
    return !!this.waterShortageFaultProp();
  }

  //dry
  supportsDry() {
    return !!this.dryProp();
  }

  //actual speed
  supportsActualSpeedReporting() {
    return !!this.actaulSpeedProp();
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getPropertyValue(this.targetHumidityProp());
  }

  isDryEnabled() {
    return this.getPropertyValue(this.dryProp());
  }

  getWaterLevel() {
    return this.getPropertyValue(this.waterLevelProp());
  }

  isWaterShortageFault() {
    return this.getPropertyValue(this.waterShortageFaultProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(value) {
    return this.setPropertyValue(this.targetHumidityProp(), value);
  }

  async setDryEnabled(value) {
    return this.setPropertyValue(this.dryProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  getTargetHumiditySafe() {
    return Math.max(this.targetHumidityRange()[0], this.getTargetHumidity());
  }

  async setTargetHumiditySafe(value) {
    let safeVal = value;
    const minVal = this.targetHumidityRange()[0];
    const maxVal = this.targetHumidityRange()[1];
    safeVal = Math.max(minVal, safeVal);
    safeVal = Math.min(maxVal, safeVal);
    return this.setTargetHumidity(safeVal);
  }

  getWaterLevelPercentage() {
    if (this.supportsWaterShortageFaultReporting()) {
      return this.isWaterShortageFault() ? 0 : 100;
    } else if (this.supportsWaterLevelReporting()) {
      return this.convertPropValueToPercentage(this.waterLevelProp());
    }
    return 100;
  }

  isHumidifying() {
    return this.isOn();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = HumidifierDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class DehumidifierDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.DEHUMIDIFIER;
  }

  getDeviceName() {
    return 'Unknown dehumidifier device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    const properties = ['dehumidifier:on', 'dehumidifier:fault', 'dehumidifier:mode', 'dehumidifier:fan-level',
      'dehumidifier:target-humidity', 'environment:relative-humidity', 'environment:temperature', 'alarm:alarm',
      'indicator-light:on', 'physical-controls-locked:physical-controls-locked'
    ];

    const compressorStatusProp = this.compressorStatusProp();
    if (compressorStatusProp) properties.push(compressorStatusProp.getName());

    return properties;
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


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('dehumidifier:on');
  }

  faultProp() {
    return this.getProperty('dehumidifier:fault');
  }

  modeProp() {
    return this.getProperty('dehumidifier:mode');
  }

  fanLevelProp() {
    return this.getProperty('dehumidifier:fan-level');
  }

  //device specific
  targetHumidityProp() {
    return this.getProperty('dehumidifier:target-humidity');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // target humidity
  supportsTargetHumidity() {
    return !!this.targetHumidityProp();
  }

  targetHumidityRange() {
    let range = this.getPropertyValueRange(this.targetHumidityProp());
    return range;
  }

  isTargetHumiditySynced() {
    const prop = this.targetHumidityProp();
    const value = this.getPropertyValue(prop);
    return !!prop && !prop.isValueInitial && Number.isFinite(value) && prop.isValueWithinRange(value);
  }

  isRelativeHumiditySynced() {
    const prop = this.relativeHumidityProp();
    const value = this.getPropertyValue(prop);
    return !!prop && !prop.isValueInitial && Number.isFinite(value) && prop.isValueWithinRange(value);
  }

  isOnSynced() {
    const prop = this.onProp();
    return !!prop && !prop.isValueInitial;
  }

  hasSyncedDehumidifierState() {
    return this.isOnSynced() && this.isTargetHumiditySynced() && this.isRelativeHumiditySynced();
  }


  /*----------========== GETTERS ==========----------*/

  getTargetHumidity() {
    return this.getPropertyValue(this.targetHumidityProp());
  }

  getTargetHumiditySafe() {
    if (!this.isTargetHumiditySynced()) {
      return this.targetHumidityMinVal();
    }
    return this.getSafePropertyValue(this.targetHumidityProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setTargetHumidity(value) {
    return this.setPropertyValue(this.targetHumidityProp(), value);
  }


  /*----------========== CONVENIENCE ==========----------*/

  compressorStatusProp() {
    return this.findPropertyByType('compressor-status');
  }

  getReportedDehumidifyingState() {
    if (!this.isOn()) {
      return false;
    }

    const compressorStatusProp = this.compressorStatusProp();
    if (!compressorStatusProp || compressorStatusProp.isValueInitial) {
      return null;
    }

    return !!this.getPropertyValue(compressorStatusProp);
  }

  isDehumidifying() {
    return this.getReportedDehumidifyingState() === true;
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = DehumidifierDevice;

const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class AirConditionerDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.AIR_CONDITIONER;
  }

  getDeviceName() {
    return 'Unknown air conditioner device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['air-conditioner:on', 'air-conditioner:mode', 'air-conditioner:fault', 'air-conditioner:target-temperature',
      'fan-control:fan-level', 'fan-control:vertical-swing', 'indicator-light:indicator-light'
    ];
  }


  /*----------========== VALUES ==========----------*/

  autoModeValue() {
    return this.getValueForMode('Auto');
  }

  heatModeValue() {
    return this.getValueForMode('Heat');
  }

  coolModeValue() {
    return this.getValueForMode('Cool');
  }

  dryModeValue() {
    return this.getValueForMode('Dry');
  }

  fanModeValue() {
    return this.getValueForMode('Fan');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('air-conditioner:on');
  }

  modeProp() {
    return this.getProperty('air-conditioner:mode');
  }

  faultProp() {
    return this.getProperty('air-conditioner:fault');
  }

  fanLevelProp() {
    return this.getProperty('fan-control:fan-level');
  }

  targetTemperatureProp() {
    return this.getProperty('air-conditioner:target-temperature');
  }

  //device specific
  verticalSwingProp() {
    return this.getProperty('fan-control:vertical-swing');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // vertical swing
  supportsVerticalSwing() {
    return !!this.verticalSwingProp();
  }


  /*----------========== GETTERS ==========----------*/

  isVerticalSwingEnabled() {
    return this.getPropertyValue(this.verticalSwingProp());
  }


  /*----------========== SETTERS ==========----------*/

  async setVerticalSwingEnabled(enabled) {
    return this.setPropertyValue(this.verticalSwingProp(), enabled);
  }


  /*----------========== CONVENIENCE ==========----------*/

  async enableAutoMode() {
    return this.setMode(this.autoModeValue());
  }

  async enableHeatMode() {
    return this.setMode(this.heatModeValue());
  }

  async enableCoolMode() {
    return this.setMode(this.coolModeValue());
  }

  async enableDryMode() {
    return this.setMode(this.dryModeValue());
  }

  async enableFanMode() {
    return this.setMode(this.fanModeValue());
  }

  isHeating() {
    return this.isHeatModeEnabled();
  }

  isCooling() {
    return this.isCoolModeEnabled();
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/

  isAutoModeEnabled() {
    return this.getMode() === this.autoModeValue();
  }

  isHeatModeEnabled() {
    return this.getMode() === this.heatModeValue();
  }

  isCoolModeEnabled() {
    return this.getMode() === this.coolModeValue();
  }

  isDryModeEnabled() {
    return this.getMode() === this.dryModeValue();
  }

  isFanModeEnabled() {
    return this.getMode() === this.fanModeValue();
  }


  /*----------========== HELPERS ==========----------*/


}

module.exports = AirConditionerDevice;

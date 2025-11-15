const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class DiffuserDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.DIFFUSER;
  }

  getDeviceName() {
    return 'Unknown diffuser device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['diffuser:on', 'diffuser:fault', 'diffuser:fragrance-out-time', 'diffuser:fragrance-out-time4',
      'other:auto-fragrance', 'other:auto-light', 'other:light-auto-off'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('diffuser:on');
  }

  faultProp() {
    return this.getProperty('diffuser:fault');
  }


  //device specific
  fragranceOutTimeProp() {
    return this.getProperty('diffuser:fragrance-out-time');
  }

  fragranceOutTime4Prop() {
    return this.getProperty('diffuser:fragrance-out-time4');
  }

  autoFragranceProp() {
    return this.getProperty('other:auto-fragrance');
  }

  autoLightProp() {
    return this.getProperty('other:auto-light');
  }

  lightAutoOffProp() {
    return this.getProperty('other:light-auto-off');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/

  // auto fragrance
  supportsAutoFragrance() {
    return !!this.autoFragranceProp();
  }

  // auto light
  supportsAutoLight() {
    return !!this.autoLightProp();
  }

  // light auto off
  supportsLightAutoOff() {
    return !!this.lightAutoOffProp();
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = DiffuserDevice;

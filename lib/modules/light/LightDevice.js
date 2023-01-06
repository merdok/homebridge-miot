const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');
const colorConvert = require('color-convert');


class LightDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }

  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.LIGHT;
  }

  getDeviceName() {
    return 'Unknown light device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['light:on', 'light:brightness', 'light:color-temperature', 'light:color',
      'light:mode'
    ];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  onProp() {
    return this.getProperty('light:on');
  }

  modeProp() {
    return this.getProperty('light:mode');
  }

  //device specific
  brightnessProp() {
    return this.getProperty('light:brightness');
  }

  colorTemperatureProp() {
    return this.getProperty('light:color-temperature');
  }

  colorProp() {
    return this.getProperty('light:color');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = LightDevice;

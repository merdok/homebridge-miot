const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class TemperatureHumiditySensorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.TEMPERATURE_HUMIDITY_SENSOR;
  }

  getDeviceName() {
    return 'Unknown temperature humidity sensor device';
  }

  getMainService() {
    return this.getServiceByType('temperature-humidity-sensor');
  }

  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['temperature-humidity-sensor:temperature', 'temperature-humidity-sensor:relative-humidity', 'battery:battery-level'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides
  temperatureProp() {
    return this.getProperty('temperature-humidity-sensor:temperature');
  }

  relativeHumidityProp() {
    return this.getProperty('temperature-humidity-sensor:relative-humidity');
  }


  //device specific


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = TemperatureHumiditySensorDevice;

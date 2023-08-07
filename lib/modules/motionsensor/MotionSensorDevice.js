const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');
const Events = require('../../constants/Events.js');


class MotionSensorDevice extends BaseDevice {
  constructor(device, name, logger) {
    super(device, name, logger);
   
    // Only needed if device need to process motion status based on response updateTime
    this.propResponse = null; 
    this.lastResponse = null; 
    this.lastMotionResponse = null; 
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.MOTION_SENSOR;
  }

  getDeviceName() {
    return 'Unknown motion sensor device';
  }

  getMainService() {
    return this.getServiceByType('motion-sensor');
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['motion-sensor:motion-state', 'battery:battery-level'];
  }


  /*----------========== VALUES ==========----------*/


  /*----------========== PROPERTIES ==========----------*/

  //overrides


  //device specific
  motionStateProp() {
    return this.getProperty('motion-sensor:motion-state');
  }


  /*----------========== ACTIONS ==========----------*/


  /*----------========== FEATURES ==========----------*/


  /*----------========== GETTERS ==========----------*/

  isMotionStateOn() {
    return this.getPropertyValue(this.motionStateProp());
  }


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/
  _registerForPropRetrieved(miotProp) {
    if (miotProp) {
      miotProp.on(Events.MIOT_DEVICE_PROPERTY_RETRIEVED, (response) => {
        this.propResponse = response; 
        this.logger.debug(`Property ${miotProp.getName()} response retrieved.`);
      });
    }
  }

  _updateValueBasedOnUpdateTimeFromDevice(response) {
    let currentTime = Math.floor(Date.now() / 1000);  // convert to seconds
    let updateTime = response.updateTime;
    let motionTimeout = 60; // 60 seconds timeout

    if (this.lastResponse && this.lastResponse.updateTime !== updateTime) { 
      if (currentTime - updateTime <= motionTimeout) {
        let lastMotionUpdateTime = this.lastMotionResponse.updateTime;
        if (!this._isPeriodicCheck(lastMotionUpdateTime, updateTime)){
          response.value = true;
          this.lastMotionResponse = {...response};
        }
        else {
          response.value = false;
        }
      } else {
        response.value = false;
      }
    } else {
      // init status
      if (!this.lastResponse){
        response.value = false; 
        this.lastMotionResponse = {...response};
        this.motionCounter++;
      }
      // no change in updateTime, then we keep the previous status
      else{
        response.value = this.lastResponse.value;
      }
    }
    this.lastResponse = {...response};
  }

  
  _isPeriodicCheck(baseTime, targetTime) {
    let difference = Math.abs(targetTime - baseTime);
    let remainder = difference % 60;
    
    return remainder === 0;
  }

}

module.exports = MotionSensorDevice;

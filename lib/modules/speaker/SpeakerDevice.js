const BaseDevice = require('../../base/BaseDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class SpeakerDevice extends BaseDevice {

  constructor(device, name, logger) {
    super(device, name, logger);
  }


  /*----------========== LIFECYCLE ==========----------*/

  initialPropertyFetchDone() {
    super.initialPropertyFetchDone();
  }


  /*----------========== DEVICE INFO ==========----------*/

  getType() {
    return DevTypes.SPEAKER;
  }

  getDeviceName() {
    return 'Unknown speaker device';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['speaker:volume', 'speaker:mute'];
  }


  /*----------========== VALUES ==========----------*/

  statusVolumeValue() {
    return this.getValueForStatus('Volume');
  }

  statusMuteValue() {
    return this.getValueForStatus('Mute');
  }


  /*----------========== PROPERTIES ==========----------*/

  //overrides


  //device specific
  volumeProp() {
    return this.getProperty('speaker:volume');
  }

  muteProp() {
    return this.getProperty('speaker:mute');
  }


  /*----------========== ACTIONS ==========----------*/

  playAction() {
    return this.getAction('play-control:play');
  }

  pauseAction() {
    return this.getAction('play-control:pause');
  }

  nextAction() {
    return this.getAction('play-control:next');
  }

  previousAction() {
    return this.getAction('play-control:previous');
  }


  /*----------========== FEATURES ==========----------*/

  volumeRange() {
    let range = this.getPropertyValueRange(this.volumeProp());
    return (range.length > 2) ? range : [6, 100, 1];
  }


  /*----------========== GETTERS ==========----------*/


  /*----------========== SETTERS ==========----------*/


  /*----------========== CONVENIENCE ==========----------*/

  playMedia() {
    return this.fireAction(this.playAction());
  }

  pauseMedia() {
    return this.fireAction(this.pauseAction());
  }

  nextMedia() {
    return this.fireAction(this.nextAction());
  }

  previousMedia() {
    return this.fireAction(this.previousAction());
  }

  getMuteValue() {
    return this.getPropertyValue(this.muteProp());
  }

  setMuteValue(value) {
    return this.setPropertyValue(this.muteProp(), value);
  }

  getVolumeValue() {
    return this.getPropertyValue(this.volumeProp());
  }

  setVolumeValue(value) {
    return this.setPropertyValue(this.volumeProp(), value);
  }


  /*----------========== VALUE CONVENIENCE  ==========----------*/


  /*----------========== HELPERS ==========----------*/


}

module.exports = SpeakerDevice;

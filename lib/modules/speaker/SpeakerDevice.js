const GenericDevice = require('../generic/GenericDevice.js');
const Constants = require('../../constants/Constants.js');
const DevTypes = require('../../constants/DevTypes.js');
const PropFormat = require('../../constants/PropFormat.js');
const PropUnit = require('../../constants/PropUnit.js');
const PropAccess = require('../../constants/PropAccess.js');


class SpeakerDevice extends GenericDevice {

  mediaState = 0;

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

  statusPlayingStateValue() {
    return this.getValueForStatus('Playing State');
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

  playingStateProp() {
    return this.getProperty('playing-control:playing-state');
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

  stopMedia() {
    this.mediaState = 0;
    return this.fireAction(this.pauseAction());
  }

  playMedia() {
    this.mediaState = 1;
    return this.fireAction(this.playAction());
  }

  pauseMedia() {
    this.mediaState = 2;
    return this.fireAction(this.pauseAction());
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

  isMediaStopped() {
    return this.mediaState === 0;
    // return this.getPropertyValue(this.playingStateProp()) === 0;
  }

  isMediaPlaying() {
    return this.mediaState === 1;
    // return this.getPropertyValue(this.playingStateProp()) === 1;
  }

  isMediaPaused() {
    return this.mediaState === 2;
    // return this.getPropertyValue(this.playingStateProp()) === 2;
  }

  isMuted() {
    return this.getPropertyValue(this.muteProp());
  }

  /*----------========== HELPERS ==========----------*/


}

module.exports = SpeakerDevice;

const VideoDoorbellDevice = require('../VideoDoorbellDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class MadvCateyeMowl3g extends VideoDoorbellDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Smart Doorbell 3';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:video-doorbell:0000A03A:madv-mowl3g:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:video-doorbell:00007863:madv-mowl3g:1","description":"Video Doorbell"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:motion-detection:0000784F:madv-mowl3g:1","description":"Motion Detection"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:alarm:00007804:madv-mowl3g:1","description":"Alarm"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:battery:00007805:madv-mowl3g:1","description":"Battery"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:p2p-stream:00007881:madv-mowl3g:1","description":"P2P Stream"}');
    this.createServiceByString('{"siid":11,"type":"urn:miot-spec-v2:service:indicator-light:00007803:madv-mowl3g:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":12,"type":"urn:miot-spec-v2:service:speaker:0000781C:madv-mowl3g:1","description":"Speaker"}');
    this.createServiceByString('{"siid":10,"type":"urn:madv-spec:service:madv-doorbell:00007801:madv-mowl3g:1","description":"madv-doorbell"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('video-doorbell:status', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:status:00000007:madv-mowl3g:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('video-doorbell:night-shot', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:night-shot:00000057:madv-mowl3g:1","description":"Night Shot","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"},{"value":2,"description":"Auto"}]}');
    this.addPropertyByString('video-doorbell:eco', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:eco:00000024:madv-mowl3g:1","description":"ECO","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('video-doorbell:ringtone', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:ringtone:0000009D:madv-mowl3g:1","description":"Ringtone","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[1,3,1]}');
    this.addPropertyByString('video-doorbell:cloud-video-id', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:cloud-video-id:00000113:madv-mowl3g:1","description":"Cloud Video ID","format":"string","access":[]}');
    this.addPropertyByString('motion-detection:alarm-interval', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:alarm-interval:0000008F:madv-mowl3g:1","description":"Alarm Interval","format":"uint8","access":["read","write","notify"],"unit":"minutes","valueList":[{"value":0,"description":"0"},{"value":5,"description":"5"},{"value":15,"description":"15"},{"value":30,"description":"30"},{"value":60,"description":"60"},{"value":180,"description":"180"}]}');
    this.addPropertyByString('motion-detection:detection-sensitivity', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:detection-sensitivity:00000090:madv-mowl3g:1","description":"Detection Sensitivity","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Low"},{"value":1,"description":"Middle"},{"value":2,"description":"High"}]}');
    this.addPropertyByString('motion-detection:motion-detection', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:motion-detection:00000056:madv-mowl3g:1","description":"Motion Detection","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":7,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:madv-mowl3g:1","description":"Alarm","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('battery:battery-level', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:madv-mowl3g:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":11,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:madv-mowl3g:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('speaker:volume', '{"siid":12,"piid":1,"type":"urn:miot-spec-v2:property:volume:00000013:madv-mowl3g:1","description":"Volume","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,25]}');
    this.addPropertyByString('madv-doorbell:motionpush-pushtype', '{"siid":10,"piid":7,"type":"urn:madv-spec:property:motionpush-pushtype:00000007:madv-mowl3g:1","description":"motionpush-pushtype","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"Not Push"},{"value":1,"description":"Only Pass"},{"value":2,"description":"Only Stay"}]}');
    this.addPropertyByString('madv-doorbell:videodelay', '{"siid":10,"piid":11,"type":"urn:madv-spec:property:videodelay:0000000b:madv-mowl3g:1","description":"videodelay","format":"uint8","access":["read","notify","write"],"unit":"seconds","valueRange":[0,10,1]}');
    this.addPropertyByString('madv-doorbell:videolength', '{"siid":10,"piid":12,"type":"urn:madv-spec:property:videolength:0000000c:madv-mowl3g:1","description":"videolength","format":"uint8","access":["read","notify","write"],"unit":"seconds","valueList":[{"value":10,"description":"Videolength 10"},{"value":15,"description":"Videolength 15"},{"value":20,"description":"Videolength 20"},{"value":30,"description":"Videolength 30"}]}');
    this.addPropertyByString('madv-doorbell:autoreply', '{"siid":10,"piid":13,"type":"urn:madv-spec:property:autoreply:0000000d:madv-mowl3g:1","description":"autoreply","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:autoreply-week', '{"siid":10,"piid":14,"type":"urn:madv-spec:property:autoreply-week:0000000e:madv-mowl3g:1","description":"autoreply-week","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:autoreply-time', '{"siid":10,"piid":15,"type":"urn:madv-spec:property:autoreply-time:0000000f:madv-mowl3g:1","description":"autoreply-time","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:autoreply-item', '{"siid":10,"piid":16,"type":"urn:madv-spec:property:autoreply-item:00000010:madv-mowl3g:1","description":"autoreply-item","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:ringer-time', '{"siid":10,"piid":18,"type":"urn:madv-spec:property:ringer-time:00000012:madv-mowl3g:1","description":"ringer-time","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:fw-autoupgrade', '{"siid":10,"piid":19,"type":"urn:madv-spec:property:fw-autoupgrade:00000013:madv-mowl3g:1","description":"fw-autoupgrade","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:eco-code', '{"siid":10,"piid":36,"type":"urn:madv-spec:property:eco-code:00000003:madv-mowl3g:1","description":"eco-code","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"0"},{"value":1,"description":"1"},{"value":2,"description":"2"}]}');
    this.addPropertyByString('madv-doorbell:motion-time', '{"siid":10,"piid":38,"type":"urn:madv-spec:property:motion-time:0000000a:madv-mowl3g:1","description":"motion-time","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:test-spec', '{"siid":10,"piid":39,"type":"urn:madv-spec:property:test-spec:00000011:madv-mowl3g:1","description":"test-spec","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"1"}]}');
    this.addPropertyByString('madv-doorbell:settingsync-time', '{"siid":10,"piid":40,"type":"urn:madv-spec:property:settingsync-time:00000006:madv-mowl3g:1","description":"settingsync-time","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:battypedate', '{"siid":10,"piid":41,"type":"urn:madv-spec:property:battypedate:00000014:madv-mowl3g:1","description":"battypedate","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:workinglength', '{"siid":10,"piid":42,"type":"urn:madv-spec:property:workinglength:00000015:madv-mowl3g:1","description":"workinglength","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:startuptimes', '{"siid":10,"piid":43,"type":"urn:madv-spec:property:startuptimes:00000017:madv-mowl3g:1","description":"startuptimes","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:threeday-work', '{"siid":10,"piid":44,"type":"urn:madv-spec:property:threeday-work:00000018:madv-mowl3g:1","description":"threeday-work","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:syswork', '{"siid":10,"piid":45,"type":"urn:madv-spec:property:syswork:00000019:madv-mowl3g:1","description":"syswork","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:pir', '{"siid":10,"piid":46,"type":"urn:madv-spec:property:pir:0000001a:madv-mowl3g:1","description":"pir","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:videonum', '{"siid":10,"piid":47,"type":"urn:madv-spec:property:videonum:0000001b:madv-mowl3g:1","description":"videonum","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:fourbat-work', '{"siid":10,"piid":48,"type":"urn:madv-spec:property:fourbat-work:0000001c:madv-mowl3g:1","description":"fourbat-work","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:connected', '{"siid":10,"piid":49,"type":"urn:madv-spec:property:connected:0000001d:madv-mowl3g:1","description":"connected","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:pwrdate', '{"siid":10,"piid":50,"type":"urn:madv-spec:property:pwrdate:0000001e:madv-mowl3g:1","description":"pwrdate","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:mcu-pir', '{"siid":10,"piid":51,"type":"urn:madv-spec:property:mcu-pir:0000001f:madv-mowl3g:1","description":"mcu-pir","format":"string","access":[],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:ringer-music', '{"siid":10,"piid":52,"type":"urn:madv-spec:property:ringer-music:00000004:madv-mowl3g:1","description":"ringer-music","format":"uint8","access":["read","notify","write"],"unit":"none","valueList":[{"value":3,"description":"3"},{"value":4,"description":"4"},{"value":5,"description":"5"},{"value":6,"description":"7"}]}');
    this.addPropertyByString('madv-doorbell:vistpush', '{"siid":10,"piid":53,"type":"urn:madv-spec:property:vistpush:00000020:madv-mowl3g:1","description":"vistpush","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:motionpush', '{"siid":10,"piid":54,"type":"urn:madv-spec:property:motionpush:00000021:madv-mowl3g:1","description":"motionpush","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:motion-detection', '{"siid":10,"piid":55,"type":"urn:madv-spec:property:motion-detection:00000022:madv-mowl3g:1","description":"motion-detection","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('madv-doorbell:reserve', '{"siid":10,"piid":56,"type":"urn:madv-spec:property:reserve:00000001:madv-mowl3g:1","description":"","format":"string","access":[]}');
    this.addPropertyByString('madv-doorbell:timezone', '{"siid":10,"piid":57,"type":"urn:madv-spec:property:timezone:00000002:madv-mowl3g:1","description":"","format":"string","access":["write"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('video-doorbell:doorbell-forcibly-removed', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:doorbell-forcibly-removed:00005025:madv-mowl3g:1","description":"Doorbell Forcibly Removed","arguments":[8]}');
    this.addEventByString('video-doorbell:doorbell-ring', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:doorbell-ring:00005013:madv-mowl3g:1","description":"Doorbell Ring","arguments":[8]}');
    this.addEventByString('video-doorbell:someone-at-the-door', '{"siid":2,"eiid":3,"type":"urn:miot-spec-v2:event:someone-at-the-door:0000502D:madv-mowl3g:1","description":"Someone At The Door","arguments":[8]}');
    this.addEventByString('video-doorbell:someone-passed-by', '{"siid":2,"eiid":4,"type":"urn:miot-spec-v2:event:someone-passed-by:0000502C:madv-mowl3g:1","description":"Someone Passed By","arguments":[8]}');
    this.addEventByString('battery:low-battery', '{"siid":8,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:madv-mowl3g:1","description":"Low Battery","arguments":[]}');
    this.addEventByString('madv-doorbell:upgrade-event', '{"siid":10,"eiid":8,"type":"urn:madv-spec:event:upgrade-event:00005008:madv-mowl3g:1","description":"upgrade-event","arguments":[]}');
    this.addEventByString('madv-doorbell:upgrade-success', '{"siid":10,"eiid":10,"type":"urn:madv-spec:event:upgrade-success:0000500a:madv-mowl3g:1","description":"upgrade-success","arguments":[]}');
    this.addEventByString('madv-doorbell:upgrade-fail', '{"siid":10,"eiid":11,"type":"urn:madv-spec:event:upgrade-fail:0000500b:madv-mowl3g:1","description":"upgrade-fail","arguments":[]}');
    this.addEventByString('madv-doorbell:no-battery', '{"siid":10,"eiid":12,"type":"urn:madv-spec:event:no-battery:00005009:madv-mowl3g:1","description":"no-battery","arguments":[]}');
    this.addEventByString('madv-doorbell:low-battery', '{"siid":10,"eiid":16,"type":"urn:madv-spec:event:low-battery:0000500f:madv-mowl3g:1","description":"low-battery","arguments":[]}');
    this.addEventByString('madv-doorbell:new-battery', '{"siid":10,"eiid":17,"type":"urn:madv-spec:event:new-battery:00005001:madv-mowl3g:1","description":"new-battery","arguments":[]}');
    this.addEventByString('madv-doorbell:temp-abnormal', '{"siid":10,"eiid":18,"type":"urn:madv-spec:event:temp-abnormal:00005002:madv-mowl3g:1","description":"temp-abnormal","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = MadvCateyeMowl3g;

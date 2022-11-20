const SpeakerDevice = require('../SpeakerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiWifispeakerLx06 extends SpeakerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi AI Speaker Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:speaker:0000A015:xiaomi-lx06:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:speaker:0000781C:xiaomi-lx06:1","description":"Speaker"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:play-control:0000781D:xiaomi-lx06:1","description":"Play Control"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:microphone:00007826:xiaomi-lx06:1","description":"Microphone"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:intelligent-speaker:0000789B:xiaomi-lx06:1","description":"Intelligent Speaker"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:clock:0000789A:xiaomi-lx06:1","description":"Clock"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('speaker:volume', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:volume:00000013:xiaomi-lx06:1","description":"Volume","format":"uint8","access":["read","write"],"unit":"percentage","valueRange":[6,100,1]}');
    this.addPropertyByString('speaker:mute', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mute:00000040:xiaomi-lx06:1","description":"Mute","format":"bool","access":["read","write"]}');
    this.addPropertyByString('play-control:playing-state', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:playing-state:00000041:xiaomi-lx06:2","description":"Playing State","format":"uint8","access":["notify"],"valueList":[{"value":0,"description":"Stop"},{"value":1,"description":"Playing"},{"value":2,"description":"Pause"}]}');
    this.addPropertyByString('microphone:mute', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:mute:00000040:xiaomi-lx06:1","description":"Mute","format":"bool","access":["read","write"]}');
    this.addPropertyByString('intelligent-speaker:text-content', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:text-content:000000FA:xiaomi-lx06:1","description":"Text Content","format":"string","access":[]}');
    this.addPropertyByString('intelligent-speaker:silent-execution', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:silent-execution:000000FB:xiaomi-lx06:1","description":"Silent Execution","format":"bool","access":[]}');
    this.addPropertyByString('intelligent-speaker:sleep-mode', '{"siid":5,"piid":3,"type":"urn:miot-spec-v2:property:sleep-mode:00000028:xiaomi-lx06:2","description":"Sleep Mode","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('intelligent-speaker:audio-id', '{"siid":5,"piid":4,"type":"urn:miot-spec-v2:property:audio-id:00000159:xiaomi-lx06:2","description":"Audio Id","format":"string","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('play-control:play', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:play:0000280B:xiaomi-lx06:1","description":"Play","in":[],"out":[]}');
    this.addActionByString('play-control:pause', '{"siid":3,"aiid":2,"type":"urn:miot-spec-v2:action:pause:0000280C:xiaomi-lx06:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('play-control:next', '{"siid":3,"aiid":3,"type":"urn:miot-spec-v2:action:next:0000280F:xiaomi-lx06:1","description":"Next","in":[],"out":[]}');
    this.addActionByString('play-control:previous', '{"siid":3,"aiid":4,"type":"urn:miot-spec-v2:action:previous:0000280E:xiaomi-lx06:1","description":"Previous","in":[],"out":[]}');
    this.addActionByString('intelligent-speaker:play-text', '{"siid":5,"aiid":1,"type":"urn:miot-spec-v2:action:play-text:00002841:xiaomi-lx06:1","description":"Play Text","in":[1],"out":[]}');
    this.addActionByString('intelligent-speaker:play-music', '{"siid":5,"aiid":2,"type":"urn:miot-spec-v2:action:play-music:00002846:xiaomi-lx06:1","description":"Play Music","in":[],"out":[]}');
    this.addActionByString('intelligent-speaker:wake-up', '{"siid":5,"aiid":3,"type":"urn:miot-spec-v2:action:wake-up:0000283F:xiaomi-lx06:1","description":"Wake Up","in":[],"out":[]}');
    this.addActionByString('intelligent-speaker:play-radio', '{"siid":5,"aiid":4,"type":"urn:miot-spec-v2:action:play-radio:00002840:xiaomi-lx06:1","description":"Play Radio","in":[],"out":[]}');
    this.addActionByString('intelligent-speaker:execute-text-directive', '{"siid":5,"aiid":5,"type":"urn:miot-spec-v2:action:execute-text-directive:00002842:xiaomi-x08c:1","description":"Execute Text Directive","in":[1,2],"out":[]}');
    this.addActionByString('clock:stop-alarm', '{"siid":6,"aiid":1,"type":"urn:miot-spec-v2:action:stop-alarm:00002843:xiaomi-lx06:1","description":"Stop Alarm","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiWifispeakerLx06;

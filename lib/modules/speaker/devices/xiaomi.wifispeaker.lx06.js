const SpeakerDevice = require('../SpeakerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiWifiSpeakerLx06 extends SpeakerDevice {
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
  }

  initDeviceProperties() {
    this.addPropertyByString('speaker:volume', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:volume:00000013:xiaomi-lx06:1","description":"Volume","format":"uint8","access":["read","write"],"unit":"percentage","valueRange":[6,100,1]}');
    this.addPropertyByString('speaker:mute', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mute:00000040:xiaomi-lx06:1","description":"Mute","format":"bool","access":["read","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('play-control:play', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:play:0000280B:xiaomi-lx06:1","description":"Play","in":[],"out":[]}');
    this.addActionByString('play-control:pause', '{"siid":3,"aiid":2,"type":"urn:miot-spec-v2:action:pause:0000280C:xiaomi-lx06:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('play-control:next', '{"siid":3,"aiid":3,"type":"urn:miot-spec-v2:action:next:0000280F:xiaomi-lx06:1","description":"Next","in":[],"out":[]}');
    this.addActionByString('play-control:previous', '{"siid":3,"aiid":4,"type":"urn:miot-spec-v2:action:previous:0000280E:xiaomi-lx06:1","description":"Previous","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = XiaomiWifiSpeakerLx06;

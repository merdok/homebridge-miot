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
    this.addPropertyByString('play-control:playing-state', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:playing-state:00000041:xiaomi-lx06:2","description":"Playing State","format":"uint8","access":["notify"],"valueList":[{"value":0,"description":"Stop"},{"value":1,"description":"Playing"},{"value":2,"description":"Pause"}]}');
  }

  initDeviceActions() {
    //no actions
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

const FanDevice = require('../FanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DmakerFan1c extends FanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Standing Fan 1C';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:dmaker-1c:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:fan:00007808:dmaker-1c:1","description":"Fan"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:dmaker-1c:1","description":"Physical Control Locked"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('fan:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:dmaker-1c:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:dmaker-1c:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"1"},{"value":2,"description":"2"},{"value":3,"description":"3"}]}');
    this.addPropertyByString('fan:horizontal-swing', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:horizontal-swing:00000017:dmaker-1c:1","description":"Horizontal Swing","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:mode:00000008:dmaker-1c:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Straight Wind"},{"value":1,"description":"Sleep"}]}');
    this.addPropertyByString('fan:off-delay-time', '{"siid":2,"piid":10,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:dmaker-1c:1","description":"Power Off Delay Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,480,1]}');
    this.addPropertyByString('fan:alarm', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:alarm:00000012:dmaker-1c:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:brightness', '{"siid":2,"piid":12,"type":"urn:miot-spec-v2:property:brightness:0000000D:dmaker-1c:1","description":"Brightness","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:dmaker-1c:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('fan:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:dmaker-1c:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  straightWindModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 1;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('fan:off-delay-time');
  }

  alarmProp() {
    return this.getProperty('fan:alarm');
  }

  indicatorLightBrightnessProp() {
    return this.getProperty('fan:brightness');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DmakerFan1c;

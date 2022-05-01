const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightMono6 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart LED Bulb mono6';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-mono6:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-mono6:1","description":"Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-mono6:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-mono6:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:off-delay-time', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:off-delay-time:00000054:yeelink-mono6:1","description":"Power Off Delay Time","format":"uint32","access":["read","write","notify"],"unit":"minutes","valueRange":[0,120,1]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-mono6:1","description":"Toggle","in":[],"out":[]}');
    this.addActionByString('light:brightness-down', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:brightness-down:00002829:yeelink-mono6:1","description":"Brightness Down","in":[],"out":[]}');
    this.addActionByString('light:brightness-up', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:brightness-up:00002828:yeelink-mono6:1","description":"Brightness Up","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightMono6;

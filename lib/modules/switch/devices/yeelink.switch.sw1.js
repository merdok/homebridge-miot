const SwitchDevice = require('../SwitchDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkSwitchSw1 extends SwitchDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart Dual Control Module';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:switch:0000A003:yeelink-sw1:1:0000C809';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:yeelink-sw1:1:0000C809","description":"First Switch Service"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:switch:0000780C:yeelink-sw1:1:0000C809","description":"Second Switch Service"}');
    this.createServiceByString('{"siid":4,"type":"urn:yeelink-spec:service:extension:00007801:yeelink-sw1:1","description":"extension"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-sw1:1:0000C809","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-sw1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('switch:mode3', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-sw1:1","description":"Mode","format":"int64","access":["read","write","notify"],"unit":"none","valueRange":[-1,43200,1]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-sw1:1:0000C809","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch3:mode', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-sw1:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('switch3:mode3', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-sw1:1","description":"Mode","format":"int64","access":["read","write","notify"],"unit":"none","valueRange":[-1,43200,1]}');
    this.addPropertyByString('extension:interlock', '{"siid":4,"piid":1,"type":"urn:yeelink-spec:property:interlock:00000001:yeelink-sw1:1","description":"interlock","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('extension:flash', '{"siid":4,"piid":2,"type":"urn:yeelink-spec:property:flash:00000002:yeelink-sw1:1","description":"","format":"uint8","access":["read","notify","write"],"unit":"none","valueRange":[0,1,1]}');
    this.addPropertyByString('extension:rc-list', '{"siid":4,"piid":3,"type":"urn:yeelink-spec:property:rc-list:00000003:yeelink-sw1:1","description":"rc-list","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('extension:rc-list-for-del', '{"siid":4,"piid":4,"type":"urn:yeelink-spec:property:rc-list-for-del:00000004:yeelink-sw1:1","description":"rc-list-for-del","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('extension:toggle', '{"siid":4,"piid":5,"type":"urn:yeelink-spec:property:toggle:00000005:yeelink-sw1:1","description":"toggle","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"通道0"},{"value":1,"description":"通道1"}]}');
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

module.exports = YeelinkSwitchSw1;

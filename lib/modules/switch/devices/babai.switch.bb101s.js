const SwitchDevice = require('../SwitchDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class BabaiSwitchBb101s extends SwitchDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'WiFi Wall Switch A1';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:switch:0000A003:babai-bb101s:2:0000C808';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:babai-bb101s:1:0000C808","description":"Switch"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:babai-bb101s:1:0000C808","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('switch:eco', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:eco:00000024:babai-bb101s:1","description":"ECO","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('switch:off-delay', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:off-delay:00000053:babai-bb101s:1","description":"Power Off Delay","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('switch:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:babai-bb101s:2","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Normal"},{"value":3,"description":"Memory"}]}');
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

module.exports = BabaiSwitchBb101s;

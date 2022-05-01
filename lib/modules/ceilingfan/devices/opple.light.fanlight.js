const CeilingFanDevice = require('../CeilingFanDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class OppleLightFanlight extends CeilingFanDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Opple Ceiling Fan Light';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:opple-fanlight:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:opple-fanlight:2","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan:00007808:opple-fanlight:2","description":"Fan"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:opple-fanlight:2","description":"Switch Status","format":"bool","access":["read","write"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:opple-fanlight:2","description":"Mode","format":"uint8","access":["read","write"],"valueList":[{"value":1,"description":"Hospitality"},{"value":2,"description":"Tv"},{"value":3,"description":"Entertainment"},{"value":4,"description":"Night"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:opple-fanlight:2","description":"Brightness","format":"uint8","access":["write","read"],"unit":"percentage","valueRange":[7,100,1]}');
    this.addPropertyByString('light:color-temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:color-temperature:0000000F:opple-fanlight:2","description":"Color Temperature","format":"uint32","access":["read","write"],"unit":"kelvin","valueRange":[3000,5700,1]}');
    this.addPropertyByString('fan:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:opple-fanlight:2","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('fan:fan-level', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:opple-fanlight:2","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[10,64,1]}');
    this.addPropertyByString('fan:mode', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:opple-fanlight:2","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"NONE"},{"value":2,"description":"LOW"},{"value":3,"description":"MID"},{"value":4,"description":"HIGH"}]}');
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

module.exports = OppleLightFanlight;

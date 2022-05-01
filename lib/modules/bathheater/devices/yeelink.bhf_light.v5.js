const BathHeaterDevice = require('../BathHeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkBhf_lightV5 extends BathHeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Bathroom Heater Pro';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:bath-heater:0000A028:yeelink-v5:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }
  

  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-v5:1","description":"Light Bath Heater"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:ptc-bath-heater:0000783B:yeelink-v5:1","description":"PTC Bath Heater"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-v5:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-v5:1","description":"Mode","format":"uint8","access":["write"],"valueList":[{"value":1,"description":"Lighting"},{"value":2,"description":"Night Light"}]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-v5:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('ptc-bath-heater:mode', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-v5:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Dry"},{"value":2,"description":"Defog"},{"value":3,"description":"Quick Defog"},{"value":4,"description":"Quick Heat"},{"value":5,"description":"Idle"},{"value":6,"description":"None"}]}');
    this.addPropertyByString('ptc-bath-heater:heating', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:heating:000000C7:yeelink-v5:1","description":"Heating","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('ptc-bath-heater:blow', '{"siid":3,"piid":3,"type":"urn:miot-spec-v2:property:blow:000000CD:yeelink-v5:1","description":"Blow","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('ptc-bath-heater:ventilation', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:ventilation:000000CE:yeelink-v5:1","description":"Ventilation","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('ptc-bath-heater:target-temperature', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:target-temperature:00000021:yeelink-v5:1","description":"Target Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[25,45,1]}');
    this.addPropertyByString('ptc-bath-heater:temperature', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:temperature:00000020:yeelink-v5:1","description":"Temperature","format":"uint8","access":["read"],"unit":"celsius","valueRange":[0,50,1]}');
  }

  initDeviceActions() {
    this.addActionByString('ptc-bath-heater:stop-working', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:stop-working:00002825:yeelink-v5:1","description":"Stop Working","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  idleModeValue() {
    return 5;
  }

  heatModeValue() {
    return 4;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkBhf_lightV5;

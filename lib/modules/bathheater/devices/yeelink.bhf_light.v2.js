const BathHeaterDevice = require('../BathHeaterDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkBhf_lightV2 extends BathHeaterDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Smart Bathroom Heater';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:bath-heater:0000A028:yeelink-v2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-v2:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:ptc-bath-heater:0000783B:yeelink-v2:1","description":"PTC Bath Heater"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:fan-control:00007809:yeelink-v2:1","description":"Fan Control"}');
    this.createServiceByString('{"siid":5,"type":"urn:yeelink-spec:service:light-extension:00000001:yeelink-v2:1","description":"Light Extension Feature"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-v2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-v2:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('ptc-bath-heater:mode', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:mode:00000008:yeelink-v2:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Heat"},{"value":3,"description":"Ventilate"},{"value":4,"description":"Dry"},{"value":5,"description":"Fan"}]}');
    this.addPropertyByString('fan-control:fan-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:fan-level:00000016:yeelink-v2:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('light-extension:brightness-delta', '{"siid":5,"piid":1,"type":"urn:yeelink-spec:property:brightness-delta:00000002:yeelink-v2:1","description":"Adjust brightness","format":"int8","access":["write"],"unit":"percentage","valueRange":[-100,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('ptc-bath-heater:stop-working', '{"siid":3,"aiid":1,"type":"urn:miot-spec-v2:action:stop-working:00002825:yeelink-v2:1","description":"Stop Working","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  idleModeValue() {
    return 1;
  }

  heatModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkBhf_lightV2;

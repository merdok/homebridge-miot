const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChuangmiPlugV3 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Chuangmi Plug V3';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:chuangmi-v3:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:chuangmi-v3:1","description":"Power Switch Status"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:switch:0000780C:chuangmi-v3:1","description":"USB Switch Status"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:chuangmi-v3:1","description":"Indicator Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:chuangmi-v3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch:temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:chuangmi-v3:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-40,125,0.1]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:chuangmi-v3:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:chuangmi-v3:1","description":"Switch Status","format":"bool","access":["read","write"]}');
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

module.exports = ChuangmiPlugV3;

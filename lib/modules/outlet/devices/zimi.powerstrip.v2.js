const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZimiPowerstripV2 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Power Strip';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:zimi-v2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:zimi-v2:1","description":"Switch"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:power-consumption:0000780E:zimi-v2:1","description":"Power Consumption"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:zimi-v2:1","description":"Indicator Light"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zimi-v2:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch:temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:zimi-v2:1","description":"Temperature","format":"float","access":["read"],"unit":"celsius","valueRange":[-40,125,0.01]}');
    this.addPropertyByString('power-consumption:surge-power', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:surge-power:00000033:zimi-v2:1","description":"Surge power","format":"float","access":["read"],"unit":"w","valueRange":[0,2500,0.1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zimi-v2:1","description":"Switch Status","format":"bool","access":["read","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:zimi-v2:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZimiPowerstripV2;

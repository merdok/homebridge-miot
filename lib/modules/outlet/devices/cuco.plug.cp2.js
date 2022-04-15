const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CucoPlugCp2 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Gosund Socket';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:cuco-cp2:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:cuco-cp2:1","description":"Switch"}');
    this.createServiceByString('{"siid":3,"type":"urn:cuco-spec:service:indicator-light:00007801:cuco-cp2:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:cuco-cp2:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('switch:power-consumption', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:cuco-cp2:1","description":"Power Consumption","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('switch:voltage', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:voltage:00000031:cuco-cp2:1","description":"Voltage","format":"uint16","access":["read","notify"],"unit":"none","valueRange":[0,3000,1]}');
    this.addPropertyByString('switch:electric-current', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:electric-current:00000030:cuco-cp2:1","description":"Electric Current","format":"uint16","access":["read"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('switch:countdown-time', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:countdown-time:00000055:cuco-cp2:1","description":"Countdown Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":3,"piid":1,"type":"urn:cuco-spec:property:on:00000001:cuco-cp2:1","description":"指示灯开关","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('indicator-light:power', '{"siid":3,"piid":2,"type":"urn:cuco-spec:property:power:00000002:cuco-cp2:1","description":"功率","format":"uint16","access":["read","notify"],"unit":"watt","valueRange":[0,65535,1]}');
    this.addPropertyByString('indicator-light:reverse', '{"siid":3,"piid":3,"type":"urn:cuco-spec:property:reverse:00000003:cuco-cp2:1","description":"反转开/关","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('indicator-light:overheat-alarm', '{"siid":3,"piid":4,"type":"urn:cuco-spec:property:overheat-alarm:00000004:cuco-cp2:2","description":"overheat-alarm","format":"bool","access":["notify","read"]}');
  }

  initDeviceActions() {
    this.addActionByString('switch:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:cuco-cp2:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CucoPlugCp2;

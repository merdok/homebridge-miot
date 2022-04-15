const OutletDevice = require('../OutletDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChuangmiPlug212a01 extends OutletDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Power Plug 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:outlet:0000A002:chuangmi-212a01:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:chuangmi-212a01:1","description":"Switch"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:indicator-light:00007803:chuangmi-212a01:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:power-consumption:0000780E:chuangmi-212a01:1","description":"Power Consumption"}');
    this.createServiceByString('{"siid":4,"type":"urn:chuangmi-spec:service:imilab-timer:00007801:chuangmi-212a01:1","description":"imilab-timer"}');
    this.createServiceByString('{"siid":6,"type":"urn:chuangmi-spec:service:relay-event:00007802:chuangmi-212a01:1","description":"relay-event"}');
    this.createServiceByString('{"siid":7,"type":"urn:chuangmi-spec:service:functions-enable:00007803:chuangmi-212a01:2","description":"functions-enable"}');
    this.createServiceByString('{"siid":8,"type":"urn:chuangmi-spec:service:push-services:00007804:chuangmi-212a01:2","description":"push-services"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:chuangmi-212a01:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch:temperature', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:temperature:00000020:chuangmi-212a01:1","description":"Temperature","format":"uint8","access":["read","notify"],"unit":"celsius","valueRange":[0,255,1]}');
    this.addPropertyByString('switch:working-time', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:working-time:00000079:chuangmi-212a01:1","description":"Working Time","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,300,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:chuangmi-212a01:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('power-consumption:power-consumption', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:power-consumption:0000002F:chuangmi-212a01:1","description":"Power Consumption","format":"uint32","access":["read","notify"],"unit":"none","valueRange":[0,65535000,1]}');
    this.addPropertyByString('power-consumption:electric-current', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:electric-current:00000030:chuangmi-212a01:1","description":"Electric Current","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('power-consumption:voltage', '{"siid":5,"piid":3,"type":"urn:miot-spec-v2:property:voltage:00000031:chuangmi-212a01:1","description":"Voltage","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('power-consumption:electric-power', '{"siid":5,"piid":6,"type":"urn:miot-spec-v2:property:electric-power:00000066:chuangmi-212a01:1","description":"Electric Power","format":"uint32","access":["read","notify"],"unit":"watt","valueRange":[0,6553500,1]}');
    this.addPropertyByString('power-consumption:surge-power', '{"siid":5,"piid":7,"type":"urn:miot-spec-v2:property:surge-power:00000033:chuangmi-212a01:2","description":"Surge power","format":"uint32","access":["read","notify"],"valueRange":[0,65525,1]}');
    this.addPropertyByString('imilab-timer:on-duration', '{"siid":4,"piid":1,"type":"urn:chuangmi-spec:property:on-duration:00000001:chuangmi-212a01:1","description":"on-duration","format":"uint32","access":["read","notify","write"],"unit":"seconds","valueRange":[0,86500,1]}');
    this.addPropertyByString('imilab-timer:off-duration', '{"siid":4,"piid":2,"type":"urn:chuangmi-spec:property:off-duration:00000002:chuangmi-212a01:1","description":"off-duration","format":"uint32","access":["read","notify","write"],"unit":"seconds","valueRange":[0,86500,1]}');
    this.addPropertyByString('imilab-timer:countdown', '{"siid":4,"piid":3,"type":"urn:chuangmi-spec:property:countdown:00000003:chuangmi-212a01:1","description":"countdown","format":"uint32","access":["read","notify","write"],"unit":"seconds","valueRange":[0,86500,1]}');
    this.addPropertyByString('imilab-timer:task-switch', '{"siid":4,"piid":4,"type":"urn:chuangmi-spec:property:task-switch:00000004:chuangmi-212a01:1","description":"task-switch","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('imilab-timer:countdown-info', '{"siid":4,"piid":5,"type":"urn:chuangmi-spec:property:countdown-info:00000005:chuangmi-212a01:1","description":"countdown-info","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('imilab-timer:switch-toggle', '{"siid":4,"piid":6,"type":"urn:chuangmi-spec:property:switch-toggle:00000006:chuangmi-212a01:1","description":"switch-toggle","format":"bool","access":["write"],"unit":"none"}');
    this.addPropertyByString('relay-event:switch-event', '{"siid":6,"piid":1,"type":"urn:chuangmi-spec:property:switch-event:00000001:chuangmi-212a01:1","description":"switch-event","format":"bool","access":["notify"],"unit":"none"}');
    this.addPropertyByString('functions-enable:power-enable', '{"siid":7,"piid":1,"type":"urn:chuangmi-spec:property:power-enable:00000001:chuangmi-212a01:2","description":"power-enable","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('push-services:over-power-limit', '{"siid":8,"piid":1,"type":"urn:chuangmi-spec:property:over-power-limit:00000001:chuangmi-212a01:2","description":"over-power-limit","format":"bool","access":["notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('relay-event:event', '{"siid":6,"eiid":1,"type":"urn:chuangmi-spec:event:event:00005001:chuangmi-212a01:1","description":"event","arguments":[1]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  offDelayProp() {
    return this.getProperty('imilab-timer:countdown');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChuangmiPlug212a01;

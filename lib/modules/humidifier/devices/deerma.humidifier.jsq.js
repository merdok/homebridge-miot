const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DeermaHumidifierJsq extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Smart Antibacterial Humidifier';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  propertiesToMonitor() {
    return [];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:deerma-jsq:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:deerma-jsq:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:indicator-light:00007803:deerma-jsq:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:deerma-jsq:1","description":"Alarm"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:deerma-jsq:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,90,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:deerma-jsq:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-10,60,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:deerma-jsq:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
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

module.exports = DeermaHumidifierJsq;

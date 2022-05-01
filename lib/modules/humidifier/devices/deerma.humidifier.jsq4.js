const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DeermaHumidifierJsq4 extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Smartmi Evaporative Humidifier 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq4:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:deerma-jsq4:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:deerma-jsq4:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:deerma-jsq4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:deerma-jsq4:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:deerma-spec:service:custom:00007801:deerma-jsq4:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:deerma-jsq4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Insufficient Water"},{"value":2,"description":"Water Separation"}]}');
    this.addPropertyByString('humidifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:deerma-jsq4:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Humidity"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-humidity:00000022:deerma-jsq4:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[40,80,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:deerma-jsq4:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:deerma-jsq4:1","description":"Temperature","format":"int8","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:deerma-jsq4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq4:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('custom:water-shortage-fault', '{"siid":7,"piid":1,"type":"urn:deerma-spec:property:water-shortage-fault:00000001:deerma-jsq4:1","description":"water-shortage-fault","format":"bool","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('custom:the-tank-filed', '{"siid":7,"piid":2,"type":"urn:deerma-spec:property:the-tank-filed:00000002:deerma-jsq4:1","description":"the-tank-filed","format":"bool","access":["read","notify"],"unit":"none"}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    this.addEventByString('custom:lack-of-water', '{"siid":7,"eiid":1,"type":"urn:deerma-spec:event:lack-of-water:00005001:deerma-jsq4:1","description":"lack-of-water","arguments":[1]}');
    this.addEventByString('custom:bring-water-tank', '{"siid":7,"eiid":2,"type":"urn:deerma-spec:event:bring-water-tank:00005002:deerma-jsq4:1","description":"bring-water-tank","arguments":[2]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DeermaHumidifierJsq4;

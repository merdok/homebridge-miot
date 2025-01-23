const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DeermaHumidifierJsq1 extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Antibacterial Humidifier S';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }

  propertiesToMonitor() {
    return [
      'humidifier:on', 'humidifier:fan-level', 'humidifier:target-humidity', 'humidifier:overwet-protect',
      'environment:relative-humidity', 'environment:temperature',
      'alarm:alarm',
      'indicator-light:on'
    ];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:deerma-jsq1:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:deerma-jsq1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:deerma-jsq1:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:deerma-jsq1:1","description":"Indicator Light"}');
  }

  initDeviceProperties() {
    // humidifier
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:fan-level', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fan-level:00000016:deerma-jsq1:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"ConstHumidity"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:target-humidity:00000022:deerma-jsq1:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[40,70,1]}');
    this.addPropertyByString('humidifier:overwet-protect', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:overwet-protect:00000187:deerma-jsq1:1","description":"Overwet Protect","format":"bool","access":["read","write","notify"]}');

    // environment
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:deerma-jsq1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[20,99,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:deerma-jsq1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-10,60,1]}');

    // alarm
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:deerma-jsq1:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');

    // indicator-light
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq1:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('humidifier:low-water-level', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:low-water-level:0000500A:deerma-jsq1:1","description":"Low Water Level","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DeermaHumidifierJsq1;

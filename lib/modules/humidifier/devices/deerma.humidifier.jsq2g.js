const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class DeermaHumidifierJsq2g extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Smart Anti-bacterial Humidifier 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:deerma-jsq2g:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:deerma-jsq2g:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:deerma-jsq2g:1","description":"Environment"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:alarm:00007804:deerma-jsq2g:1","description":"Alarm"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:indicator-light:00007803:deerma-jsq2g:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":7,"type":"urn:deerma-spec:service:custom:00007801:deerma-jsq2g:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq2g:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:deerma-jsq2g:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"Insufficient Water"},{"value":2,"description":"Water Separation"}]}');
    this.addPropertyByString('humidifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:deerma-jsq2g:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-humidity:00000022:deerma-jsq2g:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[40,70,1]}');
    this.addPropertyByString('humidifier:status', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:status:00000007:deerma-jsq2g:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Busy"}]}');
    this.addPropertyByString('humidifier:mode', '{"siid":2,"piid":8,"type":"urn:miot-spec-v2:property:mode:00000008:deerma-jsq2g:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"None"},{"value":1,"description":"Constant Humidity"}]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:deerma-jsq2g:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:deerma-jsq2g:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:deerma-jsq2g:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:deerma-jsq2g:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('custom:the-tank-filed', '{"siid":7,"piid":1,"type":"urn:deerma-spec:property:the-tank-filed:00000001:deerma-jsq2g:1","description":"the-tank-filed","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:water-shortage-fault', '{"siid":7,"piid":2,"type":"urn:deerma-spec:property:water-shortage-fault:00000002:deerma-jsq2g:1","description":"water-shortage-fault","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:humi-sensor-fault', '{"siid":7,"piid":3,"type":"urn:deerma-spec:property:humi-sensor-fault:00000003:deerma-jsq2g:1","description":"humi-sensor-fault","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:temp-sensor-fault', '{"siid":7,"piid":4,"type":"urn:deerma-spec:property:temp-sensor-fault:00000004:deerma-jsq2g:1","description":"temp-sensor-fault","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:overwet-protect', '{"siid":7,"piid":5,"type":"urn:deerma-spec:property:overwet-protect:00000005:deerma-jsq2g:1","description":"overwet-protect","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:overwet-protect-on', '{"siid":7,"piid":6,"type":"urn:deerma-spec:property:overwet-protect-on:00000006:deerma-jsq2g:1","description":"overwet-protect-on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('custom:constant-protect', '{"siid":7,"piid":7,"type":"urn:deerma-spec:property:constant-protect:00000007:deerma-jsq2g:1","description":"constant-protect","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('custom:constant-protect-on', '{"siid":7,"piid":8,"type":"urn:deerma-spec:property:constant-protect-on:00000008:deerma-jsq2g:1","description":"constant-protect-on","format":"bool","access":["read","notify","write"]}');
  }

  initDeviceActions() {
    this.addActionByString('humidifier:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:deerma-jsq2g:1","description":"Toggle","in":[1],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('custom:bring-water-tank', '{"siid":7,"eiid":1,"type":"urn:deerma-spec:event:bring-water-tank:00005001:deerma-jsq2g:1","description":"bring-water-tank","arguments":[1]}');
    this.addEventByString('custom:lack-of-water', '{"siid":7,"eiid":2,"type":"urn:deerma-spec:event:lack-of-water:00005002:deerma-jsq2g:1","description":"lack-of-water","arguments":[2]}');
    this.addEventByString('custom:humidity-fault', '{"siid":7,"eiid":3,"type":"urn:deerma-spec:event:humidity-fault:00005003:deerma-jsq2g:1","description":"humidity-fault","arguments":[3]}');
    this.addEventByString('custom:temperature-fault', '{"siid":7,"eiid":4,"type":"urn:deerma-spec:event:temperature-fault:00005004:deerma-jsq2g:1","description":"temperature-fault","arguments":[4]}');
    this.addEventByString('custom:overwet-protect-dow', '{"siid":7,"eiid":5,"type":"urn:deerma-spec:event:overwet-protect-dow:00005005:deerma-jsq2g:1","description":"overwet-protect-dow","arguments":[5]}');
    this.addEventByString('custom:overwet-protect-cut', '{"siid":7,"eiid":6,"type":"urn:deerma-spec:event:overwet-protect-cut:00005006:deerma-jsq2g:1","description":"overwet-protect-cut","arguments":[5]}');
    this.addEventByString('custom:constant-protect-cut', '{"siid":7,"eiid":7,"type":"urn:deerma-spec:event:constant-protect-cut:00005007:deerma-jsq2g:1","description":"constant-protect-cut","arguments":[7]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = DeermaHumidifierJsq2g;

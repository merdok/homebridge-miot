const HumidifierDevice = require('../HumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ZhimiHumidifierCa4 extends HumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mijia Pure Smart Humidifier';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:humidifier:0000A00E:zhimi-ca4:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:humidifier:00007818:zhimi-ca4:1","description":"Humidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:zhimi-ca4:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:zhimi-ca4:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:screen:00007806:zhimi-ca4:1","description":"Screen"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:zhimi-ca4:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":7,"type":"urn:zhimi-spec:service:other:00007801:zhimi-ca4:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('humidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:zhimi-ca4:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('humidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:zhimi-ca4:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueRange":[0,15,1]}');
    this.addPropertyByString('humidifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:zhimi-ca4:1","description":"风机档位","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"}]}');
    this.addPropertyByString('humidifier:target-humidity', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-humidity:00000022:zhimi-ca4:1","description":"设定湿度","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[30,80,1]}');
    this.addPropertyByString('humidifier:water-level', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:water-level:0000003D:zhimi-ca4:1","description":"Water Level","format":"uint8","access":["read","notify"],"valueRange":[0,128,1]}');
    this.addPropertyByString('humidifier:speed-level', '{"siid":2,"piid":11,"type":"urn:miot-spec-v2:property:speed-level:00000023:zhimi-ca4:1","description":"设定速度","format":"int32","access":["read","write","notify"],"unit":"none","valueRange":[200,2000,10]}');
    this.addPropertyByString('humidifier:dry', '{"siid":2,"piid":8,"type":"urn:zhimi-spec:property:dry:00000001:zhimi-ca4:1","description":"","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('humidifier:use-time', '{"siid":2,"piid":9,"type":"urn:zhimi-spec:property:use-time:00000002:zhimi-ca4:1","description":"","format":"int32","access":["read","notify"],"valueRange":[0,2147483600,1]}');
    this.addPropertyByString('humidifier:button-pressed', '{"siid":2,"piid":10,"type":"urn:zhimi-spec:property:button-pressed:00000003:zhimi-ca4:1","description":"按键信息","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"none"},{"value":1,"description":"led"},{"value":2,"description":"power"}]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:zhimi-ca4:1","description":"温度","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-40,125,0.1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":9,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:zhimi-ca4:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:fahrenheit', '{"siid":3,"piid":8,"type":"urn:zhimi-spec:property:fahrenheit:00000001:zhimi-ca4:1","description":"","format":"float","access":["read","notify"],"valueRange":[-40,257,0.1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:zhimi-ca4:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('screen:brightness', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:zhimi-ca4:1","description":"亮度","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueList":[{"value":0,"description":"Dark"},{"value":1,"description":"Glimmer"},{"value":2,"description":"Brightest"}]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:zhimi-ca4:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('other:actual-speed', '{"siid":7,"piid":1,"type":"urn:zhimi-spec:property:actual-speed:00000001:zhimi-ca4:1","description":"","format":"uint32","access":["read"],"valueRange":[0,2000,1]}');
    this.addPropertyByString('other:power-time', '{"siid":7,"piid":3,"type":"urn:zhimi-spec:property:power-time:00000003:zhimi-ca4:1","description":"","format":"uint32","access":["read"],"unit":"seconds","valueRange":[0,4294967295,1]}');
    this.addPropertyByString('other:country-code', '{"siid":7,"piid":4,"type":"urn:zhimi-spec:property:country-code:00000002:zhimi-ca4:2","description":"country-code","format":"uint32","access":["read","notify","write"],"unit":"none","valueList":[{"value":0,"description":"0未知"},{"value":1,"description":"US美国"},{"value":82,"description":"KR韩国"},{"value":44,"description":"EU欧洲"},{"value":81,"description":"JP日本"},{"value":7,"description":"RU俄罗斯"},{"value":86,"description":"CN中国"},{"value":852,"description":"HK中国香港"},{"value":886,"description":"TW中国台湾"},{"value":33,"description":"FR法国"}]}');
    this.addPropertyByString('other:clean', '{"siid":7,"piid":5,"type":"urn:zhimi-spec:property:clean:00000004:zhimi-ca4:2","description":"clean","format":"bool","access":["read","notify","write"],"unit":"none"}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    this.addEventByString('humidifier:low-water-level', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:low-water-level:0000500A:zhimi-ca4:1","description":"Low Water Level","arguments":[]}');
    this.addEventByString('other:status-report', '{"siid":7,"eiid":1,"type":"urn:zhimi-spec:event:status-report:00005001:zhimi-ca4:1","description":"聚合上报","arguments":[3]}');
    this.addEventByString('other:water-box-off', '{"siid":7,"eiid":2,"type":"urn:zhimi-spec:event:water-box-off:00005002:zhimi-ca4:1","description":"水箱分离","arguments":[]}');
    this.addEventByString('other:child-lock-trigger', '{"siid":7,"eiid":3,"type":"urn:zhimi-spec:event:child-lock-trigger:00005003:zhimi-ca4:1","description":"童锁上报","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ZhimiHumidifierCa4;

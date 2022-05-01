const DehumidifierDevice = require('../DehumidifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class NwtDerh312en extends DehumidifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Widetech Dehumidifier';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:dehumidifier:0000A02D:nwt-312en:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:dehumidifier:00007841:nwt-312en:1","description":"Dehumidifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:nwt-312en:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:alarm:00007804:nwt-312en:1","description":"Alarm"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:nwt-312en:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:physical-controls-locked:00007807:nwt-312en:1","description":"Physical Control Locked"}');
    this.createServiceByString('{"siid":7,"type":"urn:nwt-spec:service:event-service:00007801:nwt-312en:1","description":"事件上报服务"}');
    this.createServiceByString('{"siid":8,"type":"urn:nwt-spec:service:timer-service:00007802:nwt-312en:1","description":"本地定时服务"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('dehumidifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:nwt-312en:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('dehumidifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:nwt-312en:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No faults"}]}');
    this.addPropertyByString('dehumidifier:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:nwt-312en:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Smart"},{"value":2,"description":"Clothes Drying"}]}');
    this.addPropertyByString('dehumidifier:target-humidity', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:target-humidity:00000022:nwt-312en:1","description":"Target Humidity","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":30,"description":"Continue"},{"value":40,"description":"Humidity 40"},{"value":50,"description":"Humidity 50"},{"value":60,"description":"Humidity 60"},{"value":70,"description":"Humidity 70"}]}');
    this.addPropertyByString('dehumidifier:fan-level', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:fan-level:00000016:nwt-312en:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Level1"}]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:nwt-312en:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:nwt-312en:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('alarm:alarm', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:alarm:00000012:nwt-312en:1","description":"Alarm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:nwt-312en:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('physical-controls-locked:physical-controls-locked', '{"siid":6,"piid":1,"type":"urn:miot-spec-v2:property:physical-controls-locked:0000001D:nwt-312en:1","description":"Physical Control Locked","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('event-service:coil-temp', '{"siid":7,"piid":1,"type":"urn:nwt-spec:property:coil-temp:00000001:nwt-312en:1","description":"铜管温度","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,200,1]}');
    this.addPropertyByString('event-service:compressor-status', '{"siid":7,"piid":2,"type":"urn:nwt-spec:property:compressor-status:00000002:nwt-312en:1","description":"压缩机工作状态","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('event-service:water-tank-status', '{"siid":7,"piid":3,"type":"urn:nwt-spec:property:water-tank-status:00000003:nwt-312en:1","description":"水箱满或移除","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('event-service:defrost-status', '{"siid":7,"piid":4,"type":"urn:nwt-spec:property:defrost-status:00000004:nwt-312en:1","description":"除霜工作状态","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('timer-service:timer', '{"siid":8,"piid":1,"type":"urn:nwt-spec:property:timer:00000001:nwt-312en:1","description":"定时剩余时间","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('timer-service:timer-setting', '{"siid":8,"piid":2,"type":"urn:nwt-spec:property:timer-setting:00000002:nwt-312en:1","description":"本地定时设置","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":""},{"value":1,"description":""},{"value":2,"description":""},{"value":4,"description":""},{"value":8,"description":""},{"value":12,"description":""}]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('event-service:tank-full-removed', '{"siid":7,"eiid":1,"type":"urn:nwt-spec:event:tank-full-removed:00005001:nwt-312en:1","description":"水箱移除","arguments":[]}');
    this.addEventByString('event-service:indoor-t-sensor-err', '{"siid":7,"eiid":2,"type":"urn:nwt-spec:event:indoor-t-sensor-err:00005002:nwt-312en:1","description":"室温传感器故障","arguments":[]}');
    this.addEventByString('event-service:coil-t-err', '{"siid":7,"eiid":3,"type":"urn:nwt-spec:event:coil-t-err:00005003:nwt-312en:1","description":"铜管传感器故障","arguments":[]}');
    this.addEventByString('event-service:humid-sensor-err', '{"siid":7,"eiid":4,"type":"urn:nwt-spec:event:humid-sensor-err:00005004:nwt-312en:1","description":"湿度传感器故障","arguments":[]}');
    this.addEventByString('event-service:com-err', '{"siid":7,"eiid":5,"type":"urn:nwt-spec:event:com-err:00005005:nwt-312en:1","description":"通讯故障","arguments":[]}');
    this.addEventByString('event-service:frz-sys-err', '{"siid":7,"eiid":6,"type":"urn:nwt-spec:event:frz-sys-err:00005006:nwt-312en:1","description":"冷冻系统异常","arguments":[]}');
    this.addEventByString('event-service:filter-clean', '{"siid":7,"eiid":7,"type":"urn:nwt-spec:event:filter-clean:00005007:nwt-312en:1","description":"滤芯清洗提醒","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  targetHumidityMinVal() {
    return 30;
  }

  targetHumidityMaxVal() {
    return 70;
  }

  targetHumidityStepVal() {
    return 10;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = NwtDerh312en;

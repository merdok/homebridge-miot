const AirMonitorDevice = require('../AirMonitorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CgllcAirmCgdn1 extends AirMonitorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Qingping Air Monitor Lite';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-monitor:0000A008:cgllc-cgdn1:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-monitor:00007812:cgllc-cgdn1:1","description":"Air Monitor"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:cgllc-cgdn1:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:battery:00007805:cgllc-cgdn1:1","description":"Battery"}');
    this.createServiceByString('{"siid":8,"type":"urn:cgllc-spec:service:mac:00007801:cgllc-cgdn1:1","description":"mac"}');
    this.createServiceByString('{"siid":9,"type":"urn:cgllc-spec:service:settings:00007802:cgllc-cgdn1:1","description":"settings"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:cgllc-cgdn1:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:cgllc-cgdn1:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:pm10-density', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:pm10-density:00000035:cgllc-cgdn1:1","description":"PM10 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:cgllc-cgdn1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.00001]}');
    this.addPropertyByString('environment:co2-density', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:co2-density:0000004B:cgllc-cgdn1:1","description":"CO2 Density","format":"uint16","access":["read","notify"],"unit":"ppm","valueRange":[0,9999,1]}');
    this.addPropertyByString('battery:battery-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:cgllc-cgdn1:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:cgllc-cgdn1:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"},{"value":3,"description":"Not chargeable"}]}');
    this.addPropertyByString('battery:voltage', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:voltage:00000031:cgllc-cgdn1:1","description":"Voltage","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('mac:mac', '{"siid":8,"piid":1,"type":"urn:cgllc-spec:property:mac:00000001:cgllc-cgdn1:1","description":"mac","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('settings:start-time', '{"siid":9,"piid":2,"type":"urn:cgllc-spec:property:start-time:00000002:cgllc-cgdn1:1","description":"start-time","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('settings:end-time', '{"siid":9,"piid":3,"type":"urn:cgllc-spec:property:end-time:00000003:cgllc-cgdn1:1","description":"end-time","format":"int32","access":["write","read","notify"],"unit":"none","valueRange":[0,2147483647,1]}');
    this.addPropertyByString('settings:monitoring-frequency', '{"siid":9,"piid":4,"type":"urn:cgllc-spec:property:monitoring-frequency:00000004:cgllc-cgdn1:1","description":"monitoring-frequency","format":"uint16","access":["read","notify","write"],"unit":"seconds","valueList":[{"value":1,"description":"Second"},{"value":60,"description":"Second"},{"value":300,"description":"Second"},{"value":600,"description":"Second"},{"value":0,"description":"Null"}]}');
    this.addPropertyByString('settings:screen-off', '{"siid":9,"piid":5,"type":"urn:cgllc-spec:property:screen-off:00000005:cgllc-cgdn1:1","description":"screen-off","format":"uint16","access":["write","read","notify"],"unit":"seconds","valueList":[{"value":15,"description":"Second"},{"value":30,"description":"Second"},{"value":60,"description":"Second"},{"value":300,"description":"Second"},{"value":0,"description":"Null"}]}');
    this.addPropertyByString('settings:device-off', '{"siid":9,"piid":6,"type":"urn:cgllc-spec:property:device-off:00000006:cgllc-cgdn1:1","description":"device-off","format":"int8","access":["read","notify","write"],"unit":"minutes","valueList":[{"value":15,"description":"Minute"},{"value":30,"description":"Minute"},{"value":60,"description":"Minute"},{"value":0,"description":"Null"}]}');
    this.addPropertyByString('settings:tempature-unit', '{"siid":9,"piid":7,"type":"urn:cgllc-spec:property:tempature-unit:00000007:cgllc-cgdn1:1","description":"tempature-unit","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('settings:screensaver-time', '{"siid":9,"piid":8,"type":"urn:cgllc-spec:property:screensaver-time:00000001:cgllc-cgdn1:2","description":"screensaver-time","format":"uint16","access":["read","notify","write"],"unit":"seconds","valueRange":[0,1800,1]}');
    this.addPropertyByString('settings:time-zone', '{"siid":9,"piid":9,"type":"urn:cgllc-spec:property:time-zone:00000008:cgllc-cgdn1:2","description":"time-zone","format":"int16","access":["read","notify","write"],"unit":"none","valueRange":[-240,240,1]}');
    this.addPropertyByString('settings:auto-slideing-time', '{"siid":9,"piid":10,"type":"urn:cgllc-spec:property:auto-slideing-time:00000009:cgllc-cgdn1:2","description":"auto-slideing-time","format":"uint16","access":["read","notify","write"],"unit":"seconds","valueRange":[0,3600,1]}');
    this.addPropertyByString('settings:screensaver-type', '{"siid":9,"piid":11,"type":"urn:cgllc-spec:property:screensaver-type:0000000a:cgllc-cgdn1:2","description":"screensaver-type","format":"uint8","access":["read","write","notify"],"valueRange":[0,10,1]}');
    this.addPropertyByString('settings:page-sequence', '{"siid":9,"piid":12,"type":"urn:cgllc-spec:property:page-sequence:0000000b:cgllc-cgdn1:2","description":"page-sequence","format":"string","access":["read","write","notify"]}');
    this.addPropertyByString('settings:temp-led-th', '{"siid":9,"piid":13,"type":"urn:cgllc-spec:property:temp-led-th:0000000c:cgllc-cgdn1:2","description":"temp-led-th","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('settings:humi-led-th', '{"siid":9,"piid":14,"type":"urn:cgllc-spec:property:humi-led-th:0000000d:cgllc-cgdn1:2","description":"humi-led-th","format":"string","access":["write","notify","read"]}');
    this.addPropertyByString('settings:carbondioxide-led-th', '{"siid":9,"piid":15,"type":"urn:cgllc-spec:property:carbondioxide-led-th:0000000e:cgllc-cgdn1:2","description":"carbondioxide-led-th","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('settings:pm-tpf-led-th', '{"siid":9,"piid":16,"type":"urn:cgllc-spec:property:pm-tpf-led-th:0000000f:cgllc-cgdn1:2","description":"pm-tpf-led-th","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('settings:pm-t-led-th', '{"siid":9,"piid":17,"type":"urn:cgllc-spec:property:pm-t-led-th:00000010:cgllc-cgdn1:2","description":"pm-t-led-th","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('settings:device-off-new', '{"siid":9,"piid":18,"type":"urn:cgllc-spec:property:device-off-new:00000011:cgllc-cgdn1:2","description":"device-off-new","format":"uint16","access":["read","notify","write"],"unit":"seconds","valueRange":[0,65535,1]}');
  }

  initDeviceActions() {
    this.addActionByString('settings:set-start-time', '{"siid":9,"aiid":2,"type":"urn:cgllc-spec:action:set-start-time:00002802:cgllc-cgdn1:1","description":"set-start-time","in":[2],"out":[2]}');
    this.addActionByString('settings:set-end-time', '{"siid":9,"aiid":3,"type":"urn:cgllc-spec:action:set-end-time:00002803:cgllc-cgdn1:1","description":"set-end-time","in":[3],"out":[3]}');
    this.addActionByString('settings:set-frequency', '{"siid":9,"aiid":4,"type":"urn:cgllc-spec:action:set-frequency:00002804:cgllc-cgdn1:1","description":"set-frequency","in":[4],"out":[4]}');
    this.addActionByString('settings:set-screen-off', '{"siid":9,"aiid":5,"type":"urn:cgllc-spec:action:set-screen-off:00002805:cgllc-cgdn1:1","description":"set-screen-off","in":[5],"out":[5]}');
    this.addActionByString('settings:set-device-off', '{"siid":9,"aiid":6,"type":"urn:cgllc-spec:action:set-device-off:00002806:cgllc-cgdn1:1","description":"set-device-off","in":[6],"out":[6]}');
    this.addActionByString('settings:set-temp-unit', '{"siid":9,"aiid":7,"type":"urn:cgllc-spec:action:set-temp-unit:00002807:cgllc-cgdn1:1","description":"set-temp-unit","in":[7],"out":[7]}');
    this.addActionByString('settings:reset-carbon-dioxide', '{"siid":9,"aiid":8,"type":"urn:cgllc-spec:action:reset-carbon-dioxide:00002801:cgllc-cgdn1:2","description":"reset-carbon-dioxide","in":[],"out":[]}');
    this.addActionByString('settings:set-screensaver-time', '{"siid":9,"aiid":9,"type":"urn:cgllc-spec:action:set-screensaver-time:00002808:cgllc-cgdn1:2","description":"set-screensaver-time","in":[8],"out":[8]}');
    this.addActionByString('settings:set-time-zone', '{"siid":9,"aiid":10,"type":"urn:cgllc-spec:action:set-time-zone:00002809:cgllc-cgdn1:2","description":"set-time-zone","in":[9],"out":[9]}');
    this.addActionByString('settings:set-autoslideingtime', '{"siid":9,"aiid":11,"type":"urn:cgllc-spec:action:set-autoslideingtime:0000280a:cgllc-cgdn1:2","description":"set-autoslideingtime","in":[10],"out":[10]}');
    this.addActionByString('settings:set-screensaver-type', '{"siid":9,"aiid":12,"type":"urn:cgllc-spec:action:set-screensaver-type:0000280b:cgllc-cgdn1:2","description":"set-screensaver-type","in":[11],"out":[11]}');
    this.addActionByString('settings:set-page-sequence', '{"siid":9,"aiid":13,"type":"urn:cgllc-spec:action:set-page-sequence:0000280c:cgllc-cgdn1:2","description":"set-page-sequence","in":[12],"out":[12]}');
    this.addActionByString('settings:set-temp-led-th', '{"siid":9,"aiid":14,"type":"urn:cgllc-spec:action:set-temp-led-th:0000280d:cgllc-cgdn1:2","description":"set-temp-led-th","in":[13],"out":[13]}');
    this.addActionByString('settings:set-humi-led-th', '{"siid":9,"aiid":15,"type":"urn:cgllc-spec:action:set-humi-led-th:0000280e:cgllc-cgdn1:2","description":"set-humi-led-th","in":[14],"out":[14]}');
    this.addActionByString('settings:set-co-two-led-th', '{"siid":9,"aiid":16,"type":"urn:cgllc-spec:action:set-co-two-led-th:0000280f:cgllc-cgdn1:2","description":"set-co-two-led-th","in":[15],"out":[15]}');
    this.addActionByString('settings:set-pm-tpf-led-th', '{"siid":9,"aiid":17,"type":"urn:cgllc-spec:action:set-pm-tpf-led-th:00002810:cgllc-cgdn1:2","description":"set-pm-tpf-led-th","in":[16],"out":[16]}');
    this.addActionByString('settings:set-pm-t-led-th', '{"siid":9,"aiid":18,"type":"urn:cgllc-spec:action:set-pm-t-led-th:00002811:cgllc-cgdn1:2","description":"set-pm-t-led-th","in":[17],"out":[17]}');
    this.addActionByString('settings:set-device-off-new', '{"siid":9,"aiid":19,"type":"urn:cgllc-spec:action:set-device-off-new:00002812:cgllc-cgdn1:2","description":"set-device-off-new","in":[18],"out":[18]}');
  }

  initDeviceEvents() {
    this.addEventByString('battery:low-battery', '{"siid":4,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:cgllc-cgdn1:1","description":"Low Battery","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 2;
  }

  chargingStateNotChargeableValue() {
    return 3;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CgllcAirmCgdn1;

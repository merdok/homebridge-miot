const AirMonitorDevice = require('../AirMonitorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CgllcAirmCgs1 extends AirMonitorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Qingping Air Monitor';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v1/instance?type=urn:miot-spec-v1:device:air-monitor:0000A008:cgllc-cgs1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v1:service:air-monitor:00007812:cgllc-cgs1:1","description":"Air Monitor"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v1:service:battery:00007805:cgllc-cgs1:1","description":"Battery"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v1:service:environment:0000780A:cgllc-cgs1:1","description":"Environment"}');
    this.createServiceByString('{"siid":11,"type":"urn:cgllc-spec:service:clock-alarm:00007801:cgllc-cgs1:1","description":"clock-alarm"}');
    this.createServiceByString('{"siid":10,"type":"urn:miot-spec-v1:service:sound-recognition:000078F8:cgllc-cgs1:1","description":"Sound Recognition"}');
    this.createServiceByString('{"siid":12,"type":"urn:cgllc-spec:service:settings:00007802:cgllc-cgs1:1","description":"settings"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v1:property:pm2.5-density:00000034:cgllc-cgs1:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v1:property:relative-humidity:0000000C:cgllc-cgs1:1","description":"Relative Humidity","format":"float","access":["read","notify"],"unit":"percentage","valueRange":[0,100,0.1]}');
    this.addPropertyByString('environment:co2-density', '{"siid":3,"piid":8,"type":"urn:miot-spec-v1:property:co2-density:0000004B:cgllc-cgs1:1","description":"CO2 Density","format":"float","access":["read","notify"],"unit":"ppm","valueRange":[0,10000,1]}');
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v1:property:temperature:00000020:cgllc-cgs1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}');
    this.addPropertyByString('environment:pm10-density', '{"siid":3,"piid":5,"type":"urn:miot-spec-v1:property:pm10-density:00000035:cgllc-cgs1:1","description":"PM10 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:tvoc-density', '{"siid":3,"piid":9,"type":"urn:miot-spec-v1:property:tvoc-density:00000065:cgllc-cgs1:1","description":"TVOC Density","format":"int32","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('sound-recognition:noise-decibel', '{"siid":10,"piid":2,"type":"urn:miot-spec-v1:property:noise-decibel:0000037D:cgllc-cgs1:1","description":"Noise Decibel","format":"uint8","access":["read","notify"],"unit":"dB","valueRange":[0,200,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":4,"piid":2,"type":"urn:miot-spec-v1:property:charging-state:00000015:cgllc-cgs1:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"},{"value":3,"description":"Not chargeable"}]}');
    this.addPropertyByString('clock-alarm:alarms', '{"siid":11,"piid":1,"type":"urn:cgllc-spec:property:alarms:00000001:cgllc-cgs1:1","description":"alarms","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('settings:temperature-unit', '{"siid":12,"piid":1,"type":"urn:cgllc-spec:property:temperature-unit:00000001:cgllc-cgs1:1","description":"","format":"uint16","access":["read","notify"],"valueList":[{"value":12289,"description":"CelUnit"},{"value":12290,"description":"KfcUnit"}]}');
    this.addPropertyByString('battery:battery-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v1:property:battery-level:00000014:cgllc-cgs1:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('settings:time-mode', '{"siid":12,"piid":3,"type":"urn:cgllc-spec:property:time-mode:00000003:cgllc-cgs1:1","description":"","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('settings:standard', '{"siid":12,"piid":5,"type":"urn:cgllc-spec:property:standard:00000005:cgllc-cgs1:1","description":"","format":"uint16","access":["read","notify"],"valueList":[{"value":16384,"description":"STANDARD-CN"},{"value":16385,"description":"STANDARD-US"}]}');
    this.addPropertyByString('settings:pm-sn', '{"siid":12,"piid":4,"type":"urn:cgllc-spec:property:pm-sn:00000004:cgllc-cgs1:1","description":"","format":"string","access":["read","notify"]}');
  }
    this.addPropertyByString('settings:tvoc-unit', '{"siid":12,"piid":2,"type":"urn:cgllc-spec:property:tvoc-unit:00000002:cgllc-cgs1:1","description":"","format":"uint16","access":["read","notify"],"valueList":[{"value":12296,"description":"VocIndex"},{"value":12293,"description":"PPB"},{"value":12292,"description":"MgM3"}]}');
    this.addPropertyByString('settings:sensor-states', '{"siid":12,"piid":6,"type":"urn:cgllc-spec:property:sensor-states:00000006:cgllc-cgs1:1","description":"","format":"string","access":["read","notify"]}');

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

module.exports = CgllcAirmCgs1;

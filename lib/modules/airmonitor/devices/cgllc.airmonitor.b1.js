const AirMonitorDevice = require('../AirMonitorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CgllcAirmonitorB1 extends AirMonitorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Air Quality Monitor';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-monitor:0000A008:cgllc-b1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:environment:0000780A:cgllc-b1:1","description":"Environment"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:cgllc-b1:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('environment:relative-humidity', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:cgllc-b1:1","description":"Relative Humidity","format":"float","access":["read","notify"],"unit":"percentage","valueRange":[0,100,0.1]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:cgllc-b1:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"valueRange":[0,999,0.1]}');
    this.addPropertyByString('environment:temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:cgllc-b1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-20,50,0.1]}');
    this.addPropertyByString('environment:co2-density', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:co2-density:0000004B:cgllc-b1:1","description":"CO2 Density","format":"float","access":["read","notify"],"unit":"ppm","valueRange":[400,9999,1]}');
    this.addPropertyByString('environment:tvoc-density', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:tvoc-density:00000065:cgllc-b1:1","description":"TVOC Density","format":"float","access":["read","notify"],"unit":"mg/m3","valueRange":[0.005,9.999,0.001]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:cgllc-b1:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('battery:charging-state', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:cgllc-b1:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"}]}');
  }

  initDeviceActions() {
   //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  chargingStateChargingValue() {
    return 1;
  }

  chargingStateNotChargingValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CgllcAirmonitorB1;

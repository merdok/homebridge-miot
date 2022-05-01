const AirPurifierDevice = require('../AirPurifierDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class HanyiAirpurifierKj550 extends AirPurifierDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'MiWhole Air Purifier Mix';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-purifier:0000A007:hanyi-kj550:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-purifier:00007811:hanyi-kj550:1","description":"Air Purifier"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:hanyi-kj550:1","description":"Environment"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:filter:0000780B:hanyi-kj550:1","description":"Filter"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:indicator-light:00007803:hanyi-kj550:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":6,"type":"urn:hanyi-spec:service:custom:00007801:hanyi-kj550:1","description":""}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-purifier:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:hanyi-kj550:1","description":"Switch Status","format":"bool","access":["read","write","notify"],"unit":"none"}');
    this.addPropertyByString('air-purifier:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:hanyi-kj550:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Nofaults"}]}');
    this.addPropertyByString('air-purifier:mode', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:mode:00000008:hanyi-kj550:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Sleep"},{"value":2,"description":"Manual"}]}');
    this.addPropertyByString('air-purifier:fan-level', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:fan-level:00000016:hanyi-kj550:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueRange":[0,100,1]}');
    this.addPropertyByString('air-purifier:anion', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:anion:00000025:hanyi-kj550:1","description":"Anion","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:hanyi-kj550:1","description":"PM2.5 Density","format":"uint16","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}');
    this.addPropertyByString('environment:indoor-temperature', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:indoor-temperature:0000000A:hanyi-kj550:1","description":"Indoor Temperature","format":"int16","access":["read","notify"],"unit":"celsius","valueRange":[-50,50,1]}');
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":6,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:hanyi-kj550:1","description":"Relative Humidity","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('filter:filter-left-time', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:filter-left-time:0000001F:hanyi-kj550:1","description":"Filter Left Time","format":"uint16","access":["read","notify"],"unit":"hours","valueRange":[0,3000,1]}');
    this.addPropertyByString('indicator-light:on', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:hanyi-kj550:1","description":"Switch Status","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Bright"},{"value":2,"description":"Dark"}]}');
    this.addPropertyByString('custom:childlock', '{"siid":6,"piid":1,"type":"urn:hanyi-spec:property:childlock:00000001:hanyi-kj550:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('custom:reset', '{"siid":6,"piid":2,"type":"urn:hanyi-spec:property:reset:00000002:hanyi-kj550:1","description":"","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('custom:timer', '{"siid":6,"piid":3,"type":"urn:hanyi-spec:property:timer:00000003:hanyi-kj550:1","description":"预约开设置时间","format":"uint8","access":["read","notify","write"],"unit":"none","valueRange":[0,24,1]}');
    this.addPropertyByString('custom:timer-off', '{"siid":6,"piid":4,"type":"urn:hanyi-spec:property:timer-off:00000004:hanyi-kj550:1","description":"预约关设置时间","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,24,1]}');
    this.addPropertyByString('custom:remaining-offtime', '{"siid":6,"piid":5,"type":"urn:hanyi-spec:property:remaining-offtime:00000005:hanyi-kj550:1","description":"","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:remaining-ontime', '{"siid":6,"piid":6,"type":"urn:hanyi-spec:property:remaining-ontime:00000006:hanyi-kj550:1","description":"","format":"uint32","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  autoModeValue() {
    return 0;
  }

  sleepModeValue() {
    return 1;
  }

  favoriteModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  temperatureProp() {
    return this.getProperty('environment:indoor-temperature');
  }

  physicalControlsLockedProp() {
    return this.getProperty('custom:childlock');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = HanyiAirpurifierKj550;

const KettleDevice = require('../KettleDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YunmiKettleR3 extends KettleDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yunmi Kettle';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:kettle:0000A009:yunmi-r3:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:kettle:00007813:yunmi-r3:1","description":"Kettle"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:tds-sensor:0000780D:yunmi-r3:1","description":"Total Dissolved Solids Sensor"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('kettle:temperature', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:temperature:00000020:yunmi-r3:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,100,1]}');
    this.addPropertyByString('kettle:target-temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:target-temperature:00000021:yunmi-r3:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[40,90,1]}');
    this.addPropertyByString('kettle:mode', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:mode:00000008:yunmi-r3:1","description":"Mode","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Common"},{"value":1,"description":"Warm Water"},{"value":2,"description":"Boiled Water"},{"value":3,"description":"None"}]}');
    this.addPropertyByString('tds-sensor:tds-out', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:tds-out:0000002D:yunmi-r3:1","description":"Total Dissolved Solids for Output Water","format":"uint16","access":["read","notify"],"valueRange":[0,1000,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  idleModeValue() {
    return 0;
  }

  boilWaterModeValue() {
    return 2;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YunmiKettleR3;

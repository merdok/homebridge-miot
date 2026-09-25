const OccupancySensorDevice = require('../OccupancySensorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiSensorOccupy03 extends OccupancySensorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Human Presence Sensor';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:occupancy-sensor:0000A0BF:xiaomi-03:3';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:occupancy-sensor:000078C0:xiaomi-03:1","description":"Occupancy Sensor"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:xiaomi-03:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('occupancy-sensor:occupancy-status', '{"siid":2,"piid":1078,"type":"urn:miot-spec-v2:property:occupancy-status:00000166:xiaomi-03:1","description":"Occupancy Status","format":"uint8","access":["notify","read"],"valueList":[{"value":0,"description":"No One"},{"value":1,"description":"Has One"},{"value":2,"description":"Quick Check"}]}');
    this.addPropertyByString('occupancy-sensor:illumination', '{"siid":2,"piid":1005,"type":"urn:miot-spec-v2:property:illumination:0000004E:xiaomi-03:1","description":"Illumination","format":"float","access":["notify","read"],"unit":"lux","valueRange":[0,1000,1]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1003,"type":"urn:miot-spec-v2:property:battery-level:00000014:xiaomi-03:1","description":"Battery Level","format":"uint8","access":["notify","read"],"unit":"percentage","valueRange":[0,100,1]}');
  }

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

module.exports = XiaomiSensorOccupy03;

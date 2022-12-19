const ContactSensorDevice = require('../ContactSensorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IsaMagnetDw2hl extends ContactSensorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Door and Windows Sensor 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:magnet-sensor:0000A016:isa-dw2hl:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:magnet-sensor:00007827:isa-dw2hl:1","description":"Magnet Sensor"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:isa-dw2hl:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('magnet-sensor:illumination', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:illumination:0000004E:isa-dw2hl:1","description":"Illumination","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Weak"},{"value":2,"description":"Strong"}]}');
    this.addPropertyByString('magnet-sensor:contact-state', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:contact-state:0000007C:isa-dw2hl:1","description":"Contact State","format":"bool","access":["read","notify"]}');
    this.addPropertyByString('battery:battery-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:isa-dw2hl:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
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

module.exports = IsaMagnetDw2hl;

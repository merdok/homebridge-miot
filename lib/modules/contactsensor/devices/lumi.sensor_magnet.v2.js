const ContactSensorDevice = require('../ContactSensorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiSensor_magnetV2 extends ContactSensorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Door and Window Sensor';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:magnet-sensor:0000A016:lumi-v2:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:magnet-sensor:00007827:lumi-v2:1","description":"Magnet Sensor"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:battery:00007805:lumi-v2:1","description":"Battery"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('magnet-sensor:contact-state', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:contact-state:0000007C:lumi-v2:1","description":"Contact State","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('magnet-sensor:close', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:close:00005005:lumi-v2:1","description":"Close","arguments":[]}');
    this.addEventByString('magnet-sensor:open', '{"siid":2,"eiid":2,"type":"urn:miot-spec-v2:event:open:00005004:lumi-v2:1","description":"Open","arguments":[]}');
    this.addEventByString('magnet-sensor:door-not-closed', '{"siid":2,"eiid":3,"type":"urn:miot-spec-v2:event:door-not-closed:00005006:lumi-v2:1","description":"Door Not Closed","arguments":[]}');
    this.addEventByString('battery:low-battery', '{"siid":3,"eiid":1,"type":"urn:miot-spec-v2:event:low-battery:00005003:lumi-v2:1","description":"Low Battery","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiSensor_magnetV2;

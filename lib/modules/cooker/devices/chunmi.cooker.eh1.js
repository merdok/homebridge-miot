const CookerDevice = require('../CookerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiCookerEh1 extends CookerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mijia Smart Rice Cooker 1.6 L';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:cooker:0000A00B:chunmi-eh1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:cooker:00007815:chunmi-eh1:1","description":"Cooker"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('cooker:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-eh1:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Running"},{"value":3,"description":"Keep Warm"},{"value":4,"description":"Cook Reservation"}]}');
    this.addPropertyByString('cooker:temperature', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:temperature:00000020:chunmi-eh1:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[0,170,1]}');
    this.addPropertyByString('cooker:auto-keep-warm', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:auto-keep-warm:0000002B:chunmi-eh1:1","description":"Auto Keep Warm","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('cooker:cancel-cooking', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-eh1:1","description":"Cancel Cooking","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('cooker:cooking-finished', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:cooking-finished:0000501C:chunmi-eh1:1","description":"Cooking Finished","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiCookerEh1;
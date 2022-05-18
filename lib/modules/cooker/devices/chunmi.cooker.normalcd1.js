const CookerDevice = require('../CookerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiCookerNormalcd1 extends CookerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi IH 3L Rice Cooker';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:cooker:0000A00B:chunmi-normalcd1:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:cooker:00007815:chunmi-normalcd1:1","description":"Cooker"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('cooker:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:chunmi-normalcd1:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Idle"},{"value":2,"description":"Running"},{"value":3,"description":"Keep Warm"},{"value":4,"description":"Cook Reservation"}]}');
    this.addPropertyByString('cooker:cook-mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:cook-mode:00000037:chunmi-normalcd1:1","description":"Cook Mode","format":"uint8","access":[],"valueList":[{"value":1,"description":"Fine Cook"},{"value":2,"description":"Quick Cook"},{"value":3,"description":"Cook Congee"},{"value":4,"description":"Keep Warm"}]}');
  }

  initDeviceActions() {
    this.addActionByString('cooker:start-cook', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-cook:00002806:chunmi-normalcd1:1","description":"Start Cook","in":[2],"out":[]}');
    this.addActionByString('cooker:cancel-cooking', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:chunmi-normalcd1:1","description":"Cancel Cooking","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('cooker:cooking-finished', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:cooking-finished:0000501C:chunmi-normalcd1:1","description":"Cooking Finished","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = ChunmiCookerNormalcd1;

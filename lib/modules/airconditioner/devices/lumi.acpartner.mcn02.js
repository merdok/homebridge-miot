const AirConditionerDevice = require('../AirConditionerDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiAcpartnerMcn02 extends AirConditionerDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Air Conditioner Companion 2';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-conditioner:0000A004:lumi-mcn02:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-conditioner:0000780F:lumi-mcn02:1","description":"Air Conditioner"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:fan-control:00007809:lumi-mcn02:1","description":"Fan Control"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-conditioner:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:lumi-mcn02:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('air-conditioner:mode', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:mode:00000008:lumi-mcn02:1","description":"Mode","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Cool"},{"value":2,"description":"Dry"},{"value":3,"description":"Heat"},{"value":4,"description":"Fan"}]}');
    this.addPropertyByString('air-conditioner:target-temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:target-temperature:00000021:lumi-mcn02:1","description":"Target Temperature","format":"float","access":["read","write","notify"],"unit":"celsius","valueRange":[16,30,1]}');
    this.addPropertyByString('fan-control:fan-level', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:fan-level:00000016:lumi-mcn02:1","description":"Fan Level","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Low"},{"value":2,"description":"Medium"},{"value":3,"description":"High"}]}');
    this.addPropertyByString('fan-control:vertical-swing', '{"siid":3,"piid":2,"type":"urn:miot-spec-v2:property:vertical-swing:00000018:lumi-mcn02:1","description":"Vertical Swing","format":"bool","access":["read","write","notify"]}');
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

  heatModeValue() {
    return 3;
  }

  coolModeValue() {
    return 1;
  }

  dryModeValue() {
    return 2;
  }

  fanModeValue() {
    return 4;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiAcpartnerMcn02;

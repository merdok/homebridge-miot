const GenericDevice = require('../../generic/GenericDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


// ymt.flowerpot.test01 - a hydroponic planter (see issue #773).
//
// This device lives in the `quirks` module rather than getting a dedicated
// device type: it has no tailored accessory and simply reuses the Generic
// device/accessory machinery (it inherits getType() => GENERIC). The only
// reason this file exists is to encode two device-specific quirks that the
// generic fallback cannot know about:
//
//   1. The firmware cannot handle multi-property reads at all: any
//      get_properties request with more than one property comes back as
//      malformed JSON (".../value":0properties_changed"), so every reading
//      ends up 0. allPropRequestChunkSize() is forced to 1 so each property
//      is polled on its own and the device never needs manual configuration.
//   2. The device is slow and returns -30012 "busy." under load; sequential
//      polling (MiotDevice.requestAllProperties) plus the -30012 retry handle
//      that, so nothing extra is needed here.
//
// Declaring the spec inline (instead of relying on the fetched spec) lets the
// generic accessory expose the controls/sensors by name without a MiCloud
// round-trip, and pins the definition against this test01/debug model.
class YmtFlowerpotTest01 extends GenericDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Flowerpot';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:flowerpot:0000A047:ymt-test01:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }

  allPropRequestChunkSize() {
    return 1; // firmware returns malformed JSON for multi-property reads; poll one at a time (issue #773)
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:flowerpot:00007888:ymt-test01:1","description":"Flowerpot"}');
    this.createServiceByString('{"siid":6,"type":"urn:miot-spec-v2:service:plant-monitor:0000784B:ymt-test01:1","description":"Plant Monitor"}');
    this.createServiceByString('{"siid":3,"type":"urn:ymt-spec:service:data:00007801:ymt-test01:1","description":"data"}');
    this.createServiceByString('{"siid":4,"type":"urn:ymt-spec:service:safe:00007802:ymt-test01:1","description":"safe"}');
    this.createServiceByString('{"siid":5,"type":"urn:ymt-spec:service:othersetting:00007803:ymt-test01:1","description":"othersetting"}');
    this.createServiceByString('{"siid":7,"type":"urn:ymt-spec:service:fill-light:00007804:ymt-test01:1","description":"fill-light"}');
  }

  initDeviceProperties() {
    // flowerpot service
    this.addPropertyByString('flowerpot:mode', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:mode:00000008:ymt-test01:1","description":"Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Manual"}]}');
    this.addPropertyByString('flowerpot:watering', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:watering:000000CC:ymt-test01:1","description":"Watering","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('flowerpot:fault', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:fault:00000009:ymt-test01:1","description":"Device Fault","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"No Faults"}]}');
    this.addPropertyByString('flowerpot:on', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:on:00000006:ymt-test01:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    // plant-monitor service (sensors)
    this.addPropertyByString('plant-monitor:temperature', '{"siid":6,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:ymt-test01:1","description":"Temperature","format":"int8","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('plant-monitor:illumination', '{"siid":6,"piid":6,"type":"urn:miot-spec-v2:property:illumination:0000004E:ymt-test01:1","description":"Illumination","format":"int32","access":["read","notify"],"unit":"lux","valueRange":[0,80000,1]}');
    // data service
    this.addPropertyByString('data:water-count', '{"siid":3,"piid":6,"type":"urn:ymt-spec:property:water-count:00000006:ymt-test01:1","description":"water-count","format":"uint16","access":["read","notify"],"valueRange":[0,65535,1]}');
    this.addPropertyByString('data:type', '{"siid":3,"piid":7,"type":"urn:ymt-spec:property:type:00000007:ymt-test01:1","description":"type","format":"int8","access":["read","notify","write"],"valueRange":[-1,19,1]}');
    this.addPropertyByString('data:type-new', '{"siid":3,"piid":8,"type":"urn:ymt-spec:property:type-new:00000001:ymt-test01:1","description":"type-new","format":"int16","access":["read","notify","write"],"valueRange":[-1,1024,1]}');
    this.addPropertyByString('data:custom-name', '{"siid":3,"piid":9,"type":"urn:ymt-spec:property:custom-name:00000002:ymt-test01:1","description":"custom-name","format":"string","access":["read","notify","write"]}');
    // safe service
    this.addPropertyByString('safe:safe-temperature', '{"siid":4,"piid":1,"type":"urn:ymt-spec:property:safe-temperature:00000001:ymt-test01:1","description":"safe-temperature","format":"string","access":["read","notify","write"]}');
    this.addPropertyByString('safe:safe-illumination', '{"siid":4,"piid":3,"type":"urn:ymt-spec:property:safe-illumination:00000003:ymt-test01:1","description":"safe-illumination","format":"string","access":["read","notify","write"]}');
    // othersetting service
    this.addPropertyByString('othersetting:light', '{"siid":5,"piid":1,"type":"urn:ymt-spec:property:light:00000001:ymt-test01:1","description":"light","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('othersetting:start-date', '{"siid":5,"piid":2,"type":"urn:ymt-spec:property:start-date:00000002:ymt-test01:1","description":"start-date","format":"string","access":["read","notify"],"unit":"seconds"}');
    this.addPropertyByString('othersetting:water-count', '{"siid":5,"piid":5,"type":"urn:ymt-spec:property:water-count:00000005:ymt-test01:1","description":"water-count","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,32767,1]}');
    this.addPropertyByString('othersetting:cumulative-harvest', '{"siid":5,"piid":6,"type":"urn:ymt-spec:property:cumulative-harvest:00000006:ymt-test01:1","description":"cumulative-harvest","format":"uint16","access":["read","notify","write"],"unit":"none","valueRange":[0,65535,1]}');
    this.addPropertyByString('othersetting:report-night', '{"siid":5,"piid":9,"type":"urn:ymt-spec:property:report-night:00000009:ymt-test01:1","description":"report-night","format":"bool","access":["read","notify","write"]}');
    // fill-light service (grow light)
    this.addPropertyByString('fill-light:on', '{"siid":7,"piid":1,"type":"urn:ymt-spec:property:on:00000001:ymt-test01:1","description":"on","format":"bool","access":["read","notify","write"]}');
    this.addPropertyByString('fill-light:mode', '{"siid":7,"piid":2,"type":"urn:ymt-spec:property:mode:00000002:ymt-test01:1","description":"mode","format":"int8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Auto"},{"value":1,"description":"Manual"}]}');
  }

  initDeviceActions() {
    // no actions defined by the spec
  }

  initDeviceEvents() {
    // no events defined by the spec
  }


}

module.exports = YmtFlowerpotTest01;

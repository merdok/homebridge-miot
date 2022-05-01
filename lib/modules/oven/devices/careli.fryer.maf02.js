const OvenDevice = require('../OvenDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CareliFryerMaf02 extends OvenDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Mi Smart Air Fryer';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-fryer:0000A0A4:careli-maf02:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-fryer:00007897:careli-maf02:1","description":"Air Fryer"}');
    this.createServiceByString('{"siid":3,"type":"urn:careli-spec:service:custom:00007801:careli-maf02:1","description":"custom"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('air-fryer:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:careli-maf02:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Shutdown"},{"value":1,"description":"Standby"},{"value":2,"description":"Pause"},{"value":3,"description":"Appointment"},{"value":4,"description":"Cooking"},{"value":5,"description":"Preheat "},{"value":6,"description":"Cooked"},{"value":7,"description":"Preheat Finish"},{"value":8,"description":"Preheat Pause"},{"value":9,"description":"Pause2"}]}');
    this.addPropertyByString('air-fryer:fault', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:fault:00000009:careli-maf02:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"No Faults"},{"value":1,"description":"E1"},{"value":2,"description":"E2"}]}');
    this.addPropertyByString('air-fryer:target-time', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:target-time:00000078:careli-maf02:1","description":"Target Time","format":"uint16","access":["read","write","notify"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('air-fryer:target-temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:target-temperature:00000021:careli-maf02:1","description":"Target Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[40,200,1]}');
    this.addPropertyByString('air-fryer:left-time', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:left-time:0000003C:careli-maf02:1","description":"Left Time","format":"uint16","access":["read","notify"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:recipe-id', '{"siid":3,"piid":1,"type":"urn:careli-spec:property:recipe-id:00000001:careli-maf02:1","description":"recipe-id","format":"string","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('custom:work-time', '{"siid":3,"piid":3,"type":"urn:careli-spec:property:work-time:00000003:careli-maf02:1","description":"work-time","format":"uint16","access":["write"],"unit":"minutes","valueRange":[1,1440,1]}');
    this.addPropertyByString('custom:work-temp', '{"siid":3,"piid":4,"type":"urn:careli-spec:property:work-temp:00000004:careli-maf02:1","description":"work-temp","format":"uint8","access":["write"],"unit":"celsius","valueRange":[40,200,1]}');
    this.addPropertyByString('custom:appoint-time', '{"siid":3,"piid":5,"type":"urn:careli-spec:property:appoint-time:00000005:careli-maf02:1","description":"appoint-time","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:food-quanty', '{"siid":3,"piid":6,"type":"urn:careli-spec:property:food-quanty:00000006:careli-maf02:1","description":"food-quanty","format":"uint8","access":["write","read","notify"],"unit":"none","valueList":[{"value":0,"description":"Null"},{"value":1,"description":"Single"},{"value":2,"description":"Double"},{"value":3,"description":"Half"},{"value":4,"description":"Full"}]}');
    this.addPropertyByString('custom:preheat-switch', '{"siid":3,"piid":7,"type":"urn:careli-spec:property:preheat-switch:00000007:careli-maf02:1","description":"preheat-switch","format":"uint8","access":["read","notify","write"],"valueList":[{"value":0,"description":"Null"},{"value":1,"description":"Off"},{"value":2,"description":"On"}]}');
    this.addPropertyByString('custom:appoint-time-left', '{"siid":3,"piid":8,"type":"urn:careli-spec:property:appoint-time-left:00000008:careli-maf02:1","description":"appoint-time-left","format":"uint16","access":["read","notify","write"],"unit":"minutes","valueRange":[0,1440,1]}');
    this.addPropertyByString('custom:turn-pot', '{"siid":3,"piid":10,"type":"urn:careli-spec:property:turn-pot:0000000a:careli-maf02:1","description":"turn-pot","format":"uint8","access":["read","notify","write"],"valueList":[{"value":1,"description":"Switch Off"},{"value":0,"description":"Not Turn Pot"},{"value":2,"description":"Turn Pot"}]}');
  }

  initDeviceActions() {
    this.addActionByString('air-fryer:start-cook', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:start-cook:00002806:careli-maf02:1","description":"Start Cook","in":[],"out":[]}');
    this.addActionByString('air-fryer:cancel-cooking', '{"siid":2,"aiid":2,"type":"urn:miot-spec-v2:action:cancel-cooking:00002807:careli-maf02:1","description":"Cancel Cooking","in":[],"out":[]}');
    this.addActionByString('air-fryer:pause', '{"siid":2,"aiid":3,"type":"urn:miot-spec-v2:action:pause:0000280C:careli-maf02:1","description":"Pause","in":[],"out":[]}');
    this.addActionByString('custom:start-custom-cook', '{"siid":3,"aiid":1,"type":"urn:careli-spec:action:start-custom-cook:00002801:careli-maf02:1","description":"start-custom-cook","in":[1,3,4,5,6,7],"out":[]}');
    this.addActionByString('custom:resume-cooking', '{"siid":3,"aiid":2,"type":"urn:careli-spec:action:resume-cooking:00002802:careli-maf02:1","description":"resume-cooking","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('air-fryer:cooking-finished', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:cooking-finished:0000501C:careli-maf02:1","description":"Cooking Finished","arguments":[]}');
    this.addEventByString('custom:cooking-start', '{"siid":3,"eiid":1,"type":"urn:careli-spec:event:cooking-start:00005001:careli-maf02:1","description":"cooking-start","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 4;
  }

  statusPausedValue() {
    return 2;
  }

  statusCompletedValue() {
    return 6;
  }

  statusSleepValue() {
    return 0;
  }

  statusPreheatValue() {
    return 5;
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  statusProp() {
    return this.getProperty('air-fryer:status');
  }

  faultProp() {
    return this.getProperty('air-fryer:fault');
  }

  targetTemperatureProp() {
    return this.getProperty('air-fryer:target-temperature');
  }

  targetTimeProp() {
    return this.getProperty('air-fryer:target-time');
  }

  leftTimeProp() {
    return this.getProperty('air-fryer:left-time');
  }


  /*----------========== ACTION OVERRIDES ==========----------*/

  startCookAction() {
    return this.getAction('air-fryer:start-cook');
  }

  cancelCookAction() {
    return this.getAction('air-fryer:cancel-cooking');
  }

  pauseCookAction() {
    return this.getAction('air-fryer:pause');
  }

  resumeCookAction() {
    return this.getAction('custom:resume-cookinge');
  }


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = CareliFryerMaf02;

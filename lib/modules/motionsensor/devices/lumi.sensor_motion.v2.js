const MotionSensorDevice = require('../MotionSensorDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LumiSensor_motionV2 extends MotionSensorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Human Body Movement Sensor';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:motion-sensor:0000A014:lumi-v2:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:motion-sensor:00007825:lumi-v2:1","description":"Motion Sensor"}');
  }

  initDeviceProperties() {
    const newProp = this.addPropertyByString('motion-sensor:motion-state', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:motion-state:0000007D:lumi-v2:1","description":"Motion State","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    this.addEventByString('motion-sensor:motion-detected', '{"siid":2,"eiid":1,"type":"urn:miot-spec-v2:event:motion-detected:00005001:lumi-v2:2","description":"Motion Detected","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LumiSensor_motionV2;

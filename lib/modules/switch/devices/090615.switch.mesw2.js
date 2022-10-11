const SwitchDevice = require('../SwitchDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class PTXSwitchSw2 extends SwitchDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'PTX Mesh intelligent two switch';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:switch:0000A003:090615-mesw2:1:0000C809';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:switch:0000780C:090615-mesw2:1:0000C809","description":"Left Switch Service"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:switch:0000780C:090615-mesw2:1:0000C809","description":"Right Switch Service"}');
    this.createServiceByString('{"siid":4,"type":"urn:090615-spec:service:switchturn:00007801:090615-mesw2:1","description":"switchturn"}');
    this.createServiceByString('{"siid":5,"type":"urn:090615-spec:service:switchturn:00007802:090615-mesw2:1","description":"switchturn"}');
    this.createServiceByString('{"siid":8,"type":"urn:090615-spec:service:setmode:00007805:090615-mesw2:1","description":"setmode"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('switch:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:090615-mesw2:1:0000C809","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switch3:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:090615-mesw2:1:0000C809","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('switchturn:turn', '{"siid":4,"piid":1,"type":"urn:090615-spec:property:turn:00000001:090615-mesw2:1","description":"switchturn","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"状态翻转"}]}');
    this.addPropertyByString('switchturn5:turn', '{"siid":5,"piid":1,"type":"urn:090615-spec:property:turn:00000001:090615-mesw2:1","description":"switchturn","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":1,"description":"状态翻转"}]}');
    this.addPropertyByString('setmode:backlight', '{"siid":8,"piid":1,"type":"urn:090615-spec:property:backlight:00000001:090615-mesw2:1","description":"Backlight","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,1,1]}');
    this.addPropertyByString('setmode:leftsmart', '{"siid":8,"piid":2,"type":"urn:090615-spec:property:leftsmart:00000002:090615-mesw2:1","description":"Left Smart","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,1,1]}');
    this.addPropertyByString('setmode:rightsmart', '{"siid":8,"piid":3,"type":"urn:090615-spec:property:rightsmart:00000003:090615-mesw2:1","description":"Right Smart","format":"uint8","access":["read","write","notify"],"unit":"none","valueRange":[0,1,1]}');
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

module.exports = PTXSwitchSw2;

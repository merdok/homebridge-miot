const LightDevice = require('../LightDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class YeelinkLightStrip6 extends LightDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Yeelight Lightstrip Plus';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:light:0000A001:yeelink-strip6:1';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return true;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:light:00007802:yeelink-strip6:1","description":"Light"}');
    this.createServiceByString('{"siid":3,"type":"urn:yeelink-spec:service:light-extension:00000001:yeelink-strip6:1","description":"Light Extension Feature"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('light:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:yeelink-strip6:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('light:brightness', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:brightness:0000000D:yeelink-strip6:1","description":"Brightness","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[1,100,1]}');
    this.addPropertyByString('light:color', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:color:0000000E:yeelink-strip6:1","description":"Color","format":"uint32","access":["read","write","notify"],"unit":"rgb","valueRange":[1,16777215,1]}');
    this.addPropertyByString('light-extension:brightness-delta', '{"siid":3,"piid":1,"type":"urn:yeelink-spec:property:brightness-delta:00000002:yeelink-strip6:1","description":"Adjust brightness","format":"int8","access":["write"],"unit":"percentage","valueRange":[-100,100,1]}');
  }

  initDeviceActions() {
    this.addActionByString('light:toggle', '{"siid":2,"aiid":1,"type":"urn:miot-spec-v2:action:toggle:00002811:yeelink-strip6:1","description":"Toggle","in":[],"out":[]}');
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = YeelinkLightStrip6;

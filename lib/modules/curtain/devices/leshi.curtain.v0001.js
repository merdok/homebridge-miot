const CurtainDevice = require('../CurtainDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class LeshiCurtainV0001 extends CurtainDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Scene Curtain WIFI X';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:curtain:0000A00C:leshi-v0001:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:curtain:00007816:leshi-v0001:1","description":"Curtain"}');
    this.createServiceByString('{"siid":3,"type":"urn:leshi-spec:service:scene:00007801:leshi-v0001:2","description":"scene"}');
    this.createServiceByString('{"siid":4,"type":"urn:leshi-spec:service:professional-setting:00007802:leshi-v0001:2","description":"professional-setting"}');
    this.createServiceByString('{"siid":5,"type":"urn:leshi-spec:service:remote:00007803:leshi-v0001:2","description":"remote"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('curtain:fault', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:fault:00000009:leshi-v0001:1","description":"Device Fault","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"Fault-free"}]}');
    this.addPropertyByString('curtain:motor-control', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:motor-control:00000038:leshi-v0001:1","description":"Motor Control","format":"uint8","access":["write"],"unit":"none","valueList":[{"value":0,"description":"Close"},{"value":1,"description":"Pause"},{"value":2,"description":"Open"}]}');
    this.addPropertyByString('curtain:on', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:on:00000006:leshi-v0001:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('curtain:motor-reverse', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:motor-reverse:00000072:leshi-v0001:1","description":"Motor Reverse","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('curtain:current-position', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:current-position:00000039:leshi-v0001:1","description":"Current Position","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('curtain:target-position', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:target-position:0000003A:leshi-v0001:1","description":"Target Position","format":"uint8","access":["read","write","notify"],"unit":"percentage","valueRange":[0,100,1]}');
    this.addPropertyByString('scene:toggle', '{"siid":3,"piid":1,"type":"urn:leshi-spec:property:toggle:00000001:leshi-v0001:2","description":"toggle","format":"bool","access":["write"]}');
    this.addPropertyByString('professional-setting:manual-operation', '{"siid":4,"piid":1,"type":"urn:leshi-spec:property:manual-operation:00000001:leshi-v0001:2","description":"manual-operation","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('professional-setting:route-settings', '{"siid":4,"piid":2,"type":"urn:leshi-spec:property:route-settings:00000002:leshi-v0001:2","description":"route-settings","format":"uint8","access":["write"],"valueList":[{"value":0,"description":"Clear-route"},{"value":1,"description":"Correction-route"}]}');
    this.addPropertyByString('professional-setting:indicatior-switch', '{"siid":4,"piid":3,"type":"urn:leshi-spec:property:indicatior-switch:00000003:leshi-v0001:2","description":"indicatior-switch","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('professional-setting:pull', '{"siid":4,"piid":4,"type":"urn:leshi-spec:property:pull:00000004:leshi-v0001:2","description":"pull","format":"uint8","access":["read","write","notify"],"valueList":[{"value":1,"description":"Level1"},{"value":2,"description":"Level2"},{"value":3,"description":"Level3"},{"value":4,"description":"Level4"},{"value":5,"description":"Level5"},{"value":6,"description":"Level6"},{"value":7,"description":"Level7"},{"value":8,"description":"Level8"},{"value":9,"description":"Level9"},{"value":10,"description":"Level10"}]}');
    this.addPropertyByString('professional-setting:curtain-style', '{"siid":4,"piid":5,"type":"urn:leshi-spec:property:curtain-style:00000005:leshi-v0001:2","description":"curtain-style","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Double"},{"value":1,"description":"Left"},{"value":2,"description":"Right"}]}');
    this.addPropertyByString('remote:remote-switch', '{"siid":5,"piid":1,"type":"urn:leshi-spec:property:remote-switch:00000001:leshi-v0001:2","description":"remote-switch","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"}]}');
    this.addPropertyByString('remote:remote-add', '{"siid":5,"piid":2,"type":"urn:leshi-spec:property:remote-add:00000002:leshi-v0001:2","description":"remote-add","format":"uint8","access":["write"],"valueList":[{"value":1,"description":"Remote-add"}]}');
    this.addPropertyByString('remote:remote-del', '{"siid":5,"piid":3,"type":"urn:leshi-spec:property:remote-del:00000003:leshi-v0001:2","description":"remote-del","format":"int32","access":["write"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-ltype', '{"siid":5,"piid":4,"type":"urn:leshi-spec:property:remote-ltype:00000004:leshi-v0001:2","description":"remote-ltype","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-htype', '{"siid":5,"piid":5,"type":"urn:leshi-spec:property:remote-htype:00000005:leshi-v0001:2","description":"remote-htype","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-a', '{"siid":5,"piid":6,"type":"urn:leshi-spec:property:remote-a:00000006:leshi-v0001:2","description":"remote-a","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-b', '{"siid":5,"piid":7,"type":"urn:leshi-spec:property:remote-b:00000007:leshi-v0001:2","description":"remote-b","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-c', '{"siid":5,"piid":8,"type":"urn:leshi-spec:property:remote-c:00000008:leshi-v0001:2","description":"remote-c","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-d', '{"siid":5,"piid":9,"type":"urn:leshi-spec:property:remote-d:00000009:leshi-v0001:2","description":"remote-d","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-e', '{"siid":5,"piid":10,"type":"urn:leshi-spec:property:remote-e:0000000a:leshi-v0001:2","description":"remote-e","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-f', '{"siid":5,"piid":11,"type":"urn:leshi-spec:property:remote-f:0000000b:leshi-v0001:2","description":"remote-f","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-g', '{"siid":5,"piid":12,"type":"urn:leshi-spec:property:remote-g:0000000c:leshi-v0001:2","description":"remote-g","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-h', '{"siid":5,"piid":13,"type":"urn:leshi-spec:property:remote-h:0000000d:leshi-v0001:2","description":"remote-h","format":"int32","access":["read","notify"],"valueRange":[-2147483648,2147483647,1]}');
    this.addPropertyByString('remote:remote-cmd', '{"siid":5,"piid":14,"type":"urn:leshi-spec:property:remote-cmd:0000000e:leshi-v0001:2","description":"remote-cmd","format":"int32","access":["notify"],"valueRange":[-2147483648,2147483647,1]}');
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no events
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  // fix status stuck in opening or closing state due to current position not equal to target position after movement
  getTargetPosition() {
    return this.getPropertyValue(this.currentPositionProp());
  }


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = LeshiCurtainV0001;

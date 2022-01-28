const CameraDevice = require('../CameraDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IsaCameraHlc7 extends CameraDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Home Magnetic Mount Outdoor Camera';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:camera:0000A01C:isa-hlc7:2';
  }


  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false;
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:camera-control:0000782F:isa-hlc7:1","description":"Camera Control"}');
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:indicator-light:00007803:isa-hlc7:1","description":"Indicator Light"}');
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:memory-card-management:0000784E:isa-hlc7:1","description":"Memory Card Management"}');
    this.createServiceByString('{"siid":5,"type":"urn:miot-spec-v2:service:motion-detection:0000784F:isa-hlc7:1","description":"Motion Detection"}');
    this.createServiceByString('{"siid":7,"type":"urn:miot-spec-v2:service:p2p-stream:00007881:isa-hlc7:1","description":"P2P Stream"}');
    this.createServiceByString('{"siid":8,"type":"urn:miot-spec-v2:service:camera-stream-for-amazon-alexa:00007830:isa-hlc7:2","description":"Camera Stream Management for Amazon Alexa"}');
    this.createServiceByString('{"siid":9,"type":"urn:miot-spec-v2:service:camera-stream-for-google-home:00007831:isa-hlc7:2","description":"Camera Stream Management for Google Home"}');
    this.createServiceByString('{"siid":6,"type":"urn:isa-spec:service:other-functions:00007801:isa-hlc7:1","description":"other-functions"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('camera-control:on', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:isa-hlc7:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('camera-control:image-rollover', '{"siid":2,"piid":2,"type":"urn:miot-spec-v2:property:image-rollover:00000058:isa-hlc7:1","description":"Image Rollover","format":"uint16","access":["read","write","notify"],"unit":"arcdegrees","valueRange":[0,360,180]}');
    this.addPropertyByString('camera-control:night-shot', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:night-shot:00000057:isa-hlc7:1","description":"Night Shot","format":"uint8","access":["read","write","notify"],"valueList":[{"value":0,"description":"Off"},{"value":1,"description":"On"},{"value":2,"description":"Auto"}]}');
    this.addPropertyByString('camera-control:time-watermark', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:time-watermark:00000087:isa-hlc7:1","description":"Time Watermark","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('camera-control:recording-mode', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:recording-mode:0000008B:isa-hlc7:1","description":"Recording Mode","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":0,"description":"Continue Record"},{"value":1,"description":"Dynamic Record"},{"value":2,"description":"Stop Record"}]}');
    this.addPropertyByString('indicator-light:on', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:on:00000006:isa-hlc7:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('memory-card-management:status', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:isa-hlc7:1","description":"Status","format":"uint8","access":["read","notify"],"unit":"none","valueList":[{"value":0,"description":"SD-Nomal"},{"value":1,"description":"SD-No-Inset"},{"value":2,"description":"SD-No-Space"},{"value":3,"description":"SD-No-Work"},{"value":4,"description":"SD-Format"},{"value":5,"description":"SD-Out"}]}');
    this.addPropertyByString('memory-card-management:storage-total-space', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:storage-total-space:0000008C:isa-hlc7:1","description":"Storage Total Space","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,268435456,1]}');
    this.addPropertyByString('memory-card-management:storage-free-space', '{"siid":4,"piid":3,"type":"urn:miot-spec-v2:property:storage-free-space:0000008E:isa-hlc7:1","description":"Storage Free Space","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,268435456,1]}');
    this.addPropertyByString('memory-card-management:storage-used-space', '{"siid":4,"piid":4,"type":"urn:miot-spec-v2:property:storage-used-space:0000008D:isa-hlc7:1","description":"Storage Used Space","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,268435456,1]}');
    this.addPropertyByString('motion-detection:motion-detection', '{"siid":5,"piid":1,"type":"urn:miot-spec-v2:property:motion-detection:00000056:isa-hlc7:1","description":"Motion Detection","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('motion-detection:alarm-interval', '{"siid":5,"piid":2,"type":"urn:miot-spec-v2:property:alarm-interval:0000008F:isa-hlc7:1","description":"Alarm Interval","format":"uint8","access":["read","write","notify"],"unit":"minutes","valueRange":[1,30,1]}');
    this.addPropertyByString('motion-detection:detection-sensitivity', '{"siid":5,"piid":3,"type":"urn:miot-spec-v2:property:detection-sensitivity:00000090:isa-hlc7:1","description":"Detection Sensitivity","format":"uint8","access":["read","write","notify"],"unit":"none","valueList":[{"value":1,"description":"Low"},{"value":2,"description":"Middle"},{"value":3,"description":"Hight"}]}');
    this.addPropertyByString('motion-detection:motion-detection-start-time', '{"siid":5,"piid":4,"type":"urn:miot-spec-v2:property:motion-detection-start-time:00000091:isa-hlc7:1","description":"Motion Detection Start Time","format":"string","access":["read","write","notify"]}');
    this.addPropertyByString('motion-detection:motion-detection-end-time', '{"siid":5,"piid":5,"type":"urn:miot-spec-v2:property:motion-detection-end-time:00000092:isa-hlc7:1","description":"Motion Detection End Time","format":"string","access":["read","write","notify"]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:video-codec-type', '{"siid":8,"piid":1,"type":"urn:miot-spec-v2:property:video-codec-type:0000005A:isa-hlc7:2","description":"Video Codec Type","format":"uint8","access":[],"valueList":[{"value":1,"description":"H265"}]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:video-attribute', '{"siid":8,"piid":2,"type":"urn:miot-spec-v2:property:video-attribute:0000005B:isa-hlc7:2","description":"Video Attribute","format":"uint8","access":[],"valueList":[{"value":1,"description":"1920_1080_30"}]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:audio-codec-type', '{"siid":8,"piid":3,"type":"urn:miot-spec-v2:property:audio-codec-type:0000005C:isa-hlc7:2","description":"Audio Codec Type","format":"uint8","access":[],"valueList":[{"value":1,"description":"PCMU"}]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:audio-attribute', '{"siid":8,"piid":4,"type":"urn:miot-spec-v2:property:audio-attribute:0000005D:isa-hlc7:2","description":"Audio Attribute","format":"uint8","access":[],"valueList":[{"value":2,"description":"8000_1_8_CONSTANT"}]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:authorization-type', '{"siid":8,"piid":5,"type":"urn:miot-spec-v2:property:authorization-type:00000062:isa-hlc7:2","description":"Authorization Type","format":"uint8","access":[],"valueList":[{"value":0,"description":"None"},{"value":1,"description":"Basic"},{"value":2,"description":"Digest"}]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:stream-address', '{"siid":8,"piid":6,"type":"urn:miot-spec-v2:property:stream-address:0000005E:isa-hlc7:2","description":"Stream URL","format":"string","access":[]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:image-snapshot', '{"siid":8,"piid":7,"type":"urn:miot-spec-v2:property:image-snapshot:00000064:isa-hlc7:2","description":"Image Snapshot URL","format":"string","access":[]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:expiration-time', '{"siid":8,"piid":8,"type":"urn:miot-spec-v2:property:expiration-time:00000063:isa-hlc7:2","description":"Expiration Time","format":"uint32","access":[],"unit":"seconds","valueRange":[0,3600,3600]}');
    this.addPropertyByString('camera-stream-for-amazon-alexa:stream-status', '{"siid":8,"piid":9,"type":"urn:miot-spec-v2:property:stream-status:00000059:isa-hlc7:2","description":"Stream Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Available"},{"value":2,"description":"In use"},{"value":3,"description":"Unavailable"}]}');
    this.addPropertyByString('camera-stream-for-google-home:video-codec-type', '{"siid":9,"piid":1,"type":"urn:miot-spec-v2:property:video-codec-type:0000005A:isa-hlc7:2","description":"Video Codec Type","format":"uint8","access":[],"valueList":[{"value":1,"description":"H265"}]}');
    this.addPropertyByString('camera-stream-for-google-home:video-attribute', '{"siid":9,"piid":2,"type":"urn:miot-spec-v2:property:video-attribute:0000005B:isa-hlc7:2","description":"Video Attribute","format":"uint8","access":[],"valueList":[{"value":1,"description":"1920_1080_30"}]}');
    this.addPropertyByString('camera-stream-for-google-home:audio-codec-type', '{"siid":9,"piid":3,"type":"urn:miot-spec-v2:property:audio-codec-type:0000005C:isa-hlc7:2","description":"Audio Codec Type","format":"uint8","access":[],"valueList":[{"value":1,"description":"PCMU"}]}');
    this.addPropertyByString('camera-stream-for-google-home:audio-attribute', '{"siid":9,"piid":4,"type":"urn:miot-spec-v2:property:audio-attribute:0000005D:isa-hlc7:2","description":"Audio Attribute","format":"uint8","access":[],"valueList":[{"value":2,"description":"8000_1_8_CONSTANT"}]}');
    this.addPropertyByString('camera-stream-for-google-home:stream-address', '{"siid":9,"piid":5,"type":"urn:miot-spec-v2:property:stream-address:0000005E:isa-hlc7:2","description":"Stream URL","format":"string","access":[]}');
    this.addPropertyByString('camera-stream-for-google-home:stream-receiver-id', '{"siid":9,"piid":6,"type":"urn:miot-spec-v2:property:stream-receiver-id:00000060:isa-hlc7:2","description":"Stream Receiver id","format":"string","access":[]}');
    this.addPropertyByString('camera-stream-for-google-home:stream-auth-token', '{"siid":9,"piid":7,"type":"urn:miot-spec-v2:property:stream-auth-token:00000061:isa-hlc7:2","description":"Stream Auth Token","format":"string","access":[]}');
    this.addPropertyByString('camera-stream-for-google-home:expiration-time', '{"siid":9,"piid":8,"type":"urn:miot-spec-v2:property:expiration-time:00000063:isa-hlc7:2","description":"Expiration Time","format":"uint32","access":[],"unit":"seconds","valueRange":[0,3600,3600]}');
    this.addPropertyByString('camera-stream-for-google-home:stream-status', '{"siid":9,"piid":9,"type":"urn:miot-spec-v2:property:stream-status:00000059:isa-hlc7:2","description":"Stream Status","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Available"},{"value":2,"description":"In use"},{"value":3,"description":"Unavailable"}]}');
    this.addPropertyByString('other-functions:hl-set-timezone', '{"siid":6,"piid":2,"type":"urn:isa-spec:property:hl-set-timezone:00000002:isa-hlc7:1","description":"hl-set-timezone","format":"int32","access":["read","notify","write"],"unit":"none","valueRange":[-12,12,1]}');
    this.addPropertyByString('other-functions:hl-set-rect', '{"siid":6,"piid":3,"type":"urn:isa-spec:property:hl-set-rect:00000003:isa-hlc7:1","description":"hl-set-rect","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-get-custom-voice', '{"siid":6,"piid":4,"type":"urn:isa-spec:property:hl-get-custom-voice:00000001:isa-hlc7:1","description":"hl-get-custom-voice","format":"string","access":["read","notify"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-set-custom-voice', '{"siid":6,"piid":5,"type":"urn:isa-spec:property:hl-set-custom-voice:00000004:isa-hlc7:1","description":"hl-set-custom-voice","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-download-voice', '{"siid":6,"piid":6,"type":"urn:isa-spec:property:hl-download-voice:00000005:isa-hlc7:1","description":"hl-download-voice","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-delete-voice', '{"siid":6,"piid":7,"type":"urn:isa-spec:property:hl-delete-voice:00000006:isa-hlc7:1","description":"hl-delete-voice","format":"string","access":["write"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-voice-switch', '{"siid":6,"piid":8,"type":"urn:isa-spec:property:hl-voice-switch:00000007:isa-hlc7:1","description":"hl-voice-switch","format":"bool","access":["read","notify","write"],"unit":"none"}');
    this.addPropertyByString('other-functions:hl-get-max-connect', '{"siid":6,"piid":9,"type":"urn:isa-spec:property:hl-get-max-connect:00000008:isa-hlc7:1","description":"hl-get-max-connect","format":"bool","access":["read","notify"]}');
  }

  initDeviceActions() {
    this.addActionByString('memory-card-management:format', '{"siid":4,"aiid":1,"type":"urn:miot-spec-v2:action:format:00002831:isa-hlc7:1","description":"Format","in":[],"out":[]}');
    this.addActionByString('memory-card-management:pop-up', '{"siid":4,"aiid":2,"type":"urn:miot-spec-v2:action:pop-up:00002832:isa-hlc7:1","description":"Pop Up","in":[],"out":[]}');
    this.addActionByString('p2p-stream:start-p2p-stream', '{"siid":7,"aiid":1,"type":"urn:miot-spec-v2:action:start-p2p-stream:00002839:isa-hlc7:1","description":"Start P2P Stream","in":[],"out":[]}');
    this.addActionByString('p2p-stream:stop-stream', '{"siid":7,"aiid":2,"type":"urn:miot-spec-v2:action:stop-stream:00002822:isa-hlc7:1","description":"Stop Camera Stream","in":[],"out":[]}');
    this.addActionByString('camera-stream-for-amazon-alexa:start-rtsp-stream', '{"siid":8,"aiid":1,"type":"urn:miot-spec-v2:action:start-rtsp-stream:00002820:isa-hlc7:2","description":"Start Camera Stream for Alexa","in":[2],"out":[6]}');
    this.addActionByString('camera-stream-for-amazon-alexa:stop-stream', '{"siid":8,"aiid":2,"type":"urn:miot-spec-v2:action:stop-stream:00002822:isa-hlc7:2","description":"Stop Camera Stream","in":[],"out":[]}');
    this.addActionByString('camera-stream-for-amazon-alexa:get-stream-configuration', '{"siid":8,"aiid":3,"type":"urn:miot-spec-v2:action:get-stream-configuration:00002823:isa-hlc7:2","description":"Get Stream Configuration of Camera","in":[],"out":[9,1,2,3,4]}');
    this.addActionByString('camera-stream-for-google-home:start-hls-stream', '{"siid":9,"aiid":1,"type":"urn:miot-spec-v2:action:start-hls-stream:00002821:isa-hlc7:2","description":"Start Camera Stream for Google","in":[2],"out":[5]}');
    this.addActionByString('camera-stream-for-google-home:stop-stream', '{"siid":9,"aiid":2,"type":"urn:miot-spec-v2:action:stop-stream:00002822:isa-hlc7:2","description":"Stop Camera Stream","in":[],"out":[]}');
    this.addActionByString('camera-stream-for-google-home:get-stream-configuration', '{"siid":9,"aiid":3,"type":"urn:miot-spec-v2:action:get-stream-configuration:00002823:isa-hlc7:2","description":"Get Stream Configuration of Camera","in":[],"out":[9,1,2,3,4]}');
    this.addActionByString('other-functions:restart-device', '{"siid":6,"aiid":1,"type":"urn:isa-spec:action:restart-device:00002801:isa-hlc7:1","description":"restart-device","in":[],"out":[]}');
    this.addActionByString('other-functions:hl-upload-recode', '{"siid":6,"aiid":2,"type":"urn:isa-spec:action:hl-upload-recode:00002802:isa-hlc7:1","description":"hl-upload-recode","in":[],"out":[]}');
    this.addActionByString('other-functions:hl-speaker-voice', '{"siid":6,"aiid":3,"type":"urn:isa-spec:action:hl-speaker-voice:00002803:isa-hlc7:1","description":"hl-speaker-voice","in":[],"out":[]}');
    this.addActionByString('other-functions:hl-upload-log', '{"siid":6,"aiid":4,"type":"urn:isa-spec:action:hl-upload-log:00002804:isa-hlc7:1","description":"hl-upload-log","in":[],"out":[]}');
  }

  initDeviceEvents() {
    this.addEventByString('other-functions:hl-enter-night-mode', '{"siid":6,"eiid":2,"type":"urn:isa-spec:event:hl-enter-night-mode:00005002:isa-hlc7:1","description":"hl-enter-night-mode","arguments":[]}');
    this.addEventByString('other-functions:hl-enter-day-mode', '{"siid":6,"eiid":3,"type":"urn:isa-spec:event:hl-enter-day-mode:00005003:isa-hlc7:1","description":"hl-enter-day-mode","arguments":[]}');
    this.addEventByString('other-functions:hl-event-motion', '{"siid":6,"eiid":4,"type":"urn:isa-spec:event:hl-event-motion:00005001:isa-hlc7:1","description":"hl-event-motion","arguments":[]}');
    this.addEventByString('other-functions:hl-people-motion', '{"siid":6,"eiid":5,"type":"urn:isa-spec:event:hl-people-motion:00005004:isa-hlc7:1","description":"hl-people-motion","arguments":[]}');
    this.addEventByString('other-functions:hl-baby-cry', '{"siid":6,"eiid":6,"type":"urn:isa-spec:event:hl-baby-cry:00005005:isa-hlc7:1","description":"hl-baby-cry","arguments":[]}');
  }


  /*----------========== VALUES OVERRIDES ==========----------*/


  /*----------========== PROPERTY OVERRIDES ==========----------*/


  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/


}

module.exports = IsaCameraHlc7;

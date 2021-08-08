const CoffeeMachineDevice = require('../CoffeeMachineDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class IsaCameraHlc7 extends CameraDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "isa.camera.hlc7";
  }

  getDeviceName() {
    return "Xiaomi Mi Home Magnetic Mount Outdoor Camera";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:camera:0000A01C:isa-hlc7:2";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.IMAGE_ROLLOVER, 2, 2, PropFormat.UINT16, PropAccess.READ_WRITE_NOTIFY, PropUnit.ARCDEGREE, [0, 360, 180]);
    this.addProperty(Properties.NIGHT_SHOT, 2, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Off"
      },
      {
        "value": 1,
        "description": "On"
      },
      {
        "value": 2,
        "description": "Auto"
      }
    ]);
    this.addProperty(Properties.TIME_WATERMARK, 2, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.RECORDING_MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Continue Record"
      },
      {
        "value": 1,
        "description": "Dynamic Record"
      },
      {
        "value": 2,
        "description": "Stop Record"
      }
    ]);
    this.addProperty(Properties.LED, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MOTION_DETECTION, 5, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MOTION_DETECTION_ALARM_INTERVAL, 5, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.MINUTES, [1, 30, 1]);
    this.addProperty(Properties.MOTION_DETECTION_SENSIVITY, 5, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Low"
      },
      {
        "value": 2,
        "description": "Middle"
      },
      {
        "value": 3,
        "description": "Hight"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.SD_CARD_STATUS, 4, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "SD-Nomal"
      },
      {
        "value": 1,
        "description": "SD-No-Inset"
      },
      {
        "value": 2,
        "description": "SD-No-Space"
      },
      {
        "value": 3,
        "description": "SD-No-Work"
      },
      {
        "value": 4,
        "description": "SD-Format"
      },
      {
        "value": 5,
        "description": "SD-Out"
      }
    ]);
    this.addProperty(Properties.STORAGE_TOTAL_SPACE, 4, 2, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.MEGABYTE, [0, 268435456, 1]);
    this.addProperty(Properties.STORAGE_FREE_SPACE, 4, 3, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.MEGABYTE, [0, 268435456, 1]);
    this.addProperty(Properties.STORAGE_USED_SPACE, 4, 4, PropFormat.INT32, PropAccess.READ_NOTIFY, PropUnit.MEGABYTE, [0, 268435456, 1]);
  }

  initDeviceActions() {
    this.addAction(Actions.SD_CARD_FORMAT, 4, 1, []);
    this.addAction(Actions.SD_CARD_POP_UP, 4, 2, []);
    this.addAction(Actions.START_P2P_STREAM, 7, 1, []);
    this.addAction(Actions.STOP_CAMERA_STREAM, 7, 2, []);
    this.addAction(Actions.RESTART_DEVICE, 6, 1, []);
  }


  /*----------========== CONFIG ==========----------*/


}

module.exports = IsaCameraHlc7;

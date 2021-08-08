const FanDevice = require('../FanDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class AirFanCa23ad9 extends FanDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "air.fan.ca23ad9";
  }

  getDeviceName() {
    return "AIRMATE CA23-AD9 Air Circulation Fan";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:fan:0000A005:air-ca23ad9:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE); // only write-notify in the spec?
    this.addProperty(Properties.FAN_LEVEL, 2, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [1, 32, 1]); // only write-notify in the spec?
    this.addProperty(Properties.HORIZONTAL_SWING, 2, 3, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE); // only write-notify in the spec?
    this.addProperty(Properties.VERTICAL_SWING, 2, 4, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE); // only write-notify in the spec?
    this.addProperty(Properties.MODE, 2, 5, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{ // only write-notify in the spec?
        "value": 1,
        "description": "Basic"
      },
      {
        "value": 2,
        "description": "Baby Care"
      }
    ]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

  straightWindModeValue() {
    return 1;
  }

  sleepModeValue() { // use it as baby mode
    return 2;
  }

  emulateSteplessFanSpeed() {
    return true;
  }


}

module.exports = AirFanCa23ad9;

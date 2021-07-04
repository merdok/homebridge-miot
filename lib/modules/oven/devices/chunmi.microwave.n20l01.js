const OvenDevice = require('../OvenDevice.js');
const OvenProperties = require('../OvenProperties.js');
const OvenActions = require('../OvenActions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ChunmiMicrowaveN20l01 extends OvenDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "chunmi.microwave.n20l01";
  }

  getDeviceName() {
    return "Mi Smart Microwave Oven";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:microwave-oven:0000A032:chunmi-n20l01:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(OvenProperties.CHILD_LOCK, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);

    // READ ONLY
    this.addProperty(OvenProperties.LEFT_TIME, 2, 1, PropFormat.UINT16, PropAccess.READ_NOTIFY, PropUnit.SECONDS, [0, 3960, 1]);
    this.addProperty(OvenProperties.STATUS, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Idle"
      },
      {
        "value": 2,
        "description": "Busy"
      },
      {
        "value": 3,
        "description": "Delay"
      },
      {
        "value": 4,
        "description": "Fault"
      },
      {
        "value": 5,
        "description": "Paused"
      },
      {
        "value": 6,
        "description": "Completed"
      }
    ]);
    this.addProperty(OvenProperties.HEAT_LEVEL, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 5, 1]);
  }

  initDeviceActions() {
    this.addAction(OvenActions.PAUSE, 2, 1, []);
    this.addAction(OvenActions.START_COOK, 2, 2, []);
    this.addAction(OvenActions.CANCEL_COOKING, 2, 3, []);
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return 1;
  }

  statusBusyValue() {
    return 2;
  }

  statusDelayValue() {
    return 3;
  }

  statusFaultValue() {
    return 4;
  }

  statusPausedValue() {
    return 5;
  }

  statusCompletedValue() {
    return 6;
  }


}

module.exports = ChunmiMicrowaveN20l01;

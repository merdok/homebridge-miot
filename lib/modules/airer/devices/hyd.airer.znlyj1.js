const AirerDevice = require('../AirerDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class HydAirerZnlyj1 extends AirerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "hyd.airer.znlyj1";
  }

  getDeviceName() {
    return "MIJIA Smart Clothes Dryer";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj1:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.LIGHT_POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // WRITE ONLY
    this.addProperty(Properties.MOTOR_CONTROL, 2, 2, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Pause"
      },
      {
        "value": 1,
        "description": "Up"
      },
      {
        "value": 2,
        "description": "Down"
      }
    ]);

    // READ ONLY
    this.addProperty(Properties.DEVICE_FAULT, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No Faults"
      },
      {
        "value": 1,
        "description": "Obstruction"
      },
      {
        "value": 2,
        "description": "Overweight"
      },
      {
        "value": 3,
        "description": "Overheated"
      }
    ]);
    this.addProperty(Properties.STATUS, 2, 4, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Stopped"
      },
      {
        "value": 1,
        "description": "Up"
      },
      {
        "value": 2,
        "description": "Down"
      },
      {
        "value": 3,
        "description": "Pause"
      }
    ]);
    this.addProperty(Properties.CURRENT_POSITION, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 2, 1]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

  statusStoppedValue() {
    return 0;
  }

  statusUpValue() {
    return 1;
  }

  statusDownValue() {
    return 2;
  }

  statusPauseValue() {
    return 3;
  }

  deviceFaultObstructionValue() {
    return 1;
  }


}

module.exports = HydAirerZnlyj1;

const AirerDevice = require('../AirerDevice.js');
const AirerProperties = require('../AirerProperties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');

// Spec:
// https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:airer:0000A00D:hyd-znlyj1:2


class HydAirerZnlyj1 extends AirerDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
  //  this.addProperty(AirerProperties.TARGET_POSITION, 2, 15, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [0, 49, 1]); // device returns -4004 error but it is in the spec, why?
  //  this.addProperty(AirerProperties.TARGET_POSITION_2, 2, 16, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.PERCENTAGE, [51, 100, 1]); // device returns -4004 error but it is in the spec, why?
  //  this.addProperty(AirerProperties.POWER, 2, 17, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE); // device returns -4004 error but it is in the spec, why?
    this.addProperty(AirerProperties.LIGHT_POWER, 3, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);

    // WRITE ONLY
    this.addProperty(AirerProperties.MOTOR_CONTROL, 2, 2, PropFormat.UINT8, PropAccess.WRITE, PropUnit.NONE, [], [{
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
    this.addProperty(AirerProperties.DEVICE_FAULT, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
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
    this.addProperty(AirerProperties.STATUS, 2, 4, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
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
  //  this.addProperty(AirerProperties.CURRENT_POSITION, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [0, 2, 1]); // device returns -4004 error but it is in the spec, why?
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

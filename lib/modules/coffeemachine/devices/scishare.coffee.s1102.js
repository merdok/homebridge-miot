const CoffeeMachineDevice = require('../CoffeeMachineDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class ScishareCoffeeS1102 extends CoffeeMachineDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "scishare.coffee.s1102";
  }

  getDeviceName() {
    return "Scishare Capsule Coffee Maker";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:coffee-machine:0000A049:scishare-s1102:1";
  }

  requiresMiCloud() {
    return true;
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 2, PropFormat.BOOL, PropAccess.READ_WRITE, PropUnit.NONE);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 1, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Off"
      },
      {
        "value": 2,
        "description": "Idle"
      },
      {
        "value": 3,
        "description": "Preheating"
      },
      {
        "value": 4,
        "description": "Error"
      },
      {
        "value": 5,
        "description": "Busy"
      }
    ]);
  }

  initDeviceActions() {
    //none
  }


  /*----------========== CONFIG ==========----------*/

  statusOffValue() {
    return 1;
  }

  statusIdleValue() {
    return 2;
  }

  statusPreheatingValue() {
    return 3;
  }

  statusErrorValue() {
    return 4;
  }

  statusBusyValue() {
    return 5;
  }


}

module.exports = ScishareCoffeeS1102;

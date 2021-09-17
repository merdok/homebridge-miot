const ThermostatDevice = require('../ThermostatDevice.js');
const Properties = require('../../../constants/Properties.js');
const Actions = require('../../../constants/Actions.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class CubeeAirrtcTh123w extends ThermostatDevice {
  constructor(model, deviceId, name, logger) {
    super(model, deviceId, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  static getDeviceModel() {
    return "cubee.airrtc.th123w";
  }

  getDeviceName() {
    return "Heatcold UFH Thermostat";
  }

  getDeviceMiotSpec() {
    return "https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:thermostat:0000A031:cubee-th123w:1";
  }


  /*----------========== INIT ==========----------*/

  initDeviceProperties() {
    // READ/WRITE
    this.addProperty(Properties.POWER, 2, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.MODE, 2, 4, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "Manual"
      },
      {
        "value": 1,
        "description": "Home"
      },
      {
        "value": 2,
        "description": "Away"
      },
      {
        "value": 3,
        "description": "Smart"
      },
      {
        "value": 4,
        "description": "Sleep"
      }
    ]);
    this.addProperty(Properties.TARGET_TEMPERATURE, 2, 5, PropFormat.FLOAT, PropAccess.READ_WRITE_NOTIFY, PropUnit.CELSIUS, [0, 90, 1]);
    this.addProperty(Properties.CHILD_LOCK, 4, 1, PropFormat.BOOL, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE);
    this.addProperty(Properties.SENSOR_TYPE, 4, 2, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "1"
      },
      {
        "value": 1,
        "description": "2"
      },
      {
        "value": 2,
        "description": "3"
      }
    ]);
    this.addProperty(Properties.TEMP_ACTIVATE, 4, 3, PropFormat.UINT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [1, 9, 1]);
    this.addProperty(Properties.TEMP_COMP, 4, 4, PropFormat.INT8, PropAccess.READ_WRITE_NOTIFY, PropUnit.NONE, [-9, 9, 1]);

    // READ ONLY
    this.addProperty(Properties.STATUS, 2, 2, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 1,
        "description": "Heating"
      },
      {
        "value": 0,
        "description": "Idle"
      }
    ]);
    this.addProperty(Properties.DEVICE_FAULT, 2, 3, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.NONE, [], [{
        "value": 0,
        "description": "No error"
      },
      {
        "value": 1,
        "description": "Sensor error"
      },
      {
        "value": 2,
        "description": "High temperature protection"
      },
      {
        "value": 3,
        "description": "Low temperature protection"
      }
    ]);
    this.addProperty(Properties.TEMPERATURE, 2, 7, PropFormat.FLOAT, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [-30, 100, 1]);
    this.addProperty(Properties.TEMP_FLOOR, 4, 5, PropFormat.INT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 100, 1]);
    this.addProperty(Properties.MAX_SET_TEMP, 4, 6, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [35, 90, 1]);
    this.addProperty(Properties.MIN_SET_TEMP, 4, 7, PropFormat.UINT8, PropAccess.READ_NOTIFY, PropUnit.CELSIUS, [0, 30, 1]);
  }

  initDeviceActions() {
    // nothing special
  }


  /*----------========== CONFIG ==========----------*/

  statusIdleValue() {
    return 0;
  }

  statusHeatingValue() {
    return 1;
  }


}

module.exports = CubeeAirrtcTh123w;

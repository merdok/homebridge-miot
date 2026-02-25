const KettleDevice = require('../KettleDevice.js');
const Constants = require('../../../constants/Constants.js');
const PropFormat = require('../../../constants/PropFormat.js');
const PropUnit = require('../../../constants/PropUnit.js');
const PropAccess = require('../../../constants/PropAccess.js');


class XiaomiKettleV20 extends KettleDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger);
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Xiaomi Mi Smart Kettle';
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:kettle:0000A009:xiaomi-v20:1';
  }


  /*----------========== CONFIG ==========----------*/

  propertiesToMonitor() {
    return ['kettle:status', 'kettle:temperature', 'kettle:target-temperature', 'kettle:auto-keep-warm', 'kettle:keep-warm-temperature', 'kettle:on'];
  }


  /*----------========== METADATA ==========----------*/

  initDeviceServices() {
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:kettle:00007813:xiaomi-v20:1","description":"Kettle"}');
  }

  initDeviceProperties() {
    this.addPropertyByString('kettle:status', '{"siid":2,"piid":1,"type":"urn:miot-spec-v2:property:status:00000007:xiaomi-v20:1","description":"Status","format":"uint8","access":["read","notify"],"valueList":[{"value":0,"description":"Idle"},{"value":1,"description":"Heating"},{"value":2,"description":"Boiling"},{"value":3,"description":"Cooling Down"},{"value":4,"description":"Keep Warm"}]}');
    this.addPropertyByString('kettle:temperature', '{"siid":2,"piid":3,"type":"urn:miot-spec-v2:property:temperature:00000020:xiaomi-v20:1","description":"Temperature","format":"int8","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,1]}');
    this.addPropertyByString('kettle:target-temperature', '{"siid":2,"piid":4,"type":"urn:miot-spec-v2:property:target-temperature:00000021:xiaomi-v20:1","description":"Target Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[40,99,1]}');
    this.addPropertyByString('kettle:auto-keep-warm', '{"siid":2,"piid":5,"type":"urn:miot-spec-v2:property:auto-keep-warm:0000002B:xiaomi-v20:1","description":"Auto Keep Warm","format":"bool","access":["read","write","notify"]}');
    this.addPropertyByString('kettle:keep-warm-temperature', '{"siid":2,"piid":6,"type":"urn:miot-spec-v2:property:keep-warm-temperature:0000002E:xiaomi-v20:1","description":"Keep Warm Temperature","format":"uint8","access":["read","write","notify"],"unit":"celsius","valueRange":[0,100,1]}');
    this.addPropertyByString('kettle:on', '{"siid":2,"piid":7,"type":"urn:miot-spec-v2:property:on:00000006:xiaomi-v20:1","description":"Switch Status","format":"bool","access":["read","write","notify"]}');
  }

  initDeviceActions() {
    // stop-work is in function service (siid 3), not needed for basic boil/keep-warm
  }

  initDeviceEvents() {
    // no events in main kettle service
  }


  /*----------========== PROPERTY OVERRIDES ==========----------*/

  statusProp() {
    return this.getProperty('kettle:status');
  }

  modeProp() {
    return null; // v20 uses status, not mode
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  statusIdleValue() {
    return 0; // Idle
  }

  statusHeatingValue() {
    return [1, 2, 4]; // Heating, Boiling, Keep Warm
  }


  /*----------========== CONVENIENCE OVERRIDES ==========----------*/

  // v20 has kettle:on — setting it to true starts heating immediately; we were only setting target before
  async startHeating() {
    if (this.supportsTargetTemperature()) {
      await this.setTargetTemperature(this.targetTemperatureRange()[1]); // 99°C for boil
    }
    if (this.onProp()) {
      await this.setOn(true);
    }
  }

  async stopHeating() {
    if (this.onProp()) {
      await this.setOn(false);
    }
    if (this.supportsTargetTemperature()) {
      await this.setTargetTemperature(this.targetTemperatureRange()[0]); // 40°C
    }
  }

}

module.exports = XiaomiKettleV20;

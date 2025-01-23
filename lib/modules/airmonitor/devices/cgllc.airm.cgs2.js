const AirMonitorDevice = require('../AirMonitorDevice.js')
const Constants = require('../../../constants/Constants.js')
const PropFormat = require('../../../constants/PropFormat.js')
const PropUnit = require('../../../constants/PropUnit.js')
const PropAccess = require('../../../constants/PropAccess.js')

class CgllcAirmCgs2 extends AirMonitorDevice {
  constructor(miotDevice, name, logger) {
    super(miotDevice, name, logger)
  }


  /*----------========== DEVICE INFO ==========----------*/

  getDeviceName() {
    return 'Qingping Air Monitor 2'
  }

  getMiotSpecUrl() {
    return 'https://miot-spec.org/miot-spec-v2/instance?type=urn:miot-spec-v2:device:air-monitor:0000A008:cgllc-cgs2:1'
  }

  /*----------========== ACCESSORY STUFF ==========----------*/

  updateAccessoryInformationService(cachedDeviceInfo) {
    // super.updateAccessoryInformationService(cachedDeviceInfo);

    if (this.accessoryWrapper) {
      let manufacturer = 'Qingping'
      let model = this.getMiotDevice().getModel() || cachedDeviceInfo.model || 'Unknown'
      let deviceId = this.getMiotDevice().getDeviceId() || cachedDeviceInfo.deviceId || 'Unknown'
      let firmwareRev = this.getMiotDevice().getFirmwareRevision() || cachedDeviceInfo.firmwareRev || 'Unknown'

      this.accessoryWrapper.updateInformationService(this.getName(), manufacturer, model, deviceId, firmwareRev)
    }
  }

  /*----------========== CONFIG ==========----------*/

  requiresMiCloud() {
    return false
  }

  propertiesToMonitor() {
    return [
      // environment
      'environment:relative-humidity', 'environment:pm2.5-density', 'environment:pm10-density', 'environment:temperature', 'environment:co2-density', 'environment:tvoc-density',
      // battery
      'battery:battery-level', 'battery:charging-state',
      // sound-recognition
      'sound-recognition:noise-decibel',
      // settings
      'settings:temperature-unit', 'settings:tvoc-unit', 'settings:time-mode', 'settings:pm-sn', 'settings:standard', 'settings:sensor-states'
    ]
  }

  /*----------========== METADATA ==========----------*/
  initDeviceServices() {
    this.createServiceByString('{"siid":1,"type":"urn:miot-spec-v2:service:device-information:00007801:cgllc-cgs2:1","description":"Device Information"}')
    this.createServiceByString('{"siid":2,"type":"urn:miot-spec-v2:service:air-monitor:00007812:cgllc-cgs2:1","description":"Air Monitor"}')
    this.createServiceByString('{"siid":3,"type":"urn:miot-spec-v2:service:environment:0000780A:cgllc-cgs2:1","description":"Environment"}')
    this.createServiceByString('{"siid":4,"type":"urn:miot-spec-v2:service:battery:00007805:cgllc-cgs2:1","description":"Battery"}')
    this.createServiceByString('{"siid":10,"type":"urn:cgllc-spec:service:sound-recognition:000078F8:cgllc-cgs2:1","description":"Sound Recognition"}')
    this.createServiceByString('{"siid":11,"type":"urn:cgllc-spec:service:clock-alarm:00007801:cgllc-cgs2:1","description":"clock-alarm"}')
    this.createServiceByString('{"siid":12,"type":"urn:cgllc-spec:service:settings:00007802:cgllc-cgs2:1","description":"settings"}')
  }

  initDeviceProperties() {
    // environment
    this.addPropertyByString('environment:relative-humidity', '{"siid":3,"piid":1,"type":"urn:miot-spec-v2:property:relative-humidity:0000000C:cgllc-cgs2:1","description":"Relative Humidity","format":"float","access":["read","notify"],"unit":"percentage","valueRange":[0,100,0.1]}')
    this.addPropertyByString('environment:pm2.5-density', '{"siid":3,"piid":4,"type":"urn:miot-spec-v2:property:pm2.5-density:00000034:cgllc-cgs2:1","description":"PM2.5 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}')
    this.addPropertyByString('environment:pm10-density', '{"siid":3,"piid":5,"type":"urn:miot-spec-v2:property:pm10-density:00000035:cgllc-cgs2:1","description":"PM10 Density","format":"float","access":["read","notify"],"unit":"μg/m3","valueRange":[0,1000,1]}')
    this.addPropertyByString('environment:temperature', '{"siid":3,"piid":7,"type":"urn:miot-spec-v2:property:temperature:00000020:cgllc-cgs2:1","description":"Temperature","format":"float","access":["read","notify"],"unit":"celsius","valueRange":[-30,100,0.1]}')
    this.addPropertyByString('environment:co2-density', '{"siid":3,"piid":8,"type":"urn:miot-spec-v2:property:co2-density:0000004B:cgllc-cgs2:1","description":"CO2 Density","format":"float","access":["read","notify"],"unit":"ppm","valueRange":[0,10000,1]}')
    this.addPropertyByString('environment:tvoc-density', '{"siid":3,"piid":9,"type":"urn:miot-spec-v2:property:tvoc-density:00000065:cgllc-cgs2:1","description":"TVOC Density","format":"int32","access":["read","notify"],"unit":"none","valueRange":[0,65535,1]}')

    // battery
    this.addPropertyByString('battery:battery-level', '{"siid":4,"piid":1,"type":"urn:miot-spec-v2:property:battery-level:00000014:cgllc-cgs2:1","description":"Battery Level","format":"uint8","access":["read","notify"],"unit":"percentage","valueRange":[0,100,1]}')
    this.addPropertyByString('battery:charging-state', '{"siid":4,"piid":2,"type":"urn:miot-spec-v2:property:charging-state:00000015:cgllc-cgs2:1","description":"Charging State","format":"uint8","access":["read","notify"],"valueList":[{"value":1,"description":"Charging"},{"value":2,"description":"Not charging"},{"value":3,"description":"Not chargeable"}]}')

    // sound-recognition
    this.addPropertyByString('sound-recognition:noise-decibel', '{"siid":10,"piid":2,"type":"urn:miot-spec-v2:property:noise-decibel:0000037D:cgllc-cgs2:1","description":"Noise Decibel","format":"uint8","access":["read","notify"],"unit":"dB","valueRange":[0,200,1]}')

    // clock-alarm
    // this.addPropertyByString('clock-alarm:alarms', '{"siid":11,"piid":2,"type":"urn:cgllc-spec:service:clock-alarm:00007801:cgllc-cgs2:1","description":"alarms","format":"string","access":["read","notify"]}');

    // settings
    this.addPropertyByString('settings:temperature-unit', '{"siid":12,"piid":1,"type":"urn:cgllc-spec:property:temperature-unit:00000001:cgllc-cgs2:1","description":"temperature-unit","format":"uint16","access":["read","notify"],"valueList":[{"value":12289,"description":"CelUnit"},{"value":12290,"description":"KfcUnit"}]}')
    this.addPropertyByString('settings:tvoc-unit', '{"siid":12,"piid":2,"type":"urn:cgllc-spec:property:tvoc-unit:00000002:cgllc-cgs2:1","description":"tvoc-unit","format":"uint16","access":["read","notify"],"valueList":[{"value":12296,"description":"none"},{"value":12293,"description":"ppb"},{"value":12292,"description":"mg/m3"}]}')
    this.addPropertyByString('settings:time-mode', '{"siid":12,"piid":3,"type":"urn:cgllc-spec:property:time-mode:00000003:cgllc-cgs2:1","description":"time-mode","format":"bool","access":["read","notify"]}')
    this.addPropertyByString('settings:pm-sn', '{"siid":12,"piid":4,"type":"urn:cgllc-spec:property:pm-sn:00000004:cgllc-cgs2:1","description":"pm-sn","format":"string","access":["read","notify"]}')
    this.addPropertyByString('settings:standard', '{"siid":12,"piid":5,"type":"urn:cgllc-spec:property:standard:00000005:cgllc-cgs2:1","description":"standard","format":"uint16","access":["read","notify"],"valueList":[{"value":16384,"description":"STANDARD-CN"},{"value":16385,"description":"STANDARD-US"}]}')
    this.addPropertyByString('settings:sensor-states', '{"siid":12,"piid":6,"type":"urn:cgllc-spec:property:sensor-states:00000006:cgllc-cgs2:1","description":"sensor-states","format":"string","access":["read","notify"]}')
  }

  initDeviceActions() {
    //no actions
  }

  initDeviceEvents() {
    //no actions
  }


  /*----------========== VALUES OVERRIDES ==========----------*/

  chargingStateChargingValue() {
    return 1
  }

  chargingStateNotChargingValue() {
    return 2
  }

  chargingStateNotChargeableValue() {
    return 3
  }

  /*----------========== PROPERTY OVERRIDES ==========----------*/

  tvocUnitProp() {
    return this.getProperty('settings:tvoc-unit')
  }

  /*----------========== ACTION OVERRIDES ==========----------*/


  /*----------========== OVERRIDES ==========----------*/

  tvocDensityUnit() {
    // const prop = this.tvocUnitProp()
    // const valList = this.getPropertyValueList(prop)
    // const val = this.getPropertyValue(prop)
    // const foundObj = valList.find(item => `${item.value}` === `${val}`)

    if (!this.supportsTvocDensityReporting()) {
      return PropUnit.NONE
    } else {
      // 设备上传的是 vocindex 数据，下面 getTvocDensity 中做了转换计算，此处直接返回 μg/m3
      // if (foundObj) {
      //   return foundObj.description
      // } else {
      //   return PropUnit.NONE
      // }
      return PropUnit.UGM3
    }
  }

  getTvocDensity() {
    const tvocindex = this.getPropertyValue(this.tvocDensityProp())

    // https://sensirion.com/media/documents/4B4D0E67/6520038C/GAS_AN_SGP4x_BuildingStandards_D1_1.pdf
    // Converting ethanol concentration into WELL Building Standard® compliant TVOC concentration (μg/m3)
    const welltvoc = (Math.log(501 - tvocindex) - 6.24) * (-996.94)
    // Converting ethanol concentration into RESET® Air compliant TVOC concentration (μg/m3)
    // const resettvoc = (Math.log(501 - tvocindex) - 6.24) * (-878.53)

    // this.logger.info(`tvocindex: ${tvocindex}, welltvoc: ${welltvoc}, resettvoc: ${resettvoc}`)

    let tvoc = welltvoc
    tvoc = this.convertToHomekitTvoc(tvoc, this.tvocDensityUnit())
    return tvoc
  }

}

module.exports = CgllcAirmCgs2

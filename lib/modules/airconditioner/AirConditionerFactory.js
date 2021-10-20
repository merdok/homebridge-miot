const LumiAirconditionAcn05 = require('./devices/lumi.aircondition.acn05.js');
const LumiAcpartnerMcn02 = require('./devices/lumi.acpartner.mcn02.js');
const LumiAcpartnerV2 = require('./devices/lumi.acpartner.v2.js');
const LumiAcpartnerV3 = require('./devices/lumi.acpartner.v3.js');

const allDevices = [LumiAirconditionAcn05, LumiAcpartnerMcn02, LumiAcpartnerV2, LumiAcpartnerV3];


class AirConditionerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = AirConditionerFactory;

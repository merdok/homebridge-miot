const LumiAirconditionAcn05 = require('./devices/lumi.aircondition.acn05.js');
const LumiAcpartnerMcn02 = require('./devices/lumi.acpartner.mcn02.js');


class AirConditionerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('lumi.aircondition.acn05')) {
        deviceFactoryClass = LumiAirconditionAcn05;
      } else if (deviceModel.includes('lumi.acpartner.mcn02')) {
        deviceFactoryClass = LumiAcpartnerMcn02;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = AirConditionerFactory;

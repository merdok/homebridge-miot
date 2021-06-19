const LumiAirconditionAcn05 = require('./devices/lumi.aircondition.acn05.js');


class AirConditionerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('lumi.aircondition.acn05')) {
        deviceFactoryClass = LumiAirconditionAcn05;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = AirConditionerFactory;

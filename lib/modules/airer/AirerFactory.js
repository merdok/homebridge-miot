const HydAirerZnlyj1 = require('./devices/hyd.airer.znlyj1.js');


class AirerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('hyd.airer.znlyj1')) {
        deviceFactoryClass = HydAirerZnlyj1;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = AirerFactory;

const HydAirerZnlyj1 = require('./devices/hyd.airer.znlyj1.js');

const allDevices = [HydAirerZnlyj1];


class AirerFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = AirerFactory;

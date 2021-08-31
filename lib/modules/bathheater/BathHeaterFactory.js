const YeelinkBhfLightV5 = require('./devices/yeelink.bhf_light.v5.js');

const allDevices = [YeelinkBhfLightV5];


class BathHeaterFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = BathHeaterFactory;

const ZhimiHeaterZa2 = require('./devices/zhimi.heater.za2.js');


class HeaterFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.heater.za2')) {
        deviceFactoryClass = ZhimiHeaterZa2;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = HeaterFactory;

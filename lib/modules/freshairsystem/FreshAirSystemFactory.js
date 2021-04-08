const ZhimiAirfreshUa1 = require('./devices/zhimi.airfresh.ua1.js');


class FreshAirSystemFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.airfresh.ua1')) {
        deviceFactoryClass = ZhimiAirfreshUa1;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = FreshAirSystemFactory;

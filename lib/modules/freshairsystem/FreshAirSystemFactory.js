const ZhimiAirfreshUa1 = require('./devices/zhimi.airfresh.ua1.js');
const DmakerAirfreshA1 = require('./devices/dmaker.airfresh.a1.js');
const DmakerAirfreshT2017 = require('./devices/dmaker.airfresh.t2017.js');


class FreshAirSystemFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.airfresh.ua1')) {
        deviceFactoryClass = ZhimiAirfreshUa1;
      } else if (deviceModel.includes('dmaker.airfresh.a1')) {
        deviceFactoryClass = DmakerAirfreshA1;
      }else if (deviceModel.includes('dmaker.airfresh.t2017')) {
        deviceFactoryClass = DmakerAirfreshT2017;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = FreshAirSystemFactory;

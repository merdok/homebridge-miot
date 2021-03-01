const ZhimiAirPurifierMb4 = require('./devices/zhimi.airpurifier.mb4.js');
const ZhimiAirPurifierMb3 = require('./devices/zhimi.airpurifier.mb3.js');
const ZhimiAirPurifierVb2 = require('./devices/zhimi.airpurifier.vb2.js');
const ZhimiAirPurifierZa1 = require('./devices/zhimi.airpurifier.za1.js');

class AirPurifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.airpurifier.mb4')) {
        deviceFactoryClass = ZhimiAirPurifierMb4;
      } else if (deviceModel.includes('zhimi.airpurifier.mb3')) {
        deviceFactoryClass = ZhimiAirPurifierMb3;
      } else if (deviceModel.includes('zhimi.airpurifier.vb2')) {
        deviceFactoryClass = ZhimiAirPurifierVb2;
      } else if (deviceModel.includes('zhimi.airpurifier.za1')) {
        deviceFactoryClass = ZhimiAirPurifierZa1;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = AirPurifierFactory;

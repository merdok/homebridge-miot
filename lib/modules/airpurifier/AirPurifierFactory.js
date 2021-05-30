const ZhimiAirPurifierMb4 = require('./devices/zhimi.airpurifier.mb4.js');
const ZhimiAirPurifierMb3 = require('./devices/zhimi.airpurifier.mb3.js');
const ZhimiAirPurifierVb2 = require('./devices/zhimi.airpurifier.vb2.js');
const ZhimiAirPurifierVa1 = require('./devices/zhimi.airpurifier.va1.js');
const ZhimiAirPurifierZa1 = require('./devices/zhimi.airpurifier.za1.js');
const ZhimiAirPurifierMc2 = require('./devices/zhimi.airpurifier.mc2.js');
const ZhimiAirPurifierMa2 = require('./devices/zhimi.airpurifier.ma2.js');


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
      } else if (deviceModel.includes('zhimi.airpurifier.va1')) {
        deviceFactoryClass = ZhimiAirPurifierVa1;
      } else if (deviceModel.includes('zhimi.airpurifier.za1')) {
        deviceFactoryClass = ZhimiAirPurifierZa1;
      } else if (deviceModel.includes('zhimi.airpurifier.mc2')) {
        deviceFactoryClass = ZhimiAirPurifierMc2;
      } else if (deviceModel.includes('zhimi.airpurifier.ma2')) {
        deviceFactoryClass = ZhimiAirPurifierMa2;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = AirPurifierFactory;

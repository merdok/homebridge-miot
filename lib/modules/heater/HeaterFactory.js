const ZhimiHeaterZa2 = require('./devices/zhimi.heater.za2.js');
const ZhimiHeaterMa3 = require('./devices/zhimi.heater.ma3.js');
const ZhimiHeaterMc2 = require('./devices/zhimi.heater.mc2.js');
const ZhimiHeaterNb1 = require('./devices/zhimi.heater.nb1.js');
const ZhimiHeaterMa2 = require('./devices/zhimi.heater.ma2.js');
const ZhimiHeaterZb1 = require('./devices/zhimi.heater.zb1.js');


class HeaterFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.heater.za2')) {
        deviceFactoryClass = ZhimiHeaterZa2;
      } else if (deviceModel.includes('zhimi.heater.ma3')) {
        deviceFactoryClass = ZhimiHeaterMa3;
      } else if (deviceModel.includes('zhimi.heater.mc2')) {
        deviceFactoryClass = ZhimiHeaterMc2;
      } else if (deviceModel.includes('zhimi.heater.nb1')) {
        deviceFactoryClass = ZhimiHeaterNb1;
      } else if (deviceModel.includes('zhimi.heater.ma2')) {
        deviceFactoryClass = ZhimiHeaterMa2;
      } else if (deviceModel.includes('zhimi.heater.zb1')) {
        deviceFactoryClass = ZhimiHeaterZb1;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = HeaterFactory;

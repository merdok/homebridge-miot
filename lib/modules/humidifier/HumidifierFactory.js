const ZhimiHumidifierCa4 = require('./devices/zhimi.humidifier.ca4.js');
const DeermaHumidifierJsq4 = require('./devices/deerma.humidifier.jsq4.js');


class HumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.humidifier.ca4')) {
        deviceFactoryClass = ZhimiHumidifierCa4;
      } else if (deviceModel.includes('deerma.humidifier.jsq4')) {
        deviceFactoryClass = DeermaHumidifierJsq4;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = HumidifierFactory;

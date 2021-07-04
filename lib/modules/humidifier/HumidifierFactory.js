const ZhimiHumidifierCa4 = require('./devices/zhimi.humidifier.ca4.js');
const DeermaHumidifierJsq4 = require('./devices/deerma.humidifier.jsq4.js');

const humidifierDevices = [ZhimiHumidifierCa4, DeermaHumidifierJsq4];


class HumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = humidifierDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = HumidifierFactory;

const ZhimiHumidifierCa4 = require('./devices/zhimi.humidifier.ca4.js');
const DeermaHumidifierJsq4 = require('./devices/deerma.humidifier.jsq4.js');
const ZhimiHumidifierCb1 = require('./devices/zhimi.humidifier.cb1.js');

const allDevices = [ZhimiHumidifierCa4, DeermaHumidifierJsq4, ZhimiHumidifierCb1];


class HumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = HumidifierFactory;

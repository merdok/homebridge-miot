const ZhimiHeaterZa2 = require('./devices/zhimi.heater.za2.js');
const ZhimiHeaterMa3 = require('./devices/zhimi.heater.ma3.js');
const ZhimiHeaterMc2 = require('./devices/zhimi.heater.mc2.js');
const ZhimiHeaterNb1 = require('./devices/zhimi.heater.nb1.js');
const ZhimiHeaterNa1 = require('./devices/zhimi.heater.na1.js');
const ZhimiHeaterMa2 = require('./devices/zhimi.heater.ma2.js');
const ZhimiHeaterZb1 = require('./devices/zhimi.heater.zb1.js');

const heaterDevices = [ZhimiHeaterZa2, ZhimiHeaterMa3, ZhimiHeaterMc2, ZhimiHeaterNb1,
  ZhimiHeaterNa1, ZhimiHeaterMa2, ZhimiHeaterZb1
];


class HeaterFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = heaterDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = HeaterFactory;

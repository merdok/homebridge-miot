const ZhimiAirPurifierM1 = require('./devices/zhimi.airpurifier.m1.js');
const ZhimiAirPurifierMb4 = require('./devices/zhimi.airpurifier.mb4.js');
const ZhimiAirPurifierMb3 = require('./devices/zhimi.airpurifier.mb3.js');
const ZhimiAirPurifierVb2 = require('./devices/zhimi.airpurifier.vb2.js');
const ZhimiAirPurifierVa1 = require('./devices/zhimi.airpurifier.va1.js');
const ZhimiAirPurifierZa1 = require('./devices/zhimi.airpurifier.za1.js');
const ZhimiAirPurifierMc2 = require('./devices/zhimi.airpurifier.mc2.js');
const ZhimiAirPurifierMa2 = require('./devices/zhimi.airpurifier.ma2.js');
const ZhimiAirPurifierV7 = require('./devices/zhimi.airpurifier.v7.js');
const ZhimiAirPurifierXa1 = require('./devices/zhimi.airpurifier.xa1.js');
const HanyiAirpurifierKj550 = require('./devices/hanyi.airpurifier.kj550.js');
const ZhimiAirPurifierV6 = require('./devices/zhimi.airpurifier.v6.js');
const ZhimiAirPurifierSb1 = require('./devices/zhimi.airpurifier.sb1.js');

const allDevices = [ZhimiAirPurifierM1, ZhimiAirPurifierMb4, ZhimiAirPurifierMb3, ZhimiAirPurifierVb2, ZhimiAirPurifierVa1,
  ZhimiAirPurifierZa1, ZhimiAirPurifierMc2, ZhimiAirPurifierMa2, ZhimiAirPurifierV7,
  ZhimiAirPurifierXa1, HanyiAirpurifierKj550, ZhimiAirPurifierV6, ZhimiAirPurifierSb1
];


class AirPurifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = AirPurifierFactory;

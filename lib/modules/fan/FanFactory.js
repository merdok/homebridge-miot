const ZhimiFanZa4 = require('./devices/zhimi.fan.za4.js');
const ZhimiFanZa5 = require('./devices/zhimi.fan.za5.js');
const DmakerFan1C = require('./devices/dmaker.fan.1c.js');
const DmakerFanP8 = require('./devices/dmaker.fan.p8.js');
const DmakerFanP9 = require('./devices/dmaker.fan.p9.js');
const DmakerFanP10 = require('./devices/dmaker.fan.p10.js');
const DmakerFanP11 = require('./devices/dmaker.fan.p11.js');
const DmakerFanP15 = require('./devices/dmaker.fan.p15.js');
const ZhimiFanFa1 = require('./devices/zhimi.fan.fa1.js');
const ZhimiFanFb1 = require('./devices/zhimi.fan.fb1.js');
const DmakerFanP5 = require('./devices/dmaker.fan.p5.js');
const DmakerFanP18 = require('./devices/dmaker.fan.p18.js');
const AirFanCa23ad9 = require('./devices/air.fan.ca23ad9.js');
const ZhimiFanV3 = require('./devices/zhimi.fan.v3.js');

const allDevices = [ZhimiFanZa4, ZhimiFanZa5, DmakerFan1C, DmakerFanP8,
  DmakerFanP9, DmakerFanP10, DmakerFanP11, DmakerFanP15,
  ZhimiFanFa1, ZhimiFanFb1, DmakerFanP5, DmakerFanP18,
  AirFanCa23ad9, ZhimiFanV3
];


class FanFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = FanFactory;

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


class FanFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('zhimi.fan.za5')) {
        deviceFactoryClass = ZhimiFanZa5;
      } else if (deviceModel.includes('dmaker.fan.1c')) {
        deviceFactoryClass = DmakerFan1C;
      } else if (deviceModel.includes('dmaker.fan.p8')) {
        deviceFactoryClass = DmakerFanP8;
      } else if (deviceModel.includes('dmaker.fan.p9')) {
        deviceFactoryClass = DmakerFanP9;
      } else if (deviceModel.includes('dmaker.fan.p10')) {
        deviceFactoryClass = DmakerFanP10;
      } else if (deviceModel.includes('dmaker.fan.p11')) {
        deviceFactoryClass = DmakerFanP11;
      } else if (deviceModel.includes('dmaker.fan.p15')) {
        deviceFactoryClass = DmakerFanP15;
      } else if (deviceModel.includes('zhimi.fan.fa1')) {
        deviceFactoryClass = ZhimiFanFa1;
      } else if (deviceModel.includes('zhimi.fan.fb1')) {
        deviceFactoryClass = ZhimiFanFb1;
      } else if (deviceModel.includes('dmaker.fan.p5')) {
        deviceFactoryClass = DmakerFanP5;
      } else if (deviceModel.includes('zhimi.fan.za4')) {
        deviceFactoryClass = ZhimiFanZa4;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = FanFactory;

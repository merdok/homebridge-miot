const YeelinkLightFancl1 = require('./devices/yeelink.light.fancl1.js');
const YeelinkLightFancl2 = require('./devices/yeelink.light.fancl2.js');
const YeelinkLightFancl5 = require('./devices/yeelink.light.fancl5.js');
const OppleLightFanlight = require('./devices/opple.light.fanlight.js');

const allDevices = [YeelinkLightFancl1, YeelinkLightFancl2, YeelinkLightFancl5, OppleLightFanlight];


class CeilingFanFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = CeilingFanFactory;

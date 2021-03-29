const YeelinkLightFancl1 = require('./devices/yeelink.light.fancl1.js');
const YeelinkLightFancl2 = require('./devices/yeelink.light.fancl2.js');


class CeilingFanFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('yeelink.light.fancl1')) {
        deviceFactoryClass = YeelinkLightFancl1;
      } else if (deviceModel.includes('yeelink.light.fancl2')) {
        deviceFactoryClass = YeelinkLightFancl2;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = CeilingFanFactory;

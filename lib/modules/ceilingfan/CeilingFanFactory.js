const YeelinkLightFancl1 = require('./devices/yeelink.light.fancl1.js');
const YeelinkLightFancl2 = require('./devices/yeelink.light.fancl2.js');
const YeelinkLightFancl5 = require('./devices/yeelink.light.fancl5.js');
const OppleLightFanlight = require('./devices/opple.light.fanlight.js');


class CeilingFanFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('yeelink.light.fancl1')) {
        deviceFactoryClass = YeelinkLightFancl1;
      } else if (deviceModel.includes('yeelink.light.fancl2')) {
        deviceFactoryClass = YeelinkLightFancl2;
      } else if (deviceModel.includes('yeelink.light.fancl5')) {
        deviceFactoryClass = YeelinkLightFancl5;
      } else if (deviceModel.includes('opple.light.fanlight')) {
        deviceFactoryClass = OppleLightFanlight;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = CeilingFanFactory;

const LeshiLightWy0b01 = require('./devices/leshi.light.wy0b01.js');


class LightFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('leshi.light.wy0b01')) {
        deviceFactoryClass = LeshiLightWy0b01;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = LightFactory;

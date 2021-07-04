const LeshiLightWy0b01 = require('./devices/leshi.light.wy0b01.js');

const lightDevices = [LeshiLightWy0b01];


class LightFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = lightDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = LightFactory;

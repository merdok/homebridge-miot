const LeshiLightWy0b01 = require('./devices/leshi.light.wy0b01.js');
const YeelinkLightColor3 = require('./devices/yeelink.light.color3.js');
const PhilipsLightBulb = require('./devices/philips.light.bulb.js');

const allDevices = [LeshiLightWy0b01, YeelinkLightColor3, PhilipsLightBulb];


class LightFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = LightFactory;

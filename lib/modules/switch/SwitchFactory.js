const YeelinkSwitchSw1 = require('./devices/yeelink.switch.sw1.js');

const allDevices = [YeelinkSwitchSw1];


class SwitchFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = SwitchFactory;

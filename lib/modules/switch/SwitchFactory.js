const YeelinkSwitchSw1 = require('./devices/yeelink.switch.sw1.js');
const BabaiSwitchBb101s = require('./devices/babai.switch.bb101s.js');

const allDevices = [YeelinkSwitchSw1, BabaiSwitchBb101s];


class SwitchFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = SwitchFactory;

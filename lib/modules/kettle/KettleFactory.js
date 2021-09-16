const YunmiKettleR3 = require('./devices/yunmi.kettle.r3.js');

const allDevices = [YunmiKettleR3];


class KettleFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = KettleFactory;

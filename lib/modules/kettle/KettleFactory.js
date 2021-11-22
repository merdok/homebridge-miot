const YunmiKettleR3 = require('./devices/yunmi.kettle.r3.js');
const ViomiWaterheaterE8 = require('./devices/viomi.waterheater.e8.js');

const allDevices = [YunmiKettleR3, ViomiWaterheaterE8];


class KettleFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = KettleFactory;

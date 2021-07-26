const ChunmiMicrowaveN20l01 = require('./devices/chunmi.microwave.n20l01.js');
const ChunmiOvenX02 = require('./devices/chunmi.oven.x02.js');

const allDevices = [ChunmiMicrowaveN20l01, ChunmiOvenX02];


class OvenFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = OvenFactory;

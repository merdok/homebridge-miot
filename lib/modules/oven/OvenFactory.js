const ChunmiMicrowaveN20l01 = require('./devices/chunmi.microwave.n20l01.js');

const ovenDevices = [ChunmiMicrowaveN20l01];


class OvenFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = ovenDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = OvenFactory;

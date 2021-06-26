const ChunmiMicrowaveN20l01 = require('./devices/chunmi.microwave.n20l01.js');


class OvenFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('chunmi.microwave.n20l01')) {
        deviceFactoryClass = ChunmiMicrowaveN20l01;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = OvenFactory;

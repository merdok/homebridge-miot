const NwtDerh312en = require('./devices/nwt.derh.312en.js');


class DehumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('nwt.derh.312en')) {
        deviceFactoryClass = NwtDerh312en;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = DehumidifierFactory;

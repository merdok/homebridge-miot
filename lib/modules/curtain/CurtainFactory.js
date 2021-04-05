const DooyaCurtainM2 = require('./devices/dooya.curtain.m2.js');


class CurtainFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('dooya.curtain.m2')) {
        deviceFactoryClass = DooyaCurtainM2;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = CurtainFactory;

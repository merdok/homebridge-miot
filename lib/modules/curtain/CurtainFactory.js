const DooyaCurtainM2 = require('./devices/dooya.curtain.m2.js');
const LeshiCurtainV0001 = require('./devices/leshi.curtain.v0001.js');


class CurtainFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('dooya.curtain.m2')) {
        deviceFactoryClass = DooyaCurtainM2;
      }else if (deviceModel.includes('leshi.curtain.v0001')) {
        deviceFactoryClass = LeshiCurtainV0001;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = CurtainFactory;

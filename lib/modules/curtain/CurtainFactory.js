const DooyaCurtainM2 = require('./devices/dooya.curtain.m2.js');
const LeshiCurtainV0001 = require('./devices/leshi.curtain.v0001.js');

const allDevices = [DooyaCurtainM2, LeshiCurtainV0001];


class CurtainFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = CurtainFactory;

const DooyaCurtainM2 = require('./devices/dooya.curtain.m2.js');
const LeshiCurtainV0001 = require('./devices/leshi.curtain.v0001.js');

const curtainDevices = [DooyaCurtainM2, LeshiCurtainV0001];


class CurtainFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = curtainDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = CurtainFactory;

const IsaCameraHlc7 = require('./devices/isa.camera.hlc7.js');

const allDevices = [IsaCameraHlc7];


class CameraFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = CameraFactory;

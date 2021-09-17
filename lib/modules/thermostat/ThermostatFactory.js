const CubeeAirrtcTh123w = require('./devices/cubee.airrtc.th123w.js');

const allDevices = [CubeeAirrtcTh123w];


class ThermostatFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = ThermostatFactory;

const NwtDerh312en = require('./devices/nwt.derh.312en.js');

const allDevices = [NwtDerh312en];


class DehumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = DehumidifierFactory;

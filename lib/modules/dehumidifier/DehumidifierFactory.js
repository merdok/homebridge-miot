const NwtDerh312en = require('./devices/nwt.derh.312en.js');

const dehumidifierDevices = [NwtDerh312en];


class DehumidifierFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = dehumidifierDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = DehumidifierFactory;

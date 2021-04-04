const CucoPlugCp1 = require('./devices/cuco.plug.cp1.js');


class OutletFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('cuco.plug.cp1')) {
        deviceFactoryClass = CucoPlugCp1;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = OutletFactory;

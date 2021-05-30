const CucoPlugCp1 = require('./devices/cuco.plug.cp1.js');
const CucoPlugCp5 = require('./devices/cuco.plug.cp5.js');


class OutletFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('cuco.plug.cp1')) {
        deviceFactoryClass = CucoPlugCp1;
      } else if (deviceModel.includes('cuco.plug.cp5')) {
        deviceFactoryClass = CucoPlugCp5;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = OutletFactory;

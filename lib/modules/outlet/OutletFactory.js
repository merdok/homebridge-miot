const CucoPlugCp1 = require('./devices/cuco.plug.cp1.js');
const CucoPlugCp2 = require('./devices/cuco.plug.cp2.js');
const CucoPlugCp5 = require('./devices/cuco.plug.cp5.js');
const ChuangmiPlug212a01 = require('./devices/chuangmi.plug.212a01.js');


class OutletFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;

    if (deviceModel) {
      if (deviceModel.includes('cuco.plug.cp1')) {
        deviceFactoryClass = CucoPlugCp1;
      } else if (deviceModel.includes('cuco.plug.cp2')) {
        deviceFactoryClass = CucoPlugCp2;
      } else if (deviceModel.includes('cuco.plug.cp5')) {
        deviceFactoryClass = CucoPlugCp5;
      } else if (deviceModel.includes('chuangmi.plug.212a01')) {
        deviceFactoryClass = ChuangmiPlug212a01;
      }
    }

    return deviceFactoryClass;
  }

}

module.exports = OutletFactory;

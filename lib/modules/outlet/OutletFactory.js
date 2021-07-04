const CucoPlugCp1 = require('./devices/cuco.plug.cp1.js');
const CucoPlugCp2 = require('./devices/cuco.plug.cp2.js');
const CucoPlugCp5 = require('./devices/cuco.plug.cp5.js');
const ChuangmiPlug212a01 = require('./devices/chuangmi.plug.212a01.js');

const outletDevices = [CucoPlugCp1, CucoPlugCp2, CucoPlugCp5, ChuangmiPlug212a01];


class OutletFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = outletDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = OutletFactory;

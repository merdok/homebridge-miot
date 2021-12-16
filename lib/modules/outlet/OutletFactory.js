const CucoPlugCp1 = require('./devices/cuco.plug.cp1.js');
const CucoPlugCo1 = require('./devices/cuco.plug.co1.js');
const CucoPlugCp2 = require('./devices/cuco.plug.cp2.js');
const CucoPlugCp5 = require('./devices/cuco.plug.cp5.js');
const CucoPlugSp5 = require('./devices/cuco.plug.sp5.js');
const ChuangmiPlug212a01 = require('./devices/chuangmi.plug.212a01.js');
const ChuangmiPlugM3 = require('./devices/chuangmi.plug.m3.js');
const ChuangmiPlugV1 = require('./devices/chuangmi.plug.v1.js');
const ChuangmiPlugV3 = require('./devices/chuangmi.plug.v3.js');
const ChuangmiPlugM1 = require('./devices/chuangmi.plug.m1.js');
const ChuangmiPlugHmi206 = require('./devices/chuangmi.plug.hmi206.js');
const CucoPlugCp2a = require('./devices/cuco.plug.cp2a.js');
const CucoPlugCp1m = require('./devices/cuco.plug.cp1m.js');
const ChuangmiPlugHmi208 = require('./devices/chuangmi.plug.hmi208.js');

const allDevices = [CucoPlugCp1, CucoPlugCo1, CucoPlugCp2, CucoPlugCp5,
  ChuangmiPlug212a01, ChuangmiPlugM3, ChuangmiPlugV1, ChuangmiPlugV3,
  ChuangmiPlugM1, ChuangmiPlugHmi206, CucoPlugCp2a, CucoPlugCp1m,
  ChuangmiPlugHmi208, CucoPlugSp5
];


class OutletFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = OutletFactory;

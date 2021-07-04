const ZhimiAirfreshUa1 = require('./devices/zhimi.airfresh.ua1.js');
const DmakerAirfreshA1 = require('./devices/dmaker.airfresh.a1.js');
const DmakerAirfreshT2017 = require('./devices/dmaker.airfresh.t2017.js');

const freshAirSystemDevices = [ZhimiAirfreshUa1, DmakerAirfreshA1, DmakerAirfreshT2017];


class FreshAirSystemFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = freshAirSystemDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = FreshAirSystemFactory;

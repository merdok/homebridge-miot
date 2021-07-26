const ScishareCoffeeS1102 = require('./devices/scishare.coffee.s1102.js');

const allDevices = [ScishareCoffeeS1102];


class CoffeeMachineFactory {

  static getDeviceClassForModel(deviceModel) {
    let deviceFactoryClass = null;
    deviceFactoryClass = allDevices.find(device => device.getDeviceModel() === deviceModel);
    return deviceFactoryClass;
  }

}

module.exports = CoffeeMachineFactory;
